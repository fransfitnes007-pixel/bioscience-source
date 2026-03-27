import { useState, useEffect, useRef, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Globe, Activity } from "lucide-react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { subMinutes } from "date-fns";

// ─── 3D Globe component ───
const GlobeMesh = ({ points }: { points: { lat: number; lng: number; size: number }[] }) => {
  const meshRef = useRef<THREE.Group>(null);
  const dotsRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (meshRef.current) meshRef.current.rotation.y += delta * 0.05;
    if (dotsRef.current) dotsRef.current.rotation.y += delta * 0.05;
  });

  // Create globe dots (land representation)
  const globeGeometry = useMemo(() => {
    const positions: number[] = [];
    const radius = 2;
    const dotCount = 4000;
    for (let i = 0; i < dotCount; i++) {
      const phi = Math.acos(-1 + (2 * i) / dotCount);
      const theta = Math.sqrt(dotCount * Math.PI) * phi;
      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);
      positions.push(x, y, z);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    return geo;
  }, []);

  // Convert lat/lng to 3D position
  const latLngToVector = (lat: number, lng: number, r: number) => {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lng + 180) * (Math.PI / 180);
    return new THREE.Vector3(
      -r * Math.sin(phi) * Math.cos(theta),
      r * Math.cos(phi),
      r * Math.sin(phi) * Math.sin(theta)
    );
  };

  return (
    <>
      {/* Globe dots */}
      <group ref={meshRef}>
        <points geometry={globeGeometry}>
          <pointsMaterial color="#4dd0c8" size={0.02} transparent opacity={0.6} />
        </points>
        {/* Atmosphere sphere */}
        <mesh>
          <sphereGeometry args={[2.02, 64, 64]} />
          <meshBasicMaterial color="#1a3a4a" transparent opacity={0.15} />
        </mesh>
      </group>

      {/* Active session markers */}
      <group ref={dotsRef}>
        {points.map((p, i) => {
          const pos = latLngToVector(p.lat, p.lng, 2.05);
          return (
            <group key={i} position={pos}>
              <mesh>
                <sphereGeometry args={[0.04 * p.size, 8, 8]} />
                <meshBasicMaterial color="#c084fc" />
              </mesh>
              {/* Pulse ring */}
              <mesh>
                <ringGeometry args={[0.06 * p.size, 0.08 * p.size, 16]} />
                <meshBasicMaterial color="#c084fc" transparent opacity={0.5} side={THREE.DoubleSide} />
              </mesh>
            </group>
          );
        })}
      </group>
    </>
  );
};

// Location approximations for display
const CITY_COORDS: Record<string, { lat: number; lng: number }> = {
  "boardman": { lat: 45.84, lng: -119.7 },
  "council bluffs": { lat: 41.26, lng: -95.86 },
  "new york": { lat: 40.71, lng: -74.01 },
  "los angeles": { lat: 34.05, lng: -118.24 },
  "chicago": { lat: 41.88, lng: -87.63 },
  "london": { lat: 51.51, lng: -0.13 },
  "tokyo": { lat: 35.68, lng: 139.69 },
  "sydney": { lat: -33.87, lng: 151.21 },
  "default": { lat: 39.83, lng: -98.58 },
};

const LiveView = () => {
  const [lastRefresh, setLastRefresh] = useState(new Date());

  // Auto-refresh every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => setLastRefresh(new Date()), 10000);
    return () => clearInterval(interval);
  }, []);

  const recentCutoff = subMinutes(new Date(), 5).toISOString();

  // Active sessions (last 5 minutes)
  const { data: activeSessions = [] } = useQuery({
    queryKey: ["live-sessions", lastRefresh],
    queryFn: async () => {
      const { data } = await supabase
        .from("user_sessions")
        .select("*")
        .gte("started_at", recentCutoff)
        .order("started_at", { ascending: false });
      return data || [];
    },
    refetchInterval: 10000,
  });

  // Recent orders (today)
  const { data: todayOrders = [] } = useQuery({
    queryKey: ["live-orders", lastRefresh],
    queryFn: async () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const { data } = await supabase
        .from("orders")
        .select("total")
        .gte("created_at", today.toISOString());
      return data || [];
    },
    refetchInterval: 10000,
  });

  // Cart items count
  const { data: cartData } = useQuery({
    queryKey: ["live-carts", lastRefresh],
    queryFn: async () => {
      const { count } = await supabase
        .from("cart_items")
        .select("*", { count: "exact", head: true });
      return count || 0;
    },
    refetchInterval: 10000,
  });

  const visitorsNow = activeSessions.length;
  const totalSalesToday = todayOrders.reduce((sum, o) => sum + (o.total || 0), 0);
  const totalOrdersToday = todayOrders.length;
  const activeCarts = cartData || 0;

  // Location data for globe
  const globePoints = useMemo(() => {
    return activeSessions.map((s) => {
      const city = (s.city || "").toLowerCase();
      const coords = CITY_COORDS[city] || CITY_COORDS["default"];
      return { lat: coords.lat, lng: coords.lng, size: 1 };
    });
  }, [activeSessions]);

  // Location breakdown
  const locationBreakdown = (() => {
    const locs: Record<string, number> = {};
    activeSessions.forEach((s) => {
      const loc = [s.country, s.city].filter(Boolean).join(" · ") || "Unknown";
      locs[loc] = (locs[loc] || 0) + 1;
    });
    return Object.entries(locs).sort((a, b) => b[1] - a[1]).map(([name, value]) => ({ name, value }));
  })();

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Globe className="h-5 w-5 text-muted-foreground" />
          <h1 className="text-xl font-semibold">Live View</h1>
          <span className="flex items-center gap-1.5 text-xs">
            <span className="w-2 h-2 rounded-full bg-green-900/200 animate-pulse" />
            Just now
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-6">
          {/* Left column - Stats */}
          <div className="space-y-4">
            {/* Visitors + Sales KPIs */}
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardContent className="pt-4 pb-4">
                  <p className="text-sm text-muted-foreground">Visitors right now</p>
                  <p className="text-3xl font-semibold">{visitorsNow}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-4 pb-4">
                  <p className="text-sm text-muted-foreground">Total sales</p>
                  <p className="text-3xl font-semibold">${totalSalesToday.toFixed(0)}</p>
                </CardContent>
              </Card>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardContent className="pt-4 pb-4">
                  <p className="text-sm text-muted-foreground">Sessions</p>
                  <p className="text-3xl font-semibold">{activeSessions.length}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-4 pb-4">
                  <p className="text-sm text-muted-foreground">Orders</p>
                  <p className="text-3xl font-semibold">{totalOrdersToday}</p>
                </CardContent>
              </Card>
            </div>

            {/* Customer behavior */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">Customer behavior</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-sm text-muted-foreground">Active carts</p>
                    <p className="text-2xl font-semibold">{activeCarts}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Checking out</p>
                    <p className="text-2xl font-semibold">0</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Purchased</p>
                    <p className="text-2xl font-semibold">{totalOrdersToday}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Sessions by location */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">Sessions by location</CardTitle>
              </CardHeader>
              <CardContent>
                {locationBreakdown.length > 0 ? (
                  <div className="space-y-3">
                    {locationBreakdown.map((loc) => (
                      <div key={loc.name}>
                        <p className="text-sm mb-1">{loc.name}</p>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-muted rounded-full h-6 overflow-hidden">
                            <div
                              className="bg-primary h-full rounded-full"
                              style={{ width: `${(loc.value / Math.max(...locationBreakdown.map(l => l.value))) * 100}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium w-6 text-right">{loc.value}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">No active sessions</p>
                )}
              </CardContent>
            </Card>

            {/* New vs returning */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">New vs returning customers</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground text-center py-4">No data for this date range</p>
              </CardContent>
            </Card>
          </div>

          {/* Right column - 3D Globe */}
          <div className="sticky top-6">
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <div className="h-[600px] bg-gradient-to-br from-[#0d1b2a] to-[#1b2838] rounded-lg">
                  <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
                    <ambientLight intensity={0.4} />
                    <directionalLight position={[5, 3, 5]} intensity={0.8} />
                    <GlobeMesh points={globePoints} />
                    <OrbitControls
                      enableZoom={true}
                      enablePan={false}
                      minDistance={3}
                      maxDistance={8}
                      autoRotate={false}
                    />
                  </Canvas>
                </div>
                <div className="p-3 flex items-center gap-4 text-xs text-muted-foreground border-t border-border">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-purple-400" />
                    Orders
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#4dd0c8]" />
                    Visitors right now
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default LiveView;

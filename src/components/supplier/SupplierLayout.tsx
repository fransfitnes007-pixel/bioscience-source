import { SupplierAuthGuard } from "./SupplierAuthGuard";
import { SupplierSidebar } from "./SupplierSidebar";

interface SupplierLayoutProps {
  children: React.ReactNode;
}

export const SupplierLayout = ({ children }: SupplierLayoutProps) => {
  return (
    <SupplierAuthGuard>
      <div className="flex min-h-screen bg-background">
        <SupplierSidebar />
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </SupplierAuthGuard>
  );
};

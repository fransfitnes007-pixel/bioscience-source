import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface StatusBadgeProps {
  status: string;
  className?: string;
}

const statusConfig: Record<string, { label: string; className: string }> = {
  // Application statuses
  pending: {
    label: "Pending",
    className: "bg-yellow-500/20 text-yellow-500 border-yellow-500/30",
  },
  approved: {
    label: "Approved",
    className: "bg-green-500/20 text-green-500 border-green-500/30",
  },
  denied: {
    label: "Denied",
    className: "bg-red-500/20 text-red-500 border-red-500/30",
  },
  rejected: {
    label: "Rejected",
    className: "bg-red-500/20 text-red-500 border-red-500/30",
  },
  
  // Inquiry statuses
  new: {
    label: "New",
    className: "bg-blue-500/20 text-blue-500 border-blue-500/30",
  },
  in_progress: {
    label: "In Progress",
    className: "bg-purple-500/20 text-purple-500 border-purple-500/30",
  },
  completed: {
    label: "Completed",
    className: "bg-green-500/20 text-green-500 border-green-500/30",
  },
  closed: {
    label: "Closed",
    className: "bg-gray-500/20 text-gray-500 border-gray-500/30",
  },
  
  // Contact message statuses
  responded: {
    label: "Responded",
    className: "bg-green-500/20 text-green-500 border-green-500/30",
  },
};

const StatusBadge = ({ status, className }: StatusBadgeProps) => {
  const config = statusConfig[status] || {
    label: status,
    className: "bg-gray-500/20 text-gray-500 border-gray-500/30",
  };

  return (
    <Badge
      variant="outline"
      className={cn("font-medium", config.className, className)}
    >
      {config.label}
    </Badge>
  );
};

export default StatusBadge;

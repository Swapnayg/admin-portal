
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: string;
  variant?: "default" | "secondary" | "destructive" | "outline";
}

export function StatusBadge({ status, variant = "default" }: StatusBadgeProps) {
  const getStatusVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case "shipped":
      case "paid":
      case "approved":
      case "active":
      case "completed":
      case "processed":
        return "default";
      case "pending":
      case "processing":
        return "secondary";
      case "delivered":
        return "outline";
      case "returned":
      case "failed":
      case "rejected":
        return "destructive";
      default:
        return variant;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "shipped":
      case "paid":
      case "approved":
      case "active":
      case "completed":
      case "processed":
        return "bg-green-100 text-green-800 hover:bg-green-100";
      case "pending":
      case "processing":
        return "bg-orange-100 text-orange-800 hover:bg-orange-100";
      case "delivered":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100";
      case "returned":
      case "failed":
      case "rejected":
        return "bg-red-100 text-red-800 hover:bg-red-100";
      default:
        return "";
    }
  };

  return (
    <Badge 
      className={cn(
        "font-medium",
        getStatusColor(status)
      )}
    >
      {status}
    </Badge>
  );
}
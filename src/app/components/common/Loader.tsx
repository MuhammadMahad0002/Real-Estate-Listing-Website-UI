import { Loader2 } from "lucide-react";

export function Loader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F7FA]">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="w-10 h-10 text-[#D4A853] animate-spin" />
        <p
          className="text-gray-500 text-sm"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          Loading...
        </p>
      </div>
    </div>
  );
}

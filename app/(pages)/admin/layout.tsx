import Navbar from "@/components/admin/navbar";
import { SessionProvider } from "next-auth/react";
import { AlertProvider } from "@/context/alert";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <AlertProvider>
        <div className="min-h-screen bg-background">
          <Navbar />
          {children}
        </div>
      </AlertProvider>
    </SessionProvider>
  );
}

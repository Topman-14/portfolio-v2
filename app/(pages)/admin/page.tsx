"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Shield, User } from "lucide-react";
import { AuthButton } from "@/components/ui/auth-button";

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return; // Still loading

    if (!session) {
      router.push("/admin/auth/signin");
      return;
    }

    if (session.user?.role !== "ADMIN" && session.user?.role !== "SUPER_ADMIN") {
      router.push("/admin/auth/signin");
    }
  }, [session, status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!session) {
    return null;
  }


  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Shield className="h-8 w-8 text-primary" />
              <h1 className="text-xl font-semibold text-foreground">
                Admin Dashboard
              </h1>
            </div>

            <AuthButton />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Welcome Section */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Welcome to the Admin Dashboard
            </h2>
            <p className="text-muted-foreground">
              You have successfully signed in with {session.user?.role} privileges. 
              This is where you can manage your portfolio content, settings, and more.
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <User className="h-6 w-6 text-primary" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Role</p>
                  <p className="text-2xl font-bold text-foreground">
                    {session.user?.role}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                  <Shield className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Status</p>
                  <p className="text-2xl font-bold text-foreground">Active</p>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <User className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Session</p>
                  <p className="text-2xl font-bold text-foreground">Valid</p>
                </div>
              </div>
            </div>
          </div>

          {/* Admin Actions */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Admin Actions
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <button className="p-4 border border-border rounded-lg text-left hover:bg-accent transition-colors">
                <h4 className="font-medium text-foreground">Manage Content</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Update portfolio projects, blog posts, and pages
                </p>
              </button>

              <button className="p-4 border border-border rounded-lg text-left hover:bg-accent transition-colors">
                <h4 className="font-medium text-foreground">Site Settings</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Configure site-wide settings and preferences
                </p>
              </button>

              {session.user?.role === "SUPER_ADMIN" && (
                <button className="p-4 border border-border rounded-lg text-left hover:bg-accent transition-colors">
                  <h4 className="font-medium text-foreground">User Management</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Manage admin users and permissions
                  </p>
                </button>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

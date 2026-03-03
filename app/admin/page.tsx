"use client";

import { PageTemplate } from "@/components/layout/PageTemplate";
import { GlassCard } from "@/components/ui/GlassCard";
import { useRole } from "@/lib/RoleProvider";
import { EmptyState } from "@/components/ui/EmptyState";
import { ShieldAlert, Users, Settings, Activity } from "lucide-react";

export default function AdminPage() {
  const { role } = useRole();

  if (role !== "admin") {
    return (
      <PageTemplate title="Access Denied">
        <EmptyState
          icon={ShieldAlert}
          title="Restricted Area"
          description="You do not have permission to view this page. Please switch to the Admin role in the top bar to access these controls."
        />
      </PageTemplate>
    );
  }

  return (
    <PageTemplate
      title="Admin Dashboard"
      description="Manage system settings, users, and global configurations."
    >
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <GlassCard hoverEffect className="flex flex-col gap-4 cursor-pointer">
          <div className="p-3 bg-blue-500/10 text-blue-500 rounded-xl w-fit">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">User Management</h3>
            <p className="text-sm text-muted-foreground mt-1">Add, remove, or modify user roles and permissions.</p>
          </div>
        </GlassCard>

        <GlassCard hoverEffect className="flex flex-col gap-4 cursor-pointer">
          <div className="p-3 bg-purple-500/10 text-purple-500 rounded-xl w-fit">
            <Settings className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">System Settings</h3>
            <p className="text-sm text-muted-foreground mt-1">Configure global application settings and integrations.</p>
          </div>
        </GlassCard>

        <GlassCard hoverEffect className="flex flex-col gap-4 cursor-pointer">
          <div className="p-3 bg-green-500/10 text-green-500 rounded-xl w-fit">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Usage Logs</h3>
            <p className="text-sm text-muted-foreground mt-1">View system activity, audit logs, and performance metrics.</p>
          </div>
        </GlassCard>
      </div>
    </PageTemplate>
  );
}

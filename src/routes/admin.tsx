import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { School, Users, CreditCard, Search, TrendingUp, Activity } from "lucide-react";
import { adminSidebar } from "@/lib/nav";

export const Route = createFileRoute("/admin")({
  component: AdminDashboard,
});

const stats = [
  { label: "Total Schools", value: "524", icon: School, trend: "+12 this month", color: "text-primary" },
  { label: "Total Students", value: "45,230", icon: Users, trend: "+1,340 this month", color: "text-blue-400" },
  { label: "Pending Approvals", value: "89", icon: Activity, trend: "15 urgent", color: "text-yellow-400" },
  { label: "Cards Generated", value: "38,450", icon: CreditCard, trend: "+890 this week", color: "text-emerald-400" },
];

const recentActivity = [
  { action: "New school registered", detail: "St. Xavier's International, Mumbai", time: "2 min ago" },
  { action: "Batch approved", detail: "156 cards approved for DPS Noida", time: "15 min ago" },
  { action: "Template updated", detail: "Classic Green v2.1 released", time: "1 hr ago" },
  { action: "Report exported", detail: "Monthly analytics report downloaded", time: "3 hrs ago" },
  { action: "New teacher onboarded", detail: "Sunita Rao, Green Valley School", time: "5 hrs ago" },
];

function AdminDashboard() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate({ to: "/admin/students" });
  };

  return (
    <DashboardLayout title="Admin Dashboard" role="Admin" items={adminSidebar}>
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="glass-card rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <stat.icon size={16} className="text-primary" />
                </div>
              </div>
              <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                <TrendingUp size={12} className="text-primary" />
                {stat.trend}
              </p>
            </div>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Chart placeholder */}
          <div className="glass-card rounded-xl p-4 sm:p-6">
            <h2 className="text-base sm:text-lg font-semibold mb-4">Cards Generated (Monthly)</h2>
            <div className="h-44 sm:h-48 flex items-end gap-1 sm:gap-2 px-1 sm:px-2">
              {[40, 55, 70, 45, 80, 65, 90, 85, 95, 75, 88, 100].map((h, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1 min-w-0">
                  <div
                    className="w-full rounded-t-md bg-primary/20 hover:bg-primary/30 transition-colors"
                    style={{ height: `${h}%` }}
                  />
                  <span className="text-[10px] text-muted-foreground">
                    {["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"][i]}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="glass-card rounded-xl p-4 sm:p-6">
            <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
            <div className="space-y-4">
              {recentActivity.map((activity, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="mt-1.5 h-2 w-2 rounded-full bg-primary shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{activity.action}</p>
                    <p className="text-xs text-muted-foreground truncate">{activity.detail}</p>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">{activity.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick search */}
        <form onSubmit={handleSearch} className="glass-card rounded-xl p-4 sm:p-6">
          <h2 className="text-lg font-semibold mb-4">Quick Search</h2>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search schools, teachers, or students..."
                className="bg-surface border-border pl-10"
              />
            </div>
            <Button type="submit" variant="hero" size="default">Search</Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}

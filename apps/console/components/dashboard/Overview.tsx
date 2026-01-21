"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Users, Activity, CreditCard, TrendingUp } from "lucide-react";

const stats = [
  {
    id: "totalUsers",
    icon: Users,
    value: "2,350",
    change: "+12.5%",
    changeType: "positive" as const,
  },
  {
    id: "activeUsers",
    icon: Activity,
    value: "1,203",
    change: "+8.2%",
    changeType: "positive" as const,
  },
  {
    id: "revenue",
    icon: CreditCard,
    value: "$12,345",
    change: "+23.1%",
    changeType: "positive" as const,
  },
  {
    id: "growth",
    icon: TrendingUp,
    value: "18.2%",
    change: "+4.1%",
    changeType: "positive" as const,
  },
];

export function Overview() {
  const t = useTranslations("dashboard.overview");

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">{t("title")}</h2>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.id}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {t(stat.id)}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  <span
                    className={
                      stat.changeType === "positive"
                        ? "text-green-600"
                        : "text-red-600"
                    }
                  >
                    {stat.change}
                  </span>{" "}
                  from last month
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Main Content Area */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Chart Area */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="flex h-[300px] items-center justify-center text-muted-foreground">
              Chart Placeholder
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Your recent activity in the last 7 days
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RecentActivityList />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function RecentActivityList() {
  const activities = [
    {
      id: 1,
      title: "New user registered",
      time: "2 hours ago",
      avatar: "U1",
    },
    {
      id: 2,
      title: "Video downloaded",
      time: "4 hours ago",
      avatar: "V1",
    },
    {
      id: 3,
      title: "Settings updated",
      time: "6 hours ago",
      avatar: "S1",
    },
    {
      id: 4,
      title: "New subscription",
      time: "1 day ago",
      avatar: "N1",
    },
    {
      id: 5,
      title: "Profile updated",
      time: "2 days ago",
      avatar: "P1",
    },
  ];

  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div key={activity.id} className="flex items-center gap-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted text-xs font-medium">
            {activity.avatar}
          </div>
          <div className="flex-1 space-y-1">
            <p className="text-sm font-medium leading-none">{activity.title}</p>
            <p className="text-xs text-muted-foreground">{activity.time}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

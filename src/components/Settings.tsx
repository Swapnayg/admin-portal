'use client';

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, DollarSign, Plug, Mail } from "lucide-react";
import Link from "next/link";

const settingsItems = [
  {
    icon: Shield,
    title: "Role & Permissions",
    description: "Manage user roles and their access permissions within the platform.",
    action: "View Details",
    link: "/roleManagement",
  },
  {
    icon: DollarSign,
    title: "Tax Rules",
    description: "Configure tax rate structures for transactions.",
    action: "View Details",
    link: "/ruleManagement",
  },
  {
    icon: Plug,
    title: "API Integrations",
    description: "Manage connections and settings for third-party API integrations.",
    action: "View Details",
    link: "/apiKeyManagement",
  },
];

export default function Settings() {
  return (
    <div className="max-w-full w-full px-6 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
      </div>

      {/* Settings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {settingsItems.map((item, index) => (
          <Card
            key={index}
            className="w-full hover:shadow-md transition-shadow border border-gray-200"
          >
            <CardContent className="p-6 overflow-x-auto">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <item.icon className="h-6 w-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-base text-gray-700 mb-4">
                    {item.description}
                  </p>
                  <Link href={item.link}>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-blue-600 hover:text-blue-700 font-medium text-sm cursor-pointer"
                    >
                      {item.action}
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

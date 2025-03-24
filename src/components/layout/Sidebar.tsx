import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  ShoppingBag,
  Tag,
  BadgeDollarSign,
  BarChart,
  Users,
  Settings,
  LogOut,
  ChevronRight,
  ChevronDown,
  LineChart,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export const Sidebar = () => {
  const { pathname } = useLocation();
  const { logout } = useAuth();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const sidebarItems = [
    {
      title: 'Dashboard',
      icon: <LayoutDashboard className="h-5 w-5" />,
      href: '/',
      selected: pathname === '/' || pathname.includes('#dashboard'),
    },
    {
      title: 'Products',
      icon: <ShoppingBag className="h-5 w-5" />,
      href: '/#products',
      selected: pathname.includes('#products'),
    },
    {
      title: 'Categories',
      icon: <Tag className="h-5 w-5" />,
      href: '/#categories',
      selected: pathname.includes('#categories'),
    },
    {
      title: 'Pricing Rules',
      icon: <BadgeDollarSign className="h-5 w-5" />,
      href: '/#pricing',
      selected: pathname.includes('#pricing'),
    },
    {
      title: 'Analytics',
      icon: <BarChart className="h-5 w-5" />,
      href: '/#analytics',
      selected: pathname.includes('#analytics'),
    },
    {
      title: 'Dynamic Dashboard',
      icon: <LayoutDashboard className="h-5 w-5" />,
      href: '/dashboard',
      selected: pathname === '/dashboard',
    },
    {
      title: 'Sales Analysis',
      icon: <LineChart className="h-5 w-5" />,
      href: '/sales-analysis',
      selected: pathname === '/sales-analysis',
    },
    {
      title: 'Settings',
      icon: <Settings className="h-5 w-5" />,
      onClick: () => setIsSettingsOpen(!isSettingsOpen),
      selected: isSettingsOpen,
      children: [
        {
          title: 'Users',
          icon: <Users className="h-4 w-4" />,
          href: '/settings/users',
          selected: false,
        },
      ],
    },
  ];

  return (
    <aside className="fixed left-0 top-0 z-50 flex h-full w-64 flex-col border-r bg-background transition-all duration-300">
      <div className="flex h-20 shrink-0 items-center justify-center border-b">
        <Link to="/" className="font-bold text-2xl">
          Pricing Tool
        </Link>
      </div>
      <div className="flex flex-grow flex-col justify-between">
        <nav className="flex-1 space-y-1 p-4">
          {sidebarItems.map((item, index) => (
            <React.Fragment key={index}>
              {item.href ? (
                <Link
                  to={item.href}
                  className={cn(
                    "group flex items-center space-x-2 rounded-md p-2 text-sm font-medium hover:underline",
                    item.selected
                      ? "bg-secondary text-secondary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {item.icon}
                  <span>{item.title}</span>
                </Link>
              ) : (
                <Button
                  variant="ghost"
                  className={cn(
                    "justify-start rounded-md p-2 text-sm font-medium hover:underline w-full",
                    item.selected
                      ? "bg-secondary text-secondary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                  onClick={item.onClick}
                >
                  <div className="flex items-center space-x-2">
                    {item.icon}
                    <span>{item.title}</span>
                  </div>
                </Button>
              )}
              {item.children && item.selected && (
                <div className="ml-4 space-y-1">
                  {item.children.map((child, childIndex) => (
                    <Link
                      key={childIndex}
                      to={child.href}
                      className={cn(
                        "group flex items-center space-x-2 rounded-md p-2 text-sm font-medium hover:underline",
                        child.selected
                          ? "bg-secondary text-secondary-foreground"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {child.icon}
                      <span>{child.title}</span>
                    </Link>
                  ))}
                </div>
              )}
            </React.Fragment>
          ))}
        </nav>
        <div className="flex items-center justify-center p-4">
          <Button variant="outline" size="sm" className="w-full" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>
    </aside>
  );
};

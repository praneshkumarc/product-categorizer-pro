
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  LayoutDashboard, 
  Tag, 
  Box, 
  DollarSign, 
  BarChart, 
  Settings,
  HelpCircle,
  LogOut
} from 'lucide-react';

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}

const NavItem = ({ to, icon, label, active }: NavItemProps) => (
  <Link 
    to={to} 
    className={cn(
      "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium animate-hover",
      active 
        ? "bg-primary text-primary-foreground" 
        : "text-muted-foreground hover:bg-secondary hover:text-foreground"
    )}
  >
    {icon}
    <span>{label}</span>
    {active && <div className="w-1.5 h-1.5 rounded-full bg-primary-foreground ml-auto" />}
  </Link>
);

export const Sidebar = () => {
  const { pathname } = useLocation();
  
  const navItems = [
    { to: '/', icon: <LayoutDashboard className="h-5 w-5" />, label: 'Dashboard' },
    { to: '/categories', icon: <Tag className="h-5 w-5" />, label: 'Categories' },
    { to: '/products', icon: <Box className="h-5 w-5" />, label: 'Products' },
    { to: '/pricing', icon: <DollarSign className="h-5 w-5" />, label: 'Pricing Rules' },
    { to: '/analytics', icon: <BarChart className="h-5 w-5" />, label: 'Analytics' },
  ];
  
  const helpItems = [
    { to: '/settings', icon: <Settings className="h-5 w-5" />, label: 'Settings' },
    { to: '/help', icon: <HelpCircle className="h-5 w-5" />, label: 'Help & Support' },
  ];

  return (
    <aside className="fixed inset-y-0 left-0 w-64 glass-card border-r border-gray-200/50 pt-20 pb-4 z-30 hidden md:block">
      <div className="h-full flex flex-col px-4">
        <div className="space-y-1">
          <p className="text-xs font-semibold text-muted-foreground px-3 py-2">MAIN MENU</p>
          {navItems.map((item) => (
            <NavItem 
              key={item.to} 
              to={item.to} 
              icon={item.icon} 
              label={item.label} 
              active={pathname === item.to}
            />
          ))}
        </div>
        
        <Separator className="my-4" />
        
        <div className="space-y-1">
          <p className="text-xs font-semibold text-muted-foreground px-3 py-2">SUPPORT</p>
          {helpItems.map((item) => (
            <NavItem 
              key={item.to} 
              to={item.to} 
              icon={item.icon} 
              label={item.label} 
              active={pathname === item.to}
            />
          ))}
        </div>
        
        <div className="mt-auto">
          <Button 
            variant="outline" 
            className="w-full justify-start gap-2 text-muted-foreground border-dashed"
          >
            <LogOut className="h-4 w-4" />
            <span>Log out</span>
          </Button>
        </div>
      </div>
    </aside>
  );
};

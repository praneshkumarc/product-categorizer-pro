
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Search, Bell, Settings, LogIn } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate, useLocation } from "react-router-dom";

export const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // This would be replaced by actual auth state
  const navigate = useNavigate();
  const location = useLocation();
  
  // Check if we're on an auth page
  const isAuthPage = 
    location.pathname === "/login" || 
    location.pathname === "/register" || 
    location.pathname === "/forgot-password";
  
  // Handle scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrolled]);

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-40 py-4 px-6 transition-all duration-200 ease-in-out",
        scrolled 
          ? "bg-white/80 backdrop-blur-md border-b border-gray-200/50 shadow-sm" 
          : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <h1 className="text-xl font-medium cursor-pointer" onClick={() => navigate("/")}>Product Categorizer</h1>
          {!isAuthPage && (
            <div className="relative hidden md:flex items-center">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input 
                type="search" 
                placeholder="Search products..." 
                className="pl-10 py-1.5 w-64 bg-secondary/80 border-0 focus-visible:ring-1"
              />
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-4">
          {isLoggedIn ? (
            <>
              <Button variant="ghost" size="icon" className="rounded-full h-10 w-10 animate-hover hover:bg-secondary">
                <Bell className="h-5 w-5 text-muted-foreground" />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full h-10 w-10 animate-hover hover:bg-secondary">
                <Settings className="h-5 w-5 text-muted-foreground" />
              </Button>
              <Separator orientation="vertical" className="h-8" />
              <Avatar className="h-10 w-10 animate-hover ring-offset-background transition-all hover:ring-2 hover:ring-primary hover:ring-offset-2">
                <AvatarImage src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop" />
                <AvatarFallback>PM</AvatarFallback>
              </Avatar>
            </>
          ) : (
            !isAuthPage && (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" onClick={() => navigate("/login")}>
                  Log in
                </Button>
                <Button onClick={() => navigate("/register")}>
                  Sign up
                </Button>
              </div>
            )
          )}
        </div>
      </div>
    </header>
  );
};

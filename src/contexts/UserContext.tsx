"use client";

import { User } from "@/types/user";
import { createContext, useState, useContext, useEffect } from "react";
import React from "react";
import { logout as logoutService } from "@/features/auth/logout";
import { getUserProfile } from "@/services/serverServices/profile/getUserProfile";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";

interface UserContextType {
  user: User | null;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  setUser: (user: User | null) => void;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const UserContext = createContext<UserContextType | null>(null);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const { success, data } = await getUserProfile({ cacheSettings: "reload" });
      if (!success) {
        await logout();
        toast({
          title: "Your Session is Expired",
          description: "Please login again to continue",
        });
        router.push("/login");
        return;
      }
      setUser(data || null);
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const refreshUser = async () => {
    setIsLoading(true);
    await fetchUser();
  };

  const logout = async () => {
    await logoutService();
    setUser(null);
    setTimeout(() => {
      router.push("/login"); // Navigate after the component updates
    }, 0);
  };

  return (
    <UserContext.Provider
      value={{ user, setUser, logout, isLoading, setIsLoading, refreshUser }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

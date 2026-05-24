"use client";

import { User } from "@/types/user";
import { createContext, useState, useContext, useEffect } from "react";
import React from "react";
import { logout as logoutService } from "@/features/auth/logout";
import { getProfile } from "@/services/clientServices/profile/ProfileService";
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
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const { data } = await getProfile();

      setUser(data);
    } catch (error) {
      console.error("Failed to fetch user profile:", error);

      toast({
        variant: "destructive",
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
      });
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

"use client";
import { User } from "@/types/user";
import { createContext, useState, useContext, useEffect } from "react";
import React from "react";
import { fetchProfile } from "@/features/user/fetchProfile";
import { useRouter } from "next/navigation";
import { logout as logoutHook } from "@/features/auth/useLogout";
// import { useRouter } from "next/navigation";

interface UserContextType {
  user: User | null;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  setUser: (user: User | null) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextType | null>(null);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  // const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  // const router = useRouter();
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const profile = await fetchProfile();
        if (profile) {
          setUser(profile);
        }
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, []);


  const logout = async () => {
    await logoutHook();
    setUser(null);
  };

  return (
    <UserContext.Provider
      value={{ user, setUser, logout, isLoading, setIsLoading }}
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

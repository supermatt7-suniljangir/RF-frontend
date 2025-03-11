// features/auth/useAuth.ts
"use client";

import { useCallback } from "react";
import { usePathname } from "next/navigation";
import { useUser } from "@/contexts/UserContext";
import { useToast } from "@/hooks/use-toast";

import { getUserProfile } from "@/services/serverServices/profile/getUserProfile";
import AuthService from "@/services/clientServices/auth/AuthServices";

interface AuthPayload {
  googleToken?: string;
  email?: string;
  password?: string;
  fullName?: string;
}

export function useAuth() {
  const pathname = usePathname();
  const isLogin = pathname === "/login";
  const { setUser, isLoading, setIsLoading } = useUser();
  const { toast } = useToast();

  const auth = useCallback(
    async (data: AuthPayload): Promise<void> => {
      setIsLoading(true);

      try {
        // Handle based on login type
        if (data.googleToken) {
          await AuthService.googleLogin(data.googleToken);
        } else if (isLogin) {
          await AuthService.login({
            email: data.email,
            password: data.password,
          });
        } else {
          await AuthService.register({
            email: data.email!,
            password: data.password!,
            fullName: data.fullName!,
          });
        }

        // After successful auth, get user profile
        const profileResult = await getUserProfile({ cacheSettings: "reload" });

        if (!profileResult.success || !profileResult.data) {
          throw new Error("Failed to fetch user profile after authentication");
        }

        setUser(profileResult.data);

        toast({
          title: isLogin ? "Login successful" : "Registration successful",
          description: `Welcome${isLogin ? " back" : ""}, ${
            profileResult.data.fullName || ""
          }`,
          duration: 5000,
        });
      } catch (error) {
        toast({
          title: isLogin ? "Login Error" : "Registration Error",
          description:
            error.message || (isLogin ? "Login failed" : "Registration failed"),
          variant: "destructive",
          duration: 5000,
        });
      } finally {
        setIsLoading(false);
      }
    },
    [isLogin, setIsLoading, setUser, toast]
  );

  return { auth, isLoading };
}

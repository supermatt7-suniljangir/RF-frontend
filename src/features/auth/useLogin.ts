"use client";
import { User } from "@/types/user";
import ApiService from "@/api/wrapper/axios-wrapper";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/contexts/UserContext";
import { usePathname } from "next/navigation";
import { getUserProfile } from "@/services/users/getUserProfile";

interface LoginPayload {
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
  const apiService = ApiService.getInstance();
  let userData: User;

  const auth = async (data: LoginPayload): Promise<User | null> => {
    try {
      setIsLoading(true);
      const { googleToken } = data;
      if (googleToken) {
        const response = await apiService.post<User | null>("/users/auth", {
          googleToken,
        });
        const loginResponse: User | null = response.data;

        if (!loginResponse) {
          toast({
            title: "Google Sign-In failed",
            description: "Please try again",
            variant: "destructive",
            duration: 5000,
          });
          throw new Error("Login failed");
        }
        const fetchUserData = (await getUserProfile({cacheSettings:"no-store"})) as User;
        if (!fetchUserData) {
          throw new Error("Fetching profile failed");
        }
        userData = fetchUserData;
      } else {
        let response;

        if (isLogin)
          response = await apiService.post<User | null>("/users/auth", {
            email: data.email,
            password: data.password,
            fullName: data.fullName,
          });
        else
          response = await apiService.post<User | null>("/users/register", {
            email: data.email,
            password: data.password,
            fullName: data.fullName,
          });
        const loginResponse: User | null = response.data;

        if (!loginResponse) {
          toast({
            duration: 5000,
            title: isLogin ? "Login failed" : "Registration failed",
            description: "Please try again",
            variant: "destructive",
          });
          throw new Error(isLogin ? "Login failed" : "Registration failed");
        }
        const fetchUserData = (await getUserProfile({cacheSettings:"no-store"})) as User;
        if (!fetchUserData) {
          throw new Error("Fetching profile failed");
        }
        userData = fetchUserData;
      }
      toast({
        title: isLogin ? "Login successful" : "Registration successful",
        description: "Welcome back",
        duration: 5000,
      });
      setUser(userData);
      return { ...userData };
    } catch (error) {
      console.error(
        "Error during " + isLogin ? "login" : "registration",
        error
      );
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { auth, isLoading };
}

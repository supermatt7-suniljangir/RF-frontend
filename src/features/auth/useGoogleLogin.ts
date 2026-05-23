"use client";
import { CredentialResponse } from "@react-oauth/google";
import { toast } from "@/hooks/use-toast";
import { useCallback } from "react";
import AuthService from "@/services/clientServices/auth/AuthServices";
import { getUserProfile } from "@/services/serverServices/profile/getUserProfile";
import { useUser } from "@/contexts/UserContext";

interface GoogleLoginResult {
  handleGoogleSuccess: (
    credentialResponse: CredentialResponse,
  ) => Promise<void>;
  handleGoogleError: () => void;
  isLoading: boolean;
}

const useGoogleLogin = (): GoogleLoginResult => {
  const { setUser, setIsLoading, isLoading } = useUser();

  const handleGoogleSuccess = useCallback(
    async (credentialResponse: CredentialResponse) => {
      try {
        setIsLoading(true);
        const googleToken = credentialResponse?.credential;
        if (!googleToken) {
          toast({
            title: "Authentication Error",
            description: "No valid credentials received from Google",
            variant: "destructive",
          });
          return;
        }

        await googleAuth(googleToken);
        const profileResult = await getUserProfile({ cacheSettings: "reload" });

        if (!profileResult.success || !profileResult.data) {
          throw new Error("Failed to fetch user profile after authentication");
        }
        setUser(profileResult.data);

        toast({
          title: "Authentication Successful",
          description:
            "i heard google employees enjoy food more than their sallary",
          duration: 5000,
        });
      } catch (error) {
        toast({
          title: "Google Login Failed",
          description:
            error instanceof Error ? error.message : "Authentication failed",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    },
    [setIsLoading, setUser],
  );
  const handleGoogleError = useCallback(() => {
    toast({
      title: "Google Login Failed",
      description:
        "Authentication with Google was unsuccessful. Please try again.",
      variant: "destructive",
    });
  }, []);

  return {
    handleGoogleSuccess,
    handleGoogleError,
    isLoading,
  };
};
const googleAuth = async (googleToken) => {
  if (!googleToken) {
    toast({
      title: "Authentication Error",
      description: "No google token provided to authenticate",
      variant: "destructive",
    });
    return;
  }
  await AuthService.googleLogin(googleToken);
};
export default useGoogleLogin;

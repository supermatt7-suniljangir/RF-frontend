"use client";
import { CredentialResponse } from "@react-oauth/google";
import { useAuth } from "./useLogin";
import { toast } from "@/hooks/use-toast";
import { useCallback } from "react";

interface GoogleLoginResult {
  handleGoogleSuccess: (
    credentialResponse: CredentialResponse
  ) => Promise<void>;
  handleGoogleError: () => void;
  isLoading: boolean;
}

const useGoogleLogin = (): GoogleLoginResult => {
  const { auth, isLoading } = useAuth();

  const handleGoogleSuccess = useCallback(
    async (credentialResponse: CredentialResponse) => {
      const googleToken = credentialResponse?.credential;

      if (!googleToken) {
        toast({
          title: "Authentication Error",
          description: "No valid credentials received from Google",
          variant: "destructive",
        });
        return;
      }
      await auth({ googleToken });
    },
    [auth]
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

export default useGoogleLogin;

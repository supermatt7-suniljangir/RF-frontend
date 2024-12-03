// useGoogleLogin.ts
"use client";
import { CredentialResponse } from "@react-oauth/google";
import { useAuth } from "./useLogin";

const useGoogleLogin = () => {
  const { auth, isLoading } = useAuth();

  const handleGoogleSuccess = async (
    credentialResponse: CredentialResponse
  ) => {
    const googleToken = credentialResponse.credential;

    if (googleToken) {
      // Await login to get the user and token
      const loginResponse = await auth({ googleToken });
      if (!loginResponse) {
        console.error("Login failed");
        return;
      }
    } else {
      console.error("No credential found in the response");
    }
  };

  const handleGoogleError = () => {
    console.error("Google Sign-In failed");
  };
  return { handleGoogleSuccess, handleGoogleError, isLoading };
};

export default useGoogleLogin;

"use client";
import { useState } from "react";
import { ApiResponse } from "@/types/ApiResponse";
import { User } from "@/types/user";
import UserProfileService from "@/services/clientServices/profile/ProfileService";
import { toast } from "@/hooks/use-toast";

export function useUpdateUserProfile() {
  const [loading, setLoading] = useState<boolean>(false);

  const updateProfile = async (
    payload: Partial<User>
  ): Promise<ApiResponse> => {
    setLoading(true);
    try {
      const res = await UserProfileService.updateProfile(payload);
      toast({
        title: "Success",
        description: res.message,
        duration: 5000,
      });
      return res;
    } catch (error) {
      toast({
        title: "Failed to update profile",
        description: error.message || "An error occurred",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { updateProfile, loading };
}

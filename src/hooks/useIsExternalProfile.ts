"use client";
import { useUser } from "@/contexts/UserContext";
import { User } from "@/types/user";

const useIsExternalProfile = (profileUser: User | null) => {
  const { user: authUser } = useUser();
  if (!authUser) return true;
  return Boolean(profileUser && authUser && profileUser._id !== authUser._id);
};
export default useIsExternalProfile;

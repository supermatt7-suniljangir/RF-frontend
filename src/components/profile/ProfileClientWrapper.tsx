"use client";

import Spinner from "@/app/loading";
import { useUser } from "@/contexts/UserContext";

// Ensure you have a Spinner component

export function UserClientWrapper({ children }) {
  const { isLoading } = useUser();
  if (isLoading) {
    return <Spinner />;
  }

  return children;
}

"use client";
import Spinner from "@/app/loading";
import { useUser } from "@/contexts/UserContext";
// import { useRouter } from "next/navigation";

const Greet = () => {
  // const router = useRouter();
  const { user, isLoading } = useUser();

  if (isLoading) return <Spinner size={"small"} />;
  return (
    <div>
      <p>hello {user?.fullName}</p>
    </div>
  );
};

export default Greet;

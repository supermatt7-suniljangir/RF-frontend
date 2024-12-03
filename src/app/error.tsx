"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const Error = ({ error, reset }: { error: Error; reset: () => void }) => {
  const router = useRouter();
  return (
    <div className="h-[90dvh] flex justify-center text-center p-8 items-center flex-col space-y-4">
      <h2 className="text-5xl  font-semibold">An Error Occured</h2>
      <p className="text-lg">{error.message}</p>
      <p>
        If you continue facing the problem, please visit our help and support
        center to provide feedback
      </p>
      <Button onClick={reset}>Try Again</Button>
      <Button onClick={() => router.push("/")}>Go To Homepage</Button>
    </div>
  );
};

export default Error;

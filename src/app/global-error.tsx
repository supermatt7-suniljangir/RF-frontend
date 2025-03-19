// global-error.tsx
"use client"; // Error boundaries must be Client Components

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  return (
    <html>
      <body>
        <div className="h-screen flex justify-center text-center p-8 items-center flex-col space-y-4">
          <h2 className="text-5xl font-semibold">Something went wrong!</h2>
          <p className="text-lg">{error.message}</p>
          <Button onClick={() => reset()}>Try again</Button>
          <Button onClick={() => router.push("/")}>Go To Homepage</Button>
        </div>
      </body>
    </html>
  );
}

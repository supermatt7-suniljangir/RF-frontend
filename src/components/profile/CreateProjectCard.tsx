"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const CreateProjectCard = () => {
  const pathname = usePathname();

  // Only show if we're on /profile exactly
  if (pathname !== "/profile") {
    return null;
  }

  return (
    <Card className="m-4 flex flex-col items-center justify-center rounded-sm p-8 text-center shadow-md transition-shadow hover:shadow-lg">
      <div className="mb-6 rounded-full bg-primary p-4">
        <Plus className="h-6 w-6 text-primary-foreground" />
      </div>

      <Link href="/project/editor/new">
        <Button variant="outline" className="mb-4 rounded-full px-6">
          Create a Project
        </Button>
      </Link>

      <p className="max-w-sm text-muted-foreground">
        Get feedback, views, and appreciations.
      </p>
    </Card>
  );
};

export default CreateProjectCard;

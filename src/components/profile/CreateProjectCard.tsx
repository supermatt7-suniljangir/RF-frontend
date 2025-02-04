"use client";
import { revalidateRoute } from '@/lib/revalidatePath';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus } from "lucide-react";
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const CreateProjectCard = () => {
  const pathname = usePathname();

  // Only show if we're on /profile exactly
  if (pathname !== '/profile') {
    return null;
  }

  return (
    <Card className="flex flex-col items-center justify-center p-8 rounded-sm m-4 text-center shadow-md hover:shadow-lg transition-shadow">
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
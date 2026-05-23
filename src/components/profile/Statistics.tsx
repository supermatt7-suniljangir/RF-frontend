import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { User } from "@/types/user";

const Statistics = ({ user }: { user?: User | null }) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Statistics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-center gap-4 text-center text-sm sm:text-base md:gap-8">
          <div className="flex flex-col items-center">
            <span className="text-2xl font-bold md:text-5xl">0</span>
            <span className="text-wrap">Project Views</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-2xl font-bold md:text-5xl">0</span>
            <span className="text-wrap">Appreciations</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-2xl font-bold md:text-5xl">15</span>
            <span className="text-wrap">Profile Views</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Statistics;

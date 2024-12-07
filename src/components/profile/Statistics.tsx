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
        <div className="flex justify-center gap-4 md:gap-8 text-center text-sm sm:text-base">
          <div className="flex flex-col items-center">
            <span className="text-2xl md:text-5xl font-bold">0</span>
            <span className="text-wrap">Project Views</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-2xl md:text-5xl font-bold">0</span>
            <span className="text-wrap">Appreciations</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-2xl md:text-5xl font-bold">15</span>
            <span className="text-wrap">Profile Views</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Statistics;

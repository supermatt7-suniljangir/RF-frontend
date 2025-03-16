import { ICopyright } from "@/types/project";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface CopyrightDetailsProps {
  copyright: ICopyright;
}

const CopyrightDetails: React.FC<CopyrightDetailsProps> = ({ copyright }) => {
  if (!copyright) return null;
  return (
    <Card className="p-4 rounded-none sm:w-5/6 w-[95%]">
      <CardHeader>
        <CardTitle className="text-center">Copyright Details</CardTitle>
      </CardHeader>
      <CardContent className="gap-4 md:gap-8 flex items-center justify-center flex-col md:flex-row">
        <div>
          <span>License:</span> {copyright.license}
        </div>
        <div className="flex items-center gap-2">
          <span>Allows Download:</span>
          {copyright.allowsDownload ? (
            <Badge variant="default">Yes</Badge>
          ) : (
            <Badge variant="destructive">No</Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span>Commercial Use:</span>
          {copyright.commercialUse ? (
            <Badge variant="default">Yes</Badge>
          ) : (
            <Badge variant="destructive">No</Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CopyrightDetails;

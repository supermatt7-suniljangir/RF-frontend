"use client";
import { Switch } from "@/components/ui/switch"; // shadcn switch
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"; // shadcn select
import { License } from "@/types/project";
import { useProjectContext } from "@/contexts/ProjectContext";

export default function Copyright() {
  const {
    copyRight: { license, allowsDownload, commercialUse },
    updateCopyRight,
  } = useProjectContext();

  const handleLicenseChange = (value: License) => {
    updateCopyRight({ license: value });
  };

  const handleDownloadToggle = (checked: boolean) => {
    updateCopyRight({ allowsDownload: checked });
  };

  const handleCommercialToggle = (checked: boolean) => {
    updateCopyRight({ commercialUse: checked });
  };

  return (
    <div className="w-5/6">
      <div className="mt-4 w-full space-y-6">
        {/* License Dropdown */}
        <div>
          <label className="block text-sm font-medium mb-1">License</label>
          <Select
            value={license}
            onValueChange={handleLicenseChange}
            defaultValue={License.All_Rights_Reserved}
          >
            <SelectTrigger className="w-full rounded-none">
              <SelectValue placeholder="Select a license" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={License.CC_BY_4_0}>CC BY 4.0</SelectItem>
              <SelectItem value={License.MIT_License}>MIT License</SelectItem>
              <SelectItem value={License.All_Rights_Reserved}>
                All Rights Reserved
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Allows Download Switch */}
        <div className="flex items-center justify-between text-muted-foreground">
          <label className="text-sm font-medium">Allow Download</label>
          <Switch
            checked={allowsDownload}
            onCheckedChange={handleDownloadToggle}
          />
        </div>

        {/* Commercial Use Switch */}
        <div className="flex items-center justify-between gap- text-muted-foreground">
          <label className="text-sm font-medium">Allow Commercial Use</label>
          <Switch
            checked={commercialUse}
            onCheckedChange={handleCommercialToggle}
          />
        </div>
      </div>
    </div>
  );
}

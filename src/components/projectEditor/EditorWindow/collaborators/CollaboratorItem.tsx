// CollaboratorItem.tsx
import React, { memo } from "react";
import { Button } from "@/components/ui/button";
import { Delete } from "lucide-react";
import MiniUserInfo from "@/components/common/MiniUserInfo";
import { MiniUser } from "@/types/user";

interface CollaboratorItemProps {
  collaborator: MiniUser;
  onRemove: (id: string) => void;
}

const CollaboratorItem: React.FC<CollaboratorItemProps> = ({
  collaborator,
  onRemove,
}) => {
  return (
    <div className="flex items-center gap-2 px-4 py-2 bg-muted h-fit">
      <MiniUserInfo
        avatar={collaborator?.profile?.avatar}
        fullName={collaborator.fullName}
        id={collaborator._id}
        styles="pointer-events-none"
      />
      <Button
        variant="ghost"
        className="h-fit p-0"
        onClick={() => onRemove(collaborator._id)}
      >
        <Delete className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default memo(CollaboratorItem);

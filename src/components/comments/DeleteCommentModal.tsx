import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription } from '../ui/dialog'; // Correct import
import { Loader2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Delete } from 'lucide-react';
import React from 'react';

interface DeleteCommentModalProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  isDeleting: boolean;
  handleDeleteComment: () => void;
}

const DeleteCommentModal: React.FC<DeleteCommentModalProps> = ({
  isOpen,
  setIsOpen,
  isDeleting,
  handleDeleteComment,
}) => {
  return (
    <div>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            className="rounded-none"
            disabled={isDeleting} // Disable while deleting
            onClick={() => setIsOpen(true)} // Open dialog when clicked
          >
            {isDeleting ? <Loader2 className="animate-spin" /> : <Delete />}
          </Button>
        </DialogTrigger>

        <DialogContent className="flex flex-col items-center space-y-4">
          <DialogTitle>Delete Comment</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this comment? This action cannot be
            undone.
          </DialogDescription>

          <div className="flex gap-2">
            <Button
              variant="destructive"
              onClick={handleDeleteComment}
              disabled={isDeleting}
            >
              {isDeleting ? <Loader2 className="animate-spin" /> : "Delete"}
            </Button>
            <Button variant="secondary" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DeleteCommentModal;

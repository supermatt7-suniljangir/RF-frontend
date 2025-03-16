// CollaboratorSearch.tsx
import React, { useState, useRef, useEffect, useCallback, memo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import MiniUserInfo from "@/components/common/MiniUserInfo";
import { MiniUser } from "@/types/user";
import { useSearch } from "@/features/search/useSearch";
import { useUser } from "@/contexts/UserContext";

interface CollaboratorSearchProps {
  collaborators: MiniUser[];
  onAddCollaborator: (user: MiniUser) => void;
}

const CollaboratorSearch: React.FC<CollaboratorSearchProps> = ({
  collaborators,
  onAddCollaborator,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [userSearchResults, setUserSearchResults] = useState<MiniUser[]>([]);
  const abortControllerRef = useRef<AbortController | null>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout>();
  const { searchUsers } = useSearch();
  const { user: currentUser } = useUser();

  useEffect(() => {
    // Cleanup function to abort any pending requests when component unmounts
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  const handleSearchChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);

    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Clear results if query is empty
    if (!query.trim()) {
      setUserSearchResults([]);
      setIsLoading(false);
      return;
    }

    // Abort any previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    setIsLoading(true);

    // Create a new AbortController for this request
    const controller = new AbortController();
    abortControllerRef.current = controller;

    // Debounce the search
    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const users = await searchUsers(
          { query, limit: 20, page: 1 },
          controller.signal,
        );
        // Only update if the request wasn't aborted
        if (!controller.signal.aborted) {
          setUserSearchResults(users.data || []);
        }
      } catch (error) {
        // Ignore abort errors
        if (error.name !== "AbortError") {
          console.error("Search error:", error);
          setUserSearchResults([]);
        }
      } finally {
        setIsLoading(false);
      }
    }, 300);
  };

  const handleAddCollaborator = useCallback(
    async (user: MiniUser) => {
      onAddCollaborator(user);
      setSearchQuery("");
      setUserSearchResults([]);
    },
    [onAddCollaborator, setSearchQuery, setUserSearchResults],
  );

  return (
    <Card className="p-4 rounded-none border-none shadow-none">
      <input
        type="text"
        placeholder="Search for a collaborator"
        className="w-full p-2 border rounded-none"
        value={searchQuery}
        onChange={handleSearchChange}
      />
      <CardContent className="p-4 shadow-sm border h-48 overflow-scroll">
        {isLoading ? (
          <div className="text-sm text-muted-foreground">Loading...</div>
        ) : userSearchResults.length > 0 ? (
          userSearchResults.map((user) => {
            const added = collaborators.some(
              (collab) => collab._id === user._id,
            );
            return (
              <div
                key={user._id}
                className="flex items-center justify-between gap-2 px-4 py-2 bg-muted h-fit mb-2"
              >
                <MiniUserInfo
                  avatar={user?.profile?.avatar}
                  fullName={user.fullName}
                  id={user._id}
                  styles="pointer-events-none"
                />
                <Button
                  disabled={added || user._id === currentUser?._id}
                  variant="ghost"
                  className="h-fit px-2"
                  onClick={() => handleAddCollaborator(user)}
                >
                  {added ? "Added" : "Add"}
                </Button>
              </div>
            );
          })
        ) : (
          <div className="text-sm text-muted-foreground w-full h-full text-center mt-10">
            {searchQuery ? "No Results Found" : "Search for a user"}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default memo(CollaboratorSearch);

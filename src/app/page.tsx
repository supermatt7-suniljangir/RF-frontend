import CreateProjectCard from "@/components/profile/CreateProjectCard";
import SearchInput from "@/components/search/SearchInput";
import SearchResults from "@/components/search/SearchResults";
import React from "react";

const HomePage: React.FC = async () => {
  return (
    <div className="flex w-full flex-col flex-wrap justify-center p-4">
      <div className="my-4">
        <div className="mx-auto mb-8 w-full">
          <CreateProjectCard />
        </div>
        <SearchInput />
      </div>
      <SearchResults />
    </div>
  );
};
export default HomePage;

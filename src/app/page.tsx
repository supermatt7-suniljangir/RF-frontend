import CreateProjectCard from "@/components/profile/CreateProjectCard";
import SearchInput from "@/components/search/SearchInput";
import SearchResults from "@/components/search/SearchResults";
import React from "react";

const HomePage: React.FC = async () => {

    return <div className="flex w-full flex-wrap justify-center p-4 flex-col">
        <div className="my-4">
            <div className="w-96 -mt-4 mb-8 mx-auto">
                <CreateProjectCard/>
            </div>
            <SearchInput/>
        </div>
        <SearchResults/>
    </div>
};
export default HomePage;

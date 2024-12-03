// components/SearchContainer.jsx

import CategorySelector from "./Categories";
// import SortAndFilter from "./Filters";
import SearchBar from "./SearchBar";
import SearchTags from "./SearchTags";

export default function SearchContainer() {
  return (
    <div className="mx-auto p-4 md:p-8 text-center">
      <h1 className="text-2xl md:text-4xl font-bold">
        Discover the world’s top creations
      </h1>
      <div className="w-full sm:w-3/4 md:w-1/2 mx-auto mt-8">
        <SearchBar />
      </div>

      <CategorySelector />
      <div className="flex flex-col md:flex-row justify-center gap-2 my-8 font-medium w-full sm:w-5/6  mx-auto">
        <h3 className="text-xl text-nowrap">Popular Tags:</h3>
        <SearchTags />
      </div>
    </div>
  );
}

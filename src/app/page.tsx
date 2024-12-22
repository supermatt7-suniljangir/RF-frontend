import SearchInput from "@/components/search/SearchInput";
import SearchResults from "@/components/search/SearchResults";

const HomePage: React.FC = async () => {

  return <div className="flex w-full flex-wrap justify-center p-4 flex-col">
    <div className="my-4">
      <SearchInput />
      </div>
    <SearchResults />
  </div>
};
export default HomePage;

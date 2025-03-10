import { SEARCH_ENDPOINT } from "@/constants/Path";
import API from "../API";

//GET ALL COMMENTS
const searchByText = async (searchText: string) => {
  try {
    return await (
      await API.get(`${SEARCH_ENDPOINT.SEARCH}`, {
        params: {
          searchText,
        },
      })
    ).data;
  } catch (e) {
    console.log(e);
  }
};

const SearchService = {
  searchByText,
};

export default SearchService;

import { CategoriesQueryOptionsType, Category } from '@framework/types';
import axios from "axios";
import { useQuery } from 'react-query';

// Adjust your API endpoint here
const CATEGORY_API_ENDPOINT = 'https://patrick-north-power-fence.trycloudflare.com/category/';

// Fetch categories from API
export const fetchCategories = async ({ queryKey }: any) => {
  const [_key, _params] = queryKey; // _key is API_ENDPOINT.CATEGORIES, _params is any options passed
  const response = await axios.get(CATEGORY_API_ENDPOINT);

  const { data } = response.data;

  // console.log("reponse from category dataaa..:",data)

  // Return the data as per your type
  return { categories: data as Category[] };
};

// Hook to use categories in components
export const useCategoriesQuery = (options: CategoriesQueryOptionsType) => {
  return useQuery<{ categories: Category[] }, Error>(
    [CATEGORY_API_ENDPOINT, options], // React query key (API endpoint + options)
    fetchCategories // Function to fetch categories
  );
};

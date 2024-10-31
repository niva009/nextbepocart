import { QueryOptionsType, Product } from '@framework/types';
import { API_ENDPOINTS } from '@framework/utils/api-endpoints';
import axios from 'axios';
import shuffle from 'lodash/shuffle';
import { useInfiniteQuery } from 'react-query';

type PaginatedProduct = {
  data: Product[];
  paginatorInfo: {
    nextPageUrl: string | null;
  };
};

// Define the fetch function for products
const fetchProducts = async ({ queryKey }: any) => {
  const [_key, options] = queryKey;
  const { category, sort_by } = options || {};

  // Construct the URL with category and sort_by options if available
  let url = `https://bepocart.in/subcategory/${category}/`;

  try {
    // Fetch data from the API without Authorization headers
    const { data } = await axios.get(url, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });

    console.log("data from product usequery", data);

    return {
      data: shuffle(data.products) as Product[], // Shuffle the products if needed
      paginatorInfo: {
        nextPageUrl: data.paginatorInfo?.nextPageUrl || null, // Ensure null if undefined
      },
    };
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

// Define the useProductsQuery hook
const useProductsQuery = (options: QueryOptionsType) => {
  return useInfiniteQuery<PaginatedProduct, Error>(
    [API_ENDPOINTS.PRODUCTS, options],
    fetchProducts,
    {
      getNextPageParam: (lastPage) => lastPage.paginatorInfo.nextPageUrl,
    }
  );
};

export { useProductsQuery, fetchProducts };

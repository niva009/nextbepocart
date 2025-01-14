import { QueryOptionsType, Product } from '@framework/types';
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

  // Construct the initial URL for the subcategory endpoint
  let url = `https://bepocart.in/subcategory/${category}/`;

  try {
    // Attempt to fetch data from the subcategory API
    const { data } = await axios.get(url, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });

    console.log("Data from subcategory endpoint:", data);

    return {
      data: shuffle(data.products) as Product[],
      paginatorInfo: {
        nextPageUrl: data.paginatorInfo?.nextPageUrl || null,
      },
    };
  } catch (error) {
    console.warn("Subcategory endpoint not found, attempting main category endpoint...");

    // Fallback URL for the main category endpoint
    url = `https://bepocart.in/category/${category}/products/`;

    // Retry with the main category endpoint
    const { data } = await axios.get(url, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });

    console.log("Data from main category endpoint:", data);

    // Handle main category data format
    return {
      data: shuffle(data.products) as Product[], // Access `data.products` here for consistency
      paginatorInfo: {
        nextPageUrl: data.paginatorInfo?.nextPageUrl || null,
      },
    };
  }
};

// Define the useProductsQuery hook
const useProductsQuery = (options: QueryOptionsType) => {
  return useInfiniteQuery<PaginatedProduct, Error>(
    ['products', options],
    fetchProducts,
    {
      getNextPageParam: (lastPage) => lastPage.paginatorInfo.nextPageUrl,
    }
  );
};

export { useProductsQuery, fetchProducts };

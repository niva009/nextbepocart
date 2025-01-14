import { QueryOptionsType, Product } from '@framework/types';
import { API_ENDPOINTS } from '@framework/utils/api-endpoints';
import { useQuery } from 'react-query';
import axios from 'axios';

export const fetchSearchedProducts = async ({ queryKey }: any) => {
  const [_key, params] = queryKey;

  // Ensure params.text is defined
  if (!params?.text) {
    throw new Error('Search text is missing');
  }

  const { data } = await axios.get(
    `https://patrick-north-power-fence.trycloudflare.com/search-products/?q=${params.text}`
  );

  return data;
};

export const useSearchQuery = (options: QueryOptionsType) => {
  return useQuery<Product[], Error>(
    [API_ENDPOINTS.SEARCH, options],
    fetchSearchedProducts,
    {
      enabled: !!options.text, // Only run if text is provided
      onError: (error) => {
        console.error('Error fetching search results:', error);
      },
    }
  );
};

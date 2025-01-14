import { QueryOptionsType, Product } from '@framework/types';
import { API_ENDPOINTS } from '@framework/utils/api-endpoints';
import { useQuery } from 'react-query';
import axios from 'axios';

export const fetchCartProducts = async ({ queryKey }: any) => {
  const token = localStorage.getItem("token");
  const [_key, _params] = queryKey;

  const response = await axios.get('https://patrick-north-power-fence.trycloudflare.com/cart-products/', {
    headers: { Authorization: `${token}` },
  });

  return {
    data: response.data.data,
    subTotal: response.data.Subtotal,
  };
};

export const useCartQuery = (options: QueryOptionsType) => {
  return useQuery<{ data: Product[]; subTotal: number }, Error>(
    [API_ENDPOINTS.CART, options],
    fetchCartProducts,
    {
      refetchOnWindowFocus: true, // Ensure data refresh on page focus
      staleTime: 0,              // Forces re-fetch after every mutation
      cacheTime: 0,              // Cache invalidation ensures fresh data
    }
  );
};

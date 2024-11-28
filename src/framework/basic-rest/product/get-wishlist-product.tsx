import { QueryOptionsType, Product } from '@framework/types';
import { API_ENDPOINTS } from '@framework/utils/api-endpoints';
import { useQuery } from 'react-query';
import axios from 'axios';

export const fetchWishlistProducts = async ({ queryKey }: any) => {
  const token = localStorage.getItem("token");
  const [_key, _params] = queryKey;
  const response = await axios.get('http://72.167.55.172:8000/wishlist/',{
    headers:{'Authorization':`${token}`}
  });
  const data = response.data.data
  console.log("wishlist ittems..:",data)
  return data;
};
export const useWishlistProductsQuery = (options: QueryOptionsType) => {
  return useQuery<Product[], Error>(
    [API_ENDPOINTS.WISHLIST, options],
    fetchWishlistProducts
  );
};

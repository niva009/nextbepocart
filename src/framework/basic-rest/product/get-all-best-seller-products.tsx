'use client';
import { QueryOptionsType, Product } from '@framework/types';
import axios from 'axios'
import { API_ENDPOINTS } from '@framework/utils/api-endpoints';
import { useQuery } from 'react-query';

export const fetchBestSellerProducts = async ({ queryKey }: any) => {
  const [_key, _params] = queryKey;
  const response = await axios.get('https://patrick-north-power-fence.trycloudflare.com/best-sale/');
  const {data} = response
  return data as Product[];

};
export const useBestSellerProductsQuery = (options: QueryOptionsType) => {
  return useQuery<Product[], Error>(
    [API_ENDPOINTS.BEST_SELLER_PRODUCTS, options],
    fetchBestSellerProducts
  );
};

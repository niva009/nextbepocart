import { QueryOptionsType, Product } from '@framework/types';
import { API_ENDPOINTS } from '@framework/utils/api-endpoints';
import { useQuery } from 'react-query';
import axios from "axios";
export const fetchPopularProducts = async ({ queryKey }: any) => {
  const [_key, _params] = queryKey;
  const response = await axios.get('https://bepocart.in/best-sale/');
  const {data}= response
  return data as Product[];
};
export const getBestSale = (options: QueryOptionsType) => {
  return useQuery<Product[], Error>(
    [API_ENDPOINTS.POPULAR_PRODUCTS, options],
    fetchPopularProducts
  );
};

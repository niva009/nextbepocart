import { QueryOptionsType, Product } from '@framework/types';
import axios from 'axios'
import { API_ENDPOINTS } from '@framework/utils/api-endpoints';
import { useQuery } from 'react-query';


export const fetchBestSaleProduct = async ({ queryKey }: any) => {
  const [_key, _params] = queryKey;
  const response = await axios.get("http://72.167.55.172:8000/best-sale/")
  const {data} = response
  console.log("datainformation...:",data);
  return (data) as Product[];
};
export const useBestSale = (options: QueryOptionsType) => {
  return useQuery<Product[], Error>(
    [API_ENDPOINTS.ELETRONIC_PRODUCTS, options],
    fetchBestSaleProduct
  );
};

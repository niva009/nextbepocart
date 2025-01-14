import { QueryOptionsType, Product } from '@framework/types';
import axios from 'axios'
import { API_ENDPOINTS } from '@framework/utils/api-endpoints';
import { useQuery } from 'react-query';


export const fetchElectronictablesProducts = async ({ queryKey }: any) => {
  const [_key, _params] = queryKey;
  const response = await axios.get("https://bepocart.in/products/")
  const data = response.data.products
  return (data) as Product[];
};
export const useElectronicProductsQuery = (options: QueryOptionsType) => {
  return useQuery<Product[], Error>(
    [API_ENDPOINTS.ELETRONIC_PRODUCTS, options],
    fetchElectronictablesProducts
  );
};

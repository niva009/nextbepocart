import { Product } from '@framework/types';
import axios from "axios";
import { API_ENDPOINTS } from '@framework/utils/api-endpoints';
import { useQuery } from 'react-query';

export const fetchProduct = async (_slug: string) => {
  const response = await axios.get(`https://bepocart.in/product/${_slug}`);
  console.log("reponse from ...",response);
  return response;
};
export const useProductQuery = (slug: string) => {
  return useQuery<Product, Error>([API_ENDPOINTS.PRODUCT, slug], () =>
    fetchProduct(slug)
  );
};

import { QueryOptionsType, Product } from '@framework/types';
import axios from 'axios';
import { API_ENDPOINTS } from '@framework/utils/api-endpoints';
import { useQuery } from 'react-query';

export const fetchRelatedProducts = async ({ queryKey }: any) => {
  const [_key, params] = queryKey;
  const { slug } = params;

  if (!slug) {
    console.warn("Slug is undefined.");
    return [];
  }

  // Make a request without any authorization header
  const response = await axios.get(`http://72.167.55.172:8000/related-products/${slug}/`);
  const data = response?.data?.data; // Ensure 'data' is accessed after response is received
  console.log("related products:", data);
  return data;
};

export const useRelatedProductsQuery = (options: QueryOptionsType) => {
  return useQuery<Product[], Error>(
    [API_ENDPOINTS.RELATED_PRODUCTS, options],
    fetchRelatedProducts
  );
};

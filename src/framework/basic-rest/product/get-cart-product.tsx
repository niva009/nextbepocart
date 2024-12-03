import { QueryOptionsType, Product } from '@framework/types';
import { API_ENDPOINTS } from '@framework/utils/api-endpoints';
import { useQuery } from 'react-query';
import axios from 'axios';

export const fetchCartProducts = async ({ queryKey }: any) => {
  const token = localStorage.getItem("token");
  const [_key, _params] = queryKey;
  const response = await axios.get('https://bepocart.in/cart-products/', {
    headers: { 'Authorization': `${token}` }
  });
  const data = response.data.data;
  const subTotal = response.data.Subtotal;
  console.log("cart items:", data);
  console.log("subtotal in cart:", subTotal);
  return { data, subTotal }; // return both data and subTotal
};

export const useCartQuery = (options: QueryOptionsType) => {
  return useQuery<{ data: Product[], subTotal: number }, Error>(
    [API_ENDPOINTS.CART, options],
    fetchCartProducts
  );
};
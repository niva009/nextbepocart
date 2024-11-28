import { QueryOptionsType } from '@framework/types';
import { API_ENDPOINTS } from '@framework/utils/api-endpoints';
import { useQuery } from 'react-query';
import axios from 'axios';

const fetchOrders = async ({ queryKey }: any) => {
  // Ensure the code only runs in the client environment
  if (typeof window === 'undefined') return { data: null };

  const token = localStorage.getItem('token');
  const [_key, _params] = queryKey;

  try {
    const response = await axios.get('http://72.167.55.172:8000/order-items/', {
      headers: { Authorization: token ? `${token}` : '' }, // Ensure Bearer prefix is added if token exists
    });

    console.log('Order details:', response.data.data); // Log the nested data
    return response?.data?.data; // Access data.data if the API returns data within data
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw new Error('Failed to fetch orders');
  }
};

const useOrdersQuery = (options: QueryOptionsType) => {
  return useQuery([API_ENDPOINTS.ORDERS, options], fetchOrders, {
    enabled: typeof window !== 'undefined' && !!localStorage.getItem('token'), // Enable query only if token exists in localStorage
  });
};

export { useOrdersQuery, fetchOrders };

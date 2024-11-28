import { API_ENDPOINTS } from '@framework/utils/api-endpoints';
import { useQuery } from 'react-query';
import axios from 'axios';

const fetchAddress = async () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null;
  const { data } = await axios.get('http://72.167.55.172:8000/get-address/', {
    headers: {
      Authorization: ` ${token}`, 
    },
  });
  
  return data.address;
};

const useAddressQuery = () => {
  return useQuery([API_ENDPOINTS.ADDRESS], fetchAddress);
};

export { useAddressQuery, fetchAddress };

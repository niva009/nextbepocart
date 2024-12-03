import { useUI } from '@contexts/ui.context';
import { useMutation } from 'react-query';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/navigation';

export interface LoginInputType {
  email: string;
  password: string;
}
async function login(input: LoginInputType) {
const response =  await axios.post('https://bepocart.in/login/',input);
return response.data; 
}
export const useLoginMutation = () => {

const router = useRouter();

  return useMutation((input: LoginInputType) => login(input), {
    onSuccess: (data) => {
      console.log("login data",data);
      localStorage.setItem("token",data.token);
      toast.success("Login success welcome to bepocart !")
      router.push('/home');
    },
    onError: (data) => {
      console.log(data, 'login error response');
      toast.error("login failed pls try again");
    },
  });
};

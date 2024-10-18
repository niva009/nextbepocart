import { useUI } from '@contexts/ui.context';
import { useMutation } from 'react-query';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/navigation';



export interface SignUpInputType {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  phone: number;
}

async function signUp(input: SignUpInputType) {
  const response = await axios.post('https://bepocart.in/register/', input);
  console.log(response)
  return response.data;
}

export const useSignUpMutation = () => {
  // const { closeModal } = useUI();
  const router = useRouter();
  
  return useMutation((input: SignUpInputType) => signUp(input), {
    onSuccess: (data) => {
      toast.success("registraion successfull..please login!")
      console.log("data after signup",data);
      router.push('/home/signin');
    },
    onError: (error) => {
      toast.error("registraion failed..please try again!")
      console.log(error, 'signup error response');
    },
  });
};
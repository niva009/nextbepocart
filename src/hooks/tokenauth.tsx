import { useEffect } from "react";
import { useRouter } from "next/navigation";


export const  tokenAuth = () =>{


    const router = useRouter();

    useEffect(() =>{
        const token = localStorage.getItem("token");

        if(!token){
            router.push('/en/signin')
        }
    },[router])
}
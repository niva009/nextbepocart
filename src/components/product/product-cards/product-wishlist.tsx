

import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as solidHeart } from '@fortawesome/free-solid-svg-icons';
import { faHeart as regularHeart } from '@fortawesome/free-regular-svg-icons';
import { toast } from 'react-toastify';

interface ProductWishlistProps {
    id: string;
}

export const ProductWishlist: React.FC<ProductWishlistProps> = ({ id }) => {
    const [isWished, setIsWished] = useState(false);
    const router = useRouter();

    const handleWishlistToggle = () => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/en/signin");
            return;
        }

        axios.post(`https://bepocart.in/add-wishlist/${id}/`, {}, {
            headers: {
                Authorization: `${token}`,
            },
        })
        .then((response) => {
            console.log("Product added to wishlist:", response);
            setIsWished(!isWished); // Toggle wishlist state
        })
        .catch((error) => {
            if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                router.push("/en/signin");
            }
            const toastStatus = "product already exist in wishlist ..!"

            setTimeout(() => {
            }, 1500);
        
            toast.error(toastStatus, {
              className: 'toast-error',
              progressClassName: 'fancy-progress-bar',
              position: window.innerWidth > 768 ? 'top-right' : 'top-right',
              autoClose: 2500,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
            })
            console.log("Error in wishlist:", error);
        });
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
            <button 
                onClick={handleWishlistToggle} 
                style={{
                    // border: '1px solid #000', 
                    borderRadius: '10px',
                    cursor: 'pointer',
                    fontSize: '17px',
                    padding: '10px 30px', 
                    background:  '#93ff05', 
                    color:  'black' ,
                    display: 'flex',
                    alignItems: 'center',
                }}
            > 
                Add to Wishlist
                <FontAwesomeIcon 
                    icon={isWished ? solidHeart : regularHeart}
                    style={{ color: isWished ? 'red' : 'white', marginLeft: '8px' }} // Change icon color
                />
            </button>
        </div>
    );
};

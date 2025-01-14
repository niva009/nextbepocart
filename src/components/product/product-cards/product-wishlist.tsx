

import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as solidHeart } from '@fortawesome/free-solid-svg-icons';
import { faHeart as regularHeart } from '@fortawesome/free-regular-svg-icons';
import { toast } from 'react-toastify';

interface ProductWishlistProps {
    id: string;
    product: any;
}

export const ProductWishlist: React.FC<ProductWishlistProps> = ({ id, product }) => {
    const [isWished, setIsWished] = useState(false);
    const router = useRouter();




    const handleTrackWishlist = () => {

        if (product ) { // Track only when adding to wishlist
          window.fbq('track', 'AddToWishlist', {
            content_category: product.mainCategory,
            content_ids: product.id,
            content_name: product.name,
            content_type: 'product_group',
            currency: 'INR',
            value: product.salePrice,
          });
        }
      };


      const gtmtrackWishlist = () => {
        if (product) {
          window.dataLayer.push({ ecommerce: null }); // Clear the previous ecommerce object.
          window.dataLayer.push({
            event: "add_to_wishlist",
            ecommerce: {
              currency: "INR",
              value: product?.salePrice || 0, // Default to 0 if salePrice is undefined
              items: [
                {
                  item_id: product?.id || "", // Default to an empty string if id is undefined
                  item_name: product?.name || "", // Default to an empty string if name is undefined
                  affiliation: "Bepocart",
                  discount: product?.discount || 0, // Default to 0 if discount is undefined
                  index: 0,
                  item_category: product?.mainCategory || "", // Default to an empty string if mainCategory is undefined
                  item_category2: product?.categoryName || "", // Default to an empty string if categoryName is undefined
                  item_list_id: product?.category || "", // Default to an empty string if category is undefined
                  item_list_name: product?.categoryName || "", // Default to an empty string if categoryName is undefined
                  item_variant: "yellow", // Fixed the syntax error with extra double quotes
                //   location_id: "ChIJIQBpAG2ahYAR_6128GcTUEo", // Fixed the syntax error with extra double quotes
                  price:product?.price || 10.01, // Default to 10.01 if price is undefined
                  quantity: 1, // Assuming a default quantity of 1
                },
              ],
            },
          });
        }
      };


      const wishlist = () =>{
        handleTrackWishlist();
        handleWishlistToggle()
      gtmtrackWishlist ();

      }

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
                onClick={wishlist} 
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

'use client';

import { useState, useEffect } from 'react';
import Button from '@components/ui/button';
import Counter from '@components/ui/counter';
import { useParams, useRouter } from 'next/navigation';
import useWindowSize from '@utils/use-window-size';
import { useCart } from '@contexts/cart/cart.context';
import { generateCartItem } from '@utils/generate-cart-item';
import { toast } from 'react-toastify';
import ThumbnailCarousel from '@components/ui/carousel/thumbnail-carousel';
import Image from '@components/ui/image';
import CartIcon from '@components/icons/cart-icon';
import { IoIosHeart, IoIosHeartEmpty } from 'react-icons/io';
import ProductDetailsTab from '@components/product/product-details/product-tab';
import { useTranslation } from 'src/app/i18n/client';
import axios from "axios";
import { useQueryClient } from 'react-query';
import { API_ENDPOINTS } from '@framework/utils/api-endpoints';

const ProductSingleDetails = ({ data, lang }) => {
  const { t } = useTranslation(lang, 'common');
  const pathname = useParams();
  const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null;
  const router = useRouter();
  const { width } = useWindowSize();
  const { addItemToCart } = useCart();

  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [favorite, setFavorite] = useState(false);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedImage, setSelectedImage] = useState(null); // State to store the selected image
  const [sizes, setSizes] = useState([]);
  const [selectedSize, setSelectedSize] = useState("");
  const [stock, setStock] = useState(0);
  const [addToCartLoader, setAddToCartLoader] = useState(false);
  const [errorMessage , setErrorMessage] = useState('');
  const [addToWishlistLoader, setAddToWishlistLoader] = useState(false);
  const queryClient = useQueryClient(); // Initialize the query client

  // Automatically set initial color, size, and image with stock
  useEffect(() => {
    if (data?.product?.type === 'variant' && data?.images?.length > 0) {
      const firstAvailableColor = data.images.find(
        (image) => image.stock_info.some((sizeInfo) => sizeInfo.stock > 0)
      );
      if (firstAvailableColor) {
        setSelectedColor(firstAvailableColor.color);
        setSelectedImage(firstAvailableColor);
        setSizes(firstAvailableColor.stock_info);
        const firstAvailableSize = firstAvailableColor.stock_info.find((sizeInfo) => sizeInfo.stock > 0);
        if (firstAvailableSize) {
          setSelectedSize(firstAvailableSize.size);
          setStock(firstAvailableSize.stock);
        }
      }
    } else if (data?.product?.type === 'single' && data?.images?.[0]) {
      setSelectedImage(data.images[0]);
      setStock(data.images[0].stock || 0);
    }
  }, [data]);

  const handleColorChange = (colorOption) => {
    setErrorMessage("");
    setSelectedColor(colorOption.color);
    setSelectedImage(colorOption);
    setSelectedSize(""); // Reset size selection when color changes

    if (colorOption.stock_info) {
      setSizes(colorOption.stock_info);
      const availableSize = colorOption.stock_info.find((sizeInfo) => sizeInfo.stock > 0);
      if (availableSize) {
        setSelectedSize(availableSize.size);
        setStock(availableSize.stock);
      } else {
        setStock(0);
      }
    } else {
      setStock(colorOption.stock || 0);
    }
  };

  const handleSizeChange = (size, availableStock) => {
    if (availableStock > 0) {
      setSelectedSize(size);
      setStock(availableStock);
    }
  };

  const addToCart = async () => {
    if (stock === 0) return;
    setAddToCartLoader(true);
  
    if (!selectedColor) {
      setErrorMessage("Please choose a color or size.");
      setAddToCartLoader(false); // Stop loading if color is not selected
      return;
    }
  
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null;
      if (!token) {
        router.push('/en/signin');
        setAddToCartLoader(false); // Stop loading if not authenticated
        return;
      }
  
      const response = await axios.post(
        `https://bepocart.in/cart/${data?.product?.id}/`,
        {
          quantity: selectedQuantity,
          size: selectedSize,
          color: selectedColor,
        },
        {
          headers: { Authorization: `${token}` },
        }
      );
      queryClient.invalidateQueries(API_ENDPOINTS.CART);
  
      if (response.status === 201) {
        toast.success('Added to the bag', {
          progressClassName: 'fancy-progress-bar',
          position: width > 768 ? 'bottom-right' : 'top-right',
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        // Show specific error message if status is 400
        toast.error('product aleady exist in cart', {
          position: width > 768 ? 'bottom-right' : 'top-right',
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } else {
        // Generic error message for other cases
        toast.error("Error adding to cart. Please try again.", {
          position: width > 768 ? 'bottom-right' : 'top-right',
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    } finally {
      setAddToCartLoader(false);
    }
  };
  
  

  const addToWishlist = () => {
    if (!token) {
      router.push('/en/signin');
      return;
    }
  
    axios
      .post(
        `https://bepocart.in/add-wishlist/${data?.product?.id}/`,
        {},
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      )
      .then((response) => {
        if (response.status === 201) {
          setAddToWishlistLoader(true);
          setFavorite(!favorite);
          toast(favorite ? t('text-remove-favorite') : t('text-added-favorite'), {
            progressClassName: 'fancy-progress-bar',
            position: window.innerWidth > 768 ? 'bottom-right' : 'top-right',
            autoClose: 1500,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
          setAddToWishlistLoader(false);
        }
      })
      .catch((error) => {
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
          router.push("/en/signin");
        } else {
          const errorMessage = error.response?.data?.message || "An error occurred. Please try again.";
          toast(errorMessage, {
            progressClassName: 'fancy-progress-bar',
            position: window.innerWidth > 768 ? 'bottom-right' : 'top-right',
            autoClose: 1500,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
        }
      });
  };

  console.log("selected iamgee..:", selectedImage);

  return (
    <div className="pt-6 pb-2 md:pt-7">
      <div className="grid-cols-10 lg:grid gap-7 2xl:gap-7 mb-8 lg:mb-12 bg-white p-5 rounded">
        <div className="col-span-5 mb-6 overflow-hidden md:mb-8 lg:mb-0 xl:flex justify-center">
          {!!data?.images?.length ? (
            selectedImage ? (
              <ThumbnailCarousel
              gallery={[selectedImage, ...data.images.filter(img => img.color == selectedImage.color)]}
              galleryClassName="xl:w-[100px] w-full h-full object-cover"
              lang={lang}
            />
            
            ) : (
              <div className="flex items-center justify-center w-auto">
                <Image
                  src={data?.product?.image ?? '/product-placeholder.svg'}
                  alt={data?.product?.name}
                  width="full"
                  height={680}
                />
              </div>
            )
          ) : (
            <div className="flex items-center justify-center w-auto">
              {/* <Image
                src={data?.product?.image ?? '/product-placeholder.svg'}
                alt={data?.product?.name}
                width="full"
                height={680}
              /> */}
            </div>
          )}
        </div>

        <div className="flex flex-col col-span-5 shrink-0">
          <div className="pb-4 lg:pb-8">
            <h2 className="text-lg font-medium transition-colors duration-300 text-brand-dark md:text-xl xl:text-2xl">
              {data?.product?.name}
            </h2>
            <div className="flex items-center mt-5">
              <del className="text-sm text-opacity-50 md:text-15px ltr:pl-3 rtl:pr-3 text-brand-dark">
                ₹{data?.product?.price}
              </del>
              <span className="inline-block rounded font-bold text-45px md:text-xl text-brand-tree uppercase px-2 py-1 ltr:ml-2.5 rtl:mr-2.5">
                ₹{data?.product?.salePrice}
              </span>
            </div>
          </div>
          <p>{data?.product?.short_description}</p>

          {/* Color selection - available for both single and variant products */}
          {data?.images.length > 0 && (
            <div>
              <h4 className="text-base font-bold text-qblack mb-2 mt-4">Color</h4>
              <div className="flex flex-wrap gap-2">
                {data.images.map((image) => (
                  <button
                  key={image.id}
                  className={`px-4 py-2 rounded border ${selectedColor === image.color
                      ? ' text-red-400 font-bold '
                      : 'border-qgray text-qblack'
                    }`}
                  onClick={() => handleColorChange(image)}
                  disabled={image.stock === 0} // Disable if out of stock
                >
                  {image.color}
                </button>
                ))}
              </div>
              {errorMessage && (
      <p className="text-red-500 font-semibold mt-2">{errorMessage}</p>
    )}
            </div>
          )}

          {/* Size selection - only for variant products */}
          {data?.product?.type === 'variant' && selectedColor && sizes.length > 0 && (
            <div>
              <h4 className="text-base font-bold text-qblack mb-2 mt-4">Size</h4>
              <div className="flex flex-wrap gap-2">
                {sizes.map((sizeInfo) => (
                  <button
                    key={sizeInfo.size}
                    className={`px-4 py-2 rounded border ${selectedSize === sizeInfo.size
                        ? 'border-qblack text-qblack font-semibold'
                        : 'border-qgray text-qblack'
                      } ${sizeInfo.stock === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onClick={() => handleSizeChange(sizeInfo.size, sizeInfo.stock)}
                    disabled={sizeInfo.stock === 0}
                  >
                    {sizeInfo.size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Stock information */}
          {stock === 0 ? (
            <p style={{ color: "red", fontWeight: "bold", fontSize: "18px", padding: "10px 0px" }}>
              Out of Stock
            </p>
          ) : (
            stock > 0 && stock < 10 && (
              <p style={{ color: "green", fontWeight: "500", fontSize: "18px", padding: "10px 0px" }}>
                {`${stock} items left`}   
              </p>
            )
          )}

          <div className="space-y-4 mt-4"> 
            <Counter
              variant="single"
              value={selectedQuantity}
              onIncrement={() => setSelectedQuantity((prev) => prev + 1)}
              onDecrement={() => setSelectedQuantity((prev) => (prev !== 1 ? prev - 1 : 1))}
              disabled={stock === 0 || selectedQuantity >= stock}
              lang={lang}
            />

            <Button
              onClick={addToCart}
              className="w-full px-1.5"
              disabled={stock === 0}
            >
              <CartIcon color="#ffffff" className="ltr:mr-3 rtl:ml-3" />
              {t('text-add-to-cart')}
            </Button>

            <Button
              variant="border"
              onClick={addToWishlist}
              loading={addToWishlistLoader}
              className={`group hover:text-brand ${favorite && 'text-brand'}`}
            >
              {favorite ? (
                <IoIosHeart className="text-2xl md:text-[26px] ltr:mr-2 rtl:ml-2 transition-all" />
              ) : (
                <IoIosHeartEmpty className="text-2xl md:text-[26px] ltr:mr-2 rtl:ml-2 transition-all group-hover:text-brand" />
              )}
              {t('text-wishlist')}
            </Button>
          </div>
        </div>
      </div>
      <ProductDetailsTab product={data?.product} lang={lang} />
    </div>
  );
};

export default ProductSingleDetails;

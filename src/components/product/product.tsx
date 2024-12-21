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
import { useRef } from 'react';
import Script from 'next/script';

const ProductSingleDetails = ({ data, lang ,reviews}) => {
  const { t } = useTranslation(lang, 'common');
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
  const queryClient = useQueryClient(); 


  const hasFired = useRef(false);
  const gtmFire = useRef(false);

  let cleanUrl = null;

  if (typeof window !== "undefined") {
    const fullUrl = window.location.href;
    cleanUrl = fullUrl.split('?')[0]; 
  }
  useEffect(() => {
  
    if (data?.product && !hasFired.current) {
      try {
        // console.log("Product data:", data.product);
        window.fbq('track', 'ViewContent', {
          content_category: data.product.categoryName,
          content_name: data.product.name,
          content_ids: data.product.id,
          content_type: 'product_Group',
          value: data.product.salePrice,
          currency: 'INR',
        });
        hasFired.current = true; // Prevent further triggers
        // console.log("ViewContent event triggered");
      } catch (error) {
        console.error("Facebook Pixel error:", error);
      }
    }
  }, [data?.product]);



  ////////gtm tracking//////

  useEffect(() => {
    if (data?.product && !gtmFire.current) {
      try {
        window.dataLayer = window.dataLayer || []; 
        window.dataLayer.push({
          event: "view_item",
          ecommerce: {
            currency: "INR",
            value: data.product.salePrice,
            items: [
              {
                item_id: data.product.id,
                item_name: data.product.name,
                item_brand: firstWord,
                item_category: data.product.mainCategory,
                item_category2: data.product.categoryName,
                item_list_id: data.product.category,
                item_list_name: data.product.categoryName,
                item_variant: selectedColor|| "black",
                price: data.product.salePrice,
              },
            ],
          },
        });

        // Set gtmFire to true to prevent duplicate firing
        gtmFire.current = true;
      } catch (error) {
        console.error("GTM view_item event error:", error);
      }
    }
  }, [data?.product, selectedColor]);




  // console.log(window.dataLayer);



  // <----------------->






  // console.log("review in product page...:", reviews)

 
  const avgRating = reviews.reduce((total, rev) => total + rev.rating, 0) / reviews.length;
  const reviewDate = reviews.map(rev => {

    const date = new Date(rev.created_at); // Convert to Date object
    const day = String(date.getDate()).padStart(2, '0'); // Get day and format to two digits
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Get month (0-based) and format
    const year = date.getFullYear(); // Get year
  
    return `${day}/${month}/${year}`; // Return in 'day/month/year' format
  });


  const firstWord = data?.product?.name.split(' ')[0].trim();

  
  



  // schema integration single page........../

// Assuming data, reviews, avgRating, etc. are already fetched and populated


// console.log("produyct inaaaaaaa..:", data?.product?.image);

const structuredData = {
  "@context": "https://schema.org",
  "@type": "Product",
  "@id": cleanUrl,
  "url": cleanUrl,
  "name": data?.product?.name,
  "image":`https://bepocart.in${data?.product?.image}`,
  "description": data?.product?.description,
  "brand": {
    "@type": "Brand",
    "name": firstWord, // The first word of the product name
  },
  // Reviews: Mapping through the reviews array
  ...(reviews.length > 0 && {
    "review": reviews.map((rev) => ({
      "@type": "Review",
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": rev.rating || '', // Rating value from the review
        "bestRating": "5", // You can dynamically set this if needed
      },
      "datePublished": new Date(rev.created_at).toISOString() || '', // Ensure valid ISO date format
      "reviewBody": rev.review_text || '', // Review text content
      "author": {
        "@type": "Person",
        "name": rev.first_name || '', // Assuming `first_name` is the reviewer's name
      }
    })),
  }),

  // Aggregate Rating: Calculated average rating and review count
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": avgRating? avgRating: 4.5, // The average rating
    "reviewCount": reviews?.length ? reviews.length : 10, // Total number of reviews
  },

  // Offers: Price and availability details
  "offers": {
    "@type": "Offer",
    "url": cleanUrl,
    "priceCurrency": "INR",
    "price": data?.product?.price,
    "priceValidUntil": "2024-12-31", // Example expiration date
    "itemCondition": "https://schema.org/NewCondition",
    "availability": "https://schema.org/InStock",
    "discountCode": "", // Can be added if available
    "eligibleTransactionVolume": {
      "@type": "PriceSpecification",
      "priceCurrency": "INR",
    },
    "seller": {
      "@type": "Organization",
      "name": "Bepoart", // Assuming "Bepoart" is your brand name
    },
    "hasPriceSpecification": [
      {
        "@type": "UnitPriceSpecification",
        "priceCurrency": "INR",
        "price": data?.product?.price || 0,
        "priceType": "ListPrice"
      },
      {
        "@type": "UnitPriceSpecification",
        "priceCurrency": "INR",
        "price": data?.product?.salePrice,
        "priceType": "SalePrice"
      }
    ]
  },
};

  


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
    } else if (data?.product?.type === 'single' && data?.images?.length > 0) {
      const firstAvailableImage = data.images.find((image) => image.stock > 0);
      if (firstAvailableImage) {
        setSelectedImage(firstAvailableImage);
        setSelectedColor(firstAvailableImage.color);
        setStock(firstAvailableImage.stock || 0);
      }
    }
  }, [data]);
  





  const handleColorChange = (colorOption) => {
    setErrorMessage("");
    setSelectedQuantity(1);
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



  const handleTrackCart = () => {
    fbq('track', 'AddToCart', {
      content_name: data?.product?.name || "name",
      content_ids: data?.product?.id || "product-id",
      content_type: 'product_group',
      content_category: data?.product?.categoryName || "category", // Add category
      value: data?.product?.salePrice || "sale-price" ,
      currency: 'INR',
      quantity: selectedQuantity // Make sure to pass a valid quantity
    });
  };



  const gtmAddCart = () => {
    if (typeof window !== "undefined" && window.dataLayer) {
  
      window.dataLayer.push({ ecommerce: null }); // Clear the previous ecommerce object.
      window.dataLayer.push({
        event: "add_to_cart",
        ecommerce: {
          currency: "INR",
          value: data?.product?.salePrice,
          items: [
            {
              item_id: data?.product?.id,
              item_name: data?.product?.name,
              affiliation: "Bepocart",
              discount: data?.product?.discount,
              index: 0,
              item_brand: firstWord,
              item_category: data?.product?.mainCategory,
              item_category2: data?.product?.categoryName,
              item_list_id: data?.product?.category,
              item_list_name: data?.product?.categoryName,
              item_variant: "red", // Update with dynamic data if available
              price: data?.prooduct?.salePrice,
              quantity: selectedQuantity,
            },
          ],
        },
      });
    } else {
      console.error("dataLayer is not available on the window object.");
    }
  };
  
 
  const handleCart = () =>{
    handleTrackCart();
    addToCart()
    gtmAddCart();
  }

  const gtmtrackWishlist = () => {
    if (data && data?.product) {
      window.dataLayer.push({ ecommerce: null }); // Clear the previous ecommerce object.
      window.dataLayer.push({
        event: "add_to_wishlist",
        ecommerce: {
          currency: "INR",
          value: data?.product?.salePrice || 0, // Default to 0 if salePrice is undefined
          items: [
            {
              item_id: data?.product?.id || "", // Default to an empty string if id is undefined
              item_name: data?.product?.name || "", // Default to an empty string if name is undefined
              affiliation: "Bepocart",
              discount: data?.product?.discount || 0, // Default to 0 if discount is undefined
              index: 0,
              item_brand: firstWord || "", // Default to an empty string if firstWord is undefined
              item_category: data?.product?.mainCategory || "", // Default to an empty string if mainCategory is undefined
              item_category2: data?.product?.categoryName || "", // Default to an empty string if categoryName is undefined
              item_list_id: data?.product?.category || "", // Default to an empty string if category is undefined
              item_list_name: data?.product?.categoryName || "", // Default to an empty string if categoryName is undefined
              item_variant: "green", // Fixed the syntax error with extra double quotes
              location_id: "ChIJIQBpAG2ahYAR_6128GcTUEo", // Fixed the syntax error with extra double quotes
              price: data?.product?.price || 10.01, // Default to 10.01 if price is undefined
              quantity: 1, // Assuming a default quantity of 1
            },
          ],
        },
      });
    }
  };
  


  const handleTrackWishlist = () => {

    if (data && data?.product) { // Track only when adding to wishlist
      window.fbq('track', 'AddToWishlist', {
        content_category: data?.product.categoryName,
        content_ids: data?.product.id,
        content_name: data?.product.name,
        content_type: 'product_group',
        currency: 'INR',
        value: data?.product.salePrice,
      });
    }
  };

  const wishlistAdd = () =>{
    handleTrackWishlist();
    addToWishlist()
    gtmtrackWishlist()
  }






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
      if (error.response && error.response.status === 401) {
        // Redirect to sign in if unauthorized
        router.push('/en/signin');
      } else if (error.response && error.response.status === 400) {
        // Show specific error message if status is 400
        toast.error('Product already exists in cart', {
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

  // console.log("selected iamgee..:", selectedImage);

  return (
    <div className="pt-6 pb-2 md:pt-7">
      <div className="grid-cols-10 lg:grid gap-7 2xl:gap-7 mb-8 lg:mb-12 bg-white p-5 rounded">


      <Script
        id="json-ld-schema-product"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />


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
                <img
                  src={`https://bepocart.in/${data?.product?.image || '/product-placeholder.svg'}`}
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
              onClick={handleCart}
              className="w-full px-1.5"
              disabled={stock === 0}
            >
              <CartIcon color="#ffffff" className="ltr:mr-3 rtl:ml-3" />
              {t('text-add-to-cart')}
            </Button>

            <Button
              variant="border"
              onClick={wishlistAdd}
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

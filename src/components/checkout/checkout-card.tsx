'use client';

import Link from 'next/link';
import cn from 'classnames';
import Text from '@components/ui/text';
import Button from '@components/ui/button';
import { CheckoutItem } from '@components/checkout/checkout-card-item';
import { CheckoutCardFooterItem } from './checkout-card-footer-item';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@utils/routes';
import { useTranslation } from 'src/app/i18n/client';
import { useIsMounted } from '@utils/use-is-mounted';
import { useEffect, useState } from 'react';
import SearchResultLoader from '@components/ui/loaders/search-result-loader';
import { useCartQuery } from '@framework/product/get-cart-product';
import axios from 'axios';
import {useStateContext} from 'src/app/context/usecontext'

const CheckoutCard: React.FC<{ lang: string }> = ({ lang }) => {
  const { t } = useTranslation(lang, 'common');
  const router = useRouter();
  const [isLoading, setLoading] = useState(true);
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [subTotal, setSubTotal] = useState(0);
  const { data } = useCartQuery({});
  const [isAddressAvailable, setIsAddressAvailable] = useState(false);
  const [token, setToken] = useState(null);
  const [addressId, setAddressId] = useState("");

  const [addressData, setAddressData] = useState({});
  const { actionState } = useStateContext();


  // useEffect(() => {
  //   // Ensure this runs only in the browser
  //   if (typeof window !== 'undefined') {
  //     const savedToken = localStorage.getItem('token');
  //     const savedAddressId = localStorage.getItem('addressid');

  //     setToken(savedToken);
  //     setAddressId(savedAddressId);
  //   }
  // }, []);


  // if (actionState){
  //   setIsAddressAvailable(true);
  //   console.log("address trigered");
  // }
  console.log("token info", token);
  console.log('addressiddd', addressId);

  useEffect(() => {
    const fetchAddress = async () => {
      try {
        // if (!addressId) {
        //   setLoading(false);
        //   // setIsAddressAvailable(false);
        //   return;
        // }

        const { data } = await axios.get('https://patrick-north-power-fence.trycloudflare.com/get-address/', {
          headers: {
            Authorization: `${token}`, // Add 'Bearer' if required, else just use token
          },
        });

        console.log("sbdasd", data.address);


        const foundAddress = data?.addres?.find(address => String(address.id) === String(addressId));

        if (foundAddress) {
          console.log("addres found..:", foundAddress);
          setAddressData(foundAddress);
        }

        // setIsAddressAvailable(true); // Convert to boolean
      } catch (error) {
        console.error('Error fetching address:', error);
        // setIsAddressAvailable(false);
      } finally {
        setLoading(false);
      }
    };

    fetchAddress();
  }, [token, addressId]);

  const handleTrackCheckout = () => {
    if (!addressData || !isAddressAvailable) return;

    const { city, state, pincode } = addressData;

    console.log("pincode and addresss.:", addressData);

    fbq('track', 'AddShippingAddress', {
      value: parseFloat(subTotal).toFixed(2), // Ensure it's a number
      currency: 'INR',
      content_ids: contentIds,
      contents: content,
      content_type: 'product',
      num_items: contentIds?.length || 0, 
      quantity: totalQuantity,
      checkOut_step: "2",
      city: city || "",
      state: state || "",
      pincode: pincode || "",
    });
  };


  useEffect(() => {
    if (typeof window !== "undefined" && window.dataLayer) {
      const items = cartItems?.map(product => ({
        item_id: product.id, // Product ID
        item_name: product?.name, // Product name
        affiliation: "Bepocart", // Affiliation
        discount: product.discount, // Discount applied to the product
        item_brand: product?.name.split(' ')[0]?.trim() || "", // First word of the product name as brand
        item_category: product?.mainCategory || "", // Main category
        item_category2: product?.categoryName || "", // Secondary category
        item_list_id: product?.category || "", // Category ID
        item_list_name: product?.categoryName || "", // Category name
        item_variant: "green", // Variant
        price: product?.price || 0, // Product price
        quantity: product?.quantity || 1, // Product quantity
      }));
  
      // Push event to GTM's dataLayer
      window.dataLayer.push({
        event: "add_shipping_info",
        ecommerce: {
          currency: "INR", // Correct currency code for Indian Rupees
          value: parseFloat(subTotal || 0).toFixed(2), // Ensure subTotal is parsed as a float
          items: items || [], // Ensure items is an array
        },
      });
    }
  }, [cartItems, subTotal]); // Dependencies to re-run the effect when these values change
  
  








  useEffect(() => {
    if (data) {
      setCartItems(data.data || []);
      setSubTotal(data.subTotal);
    }
  }, [data]);


  
  
const toPaymentPage = () =>{
  orderHeader();
  handleTrackCheckout();
}

  

  function orderHeader() {
    if (cartItems) {
      router.push(`/${lang}${ROUTES.PAYMENT}`);
    }
  }

  const checkoutFooter = [
    {
      id: 1,
      name: t('text-sub-total'),
      price: `₹${subTotal.toString()}`, // Correctly formatted subtotal with currency symbol
    },
    {
      id: 2,
      name: t('text-shipping'),
      price: '₹0',
    },
    {
      id: 3,
      name: t('text-total'),
      price: `₹${subTotal.toString()}`, // Correctly formatted total with currency symbol
    },
  ];


  console.log("cartitem..:", cartItems);
  console.log('address available..:', isAddressAvailable);




  const content = cartItems?.map(product => ({
    id:product.id,
    name: product.name,
    currency:"INR",
    price: product.salePrice,
    quantity:product.quantity,

  }))



  


 const totalQuantity = cartItems?.reduce((sum, product) => sum + product?.quantity, 0)
 const contentIds = cartItems?.map(product => product.id.toString());




  
  const mounted = useIsMounted();

  return (
    <>
      <div className="px-4 pt-4 border rounded-md border-border-base text-brand-light xl:py-6 xl:px-7 bg-white rounded">
        <div className="flex pb-2 text-sm font-semibold rounded-md text-heading">
          <span className="font-medium text-15px text-brand-dark">
            {t('text-product')}
          </span>
          <span className="font-medium ltr:ml-auto rtl:mr-auto shrink-0 text-15px text-brand-dark">
            {t('text-sub-total')}
          </span>
        </div>
        {isLoading ? (
          <div className="w-full">
            <SearchResultLoader uniqueKey={`product-key`} />
          </div>
        ) : cartItems ? (
          cartItems.map((item) => <CheckoutItem item={item} key={item.id} />)
        ) : (
          <p className="py-4 text-brand-danger text-opacity-70">
            {t('text-empty-cart')}
          </p>
        )}
        {mounted &&
          checkoutFooter.map((item) => (
            <CheckoutCardFooterItem item={item} key={item.id} />
          ))}

          
<div className="w-full">
  {(!cartItems || !actionState) && (
    <div className="text-red-500 text-sm mb-4 mt-6">
      {t('please-select-address')} {/* Message for the user */}
    </div>
  )}
  <Button
    variant="formButton"
    className={cn(
      'w-full mt-8 mb-5 rounded font-semibold px-4 py-3 transition-all',
      !cartItems || !actionState
        ? 'opacity-40 cursor-not-allowed'
        : '!bg-brand !text-brand-light'
    )}
    onClick={toPaymentPage}
    disabled={!actionState} // Disable button if actionState is not available
  >
    {t('button-order-now')}
  </Button>
</div>


      </div>
      <Text className="mt-8">
        {t('text-by-placing-your-order')}{' '}
        <Link href={`/${lang}${ROUTES.TERMS}`} legacyBehavior>
          <a className="font-medium underline text-brand">
            {t('text-terms-of-service')}{' '}
          </a>
        </Link>
        {t('text-and')}{' '}
        <Link href={`/${lang}${ROUTES.PRIVACY}`} legacyBehavior>
          <a className="font-medium underline text-brand">
            {t('text-privacy')}
          </a>
        </Link>
        . {t('text-credit-debit')}
      </Text>
    </>
  );
};

export default CheckoutCard;

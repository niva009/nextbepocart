'use client';

import { useState } from 'react';
import Button from '@components/ui/button';
import Counter from '@components/ui/counter';
import { useParams } from 'next/navigation';
import { ROUTES } from '@utils/routes';
import useWindowSize from '@utils/use-window-size';
import { useProductQuery } from '@framework/product/get-product';
import { getVariations } from '@framework/utils/get-variations';
import { useCart } from '@contexts/cart/cart.context';
import { generateCartItem } from '@utils/generate-cart-item';
import isEmpty from 'lodash/isEmpty';
import { toast } from 'react-toastify';
import ThumbnailCarousel from '@components/ui/carousel/thumbnail-carousel';
import Image from '@components/ui/image';
import CartIcon from '@components/icons/cart-icon';
import { IoIosHeart, IoIosHeartEmpty } from 'react-icons/io';
import TagLabel from '@components/ui/tag-label';
import LabelIcon from '@components/icons/label-icon';
import { IoArrowRedoOutline } from 'react-icons/io5';
import SocialShareBox from '@components/ui/social-share-box';
import ProductDetailsTab from '@components/product/product-details/product-tab';
import isEqual from 'lodash/isEqual';
import { useTranslation } from 'src/app/i18n/client';

const ProductSingleDetails: React.FC<{ lang: string }> = ({ lang }) => {
  const { t } = useTranslation(lang, 'common');
  const pathname = useParams();
  const { slug } = pathname;
  const { width } = useWindowSize();
  const { data, isLoading } = useProductQuery(slug as string);
  const { addItemToCart, isInCart, getItemFromCart, isInStock } = useCart();
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [attributes, setAttributes] = useState<{ [key: string]: string }>({});
  const [favorite, setFavorite] = useState<boolean>(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState<string>(""); // Track selected color
  const [sizes, setSizes] = useState<string[]>([]); // Track sizes based on color selection
  const [stock, setStock] = useState<number>(0); // Track stock for selected size
  const [addToCartLoader, setAddToCartLoader] = useState<boolean>(false);
  const [addToWishlistLoader, setAddToWishlistLoader] = useState<boolean>(false);
  const [shareButtonStatus, setShareButtonStatus] = useState<boolean>(false);
  const productUrl = `${process.env.NEXT_PUBLIC_WEBSITE_URL}${ROUTES.PRODUCT}/${pathname.slug}`;

  const handleChange = () => {
    setShareButtonStatus(!shareButtonStatus);
  };

  if (isLoading) return <p className={"pt-8 pb-8"}>Loading...</p>;

  const variations = getVariations(data?.variations);

  const isSelected = !isEmpty(variations)
    ? !isEmpty(attributes) &&
      Object.keys(variations).every((variation) =>
        attributes.hasOwnProperty(variation)
      )
    : true;

  let selectedVariation: any = {};
  if (isSelected) {
    const dataVaiOption: any = data?.variation_options;
    selectedVariation = dataVaiOption?.find((o: any) =>
      isEqual(
        o.options.map((v: any) => v.value).sort(),
        Object.values(attributes).sort()
      )
    );
  }

  const item = generateCartItem(data!, selectedVariation);
  const outOfStock = isInCart(item.id) && !isInStock(item.id);

  // Function to handle "Add to Cart"
  function addToCart() {
    if (!isSelected || stock === 0) return;
    setAddToCartLoader(true);
    setTimeout(() => {
      setAddToCartLoader(false);
    }, 1500);

    const item = generateCartItem(data!, selectedVariation);
    addItemToCart(item, quantity);
    toast('Added to the bag', {
      progressClassName: 'fancy-progress-bar',
      position: width! > 768 ? 'bottom-right' : 'top-right',
      autoClose: 1500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  }

  function addToWishlist() {
    setAddToWishlistLoader(true);
    setFavorite(!favorite);
    const toastStatus: string =
      favorite === true ? t('text-remove-favorite') : t('text-added-favorite');
    setTimeout(() => {
      setAddToWishlistLoader(false);
    }, 1500);
    toast(toastStatus, {
      progressClassName: 'fancy-progress-bar',
      position: width! > 768 ? 'bottom-right' : 'top-right',
      autoClose: 1500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  }

  // Handle color change and update sizes and stock based on selected color
  const handleColorChange = (color: string) => {
    setSelectedColor(color);

    // Find the image with the selected color and update sizes and stock
    const selectedImage = data?.images.find((image) => image.color === color);
    if (selectedImage && selectedImage.stock_info) {
      const availableSizes = selectedImage.stock_info
        .filter((variant) => variant.stock > 0)
        .map((variant) => variant.size);
      setSizes(availableSizes);

      // Update the stock based on the selected size for the color
      const initialStock = selectedImage.stock_info.find(
        (variant) => variant.size === availableSizes[0]
      )?.stock;
      setStock(initialStock || 0); // Set stock of the first size
      setAttributes({ ...attributes, size: availableSizes[0] });
    }
  };

  // Handle size change and update the stock accordingly
  const handleSizeChange = (size: string) => {
    setAttributes({ ...attributes, size });

    // Update the stock based on the selected size
    const selectedImage = data?.images.find((image) => image.color === selectedColor);
    const selectedVariant = selectedImage?.stock_info.find(
      (variant) => variant.size === size
    );
    setStock(selectedVariant?.stock || 0);
  };

  return (
    <div className="pt-6 pb-2 md:pt-7">
      <div className="grid-cols-10 lg:grid gap-7 2xl:gap-7 mb-8 lg:mb-12 bg-white p-5 rounded">
        <div className="col-span-5 mb-6 overflow-hidden  md:mb-8 lg:mb-0 xl:flex justify-center">
          {!!data?.images?.length ? (
            <ThumbnailCarousel
              gallery={data?.images}
              galleryClassName="xl:w-[100px]"
              lang={lang}
            />
          ) : (
            <div className="flex items-center justify-center w-auto">
              <Image
                src={data?.product?.image ?? '/product-placeholder.svg'}
                alt={data?.product.name!}
                width="full"
                height={680}
                // style={{ width: 'auto' }}
              />
            </div>
          )}
        </div>

        <div className="flex flex-col col-span-5 shrink-0 ">
          <div className="pb-4 lg:pb-8">
            <div className="md:mb-2.5 block -mt-1.5">
              <h2 className="text-lg font-medium transition-colors duration-300 text-brand-dark md:text-xl xl:text-2xl">
                {data?.product.name};
              </h2>
            </div>
            <div className="flex items-center mt-5">
              <div className="font-medium text-base md:text-xl xl:text-[30px]"></div>
              {data && data.product && (
                <>
                  <del className="text-sm text-opacity-50 md:text-15px ltr:pl-3 rtl:pr-3 text-brand-dark ">
                    ₹{data?.product.price}
                  </del>
                  <span className="inline-block rounded font-bold text-45px md:text-xl text-brand-tree uppercase px-2 py-1 ltr:ml-2.5 rtl:mr-2.5">
                    ₹{data?.product?.salePrice}
                  </span>
                </>
              )}
            </div>
          </div>
          <p>{data?.product?.short_description}</p>

          {/* Colors for Single and Variant Products */}
          <div>
            {data?.product?.type === 'single' ? (
              <div>
                <h4 className="text-base font-bold text-qblack mb-2 mt-4">Color</h4>
                <div className="flex flex-wrap gap-2">
                  {data?.images.map((image) => (
                    <button
                      key={image.id}
                      className={`px-4 py-2 rounded border ${selectedColor === image.color
                          ? 'border-qblack text-qblack font-semibold'
                          : 'border-qgray text-qblack'
                        }`}
                      onClick={() => handleColorChange(image.color)}
                    >
                      {image.color}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div>
                <h4 className="text-base font-bold text-qblack mb-2 mt-5">Colors</h4>
                <div className="flex flex-wrap gap-2">
                  {data?.images.map((image) => (
                    <button
                      key={image.id}
                      className={`px-4 py-2 rounded border ${selectedColor === image.color
                          ? 'border-qblack text-qblack font-semibold'
                          : 'border-qgray text-qblack'
                        }`}
                      onClick={() => handleColorChange(image.color)}
                    >
                      {image.color}
                    </button>
                  ))}
                </div>

                {/* Sizes based on Selected Color */}
                {sizes.length > 0 && (
                  <div>
                    <h4 className="text-base font-bold text-qblack mb-2">Sizes</h4>
                    <div className="flex flex-wrap gap-2">
                      {sizes.map((size) => (
                        <button
                          key={size}
                          className={`px-4 py-2 rounded border ${attributes.size === size
                              ? 'border-qblack text-qblack font-semibold'
                              : 'border-qgray text-qblack'
                            }`}
                          onClick={() => handleSizeChange(size)}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="pt-1.5 lg:pt-3 xl:pt-4 space-y-2.5 md:space-y-3.5">
            <Counter
              variant="single"
              value={selectedQuantity}
              onIncrement={() => setSelectedQuantity((prev) => prev + 1)}
              onDecrement={() =>
                setSelectedQuantity((prev) => (prev !== 1 ? prev - 1 : 1))
              }
              disabled={
                stock === 0 || selectedQuantity >= stock
              }
              lang={lang}
            />
            <Button
              onClick={addToCart}
              className="w-full px-1.5"
              disabled={stock === 0} // Disable button if stock is zero
              loading={addToCartLoader}
            >
              <CartIcon color="#ffffff" className="ltr:mr-3 rtl:ml-3" />
              {t('text-add-to-cart')}
            </Button>

            {/* Out of stock message */}
            {stock === 0 && (
              <p style={{ color: "red", fontWeight: "bold", fontSize: "18px", padding: "10px 0px" }}>
                Out of Stock
              </p>
            )}
            {stock > 0 && stock < 10 && (
              <p style={{ color: "green", fontWeight: "500", fontSize: "18px", padding: "10px 0px" }}>
                {`${stock} items left`}
              </p>
            )}

            <div className="grid grid-cols-2 gap-2.5">
              <Button
                variant="border"
                onClick={addToWishlist}
                loading={addToWishlistLoader}
                className={`group hover:text-brand ${favorite === true && 'text-brand'
                  }`}
              >
                {favorite === true ? (
                  <IoIosHeart className="text-2xl md:text-[26px] ltr:mr-2 rtl:ml-2 transition-all" />
                ) : (
                  <IoIosHeartEmpty className="text-2xl md:text-[26px] ltr:mr-2 rtl:ml-2 transition-all group-hover:text-brand" />
                )}
                {t('text-wishlist')}
              </Button>
              <div className="relative group">
                <Button
                  variant="border"
                  className={`w-full hover:text-brand ${shareButtonStatus === true && 'text-brand'
                    }`}
                  onClick={handleChange}
                >
                  <IoArrowRedoOutline className="text-2xl md:text-[26px] ltr:mr-2 rtl:ml-2 transition-all group-hover:text-brand" />
                  {t('text-share')}
                </Button>
                <SocialShareBox
                  className={`absolute z-10 ltr:right-0 rtl:left-0 w-[300px] md:min-w-[400px] transition-all duration-300 ${shareButtonStatus === true
                      ? 'visible opacity-100 top-full'
                      : 'opacity-0 invisible top-[130%]'
                    }`}
                  shareUrl={productUrl}
                  lang={lang}
                />
              </div>
            </div>
          </div>
          {data?.tag && (
            <ul className="pt-5 xl:pt-6">
              <li className="relative inline-flex items-center justify-center text-sm md:text-15px text-brand-dark text-opacity-80 ltr:mr-2 rtl:ml-2 top-1">
                <LabelIcon className="ltr:mr-2 rtl:ml-2" /> {t('text-tags')}:
              </li>
              {data?.tag?.map((item: any) => (
                <li className="inline-block p-[3px]" key={`tag-${item.id}`}>
                  <TagLabel data={item} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <ProductDetailsTab product={data?.product} lang={lang} />
    </div>
  );
};

export default ProductSingleDetails;

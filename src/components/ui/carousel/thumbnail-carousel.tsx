import {
  Swiper,
  SwiperSlide,
  SwiperOptions,
  Navigation,
  Thumbs,
} from '@components/ui/carousel/slider';
import Image from '@components/ui/image';
import { useRef, useState, useEffect } from 'react';
import cn from 'classnames';
import { productGalleryPlaceholder } from '@assets/placeholders';
import { getDirection } from '@utils/get-direction';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import ImageLightBox from '@components/ui/image-lightbox';

interface Props {
  gallery: any[]; // This will be your 'images' array
  thumbnailClassName?: string;
  galleryClassName?: string;
  lang: string;
}

// product gallery breakpoints
const galleryCarouselBreakpoints = {
  1280: {
    slidesPerView: 4,
    direction: 'vertical',
  },
  767: {
    slidesPerView: 4,
    direction: 'horizontal',
  },
  0: {
    slidesPerView: 3,
    direction: 'horizontal',
  },
};

const swiperParams: SwiperOptions = {
  slidesPerView: 1,
  spaceBetween: 0,
};

const ThumbnailCarousel: React.FC<Props> = ({
  gallery, // this is the images array
  thumbnailClassName = 'xl:w-[600px]',
  galleryClassName = 'xl:w-[100px] 2xl:w-[120px]',
  lang,
}) => {
  const [thumbsSwiper, setThumbsSwiper] = useState<any>(null); // Swiper instance for thumbnails
  const [mainSwiper, setMainSwiper] = useState<any>(null); // Swiper instance for main gallery
  const prevRef = useRef<HTMLDivElement>(null);
  const nextRef = useRef<HTMLDivElement>(null);
  const dir = getDirection(lang);

  // Get all the image URLs from the gallery
  const imageUrls = gallery.flatMap((item) => [
    item.image1,
    item.image2,
    item.image3,
    item.image4,
    item.image5,
  ]);


  console.log("image url..:", imageUrls)

  // Ensure Swiper is properly instantiated by using useEffect
  useEffect(() => {
    if (thumbsSwiper && !thumbsSwiper.destroyed) {

      mainSwiper?.update();

    }
  }, [thumbsSwiper, mainSwiper]);

  return (
    <div className="w-full xl:flex xl:flex-row-reverse relative">
      <ImageLightBox gallery={imageUrls} />
      <div
        className={cn(
          'w-full xl:ltr:ml-7 xl:rtl:mr-7 overflow-hidden rounded-md relative flex items-center justify-between',
          thumbnailClassName
        )}
      >
        <Swiper
          id="productGallery"
          thumbs={{ swiper: thumbsSwiper }} // Sync with thumbsSwiper
          modules={[Navigation, Thumbs]}
          navigation={{
            prevEl: prevRef.current!, // Assert non-null
            nextEl: nextRef.current!, // Assert non-null
          }}
          onSwiper={setMainSwiper} // Set the instance of the main swiper
          {...swiperParams}
        >
          {imageUrls?.map((url: string, index: number) => (
            <SwiperSlide
              key={`product-gallery-${index}`}
              className="flex items-center justify-center"
            >
            <img
  src={`https://bepocart.in/${url}`}
  alt={`Product gallery ${index}`}
  width={500}
  height={500}
  className="mx-auto rounded-lg"
  priority
/>

            </SwiperSlide>
          ))}
        </Swiper>
        <div className="flex items-center justify-between w-full absolute top-2/4 z-10 px-2.5">
          <div
            ref={prevRef}
            className="flex items-center justify-center text-base transition duration-300 transform -translate-y-1/2 rounded-full cursor-pointer w-7 h-7 md:w-8 md:h-8 lg:w-9 lg:h-9 xl:w-10 xl:h-10 lg:text-lg xl:text-xl bg-brand-light hover:bg-brand hover:text-brand-light focus:outline-none shadow-navigation"
          >
            {dir === 'rtl' ? <IoIosArrowForward /> : <IoIosArrowBack />}
          </div>
          <div
            ref={nextRef}
            className="flex items-center justify-center text-base transition duration-300 transform -translate-y-1/2 rounded-full cursor-pointer w-7 h-7 md:w-8 md:h-8 lg:w-9 lg:h-9 xl:w-10 xl:h-10 lg:text-lg xl:text-xl bg-brand-light hover:bg-brand hover:text-brand-light focus:outline-none shadow-navigation"
          >
            {dir === 'rtl' ? <IoIosArrowBack /> : <IoIosArrowForward />}
          </div>
        </div>
      </div>
      {/* End of product main slider */}

      <div className={`py-5 shrink-0 ${galleryClassName}`}>
        <Swiper
          id="productGalleryThumbs"
          onSwiper={setThumbsSwiper} // Set the thumbsSwiper
          spaceBetween={12}
          watchSlidesProgress={true}
          freeMode={true}
          effect={'slide'}
          breakpoints={galleryCarouselBreakpoints}
        >
          {imageUrls?.map((url: string, index: number) => (
            <SwiperSlide
              key={`product-thumb-gallery-${index}`}
              className="flex items-center justify-center cursor-pointer rounded overflow-hidden border border-border-base transition hover:opacity-75"
            >
              <img
                src={`https://bepocart.in/${url}`}
                alt={`Product thumb gallery ${index}`}
                width={170}
                height={170}
                style={{ width: 'auto' }}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default ThumbnailCarousel;

'use client';

import cn from 'classnames';
import Link from '@components/ui/link';
import useWindowSize from '@utils/use-window-size';
import {useTranslation} from 'src/app/i18n/client';

interface BannerProps {
  lang: string;
  banner?: any;
  className?: string;
  heroContentCard?: boolean;
  variant: string;
}

function getImage(deviceWidth: number, imgObj: any) {
    return deviceWidth < 480 ? imgObj.mobile : imgObj.desktop;
}

export default function HeroBannerCard({
                                           lang,
                                           banner,
                                           className = 'py-20 xy:pt-24',
                                           variant ,
                                           heroContentCard = true,
                                       }: BannerProps) {
    const {t} = useTranslation(lang, 'common');
    const {width} = useWindowSize();
    const { name,image } = banner;

    console.log("banner99999", image);


    const selectedImage = getImage(width!, image);
    return heroContentCard ? (
        <div
        className={cn(
          'w-full bg-no-repeat bg-cover bg-center flex items-center rounded',
          {
            'min-h-[600px]': variant === 'slider', // Increase height for mobile view
            'md:min-h-[400px]': variant === 'slider', // Height for larger screens (md and above)
            'bg-fill-thumbnail': variant !== 'antique',
          },
          className
        )}
        style={{
            backgroundImage: `url('https://bepocart.in/${image}')`, 
          backgroundPosition: 'center center'
        }}
      >
            <div
                className={cn(
                    'sm:absolute inset-0 m-[15px] md:mt-[30px] xl:mt-[50px] w-full',
                    {
                        'mx-auto max-w-[480px] md:max-w-[580px] xl:max-w-[700px]': variant === 'slider',
                        'mx-auto max-w-[480px] md:max-w-[580px] xl:max-w-[600px]': variant === 'antique',
                        'lg:px-20 max-w-[480px] md:max-w-[580px] xl:max-w-[700px]': variant === 'slider-4',
                    }
                )}
            >
                <div className={cn(
                         'text-left ',
                         {
                             'md:w-8/12 lg:w-6/12': variant === 'slider',
                             'text-left': variant === 'slider-4',
                         }
                     )}
                >
      
       
                </div>
            </div>
        </div>
    ) : (
        <Link href={'/en'}>
            <div
                className={cn(
                    'w-full bg-skin-thumbnail bg-no-repeat bg-cover flex items-center',
                    {
                        'min-h-[160px]  ': variant === 'slider',
                    },
                    className
                )}
                style={{
                    backgroundImage: `url('${selectedImage.url}')`,
                    backgroundPosition:
                        variant === 'antique' ? 'left bottom -10px' : 'center center',
                }}
            ></div>
        </Link>
    );
}

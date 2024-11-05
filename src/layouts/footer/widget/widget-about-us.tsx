'use client';

import Link from 'next/link';
import Image from '@components/ui/image';
import {useTranslation} from 'src/app/i18n/client';
import {useRouter} from "next/navigation";
import {getDirection} from "@utils/get-direction";
import Heading from "@components/ui/heading";

interface AboutProps {
    lang: string;
    className?: string;
    social?: {
        id: string | number;
        path?: string;
        name: string;
        image: string;
        width: number;
        height: number;
    }[];
}

const WidgetAbout: React.FC<AboutProps> = ({lang, social, className}) => {
    const {t} = useTranslation(lang, 'footer');
    const {locale} = useRouter();
    const dir = getDirection(locale);
    
    return (
        <div className={`pb-10 sm:pb-0 ${className}`}>
            <div className="text-sm xl:max-w-[350px] mx-auto sm:ms-0 mb-2">
    
                <Heading variant="base" className="uppercase mb-4 lg:mb-5">
                    {t(`link-contact-us`)}
                </Heading>
              <p className='mb-10'>
              Bepokart, an ecommerce website for a wide range of cycles, accessories, and apparel in India,
                </p>
            </div>
        </div>
    );
};

export default WidgetAbout;

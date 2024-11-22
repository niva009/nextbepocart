import WidgetLink from './widget-link';
import WidgetAbout from './widget-about-us';
import Container from '@components/ui/container';
import { footer } from '../data';
import FeatureCarousel from "@components/common/featured-carousel";
import playstore from 'public/assets/images/playstore.png';
import applestore from 'public/assets/images/applestore.png';
import Image from 'next/image';
import FooterLinks from './footerlink'

interface WidgetsProps {
    lang: string;
    variant?: string;
    showWidgetServices?: boolean;
    widgets: {
        id: number;
        widgetTitle: string;
        lists: any;
    }[];
}

const Widgets: React.FC<WidgetsProps> = ({
    lang,
    widgets,
    showWidgetServices,
    variant = 'default',
}) => {
    const { social } = footer;

    return (
        <Container>
            {showWidgetServices && (
                <FeatureCarousel
                    lang={lang}
                    variant={'default'}
                    className="featuredCarousel border-b border-black/5"
                />
            )}
            <div className="grid grid-cols-2 md:grid-cols-7 xl:grid-cols-12 gap-5 sm:gap-9 lg:gap-11 xl:gap-7 pb-[50px] pt-10 md:pt-16">
                <WidgetAbout
                    social={social}
                    className="col-span-full sm:col-span-1 md:col-span-4"
                    lang={lang}
                />
                
                {/* Uncomment if widgets are needed */}
                {/* {widgets?.slice(0, 4)?.map((widget) => (
                    <WidgetLink
                        key={`footer-widget--key${widget.id}`}
                        data={widget}
                        className="col-span-1 md:col-span-2"
                        lang={lang}
                    />
                ))} */}
                
                {/* App Store Links Section */}
                <div className='col-span-full sm:col-span-1 md:col-span-2 flex flex-col space-y-5 items-start md:items-center mt-6'>
                <FooterLinks/>
                </div>
            
               

                <div className="col-span-full sm:col-span-1 md:col-span-2 flex flex-col space-y-5 items-start md:items-center mt-6">
                    <p className="text-lg text-#93ff05 font-semibold mb-2">Bepocart Now Available in </p>
                    <div className="flex space-x-4">
                        <a href="https://play.google.com/store/apps/details?id=com.bepocart.bepocart" target="_blank" rel="noopener noreferrer">
                            <Image
                                src={playstore}
                                alt="Play Store"
                                width={200}
                                height={70}
                                className="hover:opacity-80 transition-opacity duration-200"
                            />
                        </a>
                        <a href="https://www.apple.com/app-store/" target="_blank" rel="noopener noreferrer">
                            <Image
                                src={applestore}
                                alt="App Store"
                                width={200}
                                height={70}
                                className="hover:opacity-80 transition-opacity duration-200"
                            />
                        </a>
                    </div>
                </div>
            </div>
        </Container>
    );
};

export default Widgets;

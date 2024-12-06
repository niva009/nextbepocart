import cn from 'classnames';
import Image from '@components/ui/image';
import Link from '@components/ui/link';
import {Product} from '@framework/types';
import {useModalAction} from '@components/common/modal/modal.context';
import useWindowSize from '@utils/use-window-size';
import {useCart} from '@contexts/cart/cart.context';
import {useTranslation} from 'src/app/i18n/client';
import {productPlaceholder} from '@assets/placeholders';
import {ROUTES} from "@utils/routes";
import {ProductWishlist} from './product-wishlist';



interface ProductProps {
    lang?: string;
    product: Product;
    className?: string;
}


    


const ProductList: React.FC<ProductProps> = ({product, className, lang}) => {
    const {name, image, price, salePrice, slug, description, id} = product ?? {};
    const {t} = useTranslation(lang, 'common');
    const {width} = useWindowSize();
    const iconSize = width! > 1024 ? '20' : '17';

    
   
    
    return (
        <article
            className={cn(
                ' product-list-view overflow-hidden relative  grid grid-cols-4  p-2 sm:p-4 gap-8 bg-white rounded',
                className
            )}
            title={name}
        >
            <div className="col-span-1 ">
                <Link
                    href={`/${lang}${ROUTES.PRODUCTS}/${slug}`}
                    className="block h-full flex align-center"
                >
    
                    <img
                        src={`https://bepocart.in/${image}`}
                        alt={name || 'Product Image'}
                        width={180}
                        height={180}
                    />
                </Link>
            </div>
            
            <div className="col-span-3">
                <Link
                    href={`/${lang}${ROUTES.PRODUCTS}/${slug}`}
                    className="text-skin-base text-base font-semibold leading-5 min-h-[30px] line-clamp-2 mb-1.5 hover:text-skin-primary"
                >
                    {name}
                </Link>
                
                <div className="space-s-2">
        
        <span className="inline-block font-semibold text-[18px] text-brand">
        ₹{salePrice}
        </span>
        {price && (
<del className="mx-1  text-black-400 text-opacity-70">
   ₹{price}
</del>
)}
    </div>
                <p className="text-sm text-skin-base line-clamp-3 leading-6 text-opacity-80">
                    {description}
                </p>
                <div className="inline-block product-cart-button mt-6">
                    <ProductWishlist  id ={id}/>
                
                </div>
            
            </div>
        </article>
    );
};

export default ProductList

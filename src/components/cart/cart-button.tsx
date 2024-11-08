import React from 'react';
import CartIcon from '@components/icons/cart-icon';
import { useUI } from '@contexts/ui.context';
import { useTranslation } from 'src/app/i18n/client';
import cn from 'classnames';
import { useCartQuery } from '@framework/product/get-cart-product';

type CartButtonProps = {
    lang: string;
    className?: string;
    iconClassName?: string;
    hideLabel?: boolean;
};

const CartButton: React.FC<CartButtonProps> = ({
    lang,
    className,
    iconClassName = '',
    hideLabel,
}) => {
    const { t } = useTranslation(lang, 'common');
    const { openDrawer, setDrawerView } = useUI();

    // Use the custom `useCartQuery` hook to fetch cart data
    const { data, isLoading, error } = useCartQuery({ limit: 35 });
    
    // Extract `cartCount` as the length of items in the cart, if data is available
    const cartCount = data?.data.length || 0;

    function handleCartOpen() {
        setDrawerView('CART_SIDEBAR');
        openDrawer();
    }

    return (
        <button
            className={cn(
                'flex items-center justify-center shrink-0 h-auto focus:outline-none transform',
                className
            )}
            onClick={handleCartOpen}
            aria-label="cart-button"
        >
            <div className="relative flex items-center">
                <div className="flex items-center relative cart-button">
                    <CartIcon className={cn(iconClassName)} />
                    <span className="cart-counter-badge h-[18px] min-w-[18px] rounded-full flex items-center justify-center bg-red-600 text-brand-light absolute -top-1 ltr:left-3 rtl:right-3 text-11px">
                        {isLoading ? '-' : cartCount} {/* Display loading or count */}
                    </span>
                </div>
                {!hideLabel && (
                    <span className="text-sm font-normal ms-2">
                        {t('text-cart')}
                    </span>
                )}
            </div>
        </button>
    );
};

export default CartButton;

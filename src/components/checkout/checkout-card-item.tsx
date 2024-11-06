import { Item } from '@contexts/cart/cart.utils';
import Image from '@components/ui/image';
import { generateCartItemName } from '@utils/generate-cart-item-name';
import usePrice from '@framework/product/use-price';

export const CheckoutItem: React.FC<{ item: Item }> = ({ item }) => {
  const { price } = usePrice({
    amount: item.itemTotal,
    currencyCode: 'INR',
  });

  return (
    <div className="flex items-center py-4 border-b border-border-base">
      <div className="flex w-16 h-16 border rounded-md border-border-base shrink-0">
        <Image
          src={item?.image ?? '/assets/placeholder/order-product.svg'}
          alt="item image"
          className="rounded-md ltr:mr-5 rtl:ml-5"
          width={64}
          height={64}
          style={{ width: 'auto' }}
        />
      </div>
      <div className="flex flex-col ltr:pl-3 rtl:pr-3">
        <h6 className="font-normal text-15px text-brand-dark">
          {generateCartItemName(item.name, item.attributes)}
        </h6>
        {/* Display Quantity, Color, and Size in a user-friendly way */}
        <div className="text-sm text-gray-500 mt-1">
          <p>
            <span className="font-medium">Quantity:</span> {item.quantity}
          </p>
          {/* {item.color && (
            <p>
              <span className="font-medium">Color:</span> {item.color}
            </p>
          )} */}
          {/* {item.size && (
            <p>
              <span className="font-medium">Size:</span> {item.size}
            </p>
          )} */}
        </div>
      </div>
      <div className="flex font-normal ltr:ml-auto rtl:mr-auto text-15px text-brand-dark ltr:pl-2 rtl:pr-2 shrink-0">
        ₹ {item?.salePrice}
      </div>
    </div>
  );
};

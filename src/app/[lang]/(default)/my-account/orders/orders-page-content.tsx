'use client';

import dynamic from 'next/dynamic';
import { useOrdersQuery } from '@framework/order/get-all-orders';
import OrderTable from '@components/order/order-table';

const OrdersPageContent = ({ lang }: { lang: string }) => {
  const { data, isLoading } = useOrdersQuery({});

  return (
    <>
      {!isLoading ? (
        <OrderTable orders={data} lang={lang} />
      ) : (
        <div>Loading...</div>
      )}
    </>
  );
};

// Export OrdersPageContent using dynamic import with SSR disabled
export default dynamic(() => Promise.resolve(OrdersPageContent), { ssr: false });

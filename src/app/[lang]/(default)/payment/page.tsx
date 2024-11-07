import CheckoutCard from '@components/checkout/checkout-card';
import Container from '@components/ui/container';
import CouponDetails from '@components/checkout/coupon-card';
import Divider from '@components/ui/divider';
import { Metadata } from 'next';


export const metadata: Metadata = {
  title: 'Checkout',
};

export default async function PaymentPage({
  params: { lang },
}: {
  params: {
    lang: string;
  };
}) {
  return (
    <>
      
      <Container className="py-10 2xl:py-12 checkout">
        <div className="flex flex-col mx-auto">
          <div className="flex flex-col lg:grid lg:grid-cols-12 grid-cols-1 flex-wrap gap-8">
            <div className="w-full col-start-1 col-end-10">
              < CouponDetails lang={lang} />
            </div>
            {/* <div className="w-full mt-7 lg:mt-0 col-start-10 col-end-13">
              <CheckoutCard lang={lang} />
            </div> */}
          </div>
        </div>
      </Container>
      <Divider />
    </>
  );
}

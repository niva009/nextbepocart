import Container from '@components/ui/container';
import ProductSingleDetails from '@components/product/product';
import ElectronicProductFeed from '@components/product/feeds/electronic-product-feed';
import RelatedProductFeedOld from '@components/product/feeds/related-product-feed-old';
import Breadcrumb from '@components/ui/breadcrumb';

// Fetch data server-side
export default async function Page({
  params: { lang, slug },
}) {
  // Fetch product data
  const resProduct = await fetch(`https://bepocart.in/product/${slug}/`, { cache: "no-store" });
  const data = await resProduct.json();

  if (!data?.product) {
    return <div>Product not found</div>;
  }

  // Fetch reviews using data.product.id instead of slug
  const resReviews = await fetch(`https://bepocart.in/review/${data?.product?.id}/`);
  const reviewsData = await resReviews.json();



  // Log the fetched data for debugging
  console.log("Product data:", data?.product);
  console.log("Reviews data:", reviewsData);

  return (
    <div className="pt-6 lg:pt-7 pb-10">
      <Container>
        <Breadcrumb lang={lang} />
        
        {/* Pass both product data and reviews data to ProductSingleDetails */}
        <ProductSingleDetails lang={lang} data={data} reviews={reviewsData} />
        
        <RelatedProductFeedOld
          uniqueKey="related-products"
          lang={lang}
          className="mb-8 lg:mb-12"
          slug={slug}
        />
        
        <ElectronicProductFeed lang={lang} className="mb-8 lg:mb-12" />
      </Container>
    </div>
  );
}

import Container from '@components/ui/container';
import ProductSingleDetails from '@components/product/product';
import ElectronicProductFeed from '@components/product/feeds/electronic-product-feed';
import RelatedProductFeedOld from '@components/product/feeds/related-product-feed-old';
import Breadcrumb from '@components/ui/breadcrumb';

// Fetch data server-side
export default async function Page({
  params: { lang, slug },
}) {
  const res = await fetch(`https://bepocart.in/product/${slug}/`, { cache: "no-store" });
  const data = await res.json();
  console.log("data single product page...:", data);

  if (!data) {
    return <div>Product not found</div>;
  }

  return (
    <div className="pt-6 lg:pt-7 pb-10">
      <Container>
        <Breadcrumb lang={lang} />
        {/* Pass fetched data to Client Component */}
        <ProductSingleDetails lang={lang} data={data} />
        <RelatedProductFeedOld
          uniqueKey="related-products"
          lang={lang}
          className="mb-8 lg:mb-12"
        />
        <ElectronicProductFeed lang={lang} className="mb-8 lg:mb-12" />
      </Container>
    </div>
  );
}
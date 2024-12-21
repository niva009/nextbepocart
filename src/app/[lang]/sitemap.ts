import type { MetadataRoute } from 'next';
import axios from 'axios';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages = [
    {
      url: 'https://bepocart.com/en/about',
      lastModified: new Date().toISOString(),
      changeFrequency: 'yearly',
      priority: 1,
    },
    {
      url: 'https://bepocart.com/en/contact-us',
      lastModified: new Date().toISOString(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: 'https://bepocart.com/en/returnpolicy',
      lastModified: new Date().toISOString(),
      changeFrequency: 'weekly',
      priority: 0.5,
    },
    {
      url: 'https://bepocart.com/en/privacy-policy',
      lastModified: new Date().toISOString(),
      changeFrequency: 'weekly',
      priority: 0.5,
    },
    {
      url: 'https://bepocart.com/en/shipping',
      lastModified: new Date().toISOString(),
      changeFrequency: 'weekly',
      priority: 0.5,
    },
  ];

  let productPages: MetadataRoute.Sitemap = [];
  let categoryPages: MetadataRoute.Sitemap = [];

  try {
    const productResponse = await axios.get('https://bepocart.in/products/');
    const products = productResponse.data.products || [];
    productPages = products.map((product: any) => ({
      url: `https://bepocart.com/en/products/${product.slug}`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'weekly',
      priority: 0.8,
      images: product.image ? [`https://bepocart.in${product.image}`] : [],
    }));
  } catch (error) {
    console.error('Error fetching product data:', error.message);
  }

  try {
    const categoryResponse = await axios.get('https://bepocart.in/subcategorys/');
    const categories = Array.isArray(categoryResponse.data.data) ? categoryResponse.data.data : [];
    categoryPages = categories.map((category: any) => ({
      url: `https://bepocart.com/en/${category.categoryName}/${category.slug}`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'weekly',
      priority: 0.8,
      images: category.image ? [`https://bepocart.in${category.image}`] : [],
    }));
  } catch (error) {
    console.error('Error fetching category data:', error.message);
  }

  // Combine all pages
  const sitemap = [...staticPages, ...productPages, ...categoryPages];

  console.log('Generated Sitemap:', sitemap); // Debugging purpose

  return sitemap;
}

import type { MetadataRoute } from 'next';
import axios from 'axios';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Base URLs for static pages
  const staticPages = [
    {
      url: 'https://bepocart.com/en/about',
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 1,
    },
    {
      url: 'https://bepocart.com/en/contact-us',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: 'https://bepocart.com/en/returnpolicy',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.5,
    },
    {
      url: 'https://bepocart.com/en/privacy-policy',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.5,
    },
    {
      url: 'https://bepocart.com/en/shipping',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.5,
    },
  ];

  // Dynamic product pages
  let productPages: MetadataRoute.Sitemap = [];
  try {
    const { data: products } = await axios.get('https://bepocart.in/products/');
    productPages = products.map((product: any) => ({
      url: `https://bepocart.com/en/products/${product.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
      images: product.image ? [`https://bepocart.com${product.image}`] : undefined,
    }));
  } catch (error) {
    console.error('Error fetching product data:', error);
  }

  // Dynamic category pages
  let categoryPages: MetadataRoute.Sitemap = [];
  try {
    const { data: categories } = await axios.get('https://bepocart.in/subcategorys/');
    categoryPages = categories.map((category: any) => ({
      url: `https://bepocart.com/en/${category.categoryName}/${category.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
      images: category.image ? [`https://bepocart.com${category.image}`] : undefined,
    }));
  } catch (error) {
    console.error('Error fetching category data:', error);
  }

  // Combine static, product, and category pages
  return [...staticPages, ...productPages, ...categoryPages];
}

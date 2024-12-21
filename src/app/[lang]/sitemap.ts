import type { MetadataRoute } from 'next';
import axios from 'axios';
import { NextResponse } from 'next/server';

export async function GET() {
  // Static pages
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

  let productPages = [];
  let categoryPages = [];

  try {
    // Fetch products
    const { data } = await axios.get('https://bepocart.in/products/');
    const products = data.products || [];
    productPages = products.map((product: any) => ({
      url: `https://bepocart.com/en/products/${product.slug}`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'weekly',
      priority: 0.8,
      images: product.image ? [`https://bepocart.in${product.image}`] : undefined,
    }));
  } catch (error) {
    console.error('Error fetching product data:', error);
  }

  try {
    // Fetch categories
    const { data } = await axios.get('https://bepocart.in/subcategorys/');
    const categories = Array.isArray(data.data) ? data.data : [];
    categoryPages = categories.map((category: any) => ({
      url: `https://bepocart.com/en/${category.categoryName}/${category.slug}`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'weekly',
      priority: 0.8,
      images: category.image ? [`https://bepocart.in${category.image}`] : undefined,
    }));
  } catch (error) {
    console.error('Error fetching category data:', error);
  }

  // Combine all pages
  const sitemap = [...staticPages, ...productPages, ...categoryPages];

  // Generate XML
  const sitemapXml = `
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
      ${sitemap
        .map((page) => `
        <url>
          <loc>${page.url}</loc>
          <lastmod>${page.lastModified}</lastmod>
          <changefreq>${page.changeFrequency}</changefreq>
          <priority>${page.priority}</priority>
          ${
            page.images
              ? page.images
                  .map(
                    (img: string) => `
              <image:image>
                <image:loc>${img}</image:loc>
              </image:image>
            `
                  )
                  .join('')
              : ''
          }
        </url>
      `)
        .join('')}
    </urlset>
  `.trim();

  // Return response with correct headers
  return new NextResponse(sitemapXml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 's-maxage=3600, stale-while-revalidate',
    },
  });
}

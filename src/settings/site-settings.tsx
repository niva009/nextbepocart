
import { USFlag } from '@components/icons/language/USFlag';
import siteLogo from 'public/assets/images/logo.png';
import siteLogoBlack from 'public/assets/images/logo.png';


export const siteSettings = {
  name: 'bepocart',
  description:
    'Bepocart, an ecommerce website for a wide range of cycles, accessories, and apparel in India,',
  author: {
    name: 'Bepocart',
    websiteUrl: '/',
    address: '',
  },
  logo: {
    url: siteLogo,
    urlReverse: siteLogoBlack,
    alt: 'bepocart',
    href: '/en',
    width: 195,
    height: 20,
  },
  defaultLanguage: 'en',
  currencyCode: 'INR',
  site_header: {
    topmenu: [
      {
        id: 1,
        path: '/my-account/wishlist/',
        label: 'menu-wishlists',
      },
      {
        id: 2,
        path: '/my-account/becoin',
        label: 'bepo-Coin',
      },
    ],
    menu: [

      {
        id: 2,
        path: '/',
        label: 'categories',
        type: 'mega',
        mega_categoryCol: 5,

        mega_bannerMode: 'right',
        // mega_bannerImg: '/assets/images/mega/banner-menu.jpg',
        mega_bannerUrl: '/search',
        mega_contentBottom:
          '<strong>30% Off</strong> the shipping of your first order with the code: <strong>UMINEX-SALE30</strong>',
        subMenu: [
          {
            id: 1,
            path: '/search?category=cycling-apparel&sort_by=lowest',
            label: 'APPARLES',
            subMenu: [
              {
                id: 1,
                path: '/search?category=sports-t-shirt',
                label: 't-shirt',
              },
              {
                id: 2,
                path: '/search?category=sports-jacket',
                label: 'jacket',
              },
              {
                id: 3,
                path: '/search?category=cycling-sunglasses',
                label: 'sunglasses'
              },  {
                id: 4,
                path: '/search?category=multifunctional-mask&sort_by=lowest',
                label: 'bandana',
              },  {
                id: 5,
                path: '/search?category=cycling-shorts&sort_by=lowest',
                label: 'shorts',
              },
            ],
          },
          {
            id: 2,
            path: '/search?category=skating&sort_by=lowest',
            label: 'SKATING',
            subMenu: [
              {
                id: 1,
                path: '/search?category=skating-helmet&sort_by=lowest',
                label: 'skating helmet',
              },
              {
                id: 2,
                path: '/search?category=inline-skates&sort_by=lowest',
                label: 'inline skates',
              },
              {
                id: 3,
                path: '/search?category=skating-bag&sort_by=lowest',
                label: 'skating bags',
              },
              {
                id: 4,
                path: '/search?category=Slide-Board&sort_by=lowest',
                label: 'slide board',
              },
            ],
          },
          {
            id: 3,
            path: '/search?category=bicycle-component',
            label: 'COMPONENTS',
            subMenu: [
              {
                id: 1,
                path: '/search?category=bicycle-bottom-bracket&sort_by=lowest',
                label: 'bottom bracket',
              },
              {
                id: 2,
                path: '/search?category=bicycle-cleats-pedals&sort_by=lowest',
                label: 'chains',
              },
              {
                id: 3,
                path: '/search?category=bicycle-cleats-pedals&sort_by=lowest',
                label: 'cleats & pedalas',
              },
              {
                id: 4,
                path: '/search?category=cycle-shifter-brakes&sort_by=lowest',
                label: 'gear shifter & shiftr brakes',
              },
              {
                id: 5,
                path: '/search?category=bicycle-stem&sort_by=lowest',
                label: 'headset & stems',
              },  {
                id: 6,
                path: '/search?category=bicycle-stem&sort_by=lowest',
                label: 'holders & mounts',
              },  {
                id: 7,
                path: '/search?category=bicycle-stem&sort_by=lowest',
                label: 'rack,hanger,stands',
              },  {
                id: 8,
                path: '/search?category=cycle-seat-cover&sort_by=lowest',
                label: 'seat cover',
              },  {
                id: 9,
                path: '/search?category=bicycle-wheels-parts&sort_by=lowest',
                label: 'wheels & parts',
              },  {
                id: 10,
                path: '/search?category=bicycle-derailleur-Pulley&sort_by=lowest',
                label: 'derailleur pulley',
              },  {
                id: 11,
                path: '/search?category=cycle-brake-pads&sort_by=lowest',
                label: 'break pad',
              },  {
                id: 12,
                path: '/search?category=bicycle-seat-post&sort_by=lowest',
                label: 'seat post & parts',
              },  {
                id: 13,
                path: '/search?category=bicycle-saddle',
                label: 'bicycle saddle',
              },  {
                id: 14,
                path: '/search?category=bicycle-cassette-freewheel',
                label: 'cassette & free wheel',
              }, {
                id: 15,
                path: '/search?category=bicycle-chain-ring',
                label: 'chain ring ',
              }, {
                id: 16,
                path: '/search?category=bicycle-handlebar-parts',
                label: 'handlebar & parts',
              }, {
                id: 17,
                path: '/search?category=bicycle-tyre',
                label: 'tyre',
              },
            ],
          },
          {
            id: 4,
            path: '/search?category=bikes',
            label: 'BIKES',
            subMenu: [
              {
                id: 1,
                path: '/search?category=road-bike',
                label: 'road-bikes',
              },
              {
                id: 2,
                path: '/search?categoary=track-bike',
                label: 'track-bikes',
              },
            ],
          },
          {
            id: 5,
            path: '/search?category=furniture&sort_by=lowest',
            label: 'FURNITURES',
            subMenu: [
              {
                id: 1,
                path: '/search?category=dust-bin',
                label: 'dust-bin',
              },
            ],
          },
          {
            id: 6,
            path: '/search?category=training',
            label: 'TRAINING',
            subMenu: [
              {
                id: 1,
                path: '/search?categort=Trainers-rollers',
                label: 'rollers',
              },
            ],
          },
          {
            id: 7,
            path: '/search?category=bicycle-maintenance',
            label: 'MAINTENANCE',
            subMenu: [
              {
                id: 1,
                path: '/search?category=bicycle-tool-kit',
                label: 'tool kit ',
              },
              {
                id: 2,
                path: '/search?category=cleaning-accessories',
                label: 'cleening & accessories',
              },
            ],
          }, {
            id: 7,
            path: '/search?category=bicycle-accessories',
            label: 'ACCESSORIES',
            subMenu: [
              {
                id: 1,
                path: '/search?category=bicycle-bell',
                label: 'bell',
              },
              {
                id: 2,
                path: '/search?category=bicycle-saddle-bag',
                label: 'bicycle-bags',
              },
              {
                id: 3,
                path: '/search?category=sports-visor-caps',
                label: 'caps visor',
              },
              {
                id: 4,
                path: '/search?category=cycling-pump',
                label: 'pump',
              },
              {
                id: 5,
                path: '/search?category=bicycle-water-bottle',
                label: 'bottle',
              }, {
                id: 5,
                path: '/search?category=protective-gear',
                label: 'protective gear',
              }, {
                id: 5,
                path: '/search?category=bicycle-light',
                label: 'bike lights',
              }, {
                id: 5,
                path: '/search?category=bicycle-bottle-cage',
                label: 'bottle cage',
              },
            ],
          },
        ],
      },
      {
        id: 4,
        path: '/shops/',
        label: 'About',
      },
      {
        id: 5,
        path: '/',
        label: 'policy',
        subMenu: [
          {
            id: 1,
            path: '/privacy',
            label: 'privacy-policy',
          },
          {
            id: 2,
            path: '/returnpolicy',
            label: 'return-policy',
          },
          {
            id: 3,
            path: '/shipping',
            label: 'shipping-policy',
          },
        ],
      },
      // {
      //   id: 6,
      //   path: '/blog/blog-category-grid',
      //   label: 'menu-blog',
      //   subMenu: [
      //     {
      //       id: 1,
      //       path: '/blog/blog-category-grid',
      //       label: 'menu-blog-grid',
      //     },
      //     {
      //       id: 2,
      //       path: '/blog/blog-category-list',
      //       label: 'menu-blog-list',
      //     },
      //     {
      //       id: 3,
      //       path: '/blog/blog-category-big',
      //       label: 'menu-blog-big',
      //     },
      //     {
      //       id: 4,
      //       path: '/blog',
      //       label: 'menu-blog-wide',
      //     },
      //     {
      //       id: 6,
      //       path: '/blog/blog-category-wide',
      //       label: 'menu-single-post',
      //       subMenu: [
      //         {
      //           id: 1,
      //           path: '/blog/blog-post-left',
      //           label: 'menu-left-sidebar',
      //         },
      //         {
      //           id: 2,
      //           path: '/blog/blog-post-right',
      //           label: 'menu-right-sidebar',
      //         },
      //         {
      //           id: 3,
      //           path: '/blog/the-litigants-on-the-screen-are-not-actors',
      //           label: 'menu-no-sidebar',
      //         },
      //       ],
      //     },
      //   ],
      // },
      {
        id: 7,
        path: '/contact-us',
        label: 'menu-contact-us',
      },
    ],
    languageMenu: [
      {
        id: 'en',
        name: 'English',
        value: 'en',
        icon: <USFlag />,
      },
    ],
    pagesMenu: [
      {
        id: 1,
        path: '/search',
        label: 'menu-best-deals',
      },
      {
        id: 2,
        path: '/about-us',
        label: 'menu-about-us',
      },
      {
        id: 3,
        path: '/contact-us',
        label: 'menu-contact-us',
      },
      {
        id: 4,
        path: '/faq',
        label: 'menu-faq',
      },
    ],
  },
};

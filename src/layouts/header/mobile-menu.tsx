import React, { useState, useEffect } from 'react';
import { IoIosArrowDown } from 'react-icons/io';
import { IoLogoFacebook, IoLogoTwitter, IoLogoYoutube, IoLogoInstagram } from 'react-icons/io';
import Logo from '@components/ui/logo'; // Import your Logo component
import { useUI } from '@contexts/ui.context';
import Link from '@components/ui/link';

const MobileMenu = () => {
  const [categories, setCategories] = useState([]);
  const [activeMenus, setActiveMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const { closeSidebar } = useUI(); // Assuming `closeSidebar` is available in your context

  const social = [
    {
      id: 0,
      link: 'https://www.facebook.com/redqinc/',
      icon: <IoLogoFacebook />,
      className: 'facebook',
      title: 'Facebook',
    },
    {
      id: 1,
      link: 'https://twitter.com/redqinc',
      icon: <IoLogoTwitter />,
      className: 'twitter',
      title: 'Twitter',
    },
    {
      id: 2,
      link: 'https://www.youtube.com/channel/UCjld1tyVHRNy_pe3ROLiLhw',
      icon: <IoLogoYoutube />,
      className: 'youtube',
      title: 'YouTube',
    },
    {
      id: 3,
      link: 'https://www.instagram.com/redqinc/',
      icon: <IoLogoInstagram />,
      className: 'instagram',
      title: 'Instagram',
    },
  ];

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('https://bepocart.in/category/');
        const data = await response.json();
        if (data.status === 'success') {
          setCategories(data.data);
        } else {
          console.error('Error fetching categories');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryClick = (categorySlug) => {
    setActiveMenus((prevActiveMenus) =>
      prevActiveMenus.includes(categorySlug)
        ? prevActiveMenus.filter((slug) => slug !== categorySlug) // Close the menu if it's already open
        : [...prevActiveMenus, categorySlug] // Open the menu if it's not open
    );
  };

  const handleSubcategoryClick = (categorySlug, subcategorySlug) => {
    closeSidebar(); // Close the sidebar when a subcategory is clicked
  };

  return (
    <div style={styles.container}>
      {/* Logo */}
      <div style={styles.header}>
        <Logo /> {/* Logo component */}
        {/* Close Sidebar Button */}
        <button style={styles.closeButton} onClick={closeSidebar}>
          Close Sidebar
        </button>
      </div>

      {/* Mobile Menu */}
      <div style={styles.mobileMenu}>
        {loading ? (
          <p>Loading categories...</p>
        ) : (
          <div style={styles.categoryList}>
            {categories.map((category) => (
              <div key={category.id} style={styles.categoryItem}>
                <div
                  style={styles.categoryHeader}
                  onClick={() => handleCategoryClick(category.slug || '')} // Ensure category.slug is defined
                >
                  <Link
                    href={`/en/search?category=${category.slug || ''}`}  // Ensure category.slug is defined
                    style={styles.categoryName}
                    onClick={() => closeSidebar()} // Close the sidebar when a category is clicked
                  >
                    {category.name}
                  </Link>
                  <IoIosArrowDown
                    className={`transition duration-200 transform ${
                      activeMenus.includes(category.slug) ? '-rotate-180' : 'rotate-0'
                    }`}
                    style={styles.arrowIcon}
                  />
                </div>
                {/* Show subcategories */}
                {activeMenus.includes(category.slug) && (
                  <div style={styles.subcategoryList}>
                    {category.subcategories?.map((subcategory) => (
                      <div key={subcategory.id} style={styles.subcategoryItem}>
                        <Link
                          href={`/en/search?category=${subcategory.slug || ''}`}  // Ensure category.slug is defined for subcategory
                          style={styles.subcategoryName}
                          onClick={() => handleSubcategoryClick(category.slug, subcategory.slug)} // Handle subcategory click
                        >
                          {subcategory.name}
                        </Link>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Social Media Links */}
      <div style={styles.socialLinks}>
        {social.map((link) => (
          <a
            key={link.id}
            href={link.link}
            target="_blank"
            rel="noopener noreferrer"
            title={link.title}
            style={styles.socialIcon}
          >
            {link.icon}
          </a>
        ))}
      </div>
    </div>
  );
};

// Inline styles for the page
const styles = {
  container: {
    fontFamily: 'Arial, sans-serif',
    padding: '20px',
    backgroundColor: '#f4f4f4',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#333',
    padding: '15px',
    borderRadius: '10px',
    marginBottom: '20px',
  },
  closeButton: {
    color: 'white',
    backgroundColor: '#444',
    border: 'none',
    padding: '10px',
    cursor: 'pointer',
    borderRadius: '5px',
    fontSize: '16px',
  },
  mobileMenu: {
    backgroundColor: '#fff',
    padding: '15px',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  categoryList: {
    marginBottom: '20px',
  },
  categoryItem: {
    marginBottom: '15px',
  },
  categoryHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px',
    backgroundColor: '#f9f9f9',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '18px',
    fontWeight: 'bold',
  },
  categoryName: {
    fontSize: '18px',
    fontWeight: 'bold',
    textDecoration: 'none', // Make sure links look like normal text
  },
  arrowIcon: {
    fontSize: '20px',
    transition: 'transform 0.3s ease',
  },
  subcategoryList: {
    marginTop: '10px',
    paddingLeft: '20px',
  },
  subcategoryItem: {
    padding: '8px 0',
    fontSize: '16px',
  },
  subcategoryName: {
    fontSize: '16px',
    fontWeight: 'normal',
    color: '#555',
    textDecoration: 'none', // Make sure links look like normal text
  },
  socialLinks: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '20px',
  },
  socialIcon: {
    fontSize: '30px',
    color: '#333',
    margin: '0 15px',
    transition: 'color 0.3s ease',
  },
};

export default MobileMenu;

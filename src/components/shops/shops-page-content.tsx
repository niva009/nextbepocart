import Image from 'next/image';

const About = () => {
  return (
    <div className="container mx-auto px-6 py-12">
      

      {/* Company Story */}
      <section className="py-12 text-center">
        <h2 className="text-3xl font-semibold mb-6">Our Story</h2>
        <p className="text-lg max-w-xl mx-auto leading-relaxed">
        Bepocart, an ecommerce website for a wide range of cycles, accessories, and apparel in India, offers some of the best prices and a completely hassle-free experience with options of paying through Cash on Delivery, Debit Card, Credit card, and Net Banking processed through secure and trusted gateways. Browse through our accessories and apparel featured on our site with expert descriptions to help you arrive at the right buying decision. Bepocart also offers free shipping. Join our community of cycling enthusiasts, and let's ride together towards greatness. Subscribe now for the latest updates and cycling adventures!
        </p>
      </section>

      {/* Contact/CTA */}
      <section className="text-center bg-gray-100 py-12 mt-12">
        <h2 className="text-3xl font-semibold mb-4">Get in Touch</h2>
        <p className="text-lg max-w-md mx-auto mb-6">
          have any question reach out today
        </p>
        <a href="/en/contact" className="inline-block bg-custom-green text-black py-3 px-6 rounded-md hover:bg-blue-700 transition duration-200 mt-8">
          Contact Us
        </a>
      </section>
    </div>
  );
};

export default About;

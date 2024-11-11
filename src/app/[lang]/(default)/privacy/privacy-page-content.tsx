import { FC } from 'react';

const PrivacyPolicy: FC = () => {
  return (
    <div className="container mx-auto px-6 py-12 text-gray-800 leading-relaxed">
      <p className="text-sm text-center italic mb-12">
        Note: This policy is subject to change without notice. Please review this policy periodically to stay informed of any updates.
      </p>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">1. Collection of Personal Information</h2>
        <p>
          We may collect personal information from Users when they visit our Site, register, place an order, subscribe to our newsletter, and engage in other activities. This information may include name, email, mailing address, phone number, etc. Users may visit our Site anonymously and choose not to provide personally identifiable information, though this may limit certain activities.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">2. Non-Personal Identification Information</h2>
        <p>
          We may collect non-personal information about Users when they interact with our Site. This includes browser type, computer type, and technical details about connection methods, such as operating system and internet service provider.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">3. Web Browser Cookies</h2>
        <p>
          Our Site may use "cookies" to enhance the User experience. Users can set their browsers to refuse cookies, though some parts of the Site may not function properly without cookies.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">4. How We Use Collected Information</h2>
        <ul className="list-disc list-inside">
          <li>To improve customer service and personalize user experience.</li>
          <li>To process payments and fulfill orders, using provided information only to complete the transaction.</li>
          <li>To send periodic emails and updates, which Users can unsubscribe from at any time.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">5. How We Protect Your Information</h2>
        <p>
          We implement security measures to protect against unauthorized access, alteration, disclosure, or destruction of your personal information. Data exchange on our Site is SSL-secured and encrypted.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">6. Sharing Your Personal Information</h2>
        <p>
          We do not sell or trade personal information. We may share general aggregated information with business partners for outlined purposes and use third-party providers for services with your permission.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">7. Third-Party Websites</h2>
        <p>
          Our Site may contain links to external websites with independent privacy policies. Interacting with these websites is subject to their policies.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">8. Advertising</h2>
        <p>
          Advertisers may set cookies to deliver targeted ads based on non-personally identifiable information. This policy does not cover advertisers’ use of cookies.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">9. Google AdSense</h2>
        <p>
          Some ads may be served by Google, which uses the DART cookie to deliver ads based on your visits to our Site and others. You can opt out of the DART cookie by visiting Google’s ad and content network privacy policy.
        </p>
      </section>

      <footer className="mt-12 text-center text-sm text-gray-500">
        Thank you for trusting us with your information. For any questions about this policy, please contact us.
      </footer>
    </div>
  );
};

export default PrivacyPolicy;

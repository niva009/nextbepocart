'use client';

import Text from '@components/ui/text';
import Heading from '@components/ui/heading';
import LocationIcon from '@components/icons/contact/location-icon';
import PhoneIcon from '@components/icons/contact/phone-icon';
import MailIcon from '@components/icons/contact/mail-icon';

const data = [
  {
    id: 1,
    icon: <LocationIcon />,
    name: 'Our Office Location',
    description: 'Michael export and import pvt ltd, GV Ayyer Road, Willingdon Island, Kochi, Kerala, India, PIN 682003',
  },
  {
    id: 2,
    icon: <PhoneIcon />,
    name: 'Phone Number',
    description: '+91 6235 084 759',
  },
  {
    id: 3,
    icon: <MailIcon />,
    name: 'Email Address',
    description: 'contact@bepocart.com'
  },
];

interface Props {
  lang: string;
}

const ContactSupport  = () => {
  return (
    <div className="mb-0 3xl:ltr:pr-5 3xl:rtl:pl-5">
      <Heading variant="heading" className="mb-3 lg:mb-4 xl:mb-5">
        Contact Information
      </Heading>

      <div className="mx-auto space-y-4 mb-6">
        {data.map((item) => (
          <div
            key={`contact--key${item.id}`}
            className="flex flex-col lg:flex-row max-w-xs lg:max-w-sm xl:pe-7"
          >
            <div className="flex-shrink-0 w-14 h-14 border-2 border-border-two p-3 rounded-md">
              {item.icon}
            </div>
            <div className="lg:ps-3 2xl:ps-4 mt-4 lg:mt-0">
              <Heading variant="base">{item.name}</Heading>
              <Text>{item.description}</Text>
            </div>
          </div>
        ))}
      </div>
      <Text className="xl:leading-8">
        If you have any questions or need further assistance, feel free to reach out to us through any of the above methods.
      </Text>
    </div>
  );
};

export default ContactSupport;

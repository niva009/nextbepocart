import Input from '@components/ui/form/input';
import Button from '@components/ui/button';
import TextArea from '@components/ui/form/text-area';
import { useForm } from 'react-hook-form';
import {
  useModalAction,
  useModalState,
} from '@components/common/modal/modal.context';
import CloseButton from '@components/ui/close-button';
import Heading from '@components/ui/heading';
import { useTranslation } from 'src/app/i18n/client';
import axios from 'axios';
import { API_ENDPOINTS } from '@framework/utils/api-endpoints';
import { useQueryClient } from 'react-query';


interface ContactFormValues {
  name: string;
  formatted_address?: string;
  address: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  pincode: string;
  customer_name: string;
}

const AddAddressForm: React.FC<{ lang: string }> = ({ lang }) => {
  const { t } = useTranslation(lang);
  const { data } = useModalState();
  const { closeModal } = useModalAction();
  const queryClient = useQueryClient(); // Initialize the query client

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ContactFormValues>({
    defaultValues: {
      customer_name: data?.customer_name || "",
      name: data?.name || '',
      address: data?.address || '',
      email: data?.email || '',
      phone: data?.phone || '',
      city: data?.city || '',
      state: data?.state || '',
      pincode: data?.pincode || '',
    },
  });

  async function onSubmit(values: ContactFormValues) {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `https://patrick-north-power-fence.trycloudflare.com/add-address/`,
        values,
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );
      console.log('Address added successfully:', values);
      closeModal();
      queryClient.invalidateQueries(API_ENDPOINTS.ADDRESS); 
    } catch (error) {
      console.error('Error adding address:', error);
    }
  }

  return (
    <div className="w-full md:w-[600px] lg:w-[900px] xl:w-[1000px] mx-auto p-5 sm:p-8 bg-brand-light rounded-md">
      <CloseButton onClick={closeModal} />
      <Heading variant="title" className="mb-8 -mt-1.5">
        {t('common:text-add-delivery-address')}
      </Heading>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="mb-6">
          <Input
            variant="solid"
            label="customer Name"
            {...register('customer_name', { required: 'Customer name is required' })}
            error={errors.name?.message}
            lang={lang}
          />
        </div>
        <div className="mb-6">
          <Input
            variant="solid"
            label="house name"
            {...register('name', { required: 'Name is required' })}
            error={errors.name?.message}
            lang={lang}
          />
        </div>
        <div className="grid grid-cols-1 mb-6 gap-7">
          <TextArea
            label="Address"
            {...register('address', {
              required: 'Address is required',
            })}
            error={errors.address?.message}
            className="text-brand-dark"
            variant="solid"
            lang={lang}
          />
        </div>
        <div className="mb-6">
          <Input
            variant="solid"
            label="Email"
            {...register('email', { required: 'Email is required' })}
            error={errors.email?.message}
            lang={lang}
          />
        </div>
        <div className="mb-6">
          <Input
            variant="solid"
            label="Phone"
            {...register('phone', {
              required: 'Phone number is required',
              minLength: {
                value: 10,
                message: 'Phone number must be exactly 10 digits',
              },
              maxLength: {
                value: 10,
                message: 'Phone number must be exactly 10 digits',
              },
              pattern: {
                value: /^[0-9]+$/,
                message: 'Phone number must contain only digits',
              },
            })}
            error={errors.phone?.message}
            lang={lang}
          />
        </div>
        <div className="mb-6">
          <Input
            variant="solid"
            label="City"
            {...register('city', { required: 'City is required' })}
            error={errors.city?.message}
            lang={lang}
          />
        </div>
        <div className="mb-6">
          <Input
            variant="solid"
            label="State"
            {...register('state', { required: 'State is required' })}
            error={errors.state?.message}
            lang={lang}
          />
        </div>
        <div className="mb-6">
          <Input
            variant="solid"
            label="Pincode"
            {...register('pincode', { required: 'Pincode is required' })}
            error={errors.pincode?.message}
            lang={lang}
          />
        </div>
        <div className="flex justify-end w-full">
          <Button className="h-11 md:h-12 mt-1.5" type="submit">
            {t('common:text-save-address')}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddAddressForm;

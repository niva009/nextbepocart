'use client';

import { useState, useEffect } from 'react';
import { MdDeleteForever } from "react-icons/md";
import { AiOutlinePlus } from 'react-icons/ai';
import { RadioGroup } from '@headlessui/react';
import { useModalAction } from '@components/common/modal/modal.context';
import Button from '@components/ui/button';
import { useTranslation } from 'src/app/i18n/client';
import axios from 'axios';
import { useQueryClient } from 'react-query';
import { API_ENDPOINTS } from '@framework/utils/api-endpoints';
import { useStateContext } from 'src/app/context/usecontext';

const AddressGrid: React.FC<{ address?: any; lang: string }> = ({
  address,
  lang,
}) => {
  const { t } = useTranslation(lang, 'common');
  const { openModal } = useModalAction();
  const token = localStorage.getItem("token");
  const queryClient = useQueryClient();
  const { triggerAction } = useStateContext();

  function handlePopupView(item: any) {
    openModal('ADDRESS_VIEW_AND_EDIT', item);
  }

  async function handleDelete(itemId: any) {
    try {
      await axios.delete(`http://72.167.55.172:8000/delete-address/${itemId}/`, {
        headers: {
          Authorization: `${token}`
        }
      });
      queryClient.invalidateQueries(API_ENDPOINTS.ADDRESS); // Refetch address data
    } catch (error) {
      console.error('Error deleting address:', error);
    }
  }

  address = address || [];
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    if (selected?.id) {
      localStorage.setItem("addressid", selected.id);
    }
  }, [selected]);

  return (
    <div className="flex flex-col justify-between h-full -mt-4 text-15px md:mt-0">
      <RadioGroup
        value={selected}
        onChange={(value) => {
          setSelected(value);
          triggerAction("address clicked successfully");
          // Store the selected address ID in localStorage
          localStorage.setItem("addressid", value.id);
        }}
        className="space-y-4 md:grid md:grid-cols-2 md:gap-5 auto-rows-auto md:space-y-0"
      >
        <RadioGroup.Label className="sr-only">{t('address')}</RadioGroup.Label>
        {address?.length > 0 ? (
          address.map((item: any, index: any) => (
            <RadioGroup.Option
              key={index}
              value={item}
              className={({ checked }) =>
                `${checked ? 'border-brand' : 'border-border-base'}
                border-2 relative focus:outline-none rounded-md p-5 block cursor-pointer min-h-[112px] h-full group address__box`
              }
            >
              <RadioGroup.Label as="h3" className="mb-2 font-semibold text-brand-dark">
                {item?.name}
              </RadioGroup.Label>
              <RadioGroup.Description as="div" className="text-brand-muted">
                <p className="mb-1">{item?.address}</p>
                <p className="mb-1">{item?.city}, {item?.state} - {item?.pincode}</p>
                <p className="mb-1">{item?.email}</p>
                <p className="mb-1">{item?.phone}</p>
              </RadioGroup.Description>
              <div className="absolute z-10 flex transition-all ltr:right-3 rtl:left-3 top-3 lg:opacity-0 address__actions">
                <button
                  onClick={() => handleDelete(item?.id)}
                  className="flex items-center justify-center w-6 h-6 text-base rounded-full bg-brand text-brand-light text-opacity-80"
                >
                  <span className="sr-only">{t(item?.title)}</span>
                  <MdDeleteForever />
                </button>
              </div>
            </RadioGroup.Option>
          ))
        ) : (
          <div className="border-2 border-border-base rounded font-semibold p-5 px-10 text-brand-danger flex justify-start items-center min-h-[112px] h-full">
            {t('text-no-address-found')}
          </div>
        )}
        <button
          className="w-full border-2 transition-all border-border-base rounded font-semibold p-5 px-10 cursor-pointer text-brand flex justify-start hover:border-brand items-center min-h-[112px] h-full"
          onClick={handlePopupView}
        >
          <AiOutlinePlus size={18} className="ltr:mr-2 rtl:ml-2" />
          {t('text-add-address')}
        </button>
      </RadioGroup>

      <div className="flex mt-5 sm:justify-end md:mt-10 lg:mt-20 save-change-button">
        <Button
          className="w-full sm:w-auto"
          disabled={!selected} // Disable button if no address is selected
        >
          {t('button-save-changes')}
        </Button>
      </div>
    </div>
  );
};

export default AddressGrid;

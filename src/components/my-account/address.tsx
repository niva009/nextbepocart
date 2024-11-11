import { useAddressQuery } from '@framework/address/address';
import AddressGrid from '@components/address/address-grid';

const AcoountDetailsPage: React.FC<{ lang: string }> = ({ lang }) => {
  let { data, isLoading } = useAddressQuery();
  return !isLoading ? (
    <AddressGrid address={data} lang={lang} />
  ) : (
    <div>Loading...</div>
  );
};

export default AcoountDetailsPage;

import { MetadataList } from '@/app/components/metadataList';
import { Navbar } from '@/app/components/navbar';
import { FunctionComponent } from "react";
import styles from './page.module.scss';
import { Typography } from '@mui/material';

export const ViewBooking: FunctionComponent<{
    booking?: any;
    setBooking: (booking?: any) => void;
}> = ({booking, setBooking}) => {
  if (!booking)
    return <></>;

  return <div className={styles.viewBooking}>
    <Navbar
      pageTitle='Booking details'
      onBackClick={() => setBooking()}
    />
    <MetadataList
      additionalData={{'Booking address': booking.item.inventory.bookingAddress.address}}
      metadata={booking.item?.metadata}
    />
    {
      booking?.formData ?
        <Typography
          variant='h2'
          gutterBottom
          fontSize={20}
          sx={{paddingTop: '8px'}}
        >
          Form data:
        </Typography> :
        <></>
    }
    <MetadataList metadata={booking.formData} />
  </div>;
};

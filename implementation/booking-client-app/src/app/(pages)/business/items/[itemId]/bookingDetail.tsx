import { MetadataList } from "@/app/components/metadataList";
import { FunctionComponent } from "react";
import styles from './page.module.scss';

export const BookingDetail: FunctionComponent<{
  bookingData?: any;
}> = ({bookingData}) => {
  if (!bookingData)
    return <></>;

  return <div className={styles.viewBooking}>
    <MetadataList
      additionalData={{'Booking address': bookingData.bookingAddress.address}}
      metadata={bookingData.formData}
    />
  </div>;
}

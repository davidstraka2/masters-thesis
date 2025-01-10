import { Booking } from "@/app/components/booking";
import { MetadataList } from "@/app/components/metadataList";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import Typography from "@mui/material/Typography";
import { FunctionComponent } from "react";
import styles from './page.module.scss';

export const ItemDetail: FunctionComponent<{
  show: boolean;
  showBookingDetails: (bookingId: string) => void;
  itemData?: any;
}> = ({itemData, show, showBookingDetails}) => {
  if (!itemData || !show)
    return <></>;

  const showBookings = (itemData?.bookings?.length ?? 0) > 0;

  const bookings = (showBookings ?
    <ul className={styles.bookings}>
      {
        itemData.bookings.map((booking: any) => <li key={booking.id}>
          <Booking
            bookingData={booking}
            onClick={() => showBookingDetails(booking.id)}
            rightIcon={<KeyboardArrowDownIcon />}
          />
        </li>)
      }
    </ul> :
    <></>
  );

  return <div className={styles.viewItem}>
    <MetadataList
      additionalData={{
        ...(itemData.bookDeadline ?
          {'Book deadline': new Date(itemData.bookDeadline).toLocaleString()} :
          {}
        ),
        'Capacity': itemData.capacity ?? 'Unlimited',
        'Occupancy': itemData.occupancy,
      }}
      metadata={itemData?.metadata}
    />
    <Typography
      variant='h2'
      gutterBottom
      fontSize={20}
      sx={{paddingTop: '8px'}}
    >
      {showBookings ? 'Bookings:' : 'This item has no bookings'}
    </Typography>
    {bookings}
  </div>;
}

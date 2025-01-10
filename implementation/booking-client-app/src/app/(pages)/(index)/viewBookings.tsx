import { Item } from '@/app/components/item';
import { Loading } from '@/app/components/loading';
import { NoData } from '@/app/components/noData';
import { getBookings } from '@/app/lib/api/user/bookings';
import EditCalendarIcon from '@mui/icons-material/EditCalendar';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import Fab from '@mui/material/Fab';
import { useRouter } from "next/navigation";
import { FunctionComponent, useEffect, useState } from "react";
import { Drawer } from "../../components/drawer";
import { Menubar } from "../../components/menubar";
import { ThumbButtons } from "../../components/thumbButtons";
import styles from './page.module.scss';
import { ViewBooking } from './viewBooking';
import { BookingItem } from '@/app/components/bookingItem';

export const ViewBookings: FunctionComponent<{show: boolean}> = ({show}) => {
  const router = useRouter();

  const [data, setData] = useState<unknown>(null);
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [bookingDetail, setBookingDetail] = useState<any>();

  useEffect(() => {
    async function fetchData() {
      const res = await getBookings();
      const data = res.success ? res.data : null;
      setData(data);
    }
    fetchData();
  }, []);

  if (!show)
    return <></>;

  const goToBookPage = () => {
    router.push('/book');
  };

  const items = (data ?
    <ul className={styles.items}>
      {
        (data as any).map((booking: any) => <li key={booking.id}>
          <BookingItem
            bookingData={booking ?? {}}
            onClick={() => setBookingDetail(booking)}
            rightIcon={<KeyboardArrowDownIcon />}
          />
        </li>)
      }
    </ul> :
    <></>
  );

  const content = (<div className={styles.viewBookings}>
    <Menubar placeholder='Search your bookings' setDrawerOpen={setDrawerOpen}></Menubar>
    <Drawer open={drawerOpen} setOpen={setDrawerOpen} />
    <Loading show={data === null} />
    <NoData message='You have no bookings' show={Array.isArray(data) && data.length === 0} />
    {items}
    <ThumbButtons>
      <Fab
        type="button"
        variant="extended"
        color="primary"
        onClick={goToBookPage}
      >
        <EditCalendarIcon sx={{ mr: 1 }} />
        Book
      </Fab>
    </ThumbButtons>
  </div>);

  return bookingDetail ?
    <ViewBooking booking={bookingDetail} setBooking={setBookingDetail} /> :
    content;
};

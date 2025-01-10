"use client";

import { Alert } from "@/app/components/alert";
import { Loading } from "@/app/components/loading";
import { Navbar } from "@/app/components/navbar";
import { RequireBookingAddress } from "@/app/components/requireBookingAddress";
import { getItemBookings } from "@/app/lib/api/user/inventory/items/bookings";
import { use, useEffect, useState } from 'react';
import { SessionAuth } from "supertokens-auth-react/recipe/session";
import { BookingDetail } from "./bookingDetail";
import { ItemDetail } from "./itemDetail";
import styles from './page.module.scss';

export default function ItemDetailPage({params}: {params: Promise<{itemId: string}>}) {
  const itemId = use(params).itemId;

  const [data, setData] = useState<any>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [bookingDetailData, setBookingDetailData] = useState<any>();

  useEffect(() => {
    async function fetchData() {
      const res = await getItemBookings(itemId);
      setLoading(false);
      if (res.success) {
        setData(res.data);
      } else {
        setStatus(res.errorMessage);
      }
    }
    setLoading(true);
    fetchData();
  }, [itemId]);

  const showBookingDetails = (bookingId: string) => {
    setBookingDetailData(data?.bookings?.find((booking: any) => booking.id === bookingId));
  };

  return (
    <main className={styles.page}>
      <SessionAuth>
        <RequireBookingAddress />
        <Loading show={loading} />
        <Navbar
          onBackClick={bookingDetailData ? () => setBookingDetailData(null) : '/business'}
          pageTitle={bookingDetailData ? 'Booking details' : 'Item details'}
        />
        <Alert status={status} setStatus={setStatus} />
        <ItemDetail
          itemData={data}
          show={!bookingDetailData}
          showBookingDetails={showBookingDetails}
        />
        <BookingDetail
          bookingData={bookingDetailData}
        />
      </SessionAuth>
    </main>
  );
}

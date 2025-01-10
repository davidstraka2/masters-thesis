"use client";

import { Alert } from "@/app/components/alert";
import { Loading } from "@/app/components/loading";
import { RequireBookingAddress } from "@/app/components/requireBookingAddress";
import { urlToAddress } from "@/app/lib/util/booking-address";
import { use, useEffect, useState } from 'react';
import { SessionAuth } from "supertokens-auth-react/recipe/session";
import { Navbar } from '../../../components/navbar';
import { getBookingAddressInventory } from "../../../lib/api/booking-addresses/inventory";
import { Inventory } from "./inventory";
import { ItemDetail } from "./itemDetail";
import styles from './page.module.scss';

export default function BookingAddressInventory({params}: {params: Promise<{address: string}>}) {
  const bookingAddress = urlToAddress(decodeURIComponent(use(params).address));

  const [data, setData] = useState<any>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [itemDetailData, setItemDetailData] = useState<any>();

  useEffect(() => {
    async function fetchData() {
      const res = await getBookingAddressInventory(bookingAddress);
      setLoading(false);
      if (res.success) {
        setData(res.data);
      } else {
        setStatus(res.errorMessage);
      }
    }
    setLoading(true);
    fetchData();
  }, [bookingAddress]);

  const showItemDetails = (itemId: string) => {
    setItemDetailData(data?.items?.find((item: any) => item.id === itemId));
  };

  return (
    <main className={styles.page}>
      <SessionAuth>
        <RequireBookingAddress />
        <Loading show={loading} />
        <Navbar
          onBackClick={itemDetailData ? () => setItemDetailData(null) : '/'}
          pageTitle={itemDetailData ? 'Item details' : 'Items for booking'}
        />
        <Alert status={status} setStatus={setStatus} />
        <Inventory
          bookingAddress={bookingAddress}
          data={data}
          show={!itemDetailData}
          showItemDetails={showItemDetails}
        />
        <ItemDetail
          inventoryBookingAddress={bookingAddress}
          itemData={itemDetailData}
          inventoryId={data?.id}
          form={data?.form}
          setStatus={setStatus}
        />
      </SessionAuth>
    </main>
  );
}

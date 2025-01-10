"use client";

import { Loading } from "@/app/components/loading";
import { useEffect, useState } from "react";
import { SessionAuth } from "supertokens-auth-react/recipe/session";
import { getBookingAddress } from "../../lib/api/user/booking-address";
import { CreateAddress } from "./createAddress";
import { ViewBookings } from "./viewBookings";

export default function Homepage() {
  const [hasBookingAddress, setHasBookingAddress] = useState<boolean | null>(null);
  
  useEffect(() => {
    async function fetchData() {
      const res = await getBookingAddress();
      const data: any = res.success ? res.data : null;
      setHasBookingAddress(typeof data?.address === 'string');
    }
    fetchData();
  }, []);

  return (
    <main>
      <SessionAuth>
        <Loading show={hasBookingAddress === null} />
        <CreateAddress show={hasBookingAddress === false} setHasBookingAddress={setHasBookingAddress} />
        <ViewBookings show={hasBookingAddress === true} />
      </SessionAuth>
    </main>
  );
}

'use client';

import { useRouter } from "next/navigation";
import { FunctionComponent, useEffect } from 'react';
import { getBookingAddress } from '../lib/api/user/booking-address';

export const RequireBookingAddress: FunctionComponent = () => {
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      const res = await getBookingAddress();
      const data: any = res.success ? res.data : null;
      if (!data?.address)
        router.push('/');
    }
    fetchData();
  }, [router]);

  return <></>;
};

import { FunctionComponent, ReactNode } from 'react';
import { formatMetadataItemValue } from '../lib/util/metadata';
import styles from './booking.module.scss';

export const Booking: FunctionComponent<{
  bookingData: {
    createdAt: string;
    formData?: Record<string, unknown>;
    bookingAddress: {
      address: string;
    };
  };
  leftIcon?: ReactNode;
  rightIcon: ReactNode;
  onClick: () => void;
}> = ({
  bookingData,
  leftIcon,
  rightIcon,
  onClick,
}) => {
  const isNameInFormData = 'name' in (bookingData.formData ?? {});
  const formDataKeys = Object.keys(bookingData.formData ?? {});
  const firstRowInfo: Array<[string | null, unknown]> = [];
  const secondRowInfo: Array<[string | null, unknown]> = [];
  firstRowInfo.push(['bookingAddress', bookingData.bookingAddress.address]);
  secondRowInfo.push(...(formDataKeys
    .map<[string, unknown]>(key => [key, bookingData.formData?.[key]])));
  if (isNameInFormData) {
    const nameIndex = secondRowInfo.findIndex(([key]) => key === 'name');
    const nameItem = secondRowInfo.splice(nameIndex, 1)[0];
    secondRowInfo.unshift(nameItem);
  }

  return <div className={styles.booking} onClick={onClick}>
    {leftIcon ? <div>{leftIcon}</div> : <></>}
    <ul className={styles.bookingInfoBox}>
      <li>
        <ul className={styles.bookingInfo}>
          {firstRowInfo.map(([key, value]) => <li key={key}>{formatMetadataItemValue(key, value)}</li>)}
        </ul>
      </li>
      <li>
        <ul className={styles.bookingInfo}>
          {secondRowInfo.map(([key, value]) => <li key={key}>{formatMetadataItemValue(key, value)}</li>)}
        </ul>
      </li>
    </ul>
    {rightIcon ? <div>{rightIcon}</div> : <></>}
  </div>;
};

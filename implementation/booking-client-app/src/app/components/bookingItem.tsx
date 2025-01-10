import { FunctionComponent, ReactNode } from 'react';
import { formatMetadataItemValue } from '../lib/util/metadata';
import styles from './bookingItem.module.scss';

export const BookingItem: FunctionComponent<{
  bookingData: {
    formData?: Record<string, unknown>;
    item: {
      metadata?: Record<string, unknown>;
      inventory: {
        bookingAddress: {
          address: string;
        };
      };
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
  firstRowInfo.push(['bookingAddress', bookingData.item.inventory.bookingAddress.address]);
  secondRowInfo.push(...(formDataKeys
    .map<[string, unknown]>(key => [key, bookingData.formData?.[key]])));
  if (isNameInFormData) {
    const nameIndex = secondRowInfo.findIndex(([key]) => key === 'name');
    const nameItem = secondRowInfo.splice(nameIndex, 1)[0];
    secondRowInfo.unshift(nameItem);
  }

  return <div className={styles.item} onClick={onClick}>
    {leftIcon ? <div>{leftIcon}</div> : <></>}
    <ul className={styles.itemInfoBox}>
      <li>
        <ul className={styles.itemInfo}>
          {firstRowInfo.map(([key, value]) => <li key={key}>{formatMetadataItemValue(key, value)}</li>)}
        </ul>
      </li>
      <li>
        <ul className={styles.itemInfo}>
          {secondRowInfo.map(([key, value]) => <li key={key}>{formatMetadataItemValue(key, value)}</li>)}
        </ul>
      </li>
    </ul>
    {rightIcon ? <div>{rightIcon}</div> : <></>}
  </div>;
};

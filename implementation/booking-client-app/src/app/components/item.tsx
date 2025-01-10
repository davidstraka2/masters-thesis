import { FunctionComponent, ReactNode } from 'react';
import { formatMetadataItemValue } from '../lib/util/metadata';
import styles from './item.module.scss';

export const Item: FunctionComponent<{
  itemData: {
    createdAt: string;
    capacity?: number;
    bookDeadline?: string;
    meta?: Record<string, unknown>;
    metadata?: Record<string, unknown>;
    occupancy?: number | string;
  };
  leftIcon?: ReactNode;
  rightIcon: ReactNode;
  onClick: () => void;
}> = ({
  itemData,
  leftIcon,
  rightIcon,
  onClick,
}) => {
  const metadata = itemData.meta ?? itemData.metadata;
  const isNameInMetadata = 'name' in (metadata ?? {});
  const metadataKeys = Object.keys(metadata ?? {});
  const firstRowInfo: Array<[string | null, unknown]> = [];
  const secondRowInfo: Array<[string | null, unknown]> = [];
  if (isNameInMetadata) {
    firstRowInfo.push(['name', metadata!['name']]);
    secondRowInfo.push(...metadataKeys
      .filter(key => key !== 'name')
      .map<[string, unknown]>(key => [key, metadata![key]])
    );
  } else {
    const firstMetadataKey = metadataKeys[0];
    if (typeof firstMetadataKey === 'string') {
      firstRowInfo.push([firstMetadataKey, metadata![firstMetadataKey]]);
    } else {
      firstRowInfo.push([null, 'Item with no metadata']);
    }
    secondRowInfo.push(...metadataKeys
      .slice(1)
      .map<[string, unknown]>(key => [key, metadata![key]])
    );
  }

  let capacityInfo;
  const occupancy = typeof itemData.occupancy === 'string' ? parseInt(itemData.occupancy, 10) : itemData.occupancy;
  if (itemData.capacity && typeof occupancy !== 'number')
    capacityInfo = `${occupancy} capacity`;
  if (typeof occupancy === 'number')
    capacityInfo = `${occupancy}/${itemData.capacity ?? '∞'} filled`;

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
          {capacityInfo ? <li>{capacityInfo}</li> : <></>}
          {secondRowInfo.map(([key, value]) => <li key={key}>{formatMetadataItemValue(key, value)}</li>)}
        </ul>
      </li>
    </ul>
    {rightIcon ? <div>{rightIcon}</div> : <></>}
  </div>;
};

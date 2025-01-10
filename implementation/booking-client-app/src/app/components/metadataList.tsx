import { FunctionComponent } from 'react';
import { formatMetadataItemValue } from '../lib/util/metadata';
import styles from './metadataList.module.scss';

export const MetadataList: FunctionComponent<{
  additionalData?: Record<string, string>;
  metadata?: Record<string, unknown>;
}> = ({additionalData, metadata}) => {
  if (!metadata)
    return <></>;

  const keysToPrint = Object.keys(metadata).filter(key => !key.startsWith('@'));
  const nameIndex = keysToPrint.indexOf('name');
  if (nameIndex >= 0) {
    keysToPrint.splice(nameIndex, 1);
    keysToPrint.unshift('name');
  }
  const items = keysToPrint.map(key => <li key={key}>
    {key.at(0)!.toLocaleUpperCase()}{key.slice(1)}: {formatMetadataItemValue(key, metadata[key])}
  </li>);

  const additonalItems = Object.keys(additionalData ?? []).map(key => <li key={key}>
    {key}: {additionalData![key]}
  </li>);

  return <ul className={styles.metadataList}>
    {...additonalItems}
    {...items}
  </ul>;
};

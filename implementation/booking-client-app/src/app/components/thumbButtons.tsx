import { FunctionComponent, PropsWithChildren } from 'react';
import styles from './thumbButtons.module.scss';

export const ThumbButtons: FunctionComponent<PropsWithChildren<{}>> = ({
  children,
}) => {
  return <div className={styles.thumbButtons}>{children}</div>;
};

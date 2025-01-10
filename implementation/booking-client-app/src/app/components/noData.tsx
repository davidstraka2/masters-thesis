import Typography from '@mui/material/Typography';
import { FunctionComponent } from 'react';
import styles from './noData.module.scss';

export const NoData: FunctionComponent<{message: string; show: boolean;}> = ({message, show}) => {
  if (!show)
    return <></>;

  return <div className={styles.noData}>
    <Typography>{message}</Typography>
  </div>;
};

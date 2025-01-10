import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import { FunctionComponent } from 'react';
import styles from './loading.module.scss';

export const Loading: FunctionComponent<{show: boolean;}> = ({show}) => {
  return show ?
    <div className={styles.loading}>
      <div>
        <CircularProgress />
        <Typography>Loading data...</Typography>
      </div>
    </div> :
    <></>;
};

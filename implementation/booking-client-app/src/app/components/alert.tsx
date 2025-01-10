import MUIAlert from "@mui/material/Alert";
import { FunctionComponent } from 'react';
import styles from './alert.module.scss';

export const Alert: FunctionComponent<{
  status: string | null;
  setStatus: (status: string | null) => void;
}> = ({
  status,
  setStatus,
}) => {
  return <div className={styles.alerts}>
    {
      status &&
      <MUIAlert
        severity="error"
        sx={{borderRadius: "50px"}}
        onClick={() => setStatus(null)}
      >
        {status}
      </MUIAlert>
    }
  </div>
};

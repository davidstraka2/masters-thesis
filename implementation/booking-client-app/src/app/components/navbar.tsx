import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useRouter } from "next/navigation";
import { FunctionComponent } from 'react';
import styles from './navbar.module.scss';

export const Navbar: FunctionComponent<{
  onBackClick: string | (() => void);
  pageTitle?: string;
}> = ({
  onBackClick,
  pageTitle,
}) => {
  const router = useRouter();

  const onBackButtonClick = () => {
    if (typeof onBackClick === 'string') {
      router.push(onBackClick);
    } else {
      onBackClick();
    }
  };

  return <div className={styles.navbar}>
    <Button onClick={onBackButtonClick}>
      <ArrowBackIcon />
    </Button>
    {
      typeof pageTitle === 'string' ?
        <Typography variant="h1" fontSize={30}>
          {pageTitle}
        </Typography> :
        <></>
    }
  </div>;
};

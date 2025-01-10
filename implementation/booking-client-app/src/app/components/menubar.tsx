'use-client';

import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import InputBase from '@mui/material/InputBase';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Paper from '@mui/material/Paper';
import { redirect, usePathname } from 'next/navigation';
import { FunctionComponent, useEffect, useState } from 'react';
import { signOut } from "supertokens-auth-react/recipe/session";
import { getBookingAddress } from '../lib/api/user/booking-address';

const UserProfileDialog: FunctionComponent<{
  open: boolean;
  onClose: () => void;
}> = ({
  open,
  onClose,
}) => {
  const pathname = usePathname() || window.location.pathname;
  const [bookingAddress, setBookingAddress] = useState('');

  useEffect(() => {
    async function fetchData() {
      const res = await getBookingAddress();
      const data: any = res.success ? res.data : null;
      if (data?.address)
        setBookingAddress(data?.address);
    }
    fetchData();
  }, []);

  const handleClose = () => {
    onClose();
  };

  const handleListItemClick = (value: string) => {
    if (value === "logOut") {
      signOut().then(() => {
        if (pathname === '/') {
          location.reload();
        } else {
          redirect(`/`);
        }
      });
    }
    onClose();
  };

  return (
    <Dialog
      onClose={handleClose}
      open={open}
      PaperProps={{
        sx: {borderRadius: '20px'},
      }}
    >
      <DialogTitle>{bookingAddress}</DialogTitle>
      <List sx={{ pt: 0 }}>
        <ListItem disablePadding>
          <ListItemButton
            autoFocus
            onClick={() => handleListItemClick('logOut')}
          >
            <ListItemIcon>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Log out" />
          </ListItemButton>
        </ListItem>
      </List>
    </Dialog>
  );
}

export const Menubar: FunctionComponent<{
  placeholder: string;
  setDrawerOpen: (open: boolean) => void;
}> = ({
  placeholder,
  setDrawerOpen,
}) => {
  const [accountDialogOpen, setAccountDialogOpen] = useState(false);

  return (
    <Paper
      component="form"
      onSubmit={e => e.preventDefault()}
      sx={{
        margin: '4px 8px',
        padding: '2px 8px',
        display: 'flex',
        alignItems: 'center',
        width: 'calc(100% - 16px)',
        position: 'fixed',
        top: 0,
        left: 0,
        borderRadius: '50px',
        zIndex: 999,
      }}
    >
      <IconButton
        sx={{ p: '10px' }}
        aria-label="menu"
        onClick={() => setDrawerOpen(true)}
      >
        <MenuIcon />
      </IconButton>
      <InputBase
        sx={{ ml: 1, flex: 1 }}
        placeholder={placeholder}
        inputProps={{ 'aria-label': placeholder }}
      />
      <IconButton
        color="primary"
        sx={{ p: '10px' }}
        aria-label="directions"
        onClick={() => setAccountDialogOpen(true)}
      >
        <AccountCircleIcon />
      </IconButton>
      <UserProfileDialog
        open={accountDialogOpen}
        onClose={() => setAccountDialogOpen(false)}
      />
    </Paper>
  );
};

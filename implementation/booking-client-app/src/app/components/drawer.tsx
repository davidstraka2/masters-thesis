import HomeIcon from '@mui/icons-material/Home';
import StoreIcon from '@mui/icons-material/Store';
import Box from '@mui/material/Box';
import DialogTitle from '@mui/material/DialogTitle';
import Divider from '@mui/material/Divider';
import MUIDrawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { usePathname, useRouter } from "next/navigation";
import { FunctionComponent } from 'react';

export const Drawer: FunctionComponent<{open: boolean; setOpen: (open: boolean) => void;}> = ({
  open,
  setOpen,
}) => {
  const router = useRouter();
  const pathname = usePathname() || window.location.pathname;

  const items = [
    {
      title: 'Home',
      route: '/',
      icon: <HomeIcon />,
    },
    {
      title: 'Business',
      route: '/business',
      icon: <StoreIcon />,
    },
  ];

  const DrawerList = (
    <Box sx={{ width: 250 }} role="presentation" onClick={() => setOpen(false)}>
      <List>
        <DialogTitle>Booking client</DialogTitle>
        <Divider />
        {
          items.map(value => (
            <ListItem key={value.title} disablePadding>
            <ListItemButton
              disabled={value.route === pathname}
              onClick={() => router.push(value.route)}
            >
              <ListItemIcon>
                {value.icon}
              </ListItemIcon>
              <ListItemText primary={value.title} />
            </ListItemButton>
          </ListItem>
          ))
        }
      </List>
    </Box>
  );

  return (
    <div>
      <MUIDrawer open={open} onClose={() => setOpen(false)}>
        {DrawerList}
      </MUIDrawer>
    </div>
  );
};

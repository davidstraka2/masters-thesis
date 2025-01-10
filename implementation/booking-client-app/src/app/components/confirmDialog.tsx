import { debounce } from "@mui/material";
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { FunctionComponent, PropsWithChildren } from 'react';
import styles from './confirmDialog.module.scss';

export const ConfirmDialog: FunctionComponent<PropsWithChildren<{
    title: string;
    open: boolean;
    setOpen: (open: boolean) => void;
    onConfirm: () => void;
    onCancel: () => void;
  }>> = ({
    title,
    open,
    setOpen,
    onConfirm,
    onCancel,
    children,
  }) => {
  const handleConfirm = debounce(() => {
    setOpen(false);
    onConfirm();
  });

  const handleCancel = () => {
    setOpen(false);
    onCancel();
  };

  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      PaperProps={{
        sx: {borderRadius: '20px'},
      }}
    >
      <DialogTitle textAlign="center">{title}</DialogTitle>
      <div className={styles.confirmDialogChildren}>{children}</div>
      <List className={styles.confirmDialogButtons} sx={{ pt: 0 }}>
        <ListItem disablePadding>
          <ListItemButton
            autoFocus
            onClick={handleConfirm}
          >
            <ListItemText primary="Confirm" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton
            onClick={handleCancel}
          >
            <ListItemText primary="Cancel" />
          </ListItemButton>
        </ListItem>
      </List>
    </Dialog>
  );
}

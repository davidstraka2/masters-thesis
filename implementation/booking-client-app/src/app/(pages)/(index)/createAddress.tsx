import LoginIcon from "@mui/icons-material/Login";
import { inputBaseClasses } from "@mui/material";
import Fab from '@mui/material/Fab';
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Form from 'next/form';
import { FunctionComponent, useState } from "react";
import { Alert } from "../../components/alert";
import { ConfirmDialog } from "../../components/confirmDialog";
import { ThumbButtons } from "../../components/thumbButtons";
import { publicConfig } from "../../config/public";
import { createBookingAddress } from "../../lib/api/user/booking-address";
import {
  usernameToAddress,
  validateUsername
} from "../../lib/util/booking-address";
import styles from './page.module.scss';

export const CreateAddress: FunctionComponent<{
  show: boolean;
  setHasBookingAddress: (value: boolean) => void;
}> = ({show, setHasBookingAddress}) => {
  const [username, setUsername] = useState('');
  const [status, setStatus] = useState<string | null>(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState<boolean>(false);
  const [usernameValid, setUserNameValid] = useState<string | null>(null);
  const [isAwaitingServerResponse, setIsAwaitingServerResponse] = useState<boolean>(false);

  if (!show)
    return <></>;

  const createAddress = async () => {
    const bookingAddress = usernameToAddress(username);
    const result = await createBookingAddress(bookingAddress);
    if (result.success) {
      setStatus(null);
      setHasBookingAddress(true);
    } else {
      setStatus(result.errorMessage);
      setIsAwaitingServerResponse(false);
    }
  };

  const handleSubmit = () => {
    setIsAwaitingServerResponse(true);
    createAddress();
  };

  return (
    <div className={styles.createAddressSubpage}>
      <Alert status={status} setStatus={setStatus} />
      <Form action={() => setConfirmDialogOpen(true)}>
        <div className={styles.horizontallyCenteredDisplay}>
          <Typography variant="h1" gutterBottom fontSize={30}>
            Your new booking address
          </Typography>
          <TextField
              autoFocus
              id="outlined-search"
              label={`username@${publicConfig.bookingAddressAt}`}
              type="input"
              value={username}
              required
              error={usernameValid !== null}
              helperText={usernameValid}
              disabled={isAwaitingServerResponse}
              onChange={(e) => {
                const newUsername = e.target.value;
                const validationResult = validateUsername(newUsername);
                if (validationResult.isValid || newUsername.length === 0) {
                  setUserNameValid(null);
                } else {
                  setUserNameValid(validationResult.errorMessage);
                }
                setUsername(newUsername);
              }}
              slotProps={{
                inputLabel: {
                  required: false,
                },
                input: {
                  style: {
                    borderRadius: "50px"
                  },
                  endAdornment: (
                    <InputAdornment
                      position="end"
                      sx={{
                        alignSelf: 'flex-end',
                        boxSizing: 'content-box',
                        padding: '16.5px 0px',
                        opacity: 0,
                        pointerEvents: 'none',
                        [`[data-shrink=true] ~ .${inputBaseClasses.root} > &`]: {
                          opacity: 1,
                        },
                      }}
                    >
                      @{publicConfig.bookingAddressAt}
                    </InputAdornment>
                  ),
                },
              }}
            />
        </div>
        <ThumbButtons>
          <Fab
            type="submit"
            disabled={isAwaitingServerResponse || (usernameValid !== null)}
            variant="extended"
            color="primary"
          >
            <LoginIcon sx={{ mr: 1 }} />
            Create
          </Fab>
        </ThumbButtons>
        <ConfirmDialog
          title="Create new address"
          open={confirmDialogOpen}
          setOpen={setConfirmDialogOpen}
          onConfirm={handleSubmit}
          onCancel={() => setConfirmDialogOpen(false)}
        >
          <p>Are you sure you want the create the booking address {usernameToAddress(username)}? This action cannot be undone.</p>
          <p>Note that this address is separate from your login credentials.</p>
        </ConfirmDialog>
      </Form>
    </div>
  );
};

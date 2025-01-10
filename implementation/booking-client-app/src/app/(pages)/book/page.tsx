"use client";

import { RequireBookingAddress } from "@/app/components/requireBookingAddress";
import LoginIcon from "@mui/icons-material/Login";
import Fab from '@mui/material/Fab';
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Form from 'next/form';
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SessionAuth } from "supertokens-auth-react/recipe/session";
import { Alert } from "../../components/alert";
import { Navbar } from "../../components/navbar";
import { ThumbButtons } from "../../components/thumbButtons";
import { validateAddress } from "../../lib/util/booking-address";
import styles from './page.module.scss';

export default function Book() {
  const router = useRouter();

  const [bookingAddress, setBookingAddress] = useState('');
  const [status, setStatus] = useState<string | null>(null);
  const [usernameValid, setUserNameValid] = useState<string | null>(null);
  const [isAwaitingServerResponse, setIsAwaitingServerResponse] = useState<boolean>(false);

  const handleSubmit = () => {
    setIsAwaitingServerResponse(true);
    router.push(`/book/${encodeURIComponent(bookingAddress)}`);
  };

  return (
    <main className={styles.page}>
      <SessionAuth>
        <RequireBookingAddress />
        <Navbar onBackClick="/" />
        <Alert status={status} setStatus={setStatus} />
        <Form action={handleSubmit}>
          <div className={styles.horizontallyCenteredDisplay}>
            <Typography variant="h1" gutterBottom fontSize={30}>
              New booking
            </Typography>
            <TextField
                autoFocus
                id="outlined-search"
                label={`username@example.com`}
                type="input"
                value={bookingAddress}
                required
                error={usernameValid !== null}
                helperText={usernameValid}
                disabled={isAwaitingServerResponse}
                onChange={(e) => {
                  const newUsername = e.target.value;
                  const validationResult = validateAddress(newUsername);
                  if (validationResult.isValid || newUsername.length === 0) {
                    setUserNameValid(null);
                  } else {
                    setUserNameValid(validationResult.errorMessage);
                  }
                  setBookingAddress(newUsername);
                }}
                slotProps={{
                  inputLabel: {
                    required: false,
                  },
                  input: {
                    style: {
                      borderRadius: "50px"
                    },
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
              See inventory
            </Fab>
          </ThumbButtons>
        </Form>
      </SessionAuth>
    </main>
  );
}

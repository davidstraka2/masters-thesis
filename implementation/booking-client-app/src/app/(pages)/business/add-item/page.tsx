"use client";

import { RequireBookingAddress } from '@/app/components/requireBookingAddress';
import {
  materialCells,
  materialRenderers,
} from '@jsonforms/material-renderers';
import { JsonForms } from '@jsonforms/react';
import LoginIcon from "@mui/icons-material/Login";
import Fab from '@mui/material/Fab';
import Ajv from "ajv";
import addFormats from "ajv-formats";
import Form from 'next/form';
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SessionAuth } from "supertokens-auth-react/recipe/session";
import { Alert } from "../../../components/alert";
import { ConfirmDialog } from "../../../components/confirmDialog";
import { Navbar } from "../../../components/navbar";
import { ThumbButtons } from "../../../components/thumbButtons";
import { createItem } from '../../../lib/api/user/inventory/items';
import { itemJSONFormsDataSchema } from '../../../lib/schemas/itemJSONFormsDataSchema';
import styles from './page.module.scss';

const ajv = new Ajv();
// @ts-ignore ts(2345)
addFormats(ajv);

const validate = ajv.compile(itemJSONFormsDataSchema);

export default function AddItem() {
  const router = useRouter();

  const [confirmDialogOpen, setConfirmDialogOpen] = useState<boolean>(false);
  const [status, setStatus] = useState<string | null>(null);
  const [formData, setFormData] = useState({});
  const [isAwaitingServerResponse, setIsAwaitingServerResponse] = useState<boolean>(false);

  const createItemAux = async () => {
    const result = await createItem(formData);
    if (result.success) {
      setStatus(null);
      router.push('/business');
    } else {
      setStatus(result.errorMessage);
      setIsAwaitingServerResponse(false);
    }
  };

  const handleConfirm = () => {
    setIsAwaitingServerResponse(true);
    createItemAux();
  };

  const handleSubmit = () => {
    if (validate(formData))
      setConfirmDialogOpen(true);
  };

  return (
    <main className={styles.page}>
      <SessionAuth>
        <RequireBookingAddress />
        <Navbar onBackClick="/business" pageTitle='New inventory item' />
        <Alert status={status} setStatus={setStatus} />
        <Form
          action={handleSubmit}
        >
          <div>
            <div className={styles.form}>
              <JsonForms
                schema={itemJSONFormsDataSchema}
                data={formData}
                renderers={materialRenderers}
                cells={materialCells}
                onChange={({ data }) => setFormData(data)}
                readonly={isAwaitingServerResponse}
              />
            </div>
          </div>
          <ThumbButtons>
            <Fab
              type="submit"
              variant="extended"
              color="primary"
              disabled={isAwaitingServerResponse}
            >
              <LoginIcon sx={{ mr: 1 }} />
              Add
            </Fab>
          </ThumbButtons>
          <ConfirmDialog
            title="Add item to inventory"
            open={confirmDialogOpen}
            setOpen={setConfirmDialogOpen}
            onConfirm={handleConfirm}
            onCancel={() => setConfirmDialogOpen(false)}
          />
        </Form>
      </SessionAuth>
    </main>
  );
}

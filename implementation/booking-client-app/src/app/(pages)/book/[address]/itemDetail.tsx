import { ConfirmDialog } from "@/app/components/confirmDialog";
import { MetadataList } from "@/app/components/metadataList";
import { ThumbButtons } from "@/app/components/thumbButtons";
import { createBooking } from "@/app/lib/api/booking-addresses/booking";
import { materialCells, materialRenderers } from "@jsonforms/material-renderers";
import { JsonForms } from "@jsonforms/react";
import AddIcon from "@mui/icons-material/Add";
import Fab from "@mui/material/Fab";
import Ajv from "ajv";
import addFormats from "ajv-formats";
import Form from "next/form";
import { useRouter } from "next/navigation";
import { FunctionComponent, useState } from "react";
import styles from './page.module.scss';

const ajv = new Ajv();
// @ts-ignore ts(2345)
addFormats(ajv);

export const ItemDetail: FunctionComponent<{
  inventoryBookingAddress: string;
  inventoryId: string;
  itemData?: any;
  form?: any;
  setStatus: (status: string | null) => void;
}> = ({inventoryBookingAddress, inventoryId, itemData, form, setStatus}) => {
  const [formData, setFormData] = useState({});
  const [isAwaitingServerResponse, setIsAwaitingServerResponse] = useState<boolean>(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState<boolean>(false);

  const router = useRouter();

  if (!itemData)
    return <></>;

  const validateForm = form ? ajv.compile(form) : null;

  const bookItem = async () => {
    const result = await createBooking(inventoryBookingAddress, inventoryId, itemData.id, formData);
    if (result.success) {
      setStatus(null);
      router.push('/');
    } else {
      setStatus(result.errorMessage);
      setIsAwaitingServerResponse(false);
    }
  };

  const handleConfirm = () => {
    setIsAwaitingServerResponse(true);
    bookItem();
  };

  const handleSubmit = () => {
    if (validateForm && !validateForm(formData))
      return;
    setConfirmDialogOpen(true);
  };

  return <>
    <MetadataList
      additionalData={{
        ...(itemData.bookDeadline ?
          {'Book deadline': new Date(itemData.bookDeadline).toLocaleString()} :
          {}
        ),
        'Capacity': itemData.capacity ?? 'Unlimited',
        'Occupancy': itemData.occupancy,
      }}
      metadata={itemData.meta ?? itemData.metadata}
    />
    <Form
      action={handleSubmit}
    >
      <div>
        <div className={styles.form}>
          <JsonForms
            schema={form}
            data={formData}
            renderers={materialRenderers}
            cells={materialCells}
            onChange={({ data }: {data: object}) => setFormData(data)}
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
          <AddIcon sx={{ mr: 1 }} />
          Create booking
        </Fab>
      </ThumbButtons>
      <ConfirmDialog
        title="Book item"
        open={confirmDialogOpen}
        setOpen={setConfirmDialogOpen}
        onConfirm={handleConfirm}
        onCancel={() => setConfirmDialogOpen(false)}
      />
    </Form>
  </>;
}

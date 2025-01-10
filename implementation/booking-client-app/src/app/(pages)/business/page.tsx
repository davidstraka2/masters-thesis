"use client";

import { Loading } from '@/app/components/loading';
import { NoData } from '@/app/components/noData';
import { RequireBookingAddress } from '@/app/components/requireBookingAddress';
import {
  materialCells,
  materialRenderers,
} from '@jsonforms/material-renderers';
import { JsonForms } from '@jsonforms/react';
import AddIcon from "@mui/icons-material/Add";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import LoginIcon from "@mui/icons-material/Login";
import Fab from '@mui/material/Fab';
import Typography from "@mui/material/Typography";
import Ajv from "ajv";
import addFormats from "ajv-formats";
import Form from 'next/form';
import { useRouter } from "next/navigation";
import { FunctionComponent, useEffect, useState } from 'react';
import { SessionAuth } from "supertokens-auth-react/recipe/session";
import { Alert } from "../../components/alert";
import { ConfirmDialog } from "../../components/confirmDialog";
import { Drawer } from '../../components/drawer';
import { Item } from '../../components/item';
import { Menubar } from '../../components/menubar';
import { ThumbButtons } from "../../components/thumbButtons";
import { createInventory, getInventory } from '../../lib/api/user/inventory';
import { inventoryJSONFormsDataSchema } from '../../lib/schemas/inventoryJSONFormsData';
import styles from './page.module.scss';

const ajv = new Ajv();
// @ts-ignore ts(2345)
addFormats(ajv);

const validate = ajv.compile(inventoryJSONFormsDataSchema);

const CreateInventory: FunctionComponent<{show: boolean}> = ({show}) => {
  const [confirmDialogOpen, setConfirmDialogOpen] = useState<boolean>(false);
  const [status, setStatus] = useState<string | null>(null);
  const [formData, setFormData] = useState({});
  const [isAwaitingServerResponse, setIsAwaitingServerResponse] = useState<boolean>(false);

  if (!show)
    return <></>;

  const createInventoryAux = async () => {
    const result = await createInventory(formData);
    if (result.success) {
      setStatus(null);
      location.reload();
    } else {
      setStatus(result.errorMessage);
      setIsAwaitingServerResponse(false);
    }
  };

  const handleConfirm = () => {
    setIsAwaitingServerResponse(true);
    createInventoryAux();
  };

  const handleSubmit = () => {
    if (validate(formData))
      setConfirmDialogOpen(true);
  };

  return <>
    <Alert status={status} setStatus={setStatus} />
    <Form
      action={handleSubmit}
    >
      <div>
        <Typography variant="h1" gutterBottom fontSize={30}>
        Your new inventory
        </Typography>
        <Typography variant="caption">
          You do not currently have an inventory set up. If you wish to create one, you may do so here.
        </Typography>
        <div className={styles.form}>
          <JsonForms
            schema={inventoryJSONFormsDataSchema}
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
          Create
        </Fab>
      </ThumbButtons>
      <ConfirmDialog
        title="Create inventory"
        open={confirmDialogOpen}
        setOpen={setConfirmDialogOpen}
        onConfirm={handleConfirm}
        onCancel={() => setConfirmDialogOpen(false)}
      >
        <p>Are you sure you want the create your inventory?</p>
      </ConfirmDialog>
    </Form>
  </>;
};

const ViewInventory: FunctionComponent<{data: any}> = ({data}) => {
  const router = useRouter();

  if (!data)
    return <></>;

  const goToAddItemPage = () => {
    router.push('/business/add-item');
  };

  const goToItemDetailsPage = (itemId: string) => {
    router.push(`/business/items/${itemId}`);
  };

  return <>
    <NoData
      message='You have no inventory items'
      show={Array.isArray(data?.items) && data.items.length === 0}
    />
    <ul className={styles.items}>
      {
        (data.items ?? []).map((item: any) => <li key={item.id}>
          <Item
            itemData={item}
            onClick={() => goToItemDetailsPage(item.id)}
            rightIcon={<KeyboardArrowDownIcon />}
          />
        </li>)
      }
    </ul>
    <ThumbButtons>
      <Fab
        type="submit"
        variant="extended"
        color="primary"
        onClick={goToAddItemPage}
      >
        <AddIcon sx={{ mr: 1 }} />
        Add item
      </Fab>
    </ThumbButtons>
  </>;
};

export default function Business() {
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<unknown>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const res = await getInventory();
      const data = res.success ? res.data : null;
      setData(data);
      setLoading(false);
    }
    setLoading(true);
    fetchData();
  }, []);

  return (
    <main className={styles.page}>
      <SessionAuth>
        <RequireBookingAddress />
        <Loading show={loading} />
        <Menubar placeholder='Search your inventory' setDrawerOpen={setDrawerOpen}></Menubar>
        <Drawer open={drawerOpen} setOpen={setDrawerOpen} />
        <CreateInventory show={!loading && !data} />
        <ViewInventory data={data} />
      </SessionAuth>
    </main>
  );
}

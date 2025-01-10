import { Item } from "@/app/components/item";
import { MetadataList } from "@/app/components/metadataList";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import Typography from "@mui/material/Typography";
import { FunctionComponent } from "react";
import styles from './page.module.scss';

export const Inventory: FunctionComponent<{
  bookingAddress: string;
  data: any;
  show: boolean;
  showItemDetails: (itemId: string) => void;
}> = ({
  bookingAddress,
  data,
  show,
  showItemDetails,
}) => {
  if (!data || !show)
    return <></>;

  return <>
    <MetadataList
      additionalData={{
        'Booking address': bookingAddress,
      }}
      metadata={data.meta}
    />
    <Typography role="h2" gutterBottom fontSize={24} paddingTop={1}>Available items</Typography>
    <ul className={styles.items}>
      {
        (data.items ?? []).map((item: any) => <li key={item.id}>
          <Item
            itemData={item}
            onClick={() => showItemDetails(item.id)}
            leftIcon={<AddCircleIcon />}
            rightIcon={<KeyboardArrowDownIcon />}
          />
        </li>)
      }
    </ul>
  </>
}

// filepath: src/components/Admin/OrderAdminTable.tsx
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import { grey, purple } from '@mui/material/colors'; // Using blueGrey for ID

// Define the shape of an order object for this table
// This should ideally come from your global types or be defined more centrally
export interface IAdminOrderRow {
  id: string;
  customerName: string;
  customerEmail: string;
  status: string;
  itemCount: number;
  totalPrice: number;
  currency: string;
}

type Props = {
  orders: IAdminOrderRow[];
  onView: (id: string) => void;
  onDelete: (id: string) => void;
};

export default function OrderAdminTable({ orders, onView, onDelete }: Props) {
  if (!orders || orders.length === 0) {
    return (
      <Paper sx={{ textAlign: 'center', p: 3, mt: 2 }}>
        <Typography variant={'body1'}>No orders found.</Typography>
      </Paper>
    );
  }

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="order admin table">
        <TableHead sx={{ backgroundColor: 'action.hover' }}>
          <TableRow>
            <TableCell sx={{ fontWeight: 'bold' }}>Order ID</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Customer</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }} align="right">
              Items
            </TableCell>
            <TableCell sx={{ fontWeight: 'bold' }} align="right">
              Total
            </TableCell>
            <TableCell sx={{ fontWeight: 'bold' }} align="center">
              Actions
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orders.map((order) => (
            <TableRow
              key={order.id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              hover
            >
              <TableCell
                component="th"
                scope="row"
                sx={{ fontFamily: 'monospace', color: purple[100] }}
              >
                {order.id}
              </TableCell>
              <TableCell>
                <Typography variant="body2">{order.customerName}</Typography>
                <Typography variant="caption" color={grey[400]}>
                  {order.customerEmail}
                </Typography>
              </TableCell>
              <TableCell>{order.status}</TableCell>
              <TableCell align="right">{order.itemCount}</TableCell>
              <TableCell align="right">
                {order.totalPrice.toFixed(2)} {order.currency}
              </TableCell>
              <TableCell align="center">
                <Stack direction="row" spacing={1} justifyContent="center">
                  <IconButton
                    size="small"
                    color="primary"
                    onClick={() => onView(order.id)}
                    title="View details"
                  >
                    <VisibilityIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => onDelete(order.id)}
                    title="Delete order"
                  >
                    <DeleteIcon />
                  </IconButton>
                </Stack>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

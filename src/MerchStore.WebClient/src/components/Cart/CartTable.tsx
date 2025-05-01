import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Avatar,
  Box,
  Typography,
  Paper,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { CartItem } from '../../context/CartProvider';

interface ICartTableProps {
  items: CartItem[];
  onRemove?: (id: string) => void;
  onIncrease?: (id: string) => void;
  onDecrease?: (id: string) => void;
}

export function CartTable(props: ICartTableProps) {
  const total = props.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <Box
      sx={{
        mt: 2,
        width: '100%',
        border: '1px dashed #888',
        borderRadius: 2,
        background: 'rgba(255,255,255,0.02)',
        p: 0,
      }}
    >
      <TableContainer
        component={Paper}
        sx={{ boxShadow: 'none', background: 'transparent' }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <b>Product</b>
              </TableCell>
              <TableCell align="right">
                <b>Price</b>
              </TableCell>
              <TableCell align="center">
                <b>Quantity</b>
              </TableCell>
              <TableCell align="right">
                <b>Subtotal</b>
              </TableCell>
              <TableCell align="center"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {props.items.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar
                      src={item.imageUrl}
                      alt={item.name}
                      variant="square"
                      sx={{ width: 56, height: 56 }}
                    />
                    <Typography>{item.name}</Typography>
                  </Box>
                </TableCell>
                <TableCell align="right">
                  {item.currency}
                  {item.price.toFixed(2)}
                </TableCell>
                <TableCell align="center">
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <IconButton size="small" onClick={() => props.onDecrease?.(item.id)}>
                      <RemoveIcon />
                    </IconButton>
                    <Typography sx={{ mx: 1 }}>{item.quantity}</Typography>
                    <IconButton size="small" onClick={() => props.onIncrease?.(item.id)}>
                      <AddIcon />
                    </IconButton>
                  </Box>
                </TableCell>
                <TableCell align="right">
                  {item.currency}
                  {(item.price * item.quantity).toFixed(2)}
                </TableCell>
                <TableCell align="center">
                  <IconButton color="error" onClick={() => props.onRemove?.(item.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell colSpan={3} align="right"></TableCell>
              <TableCell align="right">
                <Typography component={'p'}>
                  <b>
                    {props.items.length > 0
                      ? `${total.toFixed(2)} ${props.items[0].currency}`
                      : ''}
                  </b>
                </Typography>
              </TableCell>
              <TableCell />
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

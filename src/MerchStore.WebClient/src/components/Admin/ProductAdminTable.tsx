import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  IconButton,
  Avatar,
  Stack,
  Typography,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { IProduct } from '../../interfaces';
import { blue } from '@mui/material/colors';

type Props = {
  products: IProduct[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
};

export default function ProductAdminTable(props: Props) {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="product table">
        <TableHead sx={{ backgroundColor: 'action.hover' }}>
          <TableRow>
            <TableCell sx={{ fontWeight: 'bold' }}>ID</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Description</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }} align={'right'}>
              Price
            </TableCell>
            <TableCell sx={{ fontWeight: 'bold' }} align={'right'}>
              Stock
            </TableCell>
            <TableCell sx={{ fontWeight: 'bold' }} align={'center'}>
              Image
            </TableCell>
            <TableCell sx={{ fontWeight: 'bold' }} align={'center'}>
              Actions
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.products.map((product) => (
            <TableRow
              hover
              key={product.id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell sx={{ fontFamily: 'monospace', color: blue[200] }}>
                {product.id}
              </TableCell>
              <TableCell component={'th'} scope={'row'}>
                {product.name}
              </TableCell>
              <TableCell>{product.description}</TableCell>
              <TableCell align={'right'} sx={{ whiteSpace: 'nowrap' }}>
                <Typography color={'primary'} component={'span'}>
                  {Number(product.price).toFixed(2)} {product.currency}
                </Typography>
              </TableCell>
              <TableCell align={'right'}>{product.stockQuantity}</TableCell>
              <TableCell align={'center'}>
                <Avatar
                  src={product.imageUrl}
                  alt={product.name}
                  variant={'square'}
                  sx={{ width: 50, height: 50, margin: 'auto' }}
                />
              </TableCell>
              <TableCell align={'center'}>
                <Stack direction={'row'} spacing={1} justifyContent={'center'}>
                  <IconButton
                    size={'small'}
                    color={'primary'}
                    onClick={() => props.onEdit(product.id)}
                    title={'Edit'}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    size={'small'}
                    color={'error'}
                    onClick={() => props.onDelete(product.id)}
                    title={'Delete'}
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

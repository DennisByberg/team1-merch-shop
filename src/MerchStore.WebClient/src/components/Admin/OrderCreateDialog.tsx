import {
  Autocomplete,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { IProduct, INewOrder, INewOrderItem } from '../../interfaces';
import { useProducts } from '../../hooks/useProducts';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteIcon from '@mui/icons-material/Delete';
import { grey } from '@mui/material/colors';
import toast from 'react-hot-toast';

interface OrderCreateDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (orderData: INewOrder) => Promise<void>;
}

interface OrderFormState {
  customerInfo: {
    fullName: string;
    email: string;
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
  items: Array<INewOrderItem>;
}

const initialFormState: OrderFormState = {
  customerInfo: {
    fullName: '',
    email: '',
    street: '',
    city: '',
    postalCode: '',
    country: '',
  },
  items: [],
};

export default function OrderCreateDialog(props: OrderCreateDialogProps) {
  const { open, onClose, onSubmit } = props;
  const { products, loading: productsLoading } = useProducts();
  const [formData, setFormData] = useState<OrderFormState>(initialFormState);
  const [selectedProduct, setSelectedProduct] = useState<IProduct | null>(null);
  const [currentQuantity, setCurrentQuantity] = useState<number>(1);
  const [errors, setErrors] = useState<
    Partial<Record<keyof OrderFormState['customerInfo'] | 'items', string>>
  >({});

  useEffect(() => {
    // Reset form when dialog is opened/closed
    if (open) {
      setFormData(initialFormState);
      setSelectedProduct(null);
      setCurrentQuantity(1);
      setErrors({});
    }
  }, [open]);

  const validateForm = (): boolean => {
    const newErrors: Partial<
      Record<keyof OrderFormState['customerInfo'] | 'items', string>
    > = {};
    const { customerInfo, items } = formData;

    if (!customerInfo.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!customerInfo.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(customerInfo.email))
      newErrors.email = 'Email is invalid';
    if (!customerInfo.street.trim()) newErrors.street = 'Street is required';
    if (!customerInfo.city.trim()) newErrors.city = 'City is required';
    if (!customerInfo.postalCode.trim()) newErrors.postalCode = 'Postal code is required';
    if (!customerInfo.country.trim()) newErrors.country = 'Country is required';
    if (items.length === 0)
      newErrors.items = 'At least one product must be added to the order';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCustomerInfoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      customerInfo: { ...prev.customerInfo, [name]: value },
    }));
  };

  const handleAddProductItem = () => {
    // Check if product already exists in items to avoid duplicates, or update quantity
    if (selectedProduct && currentQuantity > 0) {
      const existingItemIndex = formData.items.findIndex(
        (item) => item.productId === selectedProduct.id
      );

      if (existingItemIndex > -1) {
        toast.error(
          `${selectedProduct.name} is already in the order. You can remove it and add again with a new quantity.`
        );

        return;
      }

      const newItem: INewOrderItem = {
        productId: selectedProduct.id,
        productName: selectedProduct.name,
        quantity: currentQuantity,
        unitPrice: selectedProduct.price,
      };
      setFormData((prev) => ({ ...prev, items: [...prev.items, newItem] }));
      setSelectedProduct(null);
      setCurrentQuantity(1);
      if (errors.items) setErrors((prev) => ({ ...prev, items: undefined }));
    }
  };

  const handleRemoveProductItem = (productId: string) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((item) => item.productId !== productId),
    }));
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }
    const orderDataToSubmit: INewOrder = {
      ...formData.customerInfo,
      orderProducts: formData.items.map((item) => ({
        productId: item.productId,
        productName: item.productName,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
      })),
    };

    await onSubmit(orderDataToSubmit);
  };

  const totalOrderAmount = formData.items.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0
  );

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Create New Order</DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ mb: 2 }}>
          Fill in the customer and product details for the new order.
        </DialogContentText>

        <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
          Customer Information
        </Typography>
        <TextField
          name="fullName"
          label="Full Name"
          fullWidth
          margin="normal"
          value={formData.customerInfo.fullName}
          onChange={handleCustomerInfoChange}
          error={!!errors.fullName}
          helperText={errors.fullName}
        />
        <TextField
          name="email"
          label="Email"
          fullWidth
          margin="normal"
          value={formData.customerInfo.email}
          onChange={handleCustomerInfoChange}
          error={!!errors.email}
          helperText={errors.email}
        />
        <TextField
          name="street"
          label="Street Address"
          fullWidth
          margin="normal"
          value={formData.customerInfo.street}
          onChange={handleCustomerInfoChange}
          error={!!errors.street}
          helperText={errors.street}
        />
        <TextField
          name="city"
          label="City"
          fullWidth
          margin="normal"
          value={formData.customerInfo.city}
          onChange={handleCustomerInfoChange}
          error={!!errors.city}
          helperText={errors.city}
        />
        <TextField
          name="postalCode"
          label="Postal Code"
          fullWidth
          margin="normal"
          value={formData.customerInfo.postalCode}
          onChange={handleCustomerInfoChange}
          error={!!errors.postalCode}
          helperText={errors.postalCode}
        />
        <TextField
          name="country"
          label="Country"
          fullWidth
          margin="normal"
          value={formData.customerInfo.country}
          onChange={handleCustomerInfoChange}
          error={!!errors.country}
          helperText={errors.country}
        />

        <Typography variant="h6" gutterBottom sx={{ mt: 3, mb: 1 }}>
          Add Products
        </Typography>
        {errors.items && (
          <Typography color="error" variant="body2" sx={{ mb: 1 }}>
            {errors.items}
          </Typography>
        )}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Autocomplete
            sx={{ flexGrow: 1 }}
            options={products.filter((p) => p.inStock && p.stockQuantity > 0)}
            getOptionLabel={(option) => `${option.name} (Stock: ${option.stockQuantity})`}
            value={selectedProduct}
            onChange={(_event, newValue) => {
              setSelectedProduct(newValue);
            }}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            renderInput={(params) => (
              <TextField {...params} label="Select Product" variant="outlined" />
            )}
            loading={productsLoading}
            disabled={productsLoading}
          />
          <TextField
            label="Quantity"
            type="number"
            value={currentQuantity}
            onChange={(e) =>
              setCurrentQuantity(Math.max(1, parseInt(e.target.value, 10) || 1))
            }
            InputProps={{ inputProps: { min: 1 } }}
            sx={{ width: 120 }}
            disabled={!selectedProduct}
          />
          <Button
            variant="contained"
            onClick={handleAddProductItem}
            disabled={!selectedProduct || currentQuantity <= 0}
            startIcon={<AddCircleOutlineIcon />}
          >
            Add
          </Button>
        </Box>

        {formData.items.length > 0 && (
          <>
            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
              Order Items
            </Typography>
            <TableContainer component={Paper} variant="outlined">
              <Table size="small">
                <TableHead sx={{ backgroundColor: grey[800] }}>
                  <TableRow>
                    <TableCell>Product</TableCell>
                    <TableCell align="right">Quantity</TableCell>
                    <TableCell align="right">Unit Price</TableCell>
                    <TableCell align="right">Subtotal</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {formData.items.map((item) => (
                    <TableRow key={item.productId}>
                      <TableCell>{item.productName}</TableCell>
                      <TableCell align="right">{item.quantity}</TableCell>
                      <TableCell align="right">
                        {item.unitPrice.toFixed(2)} {'SEK'}
                      </TableCell>
                      <TableCell align="right">
                        {(item.unitPrice * item.quantity).toFixed(2)} {'SEK'}{' '}
                      </TableCell>
                      <TableCell align="center">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleRemoveProductItem(item.productId)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow sx={{ backgroundColor: grey[900] }}>
                    <TableCell colSpan={3} align="right">
                      <Typography fontWeight="bold">Total:</Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography fontWeight="bold">
                        {totalOrderAmount.toFixed(2)} {'SEK'}
                      </Typography>
                    </TableCell>
                    <TableCell />
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="success"
          disabled={formData.items.length === 0}
        >
          Create Order
        </Button>
      </DialogActions>
    </Dialog>
  );
}

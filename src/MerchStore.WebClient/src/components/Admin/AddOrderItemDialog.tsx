import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  CircularProgress,
  Typography,
  SelectChangeEvent,
} from '@mui/material';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { fetchProducts } from '../../api/productApi';
import { IProduct } from '../../interfaces';

interface AddOrderItemDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (itemData: { productId: string; quantity: number }) => Promise<void>;
}

export default function AddOrderItemDialog({
  open,
  onClose,
  onSave,
}: AddOrderItemDialogProps) {
  const [formData, setFormData] = useState({
    productId: '',
    quantity: 1,
  });
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load products when dialog opens
  useEffect(() => {
    if (open) {
      loadProducts();
    }
  }, [open]);

  const loadProducts = async () => {
    setLoadingProducts(true);
    setError(null);
    try {
      const productsData = await fetchProducts();
      // Only show products that are in stock
      const availableProducts = productsData.filter(
        (p) => p.inStock && p.stockQuantity > 0
      );
      setProducts(availableProducts);
    } catch (err) {
      console.error('Failed to load products:', err);
      setError('Failed to load products. Please try again.');
      toast.error('Failed to load products');
    } finally {
      setLoadingProducts(false);
    }
  };

  const handleProductChange = (event: SelectChangeEvent) => {
    setFormData({
      ...formData,
      productId: event.target.value as string,
    });
  };

  const handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value, 10);
    if (!isNaN(value) && value > 0) {
      setFormData({
        ...formData,
        quantity: value,
      });
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!formData.productId) {
      toast.error('Please select a product');
      return;
    }

    if (formData.quantity <= 0) {
      toast.error('Quantity must be greater than 0');
      return;
    }

    setLoading(true);
    try {
      await onSave(formData);
      toast.success('Item added to order');
      onClose();
    } catch (err) {
      console.error('Failed to add item to order:', err);
      toast.error('Failed to add item to order');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>Add Item to Order</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            {loadingProducts ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
                <CircularProgress />
              </Box>
            ) : error ? (
              <Typography color="error" gutterBottom>
                {error}
              </Typography>
            ) : (
              <>
                <FormControl fullWidth margin="normal">
                  <InputLabel id="product-select-label">Product</InputLabel>
                  <Select
                    labelId="product-select-label"
                    id="product-select"
                    value={formData.productId}
                    label="Product"
                    onChange={handleProductChange}
                    disabled={loading}
                  >
                    {products.map((product) => (
                      <MenuItem key={product.id} value={product.id}>
                        {product.name} - {product.price.toFixed(2)} {product.currency} (In
                        stock: {product.stockQuantity})
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <TextField
                  fullWidth
                  label="Quantity"
                  type="number"
                  value={formData.quantity}
                  onChange={handleQuantityChange}
                  margin="normal"
                  inputProps={{ min: 1 }}
                  disabled={loading}
                />
              </>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading || loadingProducts || products.length === 0}
          >
            {loading ? 'Adding...' : 'Add Item'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
} from '@mui/material';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

interface EditShippingAddressDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (shippingData: {
    street: string;
    postalCode: string;
    city: string;
    country: string;
  }) => Promise<void>;
  initialData: {
    street: string;
    postalCode: string;
    city: string;
    country: string;
  };
}

export default function EditShippingAddressDialog({
  open,
  onClose,
  onSave,
  initialData,
}: EditShippingAddressDialogProps) {
  const [formData, setFormData] = useState({
    street: '',
    postalCode: '',
    city: '',
    country: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      setFormData({
        street: initialData.street,
        postalCode: initialData.postalCode,
        city: initialData.city,
        country: initialData.country,
      });
    }
  }, [open, initialData]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (
      !formData.street.trim() ||
      !formData.postalCode.trim() ||
      !formData.city.trim() ||
      !formData.country.trim()
    ) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSave(formData);
      toast.success('Shipping address updated successfully');
      onClose();
    } catch (error) {
      console.error('Failed to update shipping address:', error);
      toast.error('Failed to update shipping address');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>Edit Shipping Address</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <TextField
              fullWidth
              label="Street Address"
              name="street"
              value={formData.street}
              onChange={handleChange}
              margin="normal"
              required
              disabled={isSubmitting}
            />
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                fullWidth
                label="Postal Code"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleChange}
                margin="normal"
                required
                disabled={isSubmitting}
              />
              <TextField
                fullWidth
                label="City"
                name="city"
                value={formData.city}
                onChange={handleChange}
                margin="normal"
                required
                disabled={isSubmitting}
              />
            </Box>
            <TextField
              fullWidth
              label="Country"
              name="country"
              value={formData.country}
              onChange={handleChange}
              margin="normal"
              required
              disabled={isSubmitting}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

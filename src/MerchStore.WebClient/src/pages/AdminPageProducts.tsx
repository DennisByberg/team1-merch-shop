import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  SxProps,
} from '@mui/material';
import React, { useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import ProductAdminTable from '../components/Admin/ProductAdminTable';
import ProductCreateDialog from '../components/Admin/ProductCreateDialog';
import CustomSpinner from '../components/CustomSpinner';
import PageBreadcrumbs from '../components/PageBreadcrumbs';
import { useProducts } from '../hooks/useProducts';
import { validateProductForm } from '../utils/validateProductForm';
import { INewProductForm } from '../types/globalInterfaces';
import CircularProgress from '@mui/material/CircularProgress';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function AdminPageProducts() {
  const initialProductFormState: INewProductForm = {
    name: '',
    description: '',
    price: '',
    stockQuantity: '',
    imageUrl: '',
    currency: 'SEK',
  };
  const { products, loading, addProduct, deleteProduct, updateProduct } = useProducts();
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [newProduct, setNewProduct] = useState<INewProductForm>(initialProductFormState);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [deleting, setDeleting] = useState(false);
  const navigate = useNavigate();
  const [editProductId, setEditProductId] = useState<string | null>(null);
  const [originalProduct, setOriginalProduct] = useState<INewProductForm | null>(null);

  const isFormValid = useMemo(
    () => Object.keys(validateProductForm(newProduct)).length === 0,
    [newProduct]
  );

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    const updated = { ...newProduct, [name]: value };
    setNewProduct(updated);
    setErrors(validateProductForm(updated));
  };

  const handleInputBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    const { name } = event.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const handleClickOpenCreateDialog = () => {
    setNewProduct(initialProductFormState);
    setOriginalProduct(null);
    setOpenCreateDialog(true);
  };

  const handleCloseCreateDialog = () => {
    setOpenCreateDialog(false);
    setEditProductId(null);
  };

  const handleCreateOrUpdateProductSubmit = async () => {
    try {
      const productToSave = {
        ...newProduct,
        price: parseFloat(newProduct.price),
        stockQuantity: parseInt(newProduct.stockQuantity, 10),
      };
      if (editProductId) {
        // Update
        await updateProduct?.(editProductId, productToSave);
        toast.success('Product updated!');
      } else {
        // Create
        await addProduct?.(productToSave);
        toast.success('Product created!');
      }
      handleCloseCreateDialog();
    } catch {
      toast.error('Failed to save product!');
    }
  };

  // UPDATE
  const handleEditProduct = (id: string) => {
    const product = products.find((p) => p.id === id);
    if (!product) return;
    setEditProductId(id);
    const formProduct = {
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      stockQuantity: product.stockQuantity.toString(),
      imageUrl: product.imageUrl ?? '',
      currency: product.currency,
    };
    setNewProduct(formProduct);
    setOriginalProduct(formProduct);
    setOpenCreateDialog(true);
  };

  // Called from table when user clicks delete
  const handleAskDeleteProduct = (id: string) => {
    const product = products.find((p) => p.id === id);
    if (product) setProductToDelete({ id: product.id, name: product.name });
    setDeleteDialogOpen(true);
  };

  // Called when user confirms delete
  const handleConfirmDelete = async () => {
    if (!productToDelete) return;
    setDeleting(true);
    try {
      await deleteProduct?.(productToDelete.id);
      toast.success(`Deleted product "${productToDelete.name}"!`);
    } catch {
      toast.error('Failed to delete product!');
    }
    setDeleting(false);
    setDeleteDialogOpen(false);
    setProductToDelete(null);
  };

  // Called when user cancels
  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
    setProductToDelete(null);
  };

  function isProductUnchanged(a: INewProductForm | null, b: INewProductForm): boolean {
    if (!a) return false;
    return (
      a.name === b.name &&
      a.description === b.description &&
      a.price === b.price &&
      a.stockQuantity === b.stockQuantity &&
      a.imageUrl === b.imageUrl &&
      a.currency === b.currency
    );
  }

  return (
    <Box>
      <PageBreadcrumbs />
      {loading ? (
        <CustomSpinner text="Loading products..." />
      ) : (
        <>
          {/* Container for Back and Add New Product buttons */}
          <Box sx={BUTTON_ROW_STYLE}>
            <Button
              color={'inherit'}
              variant={'outlined'}
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate('/admin')}
            >
              Back to admin dashboard
            </Button>

            <Button
              variant={'contained'}
              color={'primary'}
              startIcon={<AddCircleOutlineIcon />}
              onClick={handleClickOpenCreateDialog}
            >
              New Product
            </Button>
          </Box>

          {/* Create Product Dialog */}
          <ProductCreateDialog
            open={openCreateDialog}
            newProduct={newProduct}
            onChange={handleInputChange}
            onClose={handleCloseCreateDialog}
            onSubmit={handleCreateOrUpdateProductSubmit}
            errors={errors}
            touched={touched}
            onBlur={handleInputBlur}
            isFormValid={isFormValid}
            editMode={!!editProductId}
            isUnchanged={
              editProductId ? isProductUnchanged(originalProduct, newProduct) : false
            }
          />

          {/* Product Admin Table */}
          <ProductAdminTable
            products={products}
            onEdit={handleEditProduct}
            onDelete={handleAskDeleteProduct}
          />

          {/* Delete confirmation dialog */}
          <Dialog open={deleteDialogOpen} onClose={handleCancelDelete}>
            <DialogTitle>Delete Product</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Are you sure you want to delete <b>{productToDelete?.name}</b>? This
                action cannot be undone.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCancelDelete} color={'inherit'} disabled={deleting}>
                Cancel
              </Button>
              <Button
                onClick={handleConfirmDelete}
                color={'error'}
                variant={'contained'}
                disabled={deleting}
                startIcon={
                  deleting ? <CircularProgress size={20} color={'inherit'} /> : null
                }
              >
                Delete
              </Button>
            </DialogActions>
          </Dialog>
        </>
      )}
    </Box>
  );
}

/*━━━━━━━━━━━━ Styling ━━━━━━━━━━━━*/
const BUTTON_ROW_STYLE: SxProps = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  mb: 3,
  mt: 3,
};

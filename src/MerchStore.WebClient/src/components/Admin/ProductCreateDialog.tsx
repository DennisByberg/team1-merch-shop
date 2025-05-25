import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  TextField,
  CircularProgress,
} from '@mui/material';

interface NewProductForm {
  name: string;
  description: string;
  price: string;
  stockQuantity: string;
  imageUrl: string;
  currency: string;
}

interface ProductCreateDialogProps {
  open: boolean;
  newProduct: NewProductForm;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onClose: () => void;
  onSubmit: () => void;
  errors?: { [key: string]: string };
  touched?: { [key: string]: boolean };
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  isFormValid?: boolean;
  editMode?: boolean;
  isUnchanged?: boolean;
  isCreating?: boolean;
}

export default function ProductCreateDialog(props: ProductCreateDialogProps) {
  const { errors = {}, isFormValid = true, touched = {}, isCreating = false } = props;
  return (
    <Dialog open={props.open} onClose={!isCreating ? props.onClose : undefined}>
      <DialogTitle>{props.editMode ? 'Edit Product' : 'Add New Product'}</DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ mb: 2 }}>
          Fill in the details for the {props.editMode ? 'product' : 'new product'}.
        </DialogContentText>
        <TextField
          name={'name'}
          label={'Product Name'}
          type={'text'}
          fullWidth
          variant={'outlined'}
          value={props.newProduct.name}
          onChange={props.onChange}
          onBlur={props.onBlur}
          sx={getValidSx(props.newProduct.name, touched.name ? errors.name : undefined, {
            mb: 2,
          })}
          error={!!errors.name && touched.name}
          helperText={touched.name && errors.name ? errors.name : ''}
          color={props.newProduct.name && !errors.name ? 'success' : 'primary'}
        />
        <TextField
          name={'description'}
          label={'Description'}
          type={'text'}
          fullWidth
          multiline
          rows={3}
          variant={'outlined'}
          value={props.newProduct.description}
          onChange={props.onChange}
          onBlur={props.onBlur}
          sx={getValidSx(
            props.newProduct.description,
            touched.description ? errors.description : undefined,
            { mb: 2 }
          )}
          error={!!errors.description && touched.description}
          helperText={touched.description && errors.description ? errors.description : ''}
          color={
            props.newProduct.description && !errors.description ? 'success' : 'primary'
          }
        />
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <TextField
            name={'price'}
            label={'Price'}
            type={'number'}
            fullWidth
            variant={'outlined'}
            value={props.newProduct.price}
            onChange={props.onChange}
            onBlur={props.onBlur}
            error={!!errors.price && touched.price}
            helperText={touched.price && errors.price ? errors.price : ''}
            sx={getValidSx(
              props.newProduct.price,
              touched.price ? errors.price : undefined,
              { flex: 1 }
            )}
            color={props.newProduct.price && !errors.price ? 'success' : 'primary'}
          />
          <TextField
            name={'currency'}
            label={'Currency'}
            type={'text'}
            fullWidth
            variant={'outlined'}
            value={'SEK'}
            disabled
            sx={{ flex: 1 }}
          />
        </Box>
        <TextField
          name={'stockQuantity'}
          label={'Stock Quantity'}
          type={'number'}
          fullWidth
          variant={'outlined'}
          value={props.newProduct.stockQuantity}
          onChange={props.onChange}
          onBlur={props.onBlur}
          sx={getValidSx(
            props.newProduct.stockQuantity,
            touched.stockQuantity ? errors.stockQuantity : undefined,
            { mb: 2 }
          )}
          error={!!errors.stockQuantity && touched.stockQuantity}
          helperText={
            touched.stockQuantity && errors.stockQuantity ? errors.stockQuantity : ''
          }
          color={
            props.newProduct.stockQuantity && !errors.stockQuantity
              ? 'success'
              : 'primary'
          }
        />
        <TextField
          name={'imageUrl'}
          label={'Image URL'}
          type={'text'}
          fullWidth
          variant={'outlined'}
          value={props.newProduct.imageUrl}
          onChange={props.onChange}
          onBlur={props.onBlur}
          sx={getValidSx(
            props.newProduct.imageUrl,
            touched.imageUrl ? errors.imageUrl : undefined,
            { mb: 2 }
          )}
          error={!!errors.imageUrl && touched.imageUrl}
          helperText={touched.imageUrl && errors.imageUrl ? errors.imageUrl : ''}
          color={props.newProduct.imageUrl && !errors.imageUrl ? 'success' : 'primary'}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={props.onClose} disabled={isCreating}>
          Cancel
        </Button>
        <Button
          onClick={props.onSubmit}
          variant={'contained'}
          color={'success'}
          disabled={!isFormValid || (props.editMode && props.isUnchanged) || isCreating}
          startIcon={
            isCreating ? <CircularProgress size={20} color="inherit" /> : undefined
          }
        >
          {isCreating
            ? props.editMode
              ? 'Updating...'
              : 'Creating...'
            : props.editMode
            ? 'Update'
            : 'Create'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

/*━━━━━━━━━━━━ Styling ━━━━━━━━━━━━*/
function getValidSx(value: string, error?: string, extraSx?: object) {
  return {
    ...extraSx,
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: value && !error ? 'success.main' : undefined,
    },
    '& .MuiOutlinedInput-root': {
      backgroundColor: 'transparent',
    },
    '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: value && !error ? 'success.main' : undefined,
    },
    '& .Mui-focused': {
      backgroundColor: 'transparent',
    },
  };
}

import { INewProductForm } from '../types/globalInterfaces';

export function validateProductForm(product: INewProductForm) {
  const newErrors: { [key: string]: string } = {};
  if (!product.name.trim()) newErrors.name = 'Name is required';
  if (!product.description.trim()) newErrors.description = 'Description is required';
  if (!product.price || isNaN(Number(product.price)) || Number(product.price) <= 0)
    newErrors.price = 'Price must be a positive number';
  if (
    !product.stockQuantity ||
    isNaN(Number(product.stockQuantity)) ||
    Number(product.stockQuantity) < 0
  )
    newErrors.stockQuantity = 'Stock must be 0 or more';
  if (!product.imageUrl.trim()) newErrors.imageUrl = 'Image URL is required';
  // Optionally: validate imageUrl is a valid URL
  return newErrors;
}

export interface Brand {
  id: string;
  name: string;
  description?: string;
}

export interface Category {
  id: string;
  name: string;
  parentId?: string;
  sustainabilityTag?: string;
  children?: Category[];
}

export interface Product {
  id: string;
  brandId: string;
  categoryId: string;
  name: string;
  description: string;
  materials: string[];
  status: ProductStatus;
  brand?: Brand;
  category?: Category;
  variants?: ProductVariant[];
  images?: ProductImage[];
  averageRating?: number;
  reviewCount?: number;
  createdAt: Date;
  updatedAt: Date;
}

export type ProductStatus = 'active' | 'inactive' | 'draft';

export interface ProductVariant {
  id: string;
  productId: string;
  sku: string;
  attributes: Record<string, string>;
  price: number;
  stockQty: number;
  createdAt: Date;
}

export interface ProductImage {
  id: string;
  productId: string;
  url: string;
  sortOrder: number;
}

export interface ProductFilter {
  category?: string;
  brand?: string;
  priceMin?: number;
  priceMax?: number;
  sustainability?: string;
  search?: string;
  page?: number;
  limit?: number;
}

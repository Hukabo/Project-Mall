import { Category } from "../category";

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  thumbnail: string;
  category: Category;
  productViews: ProductView[];
}

export interface PageResponse {
  products: Product[];
  limit: number;
  total: number;
  hasNext: boolean;
}

export interface ProductView {
  id: number;
  color: string;
  images: Image[];
  productSpecs: ProductSpec[];
  product: Product;
}

export interface ProductSpec {
  id: number;
  size: string;
  stock: number;
  productView: ProductView;
}

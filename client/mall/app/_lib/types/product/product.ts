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

interface ProductView {
  id: number;
  color: string;
  images: Image[];
  productSpecs: ProductSpec[];
}

interface ProductSpec {
  size: string;
  stock: number | string;
}

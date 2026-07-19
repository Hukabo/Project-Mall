import { Category } from "./category";

export interface Product {
  id: number;
  name: string;
  description: string;
  stock: number;
  price: number;
  images: string[];
  category: Category;
  createdAt: string;
}

export interface PageResponse {
  products: Product[];
  limit: number;
  total: number;
  hasNext: boolean;
}

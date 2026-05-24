export interface Product {
  id?: number | string;
  name?: string;
  price?: number | null;
  description?: string;
  image?: string;
  [key: string]: any;
}

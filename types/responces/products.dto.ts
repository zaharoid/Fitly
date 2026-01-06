export type Product = {
  id: string;
  name: string;
  description: string;
  carbs: number;
  createdAt: string;
  fat: number;
  imageUrl: string;
  kcal: number;
  nameKey: string;
  protein: number;
  servingQty: number;
}

export type DtoProducts = { items: Product[] };
export type Menu = {
  id: string;
  name: string;
  category: string;
  calories: number | null;
  protein: string | null;
  fat?: string | null; // Saya tambahkan ini karena ada input 'fat' di form asli
  description: string | null;
  image: string | null;
  ingredients: string | null;
};

export type Category = {
  name: string;
  label: string;
  icon: any;
};

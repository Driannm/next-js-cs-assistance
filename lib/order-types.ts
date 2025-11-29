export interface Order {
    customerId: string;
    customerName: string;
    address: string;
    status: string; // "pending" | "cooking" | "sent"
    menuName?: string;
    menuId?: string;
    note?: string;
    hasMenu: boolean;
  }
  
  export interface Menu {
    id: string;
    name: string;
  }
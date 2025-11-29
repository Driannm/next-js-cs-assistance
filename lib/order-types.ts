export interface Order {
    customerId: string;
    customerName: string;
    address: string;
    status: string;
    menuName?: string;
    menuId?: string;
    note?: string;
    hasMenu: boolean;
  }
  
  export interface Menu {
    id: string;
    name: string;
    category: string;
  }


export interface ISize {
    id?: string;

  size: string;

}
  
export interface ISizeItem {
  id?: string;
  sizeId: string;
  Size?: { size: string }; 
  quantity: number;
}
  
  
  
  
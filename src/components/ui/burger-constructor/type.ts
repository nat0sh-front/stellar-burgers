import { TOrder } from '@utils-types';
import { TConstructorState } from '../../../services/slices/constructorSlice';

export type BurgerConstructorUIProps = {
  constructorItems: TConstructorState;
  orderRequest: boolean;
  price: number;
  orderModalData: TOrder | null;
  onOrderClick: () => void;
  closeOrderModal: () => void;
};

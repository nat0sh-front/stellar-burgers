import { FC, memo, useEffect } from 'react';

import { OrdersListProps } from './type';
import { OrdersListUI, Preloader } from '@ui';
import { useDispatch, useSelector } from '../../services/store';
import {
  getIngredients,
  getIngredientsThunk,
  getIsIngredientsLoading
} from '../../services/slices/ingredientsSlice';

export const OrdersList: FC<OrdersListProps> = memo(({ orders }) => {
  const dispatch = useDispatch();
  const ingredients = useSelector(getIngredients);
  const isIngredientsLoading = useSelector(getIsIngredientsLoading);

  useEffect(() => {
    dispatch(getIngredientsThunk());
  }, [dispatch]);

  const orderByDate = [...orders].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  if (isIngredientsLoading) {
    return <Preloader />;
  }

  return <OrdersListUI orderByDate={orderByDate} ingredients={ingredients} />;
});

import { FC, useEffect, useMemo } from 'react';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';
import { useDispatch, useSelector } from '../../services/store';
import { getOrder, getOrderByNumberThunk } from '../../services/slices/orderSlice';
import { getIngredients, getIngredientsThunk } from '../../services/slices/ingredientsSlice';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Modal } from '../modal';
import { getOrders } from '../../services/slices/feedSlice';

export const OrderInfo: FC = () => {
  /** TODO: взять переменные orderData и ingredients из стора */
  const dispatch = useDispatch();
  const { number } = useParams();
  const ingredients = useSelector(getIngredients);
  const orders = useSelector(getOrders);
  const orderData = orders.find(
    (order) => order.number === Number(number)
  );
 
  useEffect(() => {
    dispatch(getIngredientsThunk());
    dispatch(getOrderByNumberThunk(Number(number)));
  }, [dispatch])

  console.log(orderData, ingredients)

  /* Готовим данные для отображения */
  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};

export const OrderInfoModal: FC = () => {
  const { number } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const background = location.state?.background;

  return (
    <Modal
      title={`#${number}`}
      onClose={() => {
        if (background) {
          navigate(-1);
        } else {
          navigate('/feed');
        }
      }}
    >
      <OrderInfo />
    </Modal>
  );
};

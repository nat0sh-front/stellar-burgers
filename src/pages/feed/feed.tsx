import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { getAllOrdersThunk } from '../../services/slices/feedSlice';
import { useDispatch, useSelector } from '../../services/store';

export const Feed: FC = () => {
  const dispatch = useDispatch();
  const { feed, isFeedLoading } = useSelector((state) => state.feed);

  useEffect(() => {
    dispatch(getAllOrdersThunk());
  }, [dispatch]);

  if (isFeedLoading || !feed) {
    return <Preloader />;
  }

  const orders: TOrder[] = feed.orders;

  return (
    <FeedUI orders={orders} handleGetFeeds={() => dispatch(getAllOrdersThunk())} />
  );
};

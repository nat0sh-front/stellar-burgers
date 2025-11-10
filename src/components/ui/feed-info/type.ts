import { TOrdersData } from '@utils-types';
import { TFeedState } from '../../../services/slices/feedSlice';

export type FeedInfoUIProps = {
  feed: TOrdersData;
  readyOrders: number[];
  pendingOrders: number[];
};

export type HalfColumnProps = {
  orders: number[];
  title: string;
  textColor?: string;
};

export type TColumnProps = {
  title: string;
  content: number;
};

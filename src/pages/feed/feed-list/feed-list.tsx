import { NoDataPanel } from '../../../components/no-data/no-data-panel';
import { OrderCard } from '../../../components/order-card/order-card';

import type { TOrder } from '../../../utils/order-types';

import styles from '../feed.module.css';

type TFeedListProps = {
  data?: TOrder[];
};

export const FeedList = ({ data }: TFeedListProps) => {
  return (
    <div className={styles.orders_container}>
      {data && data.length > 0 ? (
        <div className={styles.orders_flow}>
          {data.map((d) => (
            <OrderCard key={`feed_card_${d._id}`} data={d} redirectLink="feed" />
          ))}
        </div>
      ) : (
        <NoDataPanel />
      )}
    </div>
  );
};

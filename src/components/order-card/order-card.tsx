import { CurrencyIcon } from '@krgaa/react-developer-burger-ui-components';
import { Link, useLocation } from 'react-router-dom';

import { formatDate } from '../../utils';
import { IngredientImage } from '../ingredient-image/ingredient-image';

import type { TOrder, TOrderIngredient } from '../../utils/order-types';

import styles from './order-card.module.css';

type TOrderCardProps = {
  data: TOrder;
  redirectLink: string;
};

const firstFive = (all: TOrderIngredient[]) => all?.slice(0, 10);

export const OrderCard = ({ data, redirectLink }: TOrderCardProps) => {
  const location = useLocation();

  return (
    <Link to={`/${redirectLink}/${data.number}`} state={{ background: location }} className={styles.card_root}>
      <p className={`${styles.card_header} text text_type_digits-default`}>
        #{data.number}{' '}
        <time className="text text_type_main-default text_color_inactive">{formatDate(data.createdAt)}</time>
      </p>
      <h2 className={`${styles.card_title} text text_type_main-medium`}>{data.name}</h2>
      <div className={styles.card_details}>
        {data.ingredientsInfo && (
          <div className={styles.card_ingredients_list}>
            {firstFive(data.ingredientsInfo)
              .reverse()
              .map((ing, i) => (
                <IngredientImage key={`${ing.id}-${data._id}-${i}`} src={ing.img} />
              ))}
          </div>
        )}
        <p className={styles.card_price_container}>
          <span className={`${styles.card_price} text text_type_digits-default`}>{data.price ?? '–'}</span>
          <CurrencyIcon type="primary" />
        </p>
      </div>
    </Link>
  );
};

import acceptIcon from '../../images/order-accept.svg';

import styles from './order-details.module.css';

export const OrderDetails = (): React.JSX.Element | null => {
  return (
    <div>
      <p
        className={`${styles.order_num} text text_type_digits-large pt-20 pb-8 pl-20 pr-20`}
      >
        {Math.floor(Math.random() * 1000000)}
      </p>
      <p className="text text_type_main-medium">идентификатор заказа</p>
      <img
        src={acceptIcon}
        alt="Заказ сформирован!"
        className={`${styles.order_ok} m-15`}
      />
      <p className="text text_type_main-default mb-2">Ваш заказ начали готовить</p>
      <p className="text text_type_main-default text_color_inactive pb-20">
        Дождитесь готовности на орбитальной станции
      </p>
    </div>
  );
};

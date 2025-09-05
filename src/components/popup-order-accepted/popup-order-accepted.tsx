import { CloseIcon } from '@krgaa/react-developer-burger-ui-components';
import { createPortal } from 'react-dom';

import acceptIcon from '../../images/order-accept.svg';

import styles from './popup-order-accepted.module.css';

type TPopupOrderAcceptedProps = {
  isOpen: boolean;
  onClose: () => void;
};

export const PopupOrderAccepted = ({
  isOpen,
  onClose,
}: TPopupOrderAcceptedProps): React.JSX.Element | null => {
  if (!isOpen) {
    return null;
  }

  const modalRoot = document.getElementById('underoot-modals');

  if (!modalRoot) {
    console.error("На странице потерялся элемент 'underoot-modals'.");
    return null;
  }

  return createPortal(
    <div className={`${styles.order_root} p-10`}>
      <CloseIcon
        type="secondary"
        className={`${styles.order_close} pt-4`}
        onClick={onClose}
      />
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
    </div>,
    modalRoot
  );
};

import { CloseIcon } from '@krgaa/react-developer-burger-ui-components';
import { useEffect } from 'react';
import { createPortal } from 'react-dom';

import { ModalOverlay } from '../modal-overlay/modal-overlay';

import styles from './modal.module.css';

type TModalProps = {
  onClose: () => void;
};

export const Modal = ({
  children,
  onClose,
}: React.PropsWithChildren<TModalProps>): React.JSX.Element | null => {
  useEffect(() => {
    function checkEscapeAndClose(ev: KeyboardEvent): void {
      if (ev.key === 'Escape') {
        onClose();
      }
    }

    document.body.addEventListener('keydown', checkEscapeAndClose);

    return (): void => {
      document.body.removeEventListener('keydown', checkEscapeAndClose);
    };
  }, []);

  const modalRoot = document.getElementById('underoot-modals');

  if (!modalRoot) {
    console.error("На странице потерялся элемент 'underoot-modals'.");
    return null;
  }

  return createPortal(
    <div className={`${styles.modal_root} p-10`}>
      <CloseIcon
        type="secondary"
        className={`${styles.modal_close} pt-4`}
        onClick={() => onClose()}
      />
      <ModalOverlay onClick={() => onClose()} />
      {children}
    </div>,
    modalRoot
  );
};

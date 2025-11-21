import { createPortal } from 'react-dom';

import styles from './modal-overlay.module.css';

type TModalOverlayProps = {
  onClick: () => void;
};

export const ModalOverlay = ({ onClick }: TModalOverlayProps): React.JSX.Element | null => {
  const modalRoot = document.getElementById('underoot-overlay');

  if (!modalRoot) {
    console.error("На странице потерялся элемент 'underoot-overlay'.");
    return null;
  }

  return createPortal(<div className={styles.modal_overlay_root} onClick={onClick}></div>, modalRoot);
};

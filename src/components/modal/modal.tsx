import { createPortal } from 'react-dom';

type TModalProps = {
  isOpen: boolean;
};

export const Modal = ({
  isOpen,
  children,
}: React.PropsWithChildren<TModalProps>): React.JSX.Element | null => {
  if (!isOpen) {
    return null;
  }

  const modalRoot = document.getElementById('underoot-modals');

  if (!modalRoot) {
    console.error("На странице потерялся элемент 'underoot-modals'.");
    return null;
  }

  return createPortal(children, modalRoot);
};

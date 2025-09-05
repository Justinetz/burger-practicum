import { createPortal } from 'react-dom';

type TPopupOverlayProps = {
  isOpen: boolean;
};

export const PopupOverlay = ({
  isOpen,
}: TPopupOverlayProps): React.JSX.Element | null => {
  if (!isOpen) {
    return null;
  }

  const modalRoot = document.getElementById('underoot-overlay');

  if (!modalRoot) {
    console.error("На странице потерялся элемент 'underoot-overlay'.");
    return null;
  }

  return createPortal(
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: ' rgba(0, 0, 0, 0.6)',
      }}
    ></div>,
    modalRoot
  );
};

import { useRef, useCallback } from 'react';

type ClickHandler = (e: React.MouseEvent) => void;

const useClickPreventionOnDoubleClick = (onClick: ClickHandler, onDoubleClick: ClickHandler): [ClickHandler, ClickHandler] => {
  const api = useRef({
    click: true,
    timer: 0,
    prevent: false
  });

  const clickHandler = useCallback((e: React.MouseEvent) => {
    api.current.prevent = false;
    api.current.timer = window.setTimeout(() => {
      if (!api.current.prevent) {
        onClick(e);
      }
      api.current.prevent = false;
    }, 200); // 200ms delay to wait for double click
  }, [onClick]);

  const doubleClickHandler = useCallback((e: React.MouseEvent) => {
    window.clearTimeout(api.current.timer);
    api.current.prevent = true;
    onDoubleClick(e);
  }, [onDoubleClick]);

  return [clickHandler, doubleClickHandler];
};

export default useClickPreventionOnDoubleClick;

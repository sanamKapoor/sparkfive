import { useEffect, useRef } from "react";

interface ClickOutsideProps {
  children: React.ReactNode;
  onClick: (e: MouseEvent) => void;
  className?: string;
  exceptionRef?: React.MutableRefObject<React.ReactNode>;
}

const ClickOutside: React.FC<ClickOutsideProps> = ({
  children,
  onClick,
  className,
  exceptionRef,
}) => {
  const wrapperRef = useRef();

  useEffect(() => {
    document.addEventListener("mousedown", handleClickListener);

    return () => {
      document.removeEventListener("mousedown", handleClickListener);
    };
  }, []);

  const handleClickListener = (event: MouseEvent) => {
    let clickedInside;
    if (exceptionRef) {
      clickedInside =
        wrapperRef?.current?.contains(event.target) ||
        exceptionRef?.current === event.target ||
        exceptionRef?.current?.contains(event.target);
    } else {
      clickedInside = wrapperRef?.current?.contains(event.target);
    }

    if (clickedInside) return;
    else onClick(event);
  };

  return (
    <div ref={wrapperRef} className={`${className || ""}`}>
      {children}
    </div>
  );
};

export default ClickOutside;

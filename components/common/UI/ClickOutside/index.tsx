import { useEffect, useRef } from "react";

interface ClickOutsideProps {
  children: React.ReactNode;
  onClick: (e: MouseEvent) => void;
  className: string;
}

const ClickOutside: React.FC<ClickOutsideProps> = ({
  children,
  onClick,
  className,
}) => {
  const wrapperRef = useRef();

  useEffect(() => {
    document.addEventListener("mousedown", handleClickListener);

    return () => {
      document.removeEventListener("mousedown", handleClickListener);
    };
  }, []);

  const handleClickListener = (event: MouseEvent) => {
    const clickedInside = wrapperRef?.current?.contains(event.target);

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

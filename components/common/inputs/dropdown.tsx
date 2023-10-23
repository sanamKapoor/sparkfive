import { useContext, useEffect, useRef } from "react";
import { UserContext } from "../../../context";
import styles from "./dropdown.module.css";

const Dropdown = ({ options = [], additionalClass = "", onClickOutside, svgIcon = false }) => {
  const { hasPermission } = useContext(UserContext);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        onClickOutside && onClickOutside();
      }
    };
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, [onClickOutside]);

  return (
    <ul className={`${styles.menu} ${additionalClass}`} ref={ref}>
      {options.map((option, index) => (
        <div key={option.id || index}>
          {(!option.permissions || hasPermission(option.permissions)) && (
            <div>
              {option.OverrideComp ? (
                <option.OverrideComp />
              ) : (
                <li
                  onClick={() => {
                    option.onClick();
                    onClickOutside && onClickOutside();
                  }}
                >
                  {!svgIcon && <span>{option.icon && <img src={option.icon} />}</span>}
                  {svgIcon && option.icon}
                  <span>{option.label}</span>
                </li>
              )}
            </div>
          )}
        </div>
      ))}
    </ul>
  );
};

export default Dropdown;

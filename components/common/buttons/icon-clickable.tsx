import ReactTooltip from "react-tooltip";
import styles from "./icon-clickable.module.css";

const IconClickable = ({
  src,
  onClick = (e) => { },
  additionalClass = "",
  tooltipId = "",
  tooltipText,
  place = "top",
  SVGElement,
}: Props) => (
  <>
    {!SVGElement && (
      <img
        data-tip
        data-for={tooltipId}
        src={src}
        onClick={onClick}
        className={`${styles.button} ${additionalClass}`}
        draggable={false}
      />
    )}
    {SVGElement && (
      <SVGElement data-tip data-for={tooltipId} onClick={onClick} className={`${styles.button} ${additionalClass}`} />
    )}
    {tooltipText && (
      <ReactTooltip id={tooltipId} delayShow={300} effect="solid" place={place}>
        {tooltipText}
      </ReactTooltip>
    )}
  </>
);

interface Props {
  src?: string;
  onClick?: (e: any) => void;
  additionalClass?: string;
  tooltipId?: string;
  tooltipText?: string;
  place?: string;
  SVGElement?: any;
}

export default IconClickable;

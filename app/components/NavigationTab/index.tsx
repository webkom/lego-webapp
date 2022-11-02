import type { Node } from "react";
import { NavLink } from "react-router-dom";
import NavigationLink from "./NavigationLink";
import Icon from "app/components/Icon";
import styles from "./NavigationTab.css";
import cx from "classnames";
type Props = {
  title?: Node;
  back?: {
    label: string;
    path: string;
  };
  details?: Node;
  headerClassName?: string;
  className?: string;
  headerClassName?: string;
  children?: Node;
};

const NavigationTab = (props: Props) => <>
    {props.back && <NavLink to={props.back.path} className={styles.back}>
        <Icon name="arrow-back" size={19} className={styles.backIcon} />
        <span className={styles.backLabel}>{props.back.label}</span>
      </NavLink>}
    <div className={cx(styles.container, props.className)}>
      <h1 className={cx(styles.header, props.headerClassName)}>
        {props.title}
      </h1>
      <div className={styles.navigator}>{props.children}</div>
    </div>
    <div className={styles.details}>{props.details}</div>
  </>;

export default NavigationTab;
export { NavigationLink };
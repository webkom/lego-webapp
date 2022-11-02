import type { Node } from "react";
import cx from "classnames";
import styles from "./Container.css";
type Props = {
  className?: string;
  children: Node;
};

function Container({
  children,
  className
}: Props) {
  return <div className={cx(styles.content, className)}>{children}</div>;
}

export default Container;
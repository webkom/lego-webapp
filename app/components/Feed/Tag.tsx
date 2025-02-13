import { Link } from 'react-router';
import styles from 'app/components/Feed/context.module.css';
import type { TagComponent } from 'app/components/Feed/ActivityRenderer';

export const LinkTag: TagComponent = (props) => {
  const { linkableContent, link, text } = props;
  return linkableContent ? (
    <Link to={link}>{text}</Link>
  ) : (
    <SpanTag {...props} />
  );
};

export const SpanTag: TagComponent = (props) => {
  const classname = props.linkableContent ? styles.highlight : '';
  return <span className={classname}>{props.text}</span>;
};

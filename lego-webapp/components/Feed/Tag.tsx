import styles from '~/components/Feed/context.module.css';
import type { TagComponent } from '~/components/Feed/ActivityRenderer';

export const LinkTag: TagComponent = (props) => {
  const { linkableContent, link, text } = props;
  return linkableContent ? <a href={link}>{text}</a> : <SpanTag {...props} />;
};

export const SpanTag: TagComponent = (props) => {
  const classname = props.linkableContent ? styles.highlight : '';
  return <span className={classname}>{props.text}</span>;
};

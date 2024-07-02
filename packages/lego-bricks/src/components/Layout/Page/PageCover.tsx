import cx from 'classnames';
import { Image } from '../../Image';
import { Skeleton } from '../../Skeleton';
import Flex from '../Flex';
import styles from './PageCover.module.css';
import type { ReactNode } from 'react';

type Props = {
  image?: string;
  imagePlaceholder?: string;
  alt?: string;
  className?: string;
  skeleton?: boolean;
  children?: ReactNode;
};

/**
 * A banner for the top of a page. Should be used within a PageContainer.
 * If children are provided, they will be rendered instead of the image.
 */
export const PageCover = ({
  image,
  imagePlaceholder,
  alt,
  className,
  skeleton,
  children,
}: Props) => (
  <Flex
    column
    alignItems="center"
    className={cx(styles.container, className)}
    data-test-id="page-cover"
  >
    {skeleton ? (
      <Skeleton />
    ) : (
      children ||
      (image && (
        <Image
          src={image}
          placeholder={imagePlaceholder}
          style={{
            height: '100%',
            objectFit: 'contain',
          }}
          alt={alt ?? 'Content cover photo'}
        />
      ))
    )}
  </Flex>
);

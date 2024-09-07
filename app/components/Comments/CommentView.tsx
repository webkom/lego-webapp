import {
  FilterSection,
  Flex,
  Icon,
  LoadingIndicator,
} from '@webkom/lego-bricks';
import { ListFilter } from 'lucide-react';
import moment from 'moment';
import { useEffect, useState, type CSSProperties } from 'react';
import CommentForm from 'app/components/CommentForm';
import { generateTreeStructure } from 'app/utils';
import { SelectInput } from '../Form';
import CommentTree from './CommentTree';
import styles from './CommentView.css';
import type Comment from 'app/store/models/Comment';
import type { ContentAuthors } from 'app/store/models/Comment';
import type { ContentTarget } from 'app/store/utils/contentTarget';

type Props = {
  comments: Comment[];
  formDisabled?: boolean;
  contentTarget: ContentTarget;
  displayTitle?: boolean;
  style?: CSSProperties;
  newOnTop?: boolean;
  contentAuthors?: ContentAuthors;
};

const orderingOptions: Array<Option> = [
  {
    label: 'Nyeste',
    value: 'createdAt',
  },
  {
    label: 'Eldste',
    value: 'createdAtInv',
  },
  {
    label: 'Likes',
    value: 'reactionsGrouped',
  },
  {
    label: 'Kontroversielle',
    value: 'reactionsControversial',
  },
];

type Option = {
  label: string;
  value: string;
};

const getReactionScore = (comment: Comment, emojiString: string): number => {
  const count =
    comment.reactionsGrouped.find((reaction) => reaction.emoji === emojiString)
      ?.count || 0;
  return count;
};

const Title = ({ displayTitle }: { displayTitle: boolean }) =>
  displayTitle && <h3>Kommentarer</h3>;

const CommentView = (props: Props) => {
  const {
    comments,
    formDisabled = false,
    contentTarget,
    style,
    displayTitle = true,
    contentAuthors,
  } = props;
  const commentFormProps = {
    contentTarget,
  };
  const [ordering, setOrdering] = useState<Option>(orderingOptions[0]);
  const [sortedComments, setSortedComments] = useState<Comment[]>(comments);
  const [displaySorting, setDisplaySorting] = useState(false);
  const tree = generateTreeStructure(sortedComments);

  useEffect(() => {
    const sorted = [...comments].sort((a: Comment, b: Comment) => {
      if (ordering.value === 'createdAt') {
        return moment(b.createdAt).valueOf() - moment(a.createdAt).valueOf();
      } else if (ordering.value === 'createdAtInv') {
        return moment(a.createdAt).valueOf() - moment(b.createdAt).valueOf();
      } else if (ordering.value === 'reactionsGrouped') {
        const scoreA =
          getReactionScore(a, ':+1:') - getReactionScore(a, ':-1:');
        const scoreB =
          getReactionScore(b, ':+1:') - getReactionScore(b, ':-1:');
        return scoreB - scoreA;
      } else if (ordering.value === 'reactionsControversial') {
        return getReactionScore(b, ':-1:') - getReactionScore(a, ':-1:');
      }
      return 0;
    });

    setSortedComments(sorted);
  }, [ordering, comments]);

  return (
    <div style={style}>
      <Flex
        flex-row
        justifyContent="flex-start"
        alignItems="center"
        className={styles.headerContainer}
      >
        <Title displayTitle={displayTitle} />
        <Flex flex-row alignItems="center" className={styles.iconWrapper}>
          <Icon
            name="arrow-down-wide-narrow"
            size={20}
            onClick={() => {
              setDisplaySorting(!displaySorting);
            }}
            className={styles.sortIcon}
            iconNode={<ListFilter />}
          />
          {displaySorting && (
            <div className={styles.sortList}>
              <FilterSection title="">
                <SelectInput
                  name="sorting_selector"
                  value={ordering}
                  onChange={(selectedOption: Option) => {
                    setOrdering(selectedOption);
                  }}
                  isClearable={false}
                  options={orderingOptions}
                />
              </FilterSection>
            </div>
          )}
        </Flex>
      </Flex>

      <Flex column gap="var(--spacing-sm)">
        {!formDisabled && <CommentForm {...commentFormProps} />}

        <LoadingIndicator loading={!sortedComments}>
          {sortedComments && (
            <CommentTree
              comments={tree}
              commentFormProps={commentFormProps}
              contentTarget={contentTarget}
              contentAuthors={contentAuthors}
            />
          )}
        </LoadingIndicator>
      </Flex>
    </div>
  );
};

export default CommentView;

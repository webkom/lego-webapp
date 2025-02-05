import { Flex, Icon, LoadingIndicator } from '@webkom/lego-bricks';
import { ArrowDownUpIcon } from 'lucide-react';
import moment from 'moment';
import { useState, type CSSProperties } from 'react';
import CommentForm from 'app/components/CommentForm';
import Dropdown from 'app/components/Dropdown';
import { generateTreeStructure } from 'app/utils';
import CommentTree from './CommentTree';
import styles from './CommentView.module.css';
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
    label: 'Reaksjoner',
    value: 'reactionsGrouped',
  },
];

type Option = {
  label: string;
  value: string;
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
    newOnTop = false,
  } = props;
  const commentFormProps = {
    contentTarget,
  };
  const [ordering, setOrdering] = useState<Option>(
    newOnTop ? orderingOptions[0] : orderingOptions[1],
  );
  const [displaySorting, setDisplaySorting] = useState(false);

  const sortedComments = comments.sort((a: Comment, b: Comment) => {
    if (ordering.value === 'createdAt') {
      return moment(b.createdAt).valueOf() - moment(a.createdAt).valueOf();
    } else if (ordering.value === 'createdAtInv') {
      return moment(a.createdAt).valueOf() - moment(b.createdAt).valueOf();
    } else if (ordering.value === 'reactionsGrouped') {
      return (
        b.reactionsGrouped.reduce((acc, reaction) => acc + reaction.count, 0) -
        a.reactionsGrouped.reduce((acc, reaction) => acc + reaction.count, 0)
      );
    }
    return 0;
  });
  const tree = generateTreeStructure(sortedComments);

  return (
    <div style={style}>
      <Flex
        alignItems="center"
        gap="var(--spacing-sm)"
        className={styles.headerContainer}
      >
        <Title displayTitle={displayTitle} />

        <Dropdown
          show={displaySorting}
          toggle={() => setDisplaySorting(!displaySorting)}
          triggerComponent={
            <Icon
              size={20}
              className="secondaryFontColor"
              iconNode={<ArrowDownUpIcon />}
            />
          }
        >
          <Dropdown.List>
            {orderingOptions.map((option: Option, index: number) => (
              <>
                {index !== 0 && <Dropdown.Divider />}
                <Dropdown.ListItem
                  key={option.value}
                  active={option === ordering}
                >
                  <button
                    onClick={() => {
                      setOrdering(option);
                      setDisplaySorting(!displaySorting);
                    }}
                  >
                    {option.label}
                  </button>
                </Dropdown.ListItem>
              </>
            ))}
          </Dropdown.List>
        </Dropdown>
      </Flex>

      <Flex column gap="var(--spacing-sm)">
        {!formDisabled && <CommentForm {...commentFormProps} />}

        <LoadingIndicator loading={!comments}>
          {comments && (
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

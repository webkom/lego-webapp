// @flow

// $FlowFixMe
import React, { useMemo, useState, useCallback } from 'react';
import type { EmojiEntity } from 'app/reducers/emojis';
import type { ID } from 'app/models';
import styles from './ReactionPicker.css';
import ReactionPickerHeader from './ReactionPickerHeader';
import ReactionPickerContent from './ReactionPickerContent';
import ReactionPickerFooter from './ReactionPickerFooter';
import emojiLoading from 'app/assets/emoji_loading.svg';

type Props = {
  isLoading: boolean,
  emojis: Array<EmojiEntity>,
  addReaction: ({
    emoji: string,
    contentTarget: string
  }) => Promise<*>,
  deleteReaction: ({ reactionId: ID, contentTarget: string }) => Promise<*>,
  contentTarget: string
};

const ReactionPicker = ({
  isLoading,
  emojis,
  addReaction,
  deleteReaction,
  contentTarget
}: Props) => {
  const [activeCategory, setActiveCategory] = useState('people');
  const [searchString, setSearchString] = useState(null);

  const categories = useMemo(() => {
    if (!emojis) {
      return {};
    }
    const mappedCategories = {};
    emojis.forEach(emoji => {
      if (emoji.category in mappedCategories) {
        mappedCategories[emoji.category]['emojis'].push(emoji);
      } else {
        mappedCategories[emoji.category] = {
          name: emoji.category,
          emojis: [emoji]
        };
      }
    });
    return mappedCategories;
  }, [emojis]);

  const searchResults = useMemo(() => {
    if (searchString === null || searchString === '') {
      return null;
    } else if (searchString === '') {
      return [];
    }
    return emojis.filter(emoji => {
      const idMatches = emoji.shortCode.toLowerCase().includes(searchString);
      const keywordsMatches =
        emoji.keywords.filter(keyword =>
          keyword.toLowerCase().includes(searchString)
        ).length > 0;
      return idMatches || keywordsMatches;
    });
  }, [searchString, emojis]);

  const onCategoryClick = useCallback(category => {
    setActiveCategory(category);
    setSearchString(null);
  });
  const onSearch = useCallback(searchString =>
    setSearchString(searchString.trim().toLowerCase())
  );

  return (
    <div className={styles.reactionPicker}>
      {isLoading ? (
        <div className={styles.emojiLoading}>
          <img src={emojiLoading} alt="Emoji Loading Indicator" />
        </div>
      ) : (
        <div>
          <ReactionPickerHeader
            activeCategory={activeCategory}
            categories={Object.keys(categories)}
            onCategoryClick={onCategoryClick}
          />
          <ReactionPickerContent
            emojis={
              categories[activeCategory]
                ? categories[activeCategory].emojis
                : []
            }
            searchResults={searchResults}
            addReaction={addReaction}
            deleteReaction={deleteReaction}
            contentTarget={contentTarget}
          />
          <ReactionPickerFooter onSearch={onSearch} />
        </div>
      )}
    </div>
  );
};

export default ReactionPicker;

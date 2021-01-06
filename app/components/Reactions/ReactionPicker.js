// @flow

// $FlowFixMe
import React, { useMemo, useState, useCallback } from 'react';
import fuzzy from 'fuzzy';
import type { EmojiEntity } from 'app/reducers/emojis';
import type { ID } from 'app/models';
import styles from './ReactionPicker.css';
import ReactionPickerHeader from './ReactionPickerHeader';
import ReactionPickerContent from './ReactionPickerContent';
import ReactionPickerFooter from './ReactionPickerFooter';
import emojiLoading from 'app/assets/emoji_loading.svg';
import { Image } from 'app/components/Image';

type Props = {
  isLoading: boolean,
  emojis: Array<EmojiEntity>,
  addReaction: ({
    emoji: string,
    contentTarget: string,
  }) => Promise<*>,
  deleteReaction: ({ reactionId: ID, contentTarget: string }) => Promise<*>,
  contentTarget: string,
};

const searchEmojis = (emojis, searchString) => {
  const matchingEmojis = [];
  let currentEmojis = emojis;

  /*
   * STEP 1
   * First look for exact matches for searchString in shortCode.
   *
   * Examples (searchString = "car"):
   *   - ":car:" (match = ":<car>:")
   */
  currentEmojis = currentEmojis.filter((emoji) => {
    if (`:${searchString}:` === emoji.shortCode.toLowerCase()) {
      matchingEmojis.push(emoji);
      return false;
    }
    return true;
  });

  /*
   * STEP 2
   * Then look if shortCode start with, ends with or contains the searchString in the middle.
   *
   * Examples (searchString = "car"):
   *   - ":car_test:" (match = ":<car_>test:")
   *   - ":test_car:" (match = ":test<_car>:")
   *   - ":good_car_test:" (match = ":good<_car_>test:")
   */
  currentEmojis = currentEmojis.filter((emoji) => {
    const startsWithExact = emoji.shortCode
      .toLowerCase()
      .startsWith(`:${searchString}_`);
    const endsWithExact = emoji.shortCode
      .toLowerCase()
      .endsWith(`_${searchString}:`);
    const contains = emoji.shortCode
      .toLowerCase()
      .includes(`_${searchString}_`);
    if (startsWithExact || endsWithExact || contains) {
      matchingEmojis.push(emoji);
      return false;
    } else {
      return true;
    }
  });

  /*
   * STEP 3
   * Then look if shortCode start with, ends with or contains the searchString in the middle.
   *
   * Examples (searchString = "car"):
   *   - ":car2:" (match = ":<car>2:")
   *   - ":carrot:" (match = ":<car>rot")
   *   - ":2car:" (match = ":2<car>:")
   */
  currentEmojis = currentEmojis.filter((emoji) => {
    const startsWith = emoji.shortCode
      .toLowerCase()
      .startsWith(`:${searchString}`);
    const endsWith = emoji.shortCode.toLowerCase().endsWith(`${searchString}:`);
    if (startsWith || endsWith) {
      matchingEmojis.push(emoji);
      return false;
    } else {
      return true;
    }
  });

  /*
   * STEP 3
   * Look if the keywords for the emoji match exactly
   *
   * Examples (searchString = "vehicle"):
   *   - ":taxi:" (match = "vehicle", keywords = ["uber", "vehicle", "cars", "transportation"])
   *   - ":tractor:" (match = "vehicle", keywords = ["vehicle", "car", "farming", "argiculture"])
   *   - ":oncoming_automobile:" (match = "vehicle", keywords = ["car", "vehicle", "transportation"])
   */
  currentEmojis = currentEmojis.filter((emoji) => {
    if (
      emoji.keywords.find(
        (keyword) => keyword.toLowerCase() === searchString
      ) !== undefined
    ) {
      matchingEmojis.push(emoji);
      return true;
    } else {
      return true;
    }
  });

  /*
   * STEP 4
   * Perform a fuzzy search at the end for the remaining emojis.
   *
   * Examples (searchString = "car"):
   *   - ":woman_cart_wheeling:" (match = ":woman_<car>t_wheeling:")
   *   - ":costa_rica:" (match = ":<c>ost<a>_<r>ica")
   *   - ":christmas_tree:" (match = ":<c>hristm<a>s_t<r>ee")
   */
  const results = fuzzy.filter(searchString, currentEmojis, {
    pre: '<',
    post: '>',
    extract: (emoji) => {
      return emoji.shortCode;
    },
  });

  return [...matchingEmojis, ...results.map((result) => result.original)];
};

const ReactionPicker = ({
  isLoading,
  emojis,
  addReaction,
  deleteReaction,
  contentTarget,
}: Props) => {
  const [activeCategory, setActiveCategory] = useState(null);
  const [searchString, setSearchString] = useState(null);

  const categories = useMemo(() => {
    if (!emojis) {
      return {};
    }
    const mappedCategories = {};
    let activeCategorySet = false;
    emojis.forEach((emoji) => {
      if (!activeCategorySet) {
        setActiveCategory(emoji.category);
        activeCategorySet = true;
      }
      if (emoji.category in mappedCategories) {
        mappedCategories[emoji.category]['emojis'].push(emoji);
      } else {
        mappedCategories[emoji.category] = {
          name: emoji.category,
          emojis: [emoji],
        };
      }
    });
    return mappedCategories;
  }, [emojis]);

  const searchResults = useMemo(() => {
    if (searchString === null || searchString === '') {
      return null;
    }
    return searchEmojis(emojis, searchString);
  }, [searchString, emojis]);

  const onCategoryClick = useCallback((category) => {
    setActiveCategory(category);
    setSearchString(null);
  }, []);
  const onSearch = useCallback(
    (searchString) => setSearchString(searchString.trim().toLowerCase()),
    []
  );

  return (
    <div className={styles.reactionPicker}>
      {isLoading ? (
        <div className={styles.emojiLoading}>
          <Image src={emojiLoading} alt="Emoji Loading Indicator" />
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
              activeCategory && categories[activeCategory]
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

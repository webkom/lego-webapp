import { Card, Image } from '@webkom/lego-bricks';
import fuzzy from 'fuzzy';
import { useMemo, useState, useCallback } from 'react';
import emojiLoading from 'app/assets/emoji_loading.svg';
import { useAppSelector } from 'app/store/hooks';
import styles from './ReactionPicker.css';
import ReactionPickerContent from './ReactionPickerContent';
import ReactionPickerFooter from './ReactionPickerFooter';
import ReactionPickerHeader from './ReactionPickerHeader';
import type { EmojiWithReactionData } from 'app/components/LegoReactions';
import type { ContentTarget } from 'app/store/utils/contentTarget';

type Props = {
  emojis: EmojiWithReactionData[];
  contentTarget: ContentTarget;
};

const searchEmojis = (
  emojis: EmojiWithReactionData[],
  searchString: string,
) => {
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
   * STEP 4
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
        (keyword) => keyword.toLowerCase() === searchString,
      ) !== undefined
    ) {
      matchingEmojis.push(emoji);
      return true;
    } else {
      return true;
    }
  });

  /*
   * STEP 5
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

const ReactionPicker = ({ emojis, contentTarget }: Props) => {
  const [activeCategory, setActiveCategory] = useState<string>();
  const [searchString, setSearchString] = useState<string>('');
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
    if (searchString === '') {
      return null;
    }

    return searchEmojis(emojis, searchString);
  }, [searchString, emojis]);

  const onCategoryClick = useCallback((category) => {
    setActiveCategory(category);
    setSearchString('');
  }, []);

  const onSearch = useCallback(
    (searchString) => setSearchString(searchString.trim().toLowerCase()),
    [],
  );

  const isLoading = useAppSelector((state) => state.emojis.fetching);

  return (
    <Card className={styles.reactionPicker}>
      <ReactionPickerHeader
        activeCategory={activeCategory}
        categories={Object.keys(categories)}
        onCategoryClick={onCategoryClick}
        isSearching={searchString !== ''}
      />
      {isLoading ? (
        <div className={styles.emojiLoading}>
          <Image src={emojiLoading} alt="Lasteindikator" />
        </div>
      ) : (
        <ReactionPickerContent
          emojis={
            activeCategory && categories[activeCategory]
              ? categories[activeCategory].emojis
              : []
          }
          searchResults={searchResults}
          contentTarget={contentTarget}
        />
      )}
      <ReactionPickerFooter onSearch={onSearch} />
    </Card>
  );
};

export default ReactionPicker;

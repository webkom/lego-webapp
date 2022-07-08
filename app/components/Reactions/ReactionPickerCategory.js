// @flow

import { Component } from 'react';
import classNames from 'classnames';

import Emoji from 'app/components/Emoji';

import styles from './ReactionPickerCategory.css';

type Props = {
  isActive: boolean,
  name: string,
  onCategoryClick: (category: string) => void,
};

const mapCategoryNameToIcon = (name) => {
  switch (name) {
    case 'people':
      return '😃';
    case 'animals_and_nature':
      return '🍃';
    case 'food_and_drink':
      return '🍔';
    case 'activity':
      return '⚽';
    case 'travel_and_places':
      return '✈';
    case 'objects':
      return '💡';
    case 'symbols':
      return '❤';
    case 'flags':
      return '🇵🇱 ';
    default:
      return name.charAt(0).toUpperCase();
  }
};

class ReactionPickerCategory extends Component<Props> {
  render() {
    const { isActive, name, onCategoryClick } = this.props;

    const containerClasses = [styles.reactionPickerCategoryContainer];
    const categoryClasses = [styles.reactionPickerCategory];
    if (isActive) {
      containerClasses.push(styles.isActiveContainer);
      categoryClasses.push(styles.isActiveCategory);
    }

    return (
      <div title={name} onClick={() => onCategoryClick(name)}>
        <div className={classNames(containerClasses)}>
          <div className={classNames(categoryClasses)}>
            <Emoji unicodeString={mapCategoryNameToIcon(name)} />
          </div>
        </div>
      </div>
    );
  }
}

export default ReactionPickerCategory;

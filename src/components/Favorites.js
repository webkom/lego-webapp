import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import Icon from './ui/Icon';

export default class Favorites extends Component {
  static propTypes = {
    favorites: PropTypes.array
  }

  static defaultProps = {
    favorites: []
  }

  render() {
    const { favorites } = this.props;
    return (
      <ul>
        {favorites.map(favorite =>
          <li><Link to='' params={{ eventId: favorite.id }}><Icon name='star' />{favorite.name}</Link></li>
        )}
      </ul>
    );
  }
}

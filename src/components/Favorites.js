import React from 'react';
import {Link} from 'react-router';
import Time from './Time';
import Icon from './Icon';
import FavoritesStore from '../stores/FavoritesStore';
import FavoritesService from '../services/FavoritesService';
import FavoritesActionCreators from '../actions/FavoritesActionCreators';

var Favorites = React.createClass({

  mixins: [FavoritesStore.mixin()],

  componentDidMount: function() {
    FavoritesService.findAll(function(err, favorites) {
      if (err) return;
      FavoritesActionCreators.receiveAll(favorites);
    });
  },

  render: function() {
    return (
      <ul>
        {(this.state.favorites || []).map(function(favorite, i) {
          return (
            <li key={i}>
              <Link to='event' params={{eventId: favorite.id}}><Icon name='star' />{favorite.name}</Link>
            </li>
          );
        })}
      </ul>
    );
  }
});

export default Favorites;

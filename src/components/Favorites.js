import React from 'react';
import {Link} from 'react-router';
import Time from './Time';
import Icon from './Icon';
import FavoritesStore from '../stores/FavoritesStore';
import * as FavoritesService from '../services/FavoritesService';
import FavoritesActions from '../actions/FavoritesActions';

var Favorites = React.createClass({

  getInitialState() {
    return FavoritesStore.getState();
  },

  componentDidMount() {
    FavoritesStore.addChangeListener(this.update);
    FavoritesService.findAll(function(err, favorites) {
      if (err) return;
      FavoritesActions.receiveAll(favorites);
    });
  },

  componentWillUnmount() {
    FavoritesStore.removeChangeListener(this.update);
  },

  update() {
    this.setState(FavoritesStore.getState());
  },

  render() {
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

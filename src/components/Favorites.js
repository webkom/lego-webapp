'use strict';

var React = require('react');
var Link = require('react-router').Link;
var Time = require('./Time');
var Icon = require('./Icon');
var FavoritesStore = require('../stores/FavoritesStore');
var FavoritesService = require('../services/FavoritesService');
var FavoritesActionCreators = require('../actions/FavoritesActionCreators');

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

module.exports = Favorites;

'use strict';

var React = require('react');
var Feed = require('./FrontPageFeed');
var Icon = require('./Icon');
var SidebarBlock = require('./SidebarBlock');
var FavoritesStore = require('../stores/FavoritesStore');
var FavoritesService = require('../services/FavoritesService');
var FavoritesActionCreators = require('../actions/FavoritesActionCreators');

var Overview = React.createClass({

  mixins: [FavoritesStore.mixin()],

  componentDidMount: function() {
    FavoritesService.findAll(function(err, favorites) {
      if (err) return;
      FavoritesActionCreators.receiveAll(favorites);
    });
  },

  render: function() {
    return (
      <section>
        <div className='content'>
          <div className='sidebar'>
            <SidebarBlock title="Mine arrangementer">
              <ul>
                {this.state.favorites.map(function(favorite, i) {
                  return <li key={i}><a href=''><Icon name='star' />{favorite.name}</a></li>
                })}
              </ul>
            </SidebarBlock>

            <SidebarBlock title='Interessegrupper'>
              <p>Du er ikke medlem av noen interessegrupper.</p>
              <p><a>Finn noen som passer deg &rarr;</a></p>
            </SidebarBlock>

            <SidebarBlock title='Nyeste README'>
              <img src='http://readme.abakus.no/bilder/14/2014-03.jpg' />
            </SidebarBlock>

            <SidebarBlock title='Komitéene'>
              <p>Hello World</p>
            </SidebarBlock>
          </div>
          <div className='feed-container'>
            <Feed />
          </div>
        </div>
      </section>
    );
  }
});

module.exports = Overview;

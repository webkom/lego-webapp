/** @jsx React.DOM */

var React = require('react');
var Feed = require('./FrontPageFeed');
var Icon = require('./icon');
var SidebarBlock = require('./SidebarBlock');

/**
 * Frontpage Component
 */

var FrontPage = React.createClass({

  getInitialState: function() {
    return {
    };
  },

  render: function() {
    return (
      <section>
        <div className='content'>
          <div className='sidebar'>
            <SidebarBlock title="Mine arrangementer">
              <ul>
                <li><a><Icon name="star" /> Immball</a></li>
                <li><a><Icon name="star" /> React.js med Ciber</a></li>
              </ul>
            </SidebarBlock>

            <SidebarBlock title="Interessegrupper">
              <p>Du er ikke medlem av noen interessegrupper.</p>
              <p><a>Finn noen som passer deg &rarr;</a></p>
            </SidebarBlock>

            <SidebarBlock title="Nyeste README">
              <img src='http://readme.abakus.no/bilder/14/2014-03.jpg' />
            </SidebarBlock>

            <SidebarBlock title="Komitéene">
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

module.exports = FrontPage;

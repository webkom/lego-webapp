/** @jsx React.DOM */

var React = require('react');

var FeedStore = require('../../stores/FeedStore');


var FeedItem = React.createClass({

  render: function() {
    switch (this.props.item.type) {
      case 'article':
        return (
          <div>
            <h2>{this.props.item.payload.title}</h2>
            <p>{this.props.item.payload.body}</p>
          </div>
        );

      case 'event':
        return (
          <div>
            <h2>{this.props.item.payload.type}: {this.props.item.payload.name}</h2>
            <img src={this.props.item.payload.image} />
            <div className='event-info-box'>
              <p>Åpen for 3.-5. klasse.</p>
              <p>Påmeldingen åpner snart. <button>Meld deg på</button></p>
            </div>
          </div>
        );

      case 'notification':
        return <span>Notification: {this.props.item.payload.description}</span>;

      default:
        return <span>this.props.item.payload.description</span>;
    }
  }
});

var Feed = module.exports = React.createClass({

  getInitialState: function() {
    return {
      feedItems: FeedStore.all()
    };
  },

  update: function() {
    this.setState({feedItems: FeedStore.all()});
  },

  componentWillMount: function() {
    FeedStore.fetch();
  },

  componentDidMount: function() {
    FeedStore.addChangeListener(this.update);
  },

  componentWillUnmount: function() {
    FeedStore.removeChangeListener(this.update);
  },

  render: function() {
    return (
      <ul className='feed'>
      {this.state.feedItems.map(function(item) {
        return (
          <li>
            <FeedItem item={item} key={item.id}/>
          </li>
        );
      })}
      </ul>
    );
  }
});

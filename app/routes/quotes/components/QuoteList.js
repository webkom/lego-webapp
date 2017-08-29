import React, { Component } from 'react';
import Quote from './Quote';

type Props = {
  quotes: Array<Object>
};

export default class QuoteList extends Component {
  props: Props;

  state = {
    displayAdminId: -1
  };

  componentWillReceiveProps(newProps) {
    console.log('Got new props!');
    this.setState({ displayAdminId: -1 });
  }

  setDisplayAdmin = id => {
    this.setState({
      displayAdminId: this.state.displayAdminId === id ? -1 : id
    });
  };

  render() {
    const { quotes } = this.props;
    return (
      <ul>
        {quotes.map(quote =>
          <Quote
            {...this.props}
            quote={quote}
            key={quote.id}
            setDisplayAdmin={this.setDisplayAdmin}
            displayAdmin={quote.id === this.state.displayAdminId}
          />
        )}
      </ul>
    );
  }
}

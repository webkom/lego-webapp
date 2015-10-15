import '../../styles/Quotes.css';
import React, { Component, PropTypes } from 'react';

export default class SingleQuote extends Component {

  like(event) {
    //console.log(event, this, this.props.quote.id)
  }

  render() {
    const { quote, like } = this.props;

    return (
      <section>
        <li className="enkelQuote">
          <h3>{this.props.quote.quote}</h3>

          <span><i>-{this.props.quote.author}</i></span>
            <br />
          <span
            data-quote-id={this.props.quote.id}
            className="liker"
            onClick={()=>like(this.props.quote.id)}
          > Liker</span>

          <span> {this.props.quote.likes}</span>
            <br />
            <br />
        </li>
      </section>
    );
  }
}

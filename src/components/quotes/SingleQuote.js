import '../../styles/Quotes.css';
import React, { Component, PropTypes } from 'react';

export default class SingleQuote extends Component {
  /*static propTypes = {
    event: PropTypes.object.isRequired
  }*/
  logItBaby() {
    console.log("Min quote: ",this.props.quote)
  }
  like(quote) {

  }

  render() {
    const { event } = this.props;

    return (
      <section>
        {this.logItBaby()}
        <li className="enkelQuote">
          <h3>{this.props.quote.quote}</h3>

          <span><i>-{this.props.quote.author}</i></span>
            <br />
          <span
            className="liker"
            onClick={this.like(this)}
          > Liker</span>

          <span> {this.props.quote.likes}</span>
            <br />
            <br />
        </li>
      </section>
    );
  }
}

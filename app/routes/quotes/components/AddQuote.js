import './Quotes.css';
import React, { Component, PropTypes } from 'react';
import FieldError from 'app/components/FieldError';

export default class AddQuote extends Component {

  static propTypes = {
    addQuotes: PropTypes.func.isRequired,
    fields: PropTypes.object.isRequired,
    invalid: PropTypes.bool.isRequired,
    pristine: PropTypes.bool.isRequired,
    submitting: PropTypes.bool.isRequired
  };

  render() {
    const {
      fields: {
        text, source
      },
      invalid,
      pristine,
      submitting
    } = this.props;

    const disabledButton = invalid || pristine || submitting;

    return (
      <div className='u-container'>

        <div className='quote-top add-quote-top'>
          <h1>Legg til sitat</h1>
        </div>

        <div className='add-quote'>
          <form onSubmit={this.props.addQuotes}>

            <label htmlFor='add-quote-content' style={{ fontSize: 30 }}>
              Selve sitatet <b>*</b>
            </label>

            {text.error && text.touched ?
              <FieldError error={text.error} /> : null}
            <textarea id='add-quote-content' {...text} />

            <label htmlFor='add-quote-source' style={{ fontSize: 20 }}>
              Hvor sitatet kommer fra (sleng gjerne med noe snaks!) <b>*</b>
            </label>

            {source.error && source.touched ?
              <FieldError error={source.error} /> : null}
            <textarea id='add-quote-source' {...source} />

            <div className='clear'></div>
            <input type='submit' className='submit-quote'
              value='Send inn' disabled = {disabledButton}
            />
          </form>
        </div>
      </div>
    );
  }
}

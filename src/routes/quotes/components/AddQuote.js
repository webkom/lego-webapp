import './Quotes.css';
import React, { Component, PropTypes } from 'react';

const FieldError = ({ error }) => (
  <span style={{ color: 'red', fontWeight: 'bold' }}>{error}<br /></span>
);

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
          <div className='quote-top' style={{ marginBottom: 0 }} >
            <h1>Legg til sitat</h1>
          </div>

          <div>
          <form onSubmit={this.props.addQuotes}>

            <label style={{ fontSize: 30 }}>
              Selve sitatet <b>*</b>
            </label> <br />
            {text.error && text.touched ?
              <FieldError error={text.error} /> : null}
            <textarea id='add-quote-content' {...text} />
            <br /> <br />

            <label style={{ fontSize: 20 }}>
              Hvor sitatet kommer fra (sleng gjerne med noe snaks!) <b>*</b>
            </label> <br />
            {source.error && source.touched ?
              <FieldError error={source.error} /> : null}
            <textarea id='add-quote-source' {...source} />
            <br /> <br />

            <input type='submit' className='submit-quote'
              value='Send inn' disabled = {disabledButton}
            />
          </form>


        </div>
      </div>
    );
  }
}

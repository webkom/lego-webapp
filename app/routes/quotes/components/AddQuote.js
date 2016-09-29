import styles from './Quotes.css';
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
      <div className={styles.root}>

        <div className={styles.quoteTop}>
          <h1>Legg til sitat</h1>
        </div>

        <div className={styles.addQuote}>
          <form onSubmit={this.props.addQuotes}>

            <label htmlFor='addQuoteContent' style={{ fontSize: 30 }}>
              Selve sitatet <b>*</b>
            </label>

            {text.error && text.touched ?
              (<div style={{ display: 'block', color: 'red' }}>
                <FieldError error={text.error} />
              </div>) : null}
            <textarea className={styles.addQuoteContent} {...text} />

            <label htmlFor='addQuoteSource' style={{ fontSize: 20 }}>
              Hvor sitatet kommer fra (sleng gjerne med noe snaks!) <b>*</b>
            </label>

            {source.error && source.touched ?
              (<div style={{ display: 'block', color: 'red' }}>
                <FieldError error={source.error} />
              </div>) : null}
            <textarea className={styles.addQuoteSource} {...source} />

            <div className={styles.clear}></div>
            <input type='submit' className={styles.submitQuote}
              value='Send inn' disabled = {disabledButton}
            />
          </form>
        </div>
      </div>
    );
  }
}

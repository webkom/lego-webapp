import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { addQuotes } from '../../actions/QuoteActions';
import AddQuote from './components/AddQuote';

export class QuoteEditorRoute extends Component {

  static propTypes = {
    addQuotes: PropTypes.func.isRequired
  };

  render() {
    return <AddQuote {...this.props} />;
  }
}

const mapDispatchToProps = { addQuotes };

export default connect(null, mapDispatchToProps)(QuoteEditorRoute);

import { connect } from 'react-redux';
import { addQuotes } from '../../actions/QuoteActions';
import AddQuote from './components/AddQuote';

const mapDispatchToProps = { addQuotes };

export default connect(null, mapDispatchToProps)(AddQuote);

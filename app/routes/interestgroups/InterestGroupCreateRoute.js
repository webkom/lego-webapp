import { connect } from 'react-redux';
import { createInterestGroup } from 'app/actions/InterestGroupActions';
import InterestGroupCreate from './components/InterestGroupCreate';

const mapDispatchToProps = { createInterestGroup };

export default connect(null, mapDispatchToProps)(InterestGroupCreate);

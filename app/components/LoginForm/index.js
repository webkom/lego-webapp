import { connect } from 'react-redux';
import { login } from 'app/actions/UserActions';
import LoginForm from './LoginForm';

const mapDispatchToProps = { login };

export default connect(null, mapDispatchToProps)(LoginForm);

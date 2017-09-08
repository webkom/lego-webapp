import EmailIndex from './components/EmailIndex';
import { LoginPage } from 'app/components/LoginForm';
import replaceUnlessLoggedIn from 'app/utils/replaceUnlessLoggedIn';

export default replaceUnlessLoggedIn(LoginPage)(EmailIndex);

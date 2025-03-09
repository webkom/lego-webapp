import replaceUnlessLoggedIn from '~/utils/replaceUnlessLoggedIn';
import AuthenticatedFrontpage from './AuthenticatedFrontpage';
import PublicFrontpage from './PublicFrontpage';

export default replaceUnlessLoggedIn(PublicFrontpage)(AuthenticatedFrontpage);

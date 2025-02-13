import AuthenticatedFrontpage from 'app/routes/_index/components/AuthenticatedFrontpage';
import PublicFrontpage from 'app/routes/_index/components/PublicFrontpage';
import replaceUnlessLoggedIn from 'app/utils/replaceUnlessLoggedIn';

export default replaceUnlessLoggedIn(PublicFrontpage)(AuthenticatedFrontpage);

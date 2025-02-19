import AuthenticatedFrontpage from 'app/routes/frontpage/components/AuthenticatedFrontpage';
import PublicFrontpage from 'app/routes/frontpage/components/PublicFrontpage';
import replaceUnlessLoggedIn from 'app/utils/replaceUnlessLoggedIn';

export default replaceUnlessLoggedIn(PublicFrontpage)(AuthenticatedFrontpage);

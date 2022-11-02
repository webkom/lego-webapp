import { Route, Switch } from "react-router-dom";
import ContactRoute from "./ContactRoute";
import RouteWrapper from "app/components/RouteWrapper";
import { UserContext } from "app/routes/app/AppRoute";
import PageNotFoundRoute from "../pageNotFound/PageNotFoundRoute";

const Contact = ({
  match
}: {
  match: {
    path: string | string[];
  };
}) => <UserContext.Consumer>
    {({
    currentUser,
    loggedIn
  }) => <Switch>
        <RouteWrapper exact path={match.path} Component={ContactRoute} passedProps={{
      currentUser,
      loggedIn
    }} />
        <Route component={PageNotFoundRoute} />
      </Switch>}
  </UserContext.Consumer>;

export default Contact;
import { Content } from "app/components/Content";
import { Helmet } from "react-helmet-async";
import Feed from "app/components/Feed";
import LoadingIndicator from "app/components/LoadingIndicator";
type Props = {
  feedItems: Array<any>;
  feed: Record<string, any>;
};

const TimelinePage = (props: Props) => {
  const {
    feed,
    feedItems
  } = props;
  return <Content>
      <Helmet title="Tidslinje" />
      <h1>Tidslinje</h1>

      {feed ? <Feed items={feedItems} feed={feed} /> : <LoadingIndicator loading />}
    </Content>;
};

export default TimelinePage;
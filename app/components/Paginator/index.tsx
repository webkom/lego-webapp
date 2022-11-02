import type { Node } from "react";
import { Component } from "react";
import LoadingIndicator from "app/components/LoadingIndicator";
import InfiniteScroll from "react-infinite-scroller";
type Props = {
  infiniteScroll?: boolean;
  children: Node;
  hasMore: boolean;
  fetchNext: () => void;
  fetching: boolean;
};
export default class Paginator extends Component<Props> {
  fetchNext = () => {
    if (this.props.fetchNext && !this.props.fetching) {
      this.props.fetchNext();
    }
  };

  render() {
    const {
      infiniteScroll,
      hasMore,
      children,
      fetching
    } = this.props;

    if (infiniteScroll) {
      return <InfiniteScroll hasMore={hasMore} loadMore={() => this.fetchNext()} threshold={50} loader={<LoadingIndicator loading={fetching} />}>
          {children}
        </InfiniteScroll>;
    }

    return null;
  }

}
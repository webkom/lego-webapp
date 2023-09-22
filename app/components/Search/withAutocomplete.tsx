import { debounce } from 'lodash';
import { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { autocomplete } from 'app/actions/SearchActions';
import type { SearchResult } from 'app/reducers/search';
import type { ComponentType } from 'react';

type InjectedProps = {
  filter: Array<string>;
  autocomplete: (
    query: string,
    filter?: Array<string>
  ) => Promise<SearchResult[]>;
};

type State = {
  searching: boolean;
  result: SearchResult[];
};

function withAutocomplete<Props>({
  WrappedComponent,
  retainFailedQuery = false,
}: {
  WrappedComponent: ComponentType<Props>;
  retainFailedQuery?: boolean;
}) {
  const displayName =
    WrappedComponent.displayName || WrappedComponent.name || 'Unknown';
  return class extends Component<InjectedProps & Props, State> {
    static displayName = `Autocomplete(${displayName})`;
    state = {
      searching: false,
      result: [],
    };
    _isMounted = false;

    componentDidMount() {
      this._isMounted = true;
    }

    componentWillUnmount() {
      this._isMounted = false;
    }

    handleSearch = (query: string, filter): void => {
      this.setState({
        searching: true,
      });
      this.props
        .autocomplete(query, filter)
        .then((result) => {
          // Set the result to the response result
          let finalResult = result;

          // Retain a query with no match
          if (retainFailedQuery && result.length === 0) {
            finalResult = [
              {
                title: query,
                label: query,
              },
            ];
          }

          if (this._isMounted) {
            this.setState({
              result: finalResult,
              searching: false,
            });
          }
        })
        .catch(() => {
          if (this._isMounted) {
            this.setState({
              searching: false,
            });
          }
        });
    };

    render() {
      const { filter, ...restProps } = this.props;
      return (
        <WrappedComponent
          {...(restProps as Props)}
          options={this.state.result}
          onSearch={debounce((query) => this.handleSearch(query, filter), 100)}
          fetching={this.state.searching}
          filterOption={() => true}
        />
      );
    }
  };
}

const mapDispatchToProps = {
  autocomplete,
};

export default compose(connect(null, mapDispatchToProps), withAutocomplete);

// @flow

import type { ComponentType } from 'react';
import { Component } from 'react';
import { connect } from 'react-redux';
import { debounce } from 'lodash';
import { compose } from 'redux';

import { autocomplete } from 'app/actions/SearchActions';

type InjectedProps = {
  filter: Array<string>,
  autocomplete: (query: string, filter?: Array<string>) => Promise<*>,
};

type State = {
  searching: boolean,
  result: Array</*Todo: AutocompleteResult */ Object>,
};

function withAutocomplete<Props>({
  WrappedComponent,
  retainFailedQuery = false,
}: {
  WrappedComponent: ComponentType<Props>,
  retainFailedQuery?: boolean,
}) {
  const displayName =
    WrappedComponent.displayName || WrappedComponent.name || 'Unknown';

  // $FlowFixMe[escaped-generic]
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
            finalResult = [{ title: query, label: query }];
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
            this.setState({ searching: false });
          }
        });
    };

    render() {
      const { filter, autocomplete, ...restProps } = this.props;
      return (
        // $FlowFixMe
        <WrappedComponent
          {...restProps}
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

//$FlowFixMe[missing-annot]
export default compose(connect(null, mapDispatchToProps), withAutocomplete);

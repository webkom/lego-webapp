// @flow

import React, { Component, type ComponentType } from 'react';
import { debounce } from 'lodash';

type InjectedProps = {
  mazemapSearch: (query: string) => Promise<*>
};

type State = {
  searching: boolean,
  result: Array</*Todo: AutocompleteResult */ Object>
};

function mazemapAutocomplete<Props: {}>(
  WrappedComponent: ComponentType<Props>
) {
  const displayName =
    WrappedComponent.displayName || WrappedComponent.name || 'Unknown';

  return class extends Component<InjectedProps & Props, State> {
    static displayName = `Autocomplete(${displayName})`;

    state = {
      searching: false,
      result: []
    };

    _isMounted = false;

    componentDidMount() {
      this._isMounted = true;
    }

    componentWillUnmount() {
      this._isMounted = false;
    }

    handleSearch = (query: string): void => {
      if (!query) {
        return;
      }
      this.setState({
        searching: true
      });

      Maze.Search.search(query, {
        resultsMax: 10,
        campusId: 1,
        searchForPois: true,
        searchForBuildings: false,
        searchForPoiCategories: false,
        searchForCampuses: false
      })
        .then(results => {
          if (this._isMounted) {
            this.setState({
              result: results.map(result => ({
                label: result.geojson.properties.name,
                value: result.geojson.properties.id
              })),
              searching: false
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
      return (
        // $FlowFixMe
        <WrappedComponent
          {...this.props}
          options={this.state.result}
          onSearch={debounce(query => this.handleSearch(query), 300)}
          fetching={this.state.searching}
        />
      );
    }
  };
}

export default mazemapAutocomplete;

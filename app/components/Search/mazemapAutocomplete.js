// @flow

import { Component, type ComponentType } from 'react';
import { debounce } from 'lodash';
import { stripHtmlTags } from './utils.js';
import 'node_modules/mazemap/mazemap.min.css';
import * as Mazemap from 'mazemap';

type InjectedProps = {
  mazemapSearch: (query: string) => Promise<*>,
  meta: any,
};

type State = {
  searching: boolean,
  result: Array<Object>,
};

function mazemapAutocomplete<Props>({
  WrappedComponent,
}: {
  WrappedComponent: ComponentType<Props>,
}) {
  const displayName =
    WrappedComponent.displayName || WrappedComponent.name || 'Unknown';

  const mazemapSearchController = new Mazemap.Search.SearchController({
    campusid: 1,
    rows: 10,
    withpois: true,
    withbuilding: false,
    withtype: false,
    withcampus: false,
    resultsFormat: 'geojson',
  });

  const mapRoomAndBuildingToResult = (
    poiName: string,
    buildingName: string,
    value: Number
  ): Object => {
    return {
      label: stripHtmlTags(poiName + ', ' + buildingName),
      value: value,
    };
  };

  return class extends Component<InjectedProps & Props, State> {
    static displayName = `Autocomplete(${displayName})`;

    state = {
      searching: false,
      result: [], //first result fetched on mount
    };

    _isMounted = false;

    componentDidMount() {
      this._isMounted = true;
      if (this.props.meta.initial) {
        Mazemap.Data.getPoi(this.props.meta.initial.value).then((poi) =>
          this.setState({
            result: [
              mapRoomAndBuildingToResult(
                poi.properties.title,
                poi.properties.buildingName,
                this.props.meta.initial.value
              ),
            ],
          })
        );
      }
    }

    componentWillUnmount() {
      this._isMounted = false;
    }

    handleSearch = (query: string): void => {
      if (!query) {
        return;
      }
      this.setState({
        searching: true,
      });

      mazemapSearchController
        .search(query)
        .then((results) => {
          if (this._isMounted) {
            this.setState({
              result: results.results.features.map((result) =>
                mapRoomAndBuildingToResult(
                  result.properties.dispPoiNames[0],
                  result.properties.dispBldNames[0],
                  result.properties.poiId
                )
              ),
            });
          }
        })
        .finally(() => {
          if (this._isMounted) {
            this.setState({ searching: false });
          }
        });
    };

    render() {
      return (
        <WrappedComponent
          {...this.props}
          options={this.state.result}
          onSearch={debounce((query) => this.handleSearch(query), 300)}
          fetching={this.state.searching}
        />
      );
    }
  };
}

export default mazemapAutocomplete;

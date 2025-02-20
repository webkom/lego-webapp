import { debounce } from 'lodash';
import { useEffect, useState } from 'react';
import { stripHtmlTags } from './utils';
import type { ComponentType } from 'react';
import 'mazemap/css';

type InjectedProps = {
  options: SelectOption[];
  onSearch: (query: string) => void;
  fetching: boolean;
};

type SelectOption = {
  label: string;
  value: number;
};

const mapRoomAndBuildingToSelectOption = (
  poiName: string,
  buildingName: string,
  value: number,
): SelectOption => {
  return {
    label: stripHtmlTags(poiName + ', ' + buildingName),
    value: value,
  };
};

// This type is incomplete, but contains the parts we use
type MazemapSearchController = {
  search: (query: string) => Promise<{
    results: {
      features: {
        properties: {
          dispPoiNames: string[];
          dispBldNames: string[];
          poiId: number;
        };
      }[];
    };
  }>;
};

export const useMazemapAutocomplete = () => {
  const [options, setOptions] = useState<SelectOption[]>([]);
  const [fetching, setFetching] = useState(false);
  const [mazemapSearchController, setMazemapSearchController] =
    useState<MazemapSearchController>();

  useEffect(() => {
    import('mazemap').then((mazemap) => {
      setMazemapSearchController(
        new mazemap.Search.SearchController({
          campusid: 1,
          rows: 10,
          withpois: true,
          withbuilding: false,
          withtype: false,
          withcampus: false,
          resultsFormat: 'geojson',
        }),
      );
    });
  }, []);

  const onSearch = (query: string) => {
    if (!query) {
      return;
    }

    setFetching(true);

    mazemapSearchController &&
      mazemapSearchController
        .search(query)
        .then((results) => {
          setOptions(
            results.results.features.map((result) =>
              mapRoomAndBuildingToSelectOption(
                result.properties.dispPoiNames[0],
                result.properties.dispBldNames[0],
                result.properties.poiId,
              ),
            ),
          );
        })
        .catch(() => {})
        .finally(() => setFetching(false));
  };

  const debouncedOnSearch = debounce(onSearch, 100);

  return { options, onSearch: debouncedOnSearch, fetching };
};

const withMazemapAutocomplete = <P,>({
  WrappedComponent,
}: {
  WrappedComponent: ComponentType<P & InjectedProps>;
}) => {
  const Component = (props: P) => {
    const { options, onSearch, fetching } = useMazemapAutocomplete();

    return (
      <WrappedComponent
        {...props}
        options={options}
        onSearch={onSearch}
        fetching={fetching}
      />
    );
  };
  const displayName =
    WrappedComponent.displayName || WrappedComponent.name || 'Unknown';
  Component.displayName = `MazemapAutocomplete(${displayName})`;

  return Component;
};

export default withMazemapAutocomplete;

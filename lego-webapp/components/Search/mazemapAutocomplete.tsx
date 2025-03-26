import { debounce } from 'lodash-es';
import { useMemo, useState } from 'react';
import { useWaitForGlobal } from '~/utils/useWaitForGlobal';
import { stripHtmlTags } from './utils';
import type { ComponentType } from 'react';
import '@webkom/mazemap/css';

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

export const useMazemapAutocomplete = () => {
  const Mazemap = useWaitForGlobal('Mazemap');
  const [options, setOptions] = useState<SelectOption[]>([]);
  const [fetching, setFetching] = useState(false);
  const mazemapSearchController = useMemo(() => {
    const SearchController = Mazemap?.Search?.SearchController;
    if (!SearchController) return null;
    return new SearchController({
      campusid: 1,
      rows: 10,
      withpois: true,
      withbuilding: false,
      withtype: false,
      withcampus: false,
      resultsFormat: 'geojson',
    });
  }, [Mazemap]);

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

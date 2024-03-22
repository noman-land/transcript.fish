import { useCallback, useContext, useMemo } from 'react';
import { MultiValue } from 'react-select';
import { Option, Venue } from '../types';
import { useDb } from '../dbHooks';
import { FilterSection } from './FilterSection';
import { FiltersContext } from './FiltersContext';
import { formatVenueName, sortByLabel } from '../utils';
import { DropdownMultiselect } from './DropdownMultiselect';

const nothingFound = () => 'Nothing found';

export const CityFilters = () => {
  const {
    venues: { data: venues },
  } = useDb();

  const { cityFilters, setCityFilters } = useContext(FiltersContext);

  const handleChange = useCallback(
    (options: MultiValue<Option>) => {
      setCityFilters(options.map(({ value }) => value as string));
    },
    [setCityFilters]
  );

  const options = useMemo(() => {
    return Object.entries(venues || {})
      .reduce<Record<string, Set<string>>>((accum, [, { country, city }]) => {
        if (!accum[country]) {
          accum[country] = new Set();
        }
        accum[country].add(city);

        return accum;
      }, {});
  }, [venues]);

  const defaultValue =
    venues &&
    cityFilters.map(city => ({
      value: city,
      label: city,
    }));

  return (
    venues && (
      <FilterSection label="City filters:">
        <DropdownMultiselect
          defaultValue={defaultValue}
          noOptionsMessage={nothingFound}
          placeholder="Search cities"
          options={options}
          onChange={handleChange}
        />
      </FilterSection>
    )
  );
};

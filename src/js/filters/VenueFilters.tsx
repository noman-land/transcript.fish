import { useCallback, useContext, useMemo } from 'react';
import { MultiValue } from 'react-select';
import { Option, Venue } from '../types';
import { FilterSection } from './FilterSection';
import { FiltersContext } from './FiltersContext';
import { formatVenueName, sortByLabel } from '../utils';
import { DropdownMultiselect } from './DropdownMultiselect';
import { DatabaseContext } from '../database/DatabaseProvider';

const nothingFound = () => 'Nothing found';

type GroupedVenueOptions = Record<string, Venue[]>;

export const VenueFilters = () => {
  const {
    venues: { data: venues },
  } = useContext(DatabaseContext);

  const { venueFilters, setVenueFilters } = useContext(FiltersContext);

  const handleChange = useCallback(
    (options: MultiValue<Option>) => {
      setVenueFilters(options.map(({ value }) => value));
    },
    [setVenueFilters]
  );

  const options = useMemo(() => {
    const groupedOptions = Object.entries(venues || {}).reduce(
      (accum, [, venue]) => {
        if (accum[venue.country]) {
          accum[venue.country].push(venue);
        } else {
          accum[venue.country] = [venue];
        }
        return accum;
      },
      {} as GroupedVenueOptions
    );

    return Object.entries(groupedOptions)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([country, venues]) => ({
        label: country,
        options: Object.entries(venues || {})
          .map(([, venue]) => ({
            value: venue.id,
            label: formatVenueName(venue),
          }))
          .sort(sortByLabel),
      }));
  }, [venues]);

  const defaultValue =
    venues &&
    venueFilters.map(id => ({
      value: id,
      label: venues[id].name,
    }));

  return (
    venues && (
      <FilterSection label="Venue filters:">
        <DropdownMultiselect
          defaultValue={defaultValue}
          noOptionsMessage={nothingFound}
          placeholder="Search venues"
          options={options}
          onChange={handleChange}
        />
      </FilterSection>
    )
  );
};

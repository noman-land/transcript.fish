import { useCallback, useContext, useMemo } from 'react';
import Select, { MultiValue, Theme, StylesConfig } from 'react-select';
import { Option, Venue } from '../types';
import { useDb } from '../dbHooks';
import { Colors } from '../constants';
import { FilterSection } from './FilterSection';
import { FiltersContext } from './FiltersContext';
import { formatVenueName } from './filterUtils';

const nothingFound = () => 'Nothing found';

type GroupedVenueOptions = Record<string, Venue[]>;

const sortByLabel = (a: Option, b: Option) =>
  a.label.toLocaleLowerCase().localeCompare(b.label.toLowerCase());

const customTheme = (theme: Theme) => ({
  ...theme,
  colors: {
    ...theme.colors,
    primary: Colors.dimGrey,
    primary25: Colors.lightBlue,
    neutral0: Colors.citrineLighter,
    neutral10: Colors.lightBlue,
    neutral20: Colors.night,
    neutral30: Colors.night,
    neutral40: Colors.dimGrey,
    neutral50: Colors.dimGrey,
    neutral60: Colors.night,
    danger: Colors.slateGrey,
    dangerLight: Colors.lighterBlue,
  },
});

const styles: StylesConfig<Option, true> = {
  container: base => ({
    ...base,
    flexGrow: 1,
  }),
  menu: base => ({
    ...base,
    textAlign: 'left',
    whiteSpace: 'nowrap',
  }),
};

export const VenueFilters = () => {
  const {
    venues: { data: venues },
  } = useDb();

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
        <Select
          defaultValue={defaultValue}
          theme={customTheme}
          styles={styles}
          noOptionsMessage={nothingFound}
          placeholder="Search venues"
          isSearchable={true}
          isClearable={true}
          isMulti={true}
          options={options}
          onChange={handleChange}
        />
      </FilterSection>
    )
  );
};

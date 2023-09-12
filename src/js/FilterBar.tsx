import styled from 'styled-components';
import { useCallback, useMemo } from 'react';
import Select, { MultiValue, Theme, StylesConfig } from 'react-select';
import {
  FilterLabels,
  Option,
  Presenter,
  PresenterFiltersProps,
  SearchField,
  SearchFiltersProps,
  SelectedOption,
} from './types';
import { useDb } from './dbHooks';
import { bold } from './styleUtils';
import { formatName } from './utils';
import { Colors, hosts } from './constants';

export const FilterBar = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  flex-wrap: wrap;
  margin: 1.8rem 3vw 0 0;

  @media (max-width: 900px) {
    margin: 1.8rem 4.5vw 0 0;
  }

  @media (max-width: 650px) {
    margin: 1.8rem 6vw 0 0;
  }

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const FilterSection = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  margin: 0 0 1.8rem 3vw;

  @media (max-width: 900px) {
    margin: 0 0 1.8rem 4.5vw;
  }

  @media (max-width: 650px) {
    margin: 0 0 1.8rem 6vw;
  }

  @media (max-width: 420px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const FilterSectionLabel = styled.span`
  margin: 0 1rem 0.6rem 0;
  ${bold}
`;

const SearchFilterWrapper = styled.div`
  display: flex;
  flex-grow: 1;
  flex-wrap: wrap;

  label {
    margin-right: 1.6rem;
    display: flex;
    align-items: center;
    cursor: pointer;
    white-space: nowrap;
  }

  input {
    margin-left: 0;
    margin-right: 0.3rem;
    height: 1.2rem;
    width: 1.2rem;
    cursor: pointer;
  }
`;

const filterLabels: FilterLabels = {
  description: 'description',
  episode: 'episode number',
  title: 'title',
  words: 'transcript',
};

const noOneFound = () => 'No one found';

type PresenterType = 'host' | 'qiElf' | 'guest';

type GroupedPresenterOptions = Record<PresenterType, Presenter[]>;

export const SearchFilters = ({ selected, onToggle }: SearchFiltersProps) => {
  const handleToggle = useCallback(
    ({ target }: { target: SelectedOption }) => {
      onToggle(target);
    },
    [onToggle]
  );
  return (
    <FilterSection>
      <FilterSectionLabel>Search filters:</FilterSectionLabel>
      <SearchFilterWrapper>
        {Object.entries(selected).map(([name, checked]) => (
          <label key={name}>
            <input
              onChange={handleToggle}
              type="checkbox"
              name={name}
              checked={checked}
            />
            {filterLabels[name as SearchField]}
          </label>
        ))}
      </SearchFilterWrapper>
    </FilterSection>
  );
};

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

const groupLabels: Record<PresenterType, string> = {
  host: 'Hosts',
  qiElf: 'QI Elves',
  guest: 'Guests',
};

export const PresenterFilters = ({ onChange }: PresenterFiltersProps) => {
  const {
    presenters: { data: presenters },
  } = useDb();

  const handleChange = useCallback(
    (options: MultiValue<Option>) => {
      onChange(options.map(({ value }) => value));
    },
    [onChange]
  );

  const options = useMemo(() => {
    const groupedOptions = Object.entries(presenters || {}).reduce(
      (accum, [, pres]) => {
        if (Object.values(hosts).includes(pres.id)) {
          accum.host.push(pres);
        } else if (pres.qiElf) {
          accum.qiElf.push(pres);
        } else if (pres.guest) {
          accum.guest.push(pres);
        }
        return accum;
      },
      {
        host: [],
        qiElf: [],
        guest: [],
      } as GroupedPresenterOptions
    );

    return Object.entries(groupedOptions).map(([type, presenters]) => ({
      label: groupLabels[type as PresenterType],
      options: Object.entries(presenters || {})
        .map(([, presenter]) => ({
          value: presenter.id,
          label: formatName(presenter),
        }))
        .sort(sortByLabel),
    }));
  }, [presenters]);

  return (
    <FilterSection>
      <FilterSectionLabel>Presenter filters:</FilterSectionLabel>
      <Select
        theme={customTheme}
        styles={styles}
        noOptionsMessage={noOneFound}
        placeholder="Search presenters"
        isSearchable={true}
        isClearable={true}
        isMulti={true}
        options={options}
        onChange={handleChange}
      />
    </FilterSection>
  );
};

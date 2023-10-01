import { useCallback, useMemo } from 'react';
import Select, { MultiValue, Theme, StylesConfig } from 'react-select';
import { Option, Presenter, PresenterFiltersProps } from '../types';
import { useDb } from '../dbHooks';
import { formatName } from '../utils';
import { Colors, hosts } from '../constants';
import { FilterSection } from './FilterSection';

const noOneFound = () => 'No one found';

type PresenterType = 'host' | 'qiElf' | 'guest';

type GroupedPresenterOptions = Record<PresenterType, Presenter[]>;

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
    <FilterSection label="Presenter filters:">
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

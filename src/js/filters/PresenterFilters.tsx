import { useCallback, useContext, useMemo } from 'react';
import { MultiValue } from 'react-select';
import type { Option, Presenter } from '../types';
import { formatName } from '../utils';
import { hosts } from '../constants';
import { FilterSection } from './FilterSection';
import { FiltersContext } from './FiltersContext';
import { DropdownMultiselect } from './DropdownMultiselect';
import { sortByLabel } from '../utils';
import { DatabaseContext } from '../database/DatabaseProvider';

const noOneFound = () => 'No one found';

type PresenterType = 'host' | 'qiElf' | 'guest';

type GroupedPresenterOptions = Record<PresenterType, Presenter[]>;

const groupLabels: Record<PresenterType, string> = {
  host: 'Hosts',
  qiElf: 'QI Elves',
  guest: 'Guests',
};

export const PresenterFilters = () => {
  const {
    presenters: { data: presenters },
  } = useContext(DatabaseContext);

  const { presenterFilters, setPresenterFilters } = useContext(FiltersContext);

  const handleChange = useCallback(
    (options: MultiValue<Option>) => {
      setPresenterFilters(options.map(({ value }) => value));
    },
    [setPresenterFilters]
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

  const defaultValue =
    presenters &&
    presenterFilters.map(id => ({
      value: id,
      label: formatName(presenters[id]),
    }));

  return (
    presenters && (
      <FilterSection label="Presenter filters:">
        <DropdownMultiselect
          defaultValue={defaultValue}
          noOptionsMessage={noOneFound}
          placeholder="Search presenters"
          options={options}
          onChange={handleChange}
        />
      </FilterSection>
    )
  );
};

import Select, {
  MultiValue,
  Theme,
  StylesConfig,
  GroupBase,
} from 'react-select';
import type { Option } from '../types';
import { Colors } from '../constants';

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

interface DropdownMultiselectProps {
  defaultValue?: Option[];
  options: (Option | GroupBase<Option>)[];
  onChange: (newValue: MultiValue<Option>) => void;
  placeholder: string;
  noOptionsMessage: () => string;
}

export const DropdownMultiselect = ({
  defaultValue,
  options,
  onChange,
  placeholder,
  noOptionsMessage,
}: DropdownMultiselectProps) => {
  return (
    <Select
      defaultValue={defaultValue}
      theme={customTheme}
      styles={styles}
      noOptionsMessage={noOptionsMessage}
      placeholder={placeholder}
      isSearchable={true}
      isClearable={true}
      isMulti={true}
      options={options}
      onChange={onChange}
    />
  );
};

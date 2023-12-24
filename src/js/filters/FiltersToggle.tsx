import styled from 'styled-components';
import { useContext } from 'react';
import { FiltersContext } from './FiltersContext';

const StyledButton = styled.div`
  display: inline-block;
  cursor: pointer;
  margin: 0;
  border: 0;
  background: none;
  padding: 1rem 1rem 0.6rem 0;
`;

export const FiltersToggle = ({
  isOpen,
  onToggle,
}: {
  isOpen: boolean;
  onToggle: () => void;
}) => {
  const { numFiltersAltered } = useContext(FiltersContext);
  const numAltered = !!numFiltersAltered && `(${numFiltersAltered})`;
  return (
    <div>
      <StyledButton className="text" onClick={onToggle}>
        {isOpen ? '[-] hide' : '[+] show'} filters {numAltered}
      </StyledButton>
    </div>
  );
};

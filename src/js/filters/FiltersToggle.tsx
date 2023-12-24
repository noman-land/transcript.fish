import styled from 'styled-components';

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
  return (
    <div>
      <StyledButton className="text" onClick={onToggle}>
        {isOpen ? '[-] hide' : '[+] show'} filters
      </StyledButton>
    </div>
  );
};

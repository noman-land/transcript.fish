import {
  ChangeEventHandler,
  FocusEventHandler,
  FormEventHandler,
  KeyboardEventHandler,
  useCallback,
  useState,
} from 'react';
import { styled } from 'styled-components';

const StyledPaginator = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem 0;

  .page-numbers {
    padding: 0 0.6rem;
    text-align: center;
    min-width: 150px;
  }

  .page-number {
    font-family: TTE, 'Courier New', Courier, monospace;
    font-size: 1em;
    cursor: pointer;
    padding: 1rem 0.6rem;
    width: 22px;
    text-align: center;
    background: none;
    border: none;
    outline: none;
  }
`;

const StyledButton = styled.button`
  background: none;
  border: none;
  font-family: TTE, 'Courier New', Courier, monospace;
  font-size: 1em;
  min-width: 60px;
  padding: 1rem;

  ${({ disabled }) =>
    disabled
      ? `
      visibility: hidden;  
      `
      : `
      cursor: pointer;

      &:hover {
        text-decoration: underline;
      }
    `}
`;

interface PaginatorProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const preventDefault: FormEventHandler = e => e.preventDefault();

export const Paginator = ({
  page,
  totalPages,
  onPageChange,
}: PaginatorProps) => {
  const [value, setValue] = useState<number | ''>(page);
  const isFirstPage = page === 0;
  const isLastPage = page === totalPages - 1;

  const handleFocus: FocusEventHandler<HTMLInputElement> = useCallback(
    e => e.target.select(),
    []
  );

  const handleBlur = useCallback(() => {
    if (value === '') {
      setValue(page);
    } else {
      onPageChange(value);
      setValue(value);
    }
  }, [value, page, onPageChange]);

  const handleChange: ChangeEventHandler<HTMLInputElement> = useCallback(
    e => {
      if (e.target.value === '') {
        return setValue('');
      }
      const number = Number(e.target.value);
      if (number > 0 && number <= totalPages) {
        setValue(number - 1);
      }
    },
    [totalPages]
  );

  const handleKeyDown: KeyboardEventHandler<HTMLInputElement> = useCallback(
    e => {
      if (e.key === 'Enter') {
        (e.target as HTMLInputElement).blur();
        handleBlur();
      }
    },
    [handleBlur]
  );

  return (
    <StyledPaginator>
      <StyledButton
        name="first-page-button"
        disabled={isFirstPage}
        onClick={() => {
          setValue(0);
          onPageChange(0);
        }}
      >
        {'<<'}
      </StyledButton>
      <StyledButton
        name="previous-page-button"
        disabled={isFirstPage}
        onClick={() => {
          setValue(page - 1);
          onPageChange(page - 1);
        }}
      >
        {'<'}
      </StyledButton>
      <span className="page-numbers">
        page
        <form style={{ display: 'inline' }} onSubmit={preventDefault}>
          <input
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChange={handleChange}
            className="page-number"
            onKeyDown={handleKeyDown}
            value={typeof value === 'number' ? value + 1 : ''}
          />
        </form>
        of <span>{totalPages}</span>
      </span>
      <StyledButton
        name="next-page-button"
        disabled={isLastPage}
        onClick={() => {
          setValue(page + 1);
          onPageChange(page + 1);
        }}
      >
        {'>'}
      </StyledButton>
      <StyledButton
        name="last-page-button"
        disabled={isLastPage}
        onClick={() => {
          setValue(totalPages - 1);
          onPageChange(totalPages - 1);
        }}
      >
        {'>>'}
      </StyledButton>
    </StyledPaginator>
  );
};

import {
  ChangeEventHandler,
  FocusEventHandler,
  FormEventHandler,
  KeyboardEventHandler,
  useCallback,
  useEffect,
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

    @media (max-width: 380px) {
      padding: 0;
    }
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

const Button = styled.button`
  background: none;
  border: none;
  font-family: TTE, 'Courier New', Courier, monospace;
  font-size: 1em;
  min-width: 50px;
  max-width: 50px;
  padding: 1rem 0;

  @media (max-width: 400px) {
    min-width: 40px;
    max-width: 40px;
  }
  @media (max-width: 350px) {
    min-width: 35px;
    max-width: 35px;
  }
  @media (max-width: 325px) {
    min-width: 30px;
    max-width: 30px;
  }
  @media (max-width: 300px) {
    min-width: 25px;
    max-width: 25px;
  }

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
  const [localValue, setLocalValue] = useState<number | ''>(page);
  const isFirstPage = page === 0;
  const isLastPage = page === totalPages - 1;

  // Mirror external value to internal one.
  // This allows independent control of the
  // internal value for validation purposes
  useEffect(() => setLocalValue(page), [page]);

  const handleFocus: FocusEventHandler<HTMLInputElement> = useCallback(
    e => e.target.select(),
    []
  );

  const handleBlur = useCallback(() => {
    if (localValue === '') {
      setLocalValue(page);
    } else {
      onPageChange(localValue);
    }
  }, [localValue, page, onPageChange]);

  const handleChange: ChangeEventHandler<HTMLInputElement> = useCallback(
    e => {
      if (e.target.value === '') {
        return setLocalValue('');
      }
      const number = Number(e.target.value);
      if (number > 0 && number <= totalPages) {
        setLocalValue(number - 1);
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

  const handleFirst = useCallback(() => {
    onPageChange(0);
  }, [onPageChange]);

  const handlePrev = useCallback(() => {
    onPageChange(page - 1);
  }, [onPageChange, page]);

  const handleNext = useCallback(() => {
    onPageChange(page + 1);
  }, [onPageChange, page]);

  const handleLast = useCallback(() => {
    onPageChange(totalPages - 1);
  }, [onPageChange, totalPages]);

  const value = typeof localValue === 'number' ? localValue + 1 : '';

  return (
    <StyledPaginator>
      <Button name="first-page" disabled={isFirstPage} onClick={handleFirst}>
        {'<<'}
      </Button>
      <Button name="previous-page" disabled={isFirstPage} onClick={handlePrev}>
        {'<'}
      </Button>
      <span className="page-numbers">
        page
        <form style={{ display: 'inline' }} onSubmit={preventDefault}>
          <input
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChange={handleChange}
            className="page-number"
            onKeyDown={handleKeyDown}
            value={value}
          />
        </form>
        of <span>{totalPages}</span>
      </span>
      <Button name="next-page" disabled={isLastPage} onClick={handleNext}>
        {'>'}
      </Button>
      <Button name="last-page" disabled={isLastPage} onClick={handleLast}>
        {'>>'}
      </Button>
    </StyledPaginator>
  );
};

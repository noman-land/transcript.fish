import {
  ChangeEventHandler,
  KeyboardEventHandler,
  useEffect,
  useState,
} from 'react';
import { styled, css } from 'styled-components';
import { PaginatorProps } from './types';
import { preventDefault } from './utils';

const StyledPaginator = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.6rem 0;
`;

const PageNumbers = styled.span`
  padding: 0 0.6rem;
  text-align: center;
  min-width: 150px;

  @media (max-width: 360px) {
    padding: 0;
  }

  @media (max-width: 300px) {
    min-width: 80px;

    .total-pages {
      display: none;
    }
  }
`;

const PageNumber = styled.form`
  display: inline;

  input {
    font-family: TTE, 'Courier New', Courier, monospace;
    font-size: 1em;
    cursor: pointer;
    padding: 1rem 0.6rem;
    width: 22px;
    text-align: center;
    background: none;
    border: none;
    outline: none;

    @media (max-width: 300px) {
      padding: 1rem 0 1rem 0.6rem;
    }

    &:hover {
      text-decoration: underline;
    }
  }
`;

const Button = styled.button`
  background: none;
  border: none;
  font-family: TTE, 'Courier New', Courier, monospace;
  font-size: 1.1em;
  min-width: 50px;
  max-width: 50px;
  padding: 1rem 0;

  @media (max-width: 400px) {
    min-width: 40px;
    max-width: 40px;
  }
  @media (max-width: 340px) {
    min-width: 36px;
    max-width: 36px;
  }
  @media (max-width: 320px) {
    min-width: 32px;
    max-width: 32px;
  }

  ${({ disabled }) =>
    disabled
      ? css`
          opacity: 0.5;
        `
      : css`
          cursor: pointer;

          &:hover {
            text-decoration: underline;
          }
        `}
`;

export const PaginationSpacer = styled.div`
  height: 116.2px;
`;

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

  const handleBlur = () => {
    if (localValue === '') {
      setLocalValue(page);
    } else {
      onPageChange(localValue);
    }
  };

  const handleChange: ChangeEventHandler<HTMLInputElement> = e => {
    if (e.target.value === '') {
      setLocalValue('');
      return;
    }
    const number = Number(e.target.value);
    if (number > 0 && number <= totalPages) {
      setLocalValue(number - 1);
    }
  };

  const handleKeyDown: KeyboardEventHandler<HTMLInputElement> = e => {
    if (e.key === 'Enter') {
      (e.target as HTMLInputElement).blur();
      handleBlur();
    }
  };

  const value = typeof localValue === 'number' ? localValue + 1 : '';

  return (
    <StyledPaginator>
      <Button
        name="first-page"
        disabled={isFirstPage}
        onClick={() => onPageChange(0)}
      >
        {'<<'}
      </Button>
      <Button
        name="previous-page"
        disabled={isFirstPage}
        onClick={() => onPageChange(page - 1)}
      >
        {'<'}
      </Button>
      <PageNumbers>
        page
        <PageNumber onSubmit={preventDefault}>
          <input
            onFocus={e => e.target.select()}
            onBlur={handleBlur}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            value={value}
          />
        </PageNumber>
        <span className="total-pages">of {totalPages}</span>
      </PageNumbers>
      <Button
        name="next-page"
        disabled={isLastPage}
        onClick={() => onPageChange(page + 1)}
      >
        {'>'}
      </Button>
      <Button
        name="last-page"
        disabled={isLastPage}
        onClick={() => onPageChange(totalPages - 1)}
      >
        {'>>'}
      </Button>
    </StyledPaginator>
  );
};

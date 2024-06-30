import { FormEventHandler } from 'react';
import styled from 'styled-components';
import { Colors } from './constants';

const StyledForm = styled.form`
  display: flex;
  align-items: stretch;

  input {
    background: ${Colors.citrineLighter};
    border: 0;
    flex-grow: 1;
    padding: 1em 3vw;
    font-size: 1em;
    min-width: 100px;

    @media (max-width: 900px) {
      padding: 1em 4.5vw;
    }
    @media (max-width: 650px) {
      padding: 1em 6vw;
    }

    &:focus {
      outline: 2px solid ${Colors.citrineDark};
    }
  }

  button {
    text-align: center;
    font-size: 1.1rem;
    padding-left: 2rem;
    padding-right: 2rem;
    background: ${Colors.night};
    color: white;
    border: none;
    cursor: pointer;
    @media (max-width: 450px) {
      padding-left: 1.5rem;
      padding-right: 1.5rem;
    }
    @media (max-width: 300px) {
      font-size: 1rem;
      padding-left: 1.1rem;
      padding-right: 1.1rem;
    }
  }
`;

export const SearchBar = ({
  onSubmit,
  placeholder,
}: {
  onSubmit: FormEventHandler;
  placeholder: string;
}) => (
  <StyledForm id="search" onSubmit={onSubmit}>
    <input name="searchTerm" placeholder={placeholder} />
    <button className="bold" type="submit">
      Search
    </button>
  </StyledForm>
);

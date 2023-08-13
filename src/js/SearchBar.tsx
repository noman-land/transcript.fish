import { FormEventHandler } from 'react';
import { styled } from 'styled-components';

const StyledForm = styled.form`
  display: flex;
  align-items: stretch;

  input {
    background: #efe284;
    border: 0;
    flex-grow: 1;
    font-family: TTE, 'Courier New', Courier, monospace;
    padding: 1em 3vw;
    font-size: 1em;
    min-width: 100px;

    &::placeholder {
      opacity: 0.3;
    }

    @media (max-width: 900px) {
      padding: 1em 4.5vw;
    }
    @media (max-width: 650px) {
      padding: 1em 6vw;
    }

    &:focus {
      outline: 2px solid #d2bb3d;
    }
  }

  button {
    text-align: center;
    font-size: 1.1rem;
    padding-left: 2rem;
    padding-right: 2rem;
    background: #2f2a2a;
    color: #ddd9ba;
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

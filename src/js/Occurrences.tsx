import styled from 'styled-components';

const P = styled.p.attrs({ className: 'bold' })`
  margin-top: 0;
  text-align: right;
`;

const pluralize = (count: number) => (count === 1 ? '' : 's');

type Props = { searchTerm: string; occurrences: number };

export const Occurrences = ({ searchTerm, occurrences }: Props) => {
  return (
    <P>
      found {occurrences} utterance{pluralize(occurrences)} of "{searchTerm}"
    </P>
  );
};

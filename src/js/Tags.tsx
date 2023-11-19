import styled from 'styled-components';
import { Colors } from './constants';
import { useContext } from 'react';
import { FiltersContext } from './filters/FiltersContext';
import { EpisodeType, EpisodeTypeFiltersState } from './types';

const TagWrapper = styled.div`
  display: flex;
  align-items: start;
  justify-content: start;
`;

const Tag = styled.button.attrs({ className: 'text' })`
  border: none;
  background: ${Colors.night};
  color: white;
  cursor: pointer;
  padding: 0.3rem 0.5rem;
  margin-bottom: 0.8em;
  border-radius: 2px;

  & + & {
    margin-left: 0.8em;
  }
`;

interface TagsProps {
  live: number;
  compilation: number;
}

export const Tags = ({ live, compilation }: TagsProps) => {
  const { setEpisodeTypeFilters } = useContext(FiltersContext);
  const isLive = !!live;
  const isComp = !!compilation;
  const makeTagClickHandler = (property: EpisodeType) => () => {
    setEpisodeTypeFilters(state => {
      const rest = Object.entries(state).filter(([k]) => k !== property);
      const restOn = (rest as [EpisodeType, boolean][]).some(([k]) => state[k]);
      const restObj = Object.fromEntries(rest.map(([k]) => [k, !restOn]));

      return {
        [property]: true,
        ...restObj,
      } as EpisodeTypeFiltersState;
    });
  };

  return (
    (isLive || isComp) && (
      <TagWrapper>
        {isLive && <Tag onClick={makeTagClickHandler('live')}>Live</Tag>}
        {isComp && (
          <Tag onClick={makeTagClickHandler('compilation')}>Compilation</Tag>
        )}
      </TagWrapper>
    )
  );
};

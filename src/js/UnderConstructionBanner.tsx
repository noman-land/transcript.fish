import { styled } from 'styled-components';
import { mediaUrl } from './utils';

const BannerWrapper = styled.div`
  font-size: 0.8em;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5em;
  text-align: center;
`;

const H2 = styled.h2`
  margin-left: 1vw;
  margin-right: 1vw;
`;

const ConstructionSign = styled.img.attrs({
  src: `${mediaUrl()}/images/construction-sign.gif`,
})`
  width: 50px;

  @media (max-width: 400px) {
    width: 12.5vw;
  }
`;

export const UnderConstructionBanner = () => (
  <BannerWrapper>
    <ConstructionSign />
    <H2>under construction</H2>
    <ConstructionSign />
  </BannerWrapper>
);

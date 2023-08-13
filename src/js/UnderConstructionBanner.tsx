import { styled } from 'styled-components';
import { mediaUrl } from './utils';

const BannerWrapper = styled.div`
  font-size: 0.8em;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5em;
  text-align: center;

  h2 {
    margin-left: 1vw;
    margin-right: 1vw;
  }

  .construction-sign {
    width: 50px;

    @media (max-width: 400px) {
      width: 12.5vw;
    }
  }
`;

const ConstructionSign = () => (
  <img
    className="construction-sign"
    src={`${mediaUrl()}/images/construction-sign.gif`}
  />
);

export const UnderConstructionBanner = () => (
  <BannerWrapper>
    <ConstructionSign />
    <h2>under construction</h2>
    <ConstructionSign />
  </BannerWrapper>
);

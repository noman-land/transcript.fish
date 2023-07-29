import { styled } from 'styled-components';

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
      width: 40px;
    }
    @media (max-width: 360px) {
      width: 32px;
    }
    @media (max-width: 320px) {
      width: 24px;
    }
  }
`;

const ConstructionSign = () => (
  <img
    className="construction-sign"
    src="https://media.transcript.fish/images/construction-sign.gif"
  />
);

export const UnderConstructionBanner = () => (
  <BannerWrapper>
    <ConstructionSign />
    <h2>under construction</h2>
    <ConstructionSign />
  </BannerWrapper>
);

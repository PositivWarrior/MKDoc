import styled from 'styled-components';

const HeaderContainer = styled.header`
  background-color: white;
  padding: 1rem 0;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  position: sticky;
  top: 0;
  z-index: 50;
`;

const HeaderContent = styled.div`
  max-width: 1920px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media (max-width: 1280px) {
    padding: 0 1rem;
  }
`;

const Title = styled.h1`
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: #1e293b;
`;

const ContactInfo = styled.div`
  display: flex;
  gap: 2rem;
  align-items: center;

  a {
    color: #64748b;
    text-decoration: none;
    font-size: 0.875rem;
    transition: color 0.2s;

    &:hover {
      color: #2563eb;
    }
  }

  @media (max-width: 640px) {
    gap: 1rem;
  }
`;

const Header = () => {
  return (
    <HeaderContainer>
      <HeaderContent>
        <Title>LukMeg Verdivurdering</Title>
        <ContactInfo>
          <a href="tel:+4799854333">+47 998 54 333</a>
          <a href="mailto:lukmegnorge@gmail.com">lukmegnorge@gmail.com</a>
        </ContactInfo>
      </HeaderContent>
    </HeaderContainer>
  );
};

export default Header; 
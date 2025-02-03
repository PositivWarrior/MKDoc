import styled from 'styled-components';

const HeaderContainer = styled.header`
  background-color: #2563eb;
  color: white;
  padding: 1.5rem;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  margin: 0;
  font-size: 2rem;
  font-weight: 600;
`;

const Subtitle = styled.p`
  margin: 0.5rem 0 0;
  font-size: 1rem;
  opacity: 0.9;
`;

const Header = () => {
  return (
    <HeaderContainer>
      <Title>MKDoc</Title>
      <Subtitle>Create and manage your documents with ease</Subtitle>
    </HeaderContainer>
  );
};

export default Header; 
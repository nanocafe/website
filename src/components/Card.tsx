import styled from '@emotion/styled';

export const Card = styled.div`
  border-left: 3px solid var(--primary-border);
  background: linear-gradient(90deg, var(--primary-transparent), rgba(0, 0, 0, 0));
  padding: 0.5rem;

  @media (max-width: 540px) {
    margin: 1rem -1rem;
    padding: 1rem;
  }
`;
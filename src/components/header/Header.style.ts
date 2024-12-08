import { Link } from 'react-router-dom';
import styled from 'styled-components';

export const HeaderWrapper = styled.header`
  background-color: purple;
  align-items: center;
  min-height: 7vh;
  z-index: 100;
`;

export const HeaderLink = styled(Link)`
  text-decoration: none;
  color: white;
  font-size: 30px;
  font-weight: bold;

  &:focus,
  &:hover {
    color: black;
  }
`;

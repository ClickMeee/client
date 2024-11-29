import styled from 'styled-components';

type ButtonWrapperProps = {
  buttonType: 'common' | 'start' | 'click';
};

export const ButtonWrapper = styled.button<ButtonWrapperProps>`
  border: none;
  border-radius: 5px;
  background-color: #333;
  color: #fff;
  cursor: pointer;

  ${({ buttonType }) => {
    switch (buttonType) {
      case 'common':
        return `
            padding: 30px 50px;
        `;
      case 'start':
        return `
            padding: 50px 80px;
        `;
      case 'click':
        return `
            padding: 100px 100px;
        `;
      default:
        return `
                padding: 10px 20px;
            `;
    }
  }}
`;

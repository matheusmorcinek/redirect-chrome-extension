import styled from "styled-components";
import Button from '@mui/material/Button';

export default styled(Button)`
  && {
    color: white;
    background-color: #18bb8f;
    text-transform: none;
    &:hover {
        background-color: #747474;
      }
      ${({ variant }) => variant === 'text' && `
    background: transparent;
    color: #191414;
  `
  }
`;
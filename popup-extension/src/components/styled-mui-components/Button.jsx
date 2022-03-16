import styled from "styled-components";
import Button from '@mui/material/Button';

export default styled(Button)`
  && {
    color: white;
    background-color: #18bb8f;
    &:hover {
        background-color: #747474;
      }
  }
`;
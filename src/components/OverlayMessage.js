import React from "react";
import styled from "styled-components";
import Alert from "react-bootstrap/Alert";

const Styles = styled.div`
  position: absolute;
    left: 50%;
    transform: translateX(-50%);
    top: 5%;
    z-index: 10;
`;

export default function OverlayMessage(props) {
  if (!props.msg) return null
  setTimeout(() => props.clearMsg(), 3000);
  return (
    <Styles>
      <Alert variant={props.msg.variant}>
        {props.msg.msg}
      </Alert>
    </Styles>
  );
}

import React, {useState} from "react";
import styled from "styled-components";
import Alert from "react-bootstrap/Alert";

const Styles = styled.div`
  position: absolute;
    left: 50%;
    transform: translateX(-50%);
    top: 5%;
    z-index: 10;
`;

export default function OverlayMessage({msg}) {
  const [show, setShow] = useState(true);

  if (show) {
    setTimeout(() => setShow(false), 3000);
    return (
      <Styles>
        <Alert variant={msg.variant}>
          {msg.msg}
        </Alert>
      </Styles>
    );
  }
  return null;
}
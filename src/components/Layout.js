import React from 'react';
import {Container} from 'react-bootstrap';


export const Layout = (props) => (
  <Container style={{"marginTop": "20px"}}>
    {props.children}
  </Container>
)
import styled from "styled-components";
import * as React from "react";

export const HeaderWrapper = styled.div`
  padding: 1em 3em 5em 3em;
  `;


export function LayoutHeader(props) {
  return (
    <HeaderWrapper>
      <div style={{"float": "left", "fontSize": "1.2em"}}>
        <h1>{props.content}</h1>
      </div>
    </HeaderWrapper>
  )
}

export function ErrorMessage({error}) {
  if (!error)
    return null
  return (
    <p style={{"color": "red"}}>{error}</p>
  )
}
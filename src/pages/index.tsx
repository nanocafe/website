import styled from "@emotion/styled";
import React from "react";
import { News } from "../components/News";
import { Visualization } from "../components/Visualization";

const Container = styled.main`
  flex: 1;

  div {
    margin-top: 1rem;
    text-align: center;
  }
`;

export default function Home () {
  return (
    <Container>
      <Visualization />
      <News />
    </Container>
  );
};

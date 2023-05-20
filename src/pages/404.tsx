import { css } from "@emotion/css";
import React from "react";
import { BsQuestionDiamond } from "react-icons/bs";

const notFound = css`
  text-align: center;
  padding: 3rem;

  h2 {
    margin-top: 1rem;
    font-size: 2rem;
  }

  p {
    margin-top: 0.5rem;
  }
`;

export default function NotFound () {
  return (
    <div className={notFound}>
      <BsQuestionDiamond size="5rem" color="var(--primary)" />
      <h2>404 Not Found</h2>
      <p>The page you are looking for doesn&apos;t exist. Is the URL correct?</p>
    </div>
  );
};

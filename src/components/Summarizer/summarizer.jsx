/* eslint-disable react/prop-types */
import React from "react";

const Summarizer = (props) => {
  return (
    <React.Fragment>
      {props.transcribedText.length > 0 && (
        <div className="output-container">
          {props.transcribedText.length > 0 && (
            <div className="summary-container">{props.summarizedText}</div>
          )}
        </div>
      )}
    </React.Fragment>
  );
};

export default Summarizer;

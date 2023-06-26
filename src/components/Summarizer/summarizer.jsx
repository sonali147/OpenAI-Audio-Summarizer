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
      {props.summarizedText.length > 0 && (
        <>
          <div className="prompt-container">
            Please add your prompt below
          </div>
          <textarea 
            className="text-area"
            value={props.completionPrompt} 
            onChange={e => props.setCompletionPrompt(e.currentTarget.value)} 
          />
        </>
      )}
    </React.Fragment>
  );
};

export default Summarizer;

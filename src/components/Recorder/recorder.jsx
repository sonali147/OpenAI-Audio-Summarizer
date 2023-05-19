import React from "react";
import { useReactMediaRecorder } from "react-media-recorder";

const Recorder = (props) => {
  const { status, startRecording, pauseRecording, resumeRecording, stopRecording, mediaBlobUrl } =
    useReactMediaRecorder({ 
      // eslint-disable-next-line react/prop-types
      onStop: (blobUrl, blob) => {props.onStopRecording(blob)},  
      audio: true,
      blobPropertyBag: { type: 'audio/webm' },
    });

  console.log("Recording status >> ", status);

  return (
    <React.Fragment>
    {status=='stopped' || status == 'idle' && status != 'paused' ? (
      <button onClick={startRecording}>Start Recording</button>
    ) : status == 'recording' && status != 'paused' ? (
      <div>
        <div className="recording-section">
          <div className="recording-animation-container">
            <div className="recording-animation">{status}</div>
          </div>
        </div>
        <div className="button-container">
          <button onClick={pauseRecording}>Pause Recording</button>
          <button onClick={stopRecording}>Stop Recording</button>
        </div>
      </div>
    ) : (
      <div>
        <div className="recording-section">
          <div className="recording-animation-container">
            <div className="recording-animation paused">Recording Paused</div>
          </div>
        </div>
        <div className="button-container">
          <button onClick={resumeRecording}>Resume Recording</button>
          <button onClick={stopRecording}>Stop Recording</button>
        </div>
      </div>
    )}
    {status == 'stopped' && <audio className='audio-container' src={mediaBlobUrl} controls loop />}
    </React.Fragment>
  )
};

export default Recorder;
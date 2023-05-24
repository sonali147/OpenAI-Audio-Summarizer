import React from "react";
import { useReactMediaRecorder } from "react-media-recorder";

const Recorder = (props) => {
  const [permission, setPermission] = React.useState(false);
  const getMicrophonePermission = async () => {
    if ('MediaRecorder' in window) {
        try {
            await navigator.mediaDevices.getUserMedia({
                audio: true,
            });
            setPermission(true);
        } catch (err) {
            alert(err.message);
        }
    } else {
        alert("The MediaRecorder API is not supported in your browser.");
    }
};

  const { status, startRecording, pauseRecording, resumeRecording, stopRecording, mediaBlobUrl } =
    useReactMediaRecorder({ 
      // eslint-disable-next-line react/prop-types
      onStop: (blobUrl, blob) => {props.onStopRecording(blob)},  
      audio: true,
      blobPropertyBag: { type: 'audio/webm' },
    });

  console.log("Recording status >> ", status);
  console.log("Recording permission >> ", permission);

  return (
    <React.Fragment>
    {!permission && <button onClick={getMicrophonePermission}>Get Microphone</button>}
    {(status=='stopped' || status == 'idle') && status != 'paused' ? (
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
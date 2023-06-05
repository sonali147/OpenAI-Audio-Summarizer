import React from "react";
// import AudioRecorderPolyfill from "audio-recorder-polyfill";

// window.MediaRecorder = AudioRecorderPolyfill;

class AudioRecorder extends React.PureComponent {
  recorderRef = React.createRef();

  state = {
    audioURL: "",
    status: "idle"
    // isRecording: false
  };

  async initAudio() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true
      });

      console.log("ready to record!");
      this.recorderRef.current = new MediaRecorder(stream);

      this.recorderRef.current.addEventListener(
        "dataavailable",
        this.onRecordingReady
      );
    } catch (error) {
      console.error("getUserMedia failed:", error.name);
    }
  }

  componentDidMount() {
    this.initAudio();
  }

  onRecordingReady = async e => {
    const audioChunks = [];
    audioChunks.push(e.data);
    const blob = new Blob(audioChunks, { type: "audio/wav" });
    const blobUrl = URL.createObjectURL(blob);

    this.setState(
      {
        audioURL: blobUrl
      },
      () => {
        this.sendFile(blob);
        // eslint-disable-next-line react/prop-types
        this.props.onStopRecording(blob);
      }
    );
  };

  startRecording = () => {
    this.recorderRef.current.start();
    this.setState({
      status: "recording"
      // isRecording: !this.state.isRecording
    });
  };

  stopRecording = () => {
    this.recorderRef.current.stop();
    // this.recorderRef.current.stream.getTracks().forEach(i => i.stop());
    this.setState({
      status: "stopped"
      // isRecording: !this.state.isRecording
    });
  };

  pauseRecording = () => {
    this.recorderRef.current.pause();
    this.setState({
      status: "paused"
      // isRecording: !this.state.isRecording
    });
  };

  resumeRecording = () => {
    this.recorderRef.current.resume();
    this.setState({
      status: "recording"
      // isRecording: !this.state.isRecording
    });
  };

  sendFile(file) {
    console.log("========= file", file);
  }

  render() {
    const { audioURL, status } = this.state;

    return (
      // <div>
      //   AudioRecorder
      //   <div>
      //     <button onClick={this.startRecording} disabled={status !== "idle"}>
      //       Start recording
      //     </button>
      //     <button onClick={this.stopRecording} disabled={status === "recording"}>
      //       Stop recording
      //     </button>
      //     {audioURL && <audio src={audioURL} controls />}
      //   </div>
      // </div>
      <React.Fragment>
        {(status=='stopped' || status == 'idle') && status != 'paused' ? (
          <button onClick={this.startRecording}>Start Recording</button>
        ) : status == 'recording' && status != 'paused' ? (
          <div>
            <div className="recording-section">
              <div className="recording-animation-container">
                <div className="recording-animation">{status}</div>
              </div>
            </div>
            <div className="button-container">
              <button onClick={this.pauseRecording}>Pause Recording</button>
              <button onClick={this.stopRecording}>Stop Recording</button>
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
              <button onClick={this.resumeRecording}>Resume Recording</button>
              <button onClick={this.stopRecording}>Stop Recording</button>
            </div>
          </div>
        )}
        {status == 'stopped' && <audio className='audio-container' src={audioURL} controls loop />}
      </React.Fragment>
    );
  }
}

export default AudioRecorder;

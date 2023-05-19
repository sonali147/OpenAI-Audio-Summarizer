import { useState } from "react";
import { Configuration, OpenAIApi } from "openai";
import "./App.css";
import DropZone from "./components/Dropzone/dropzone";
import Recorder from "./components/Recorder/recorder";
import Transcriber from "./components/Transcriber/transcriber";
import Summarizer from "./components/Summarizer/summarizer";

class CustomFormData extends FormData {
  getHeaders() {
    return {};
  }
}

function App() {
  const [audioChunks, setAudioChunks] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [transcribedText, setTranscribedText] = useState("");
  const [summarizedText, setSummarizedText] = useState("");

  const configuration = new Configuration({
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
    formDataCtor: CustomFormData,
  });
  // Delete it
  delete configuration.baseOptions.headers["User-Agent"];

  const openai = new OpenAIApi(configuration);

  const initialize = () => {
    setAudioChunks([]);
    setSelectedFile(null);
    setTranscribedText("");
    setSummarizedText("");
  }

  const handleFileSelect = (file) => {
    setSelectedFile(file);
  };

  const handleAudioChunks = (chunks) => {
    console.log("handleAudioChunks", chunks.length)
    setAudioChunks(chunks);
  };

  const transcribeAudio = async () => {
    try {
      let response = null;
      if (selectedFile) {
        console.log("selectedFile exists", selectedFile instanceof File);
        response = await openai.createTranscription(selectedFile, "whisper-1");
      } else {
        console.log("transcribeAudio", audioChunks.length);
        const blob = new Blob(audioChunks, { type: "audio/webm" });
        const audioFile = new File([blob], 'recorded_audio.webm', { type: 'audio/webm' });
        console.log("audioFile exists", audioFile instanceof File);
        response = await openai.createTranscription(audioFile, "whisper-1");
      }
      console.log(response);
      if (response.error) {
        throw new Error(response.error.message);
      }
      setTranscribedText(response.data.text);
    } catch (error) {
      console.log("Error transcribing audio:", error);
    } finally {
      setAudioChunks([]);
    }
  };

  const summarize = async () => {
    try {
      const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: `${transcribedText}\n\nTl;dr`,
        temperature: 0.7,
        max_tokens: 60,
        top_p: 1.0,
        frequency_penalty: 0.0,
        presence_penalty: 1,
      });
      if (response.error) {
        throw new Error(response.error.message);
      }
      setSummarizedText(response.data.choices[0].text);
      console.log(response); // Handle the summarized text data here
    } catch (error) {
      console.log("Error summarizing text:", error);
    }
  };

  // const transcribeAudio = async () => {
  //   setTranscribedText(
  //     "Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of 'de Finibus Bonorum et Malorum' (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, 'Lorem ipsum dolor sit amet..', comes from a line in section 1.10.32. The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from 'de Finibus Bonorum et Malorum' by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham."
  //   );
  // };

  // const summarize = async () => {
  //   setSummarizedText(
  //     "Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC."
  //   );
  // };

  return (
    <div className="app">
      <h1>AI Audio Summarizer</h1>
      <DropZone initialize={initialize} onFileDrop={handleFileSelect} />
      {!selectedFile && <Recorder initialize={initialize} onStopRecording={handleAudioChunks} />}
      {(audioChunks.length > 0 || selectedFile) &&
        transcribedText.length === 0 && (
          <div>
            <div style={{ marginBottom: "10px" }}>
              Audio Ready... Click to proceed !!!
            </div>
            <button onClick={transcribeAudio}>Transcribe Audio</button>
          </div>
        )}
      {transcribedText.length > 0 && (
        <div className="container">
          <Transcriber
            transcribedText={transcribedText}
          />
          <div className="divider">
            <button className="button-container" onClick={summarize}>
              Summarize
            </button>
            <button className="button-container" onClick={initialize}>
              Retry
            </button>
          </div>
          <Summarizer
            summarize={summarize}
            transcribedText={transcribedText}
            summarizedText={summarizedText}
          />
        </div>
      )}
      <p className="footer">Powered by OpenAI</p>
    </div>
  );
}

export default App;

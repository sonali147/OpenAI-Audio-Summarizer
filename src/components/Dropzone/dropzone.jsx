import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import './dropzone.css'

// eslint-disable-next-line react/prop-types
const DropZone = ({initialize, onFileDrop}) => {
  const [myFile, setMyFile] = useState(null);

  const handleDrop = useCallback((acceptedFiles, initialize, onFileDrop) => {
    initialize();
    if (acceptedFiles.length === 1) {
      setMyFile(acceptedFiles[0])
      onFileDrop(acceptedFiles[0]);
    } else {
      console.log("Please select only one audio file.");
    }  
  }, [])

  const onFileDialogCancel = useCallback((initialize) => {
    // Handle the file selection dialog cancel event
    initialize();
    console.log('File selection dialog canceled');
  }, []);

  // const removeFile = file => () => {
  //   const newFiles = [...myFiles]
  //   newFiles.splice(newFiles.indexOf(file), 1)
  //   setMyFiles(newFiles)
  // }

  const removeAll = () => {
    setMyFile(null)
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (files) => handleDrop(files, initialize, onFileDrop),
    onFileDialogCancel: () => onFileDialogCancel(initialize),
    accept: {
      'audio/*' : ['.mp3', '.mp4', '.mpeg', '.mpga', '.m4a', '.wav', '.webm']
    }, // Accept only audio files
    maxFiles: 1, // Limit to one file
    multiple: false,
    name: 'audio',
  });

  return (
    <div {...getRootProps({ className: "dropzone" })}>
      <input className="input-zone" {...getInputProps()} />
      <div className="text-center">
        {isDragActive ? (
          <p className="dropzone-content">
            Drop the audio file here...
          </p>
        ) : (
          <p className="dropzone-content">
            Drag and drop audio file here, or click to select file<br/>(Only *.mp3, *.mp4, *.mpeg, *.mpga, *.m4a, *.wav and *.webm audio will be accepted)
          </p>
        )}
      </div>
      <aside>
        {myFile && (<p style={{color: '#535bf2'}}>{myFile.path} - {myFile.size} bytes</p>)}
      </aside>
      {myFile && <button onClick={removeAll}>Remove</button>}
    </div>
  );
};

export default DropZone;

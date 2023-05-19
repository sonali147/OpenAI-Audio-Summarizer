import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import './dropzone.css'

// eslint-disable-next-line react/prop-types
const DropZone = ({initialize, onFileDrop}) => {
  const [myFiles, setMyFiles] = useState([])

  const handleDrop = useCallback((acceptedFiles, initialize, onFileDrop) => {
    initialize();
    if (acceptedFiles.length === 1) {
      setMyFiles([...myFiles, acceptedFiles[0]])
      onFileDrop(acceptedFiles[0]);
    } else {
      console.log("Please select only one audio file.");
    }  
  }, [myFiles])

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
    setMyFiles([])
  }

  const { getRootProps, getInputProps, isDragActive, acceptedFiles } = useDropzone({
    onDrop: (files) => handleDrop(files, initialize, onFileDrop),
    onFileDialogCancel: () => onFileDialogCancel(initialize),
    acceptedFiles: "audio/*", // Accept only audio files
    maxFiles: 1, // Limit to one file
    multiple: false,
  });

  const files = acceptedFiles.map((file) => (
    <li key={file.path}>
      {file.path} - {file.size} bytes
      {/* <button onClick={removeFile(file)}>Remove File</button> */}
    </li>
  ));

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
            Drag and drop audio file here, or click to select file
          </p>
        )}
      </div>
      <aside>
      {files.length > 0 && <h4>Files</h4>}
      {files}
      </aside>
      {files.length > 0 && <button onClick={removeAll}>Remove</button>}
    </div>
  );
};

export default DropZone;

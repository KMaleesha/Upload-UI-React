import React, { useRef, useState } from "react";
import "./FileUpload.css";
import axios from "axios";

const FileUpload = () => {
    const inputRef = useRef();

    const [selectedFile, setSelectedFile] = useState(null);
    const [progress, setProgress] = useState(0);
    const [uploadStatus, setUploadStatus] = useState("select");

    const handleFileChange = (event) => {
        if (event.target.files && event.target.files.length > 0) {
            setSelectedFile(event.target.files[0]);
        }
    };

    const onChooseFile = () => {
        inputRef.current.click();
    };

    const clearFileInput = () => {
        inputRef.current.value = "";
        setSelectedFile(null);
        setProgress(0);
        setUploadStatus("select");
    };

    const handleUpload = async () => {
        if (uploadStatus === "done") {
            clearFileInput();
            return;
        }

        try {
            setUploadStatus("uploading");

            const formData = new FormData();
            formData.append("file", selectedFile);

            await axios.post(
                // Add your server URL here
                "YOUR_SERVER_URL",
                formData,
                {
                    onUploadProgress: (progressEvent) => {
                        const percentCompleted = Math.round(
                            (progressEvent.loaded * 100) / progressEvent.total
                        );
                        setProgress(percentCompleted);
                    },
                }
            );

            setUploadStatus("done");
        } catch (error) {
            setUploadStatus("select");
        }
    };

    return (
        <div className="upload-container">
            <input
                ref={inputRef}
                type="file"
                onChange={handleFileChange}
                style={{ display: "none" }}
            />

            <div className="form-container">
                <button className="file-btn" onClick={onChooseFile}>
                    <span className="material-symbols-outlined">upload</span> Upload File
                </button>

                {selectedFile && (
                    <div>
                        <div className="file-card">
                            <span className="material-symbols-outlined icon">description</span>

                            <div className="file-info">
                                <div style={{ flex: 1 }}>
                                    <h6>{selectedFile?.name}</h6>

                                    <div className="progress-bg">
                                        <div className="progress" style={{ width: `${progress}%` }} />
                                    </div>
                                </div>

                                {uploadStatus === "select" ? (
                                    <button onClick={clearFileInput}>
                                        <span className="material-symbols-outlined close-icon">
                                            close
                                        </span>
                                    </button>
                                ) : (
                                    <div className="check-circle">
                                        {uploadStatus === "uploading" ? (
                                            `${progress}%`
                                        ) : uploadStatus === "done" ? (
                                            <span
                                                className="material-symbols-outlined"
                                                style={{ fontSize: "20px" }}
                                            >
                                                check
                                            </span>
                                        ) : null}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                <div>
                    <button className="upload-btn" onClick={handleUpload}>
                        {uploadStatus === "select" || uploadStatus === "uploading"
                            ? "Upload"
                            : "Done"}
                    </button>
                </div>

            </div>
        </div>

    );
};

export default FileUpload;

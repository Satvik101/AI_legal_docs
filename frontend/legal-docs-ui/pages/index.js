import React, { useState } from "react";
import axios from "axios";

function App() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [document, setDocument] = useState(null);

  const generateDocument = async () => {
    try {
      const response = await axios.post("http://localhost:8000/generate/", {
        title,
        description,
      });
      setDocument(response.data);
    } catch (error) {
      console.error("Error generating document:", error);
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "50px" }}>
      <h1>AI-Powered Legal Document Generator</h1>
      <input
        type="text"
        placeholder="Document Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={{ padding: "10px", margin: "10px", width: "300px" }}
      />
      <textarea
        placeholder="Describe the document..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        style={{ padding: "10px", margin: "10px", width: "300px", height: "100px" }}
      />
      <br />
      <button onClick={generateDocument} style={{ padding: "10px 20px" }}>
        Generate Document
      </button>

      {document && (
        <div style={{ marginTop: "20px", textAlign: "left", maxWidth: "600px", margin: "auto" }}>
          <h2>{document.title}</h2>
          <p>{document.content}</p>
        </div>
      )}
    </div>
  );
}

export default App;

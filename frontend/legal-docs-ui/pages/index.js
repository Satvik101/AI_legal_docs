import { useState } from "react";
import axios from "axios";

export default function Home() {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");

  const handleGenerate = async () => {
    try {
      const res = await axios.post("http://127.0.0.1:8000/generate", { prompt: input });
      setResponse(res.data.output);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>AI Legal Document Generator</h1>
      <textarea
        placeholder="Enter your document details..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        rows={5}
        cols={50}
      />
      <br />
      <button onClick={handleGenerate}>Generate</button>
      <h2>Generated Document:</h2>
      <p>{response}</p>
    </div>
  );
}

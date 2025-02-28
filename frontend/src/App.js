import React, { useState } from "react";
import axios from "axios";
import wikipedia
import wikipediaapi



function App() {
  const [query, setQuery] = useState("");
  const [wikiResult, setWikiResult] = useState("");
  const [aiResult, setAiResult] = useState("");
  const [youtubeResults, setYoutubeResults] = useState([]);

  const fetchResults = async () => {
    if (!query) return;

    try {
      // Fetch Wikipedia Summary
      const wikiResponse = await axios.get(`http://127.0.0.1:5000/api/wikipedia?query=${query}`);
      setWikiResult(wikiResponse.data.summary);

      // Fetch Gemini AI Response
      const fetchGeminiResponse = async (query) => {
        const response = await fetch("http://127.0.0.1:5000/api/gemini", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ query }) // Send query in request body
        });
    
        const data = await response.json();
        console.log("Gemini AI Response:", data);
    };

      // Fetch YouTube Videos
      const youtubeResponse = await axios.get(`http://127.0.0.1:5000/api/youtube?query=${query}`);
      setYoutubeResults(youtubeResponse.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <div style={{ color: "green", backgroundColor: "black", minHeight: "100vh", padding: "20px" }}>
      <h1 style={{ textAlign: "center" }}>BuzZ.Ai</h1>
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <input 
          type="text" 
          value={query} 
          onChange={(e) => setQuery(e.target.value)} 
          onKeyDown={(e) => e.key === "Enter" && fetchResults()} 
          placeholder="Search something..." 
          style={{ padding: "10px", width: "60%", fontSize: "16px" }}
        />
        <button onClick={fetchResults} style={{ marginLeft: "10px", padding: "10px", fontSize: "16px" }}>Deep-Buzz 0_0</button>
      </div>

      {wikiResult && (
        <div style={{ backgroundColor: "#222", padding: "10px", marginBottom: "20px" }}>
          <h2>Wikipedia Summary:</h2>
          <p>{wikiResult}</p>
        </div>
      )}

      {aiResult && (
        <div style={{ backgroundColor: "#222", padding: "10px", marginBottom: "20px" }}>
          <h2>Gemini AI Response:</h2>
          <p>{aiResult}</p>
        </div>
      )}

      {youtubeResults.length > 0 && (
        <div style={{ backgroundColor: "#222", padding: "10px" }}>
          <h2>YouTube Videos:</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px" }}>
            {youtubeResults.map((video, index) => (
              <div key={index}>
                <a href={`https://www.youtube.com/watch?v=${video.id.videoId}`} target="_blank" rel="noopener noreferrer">
                  <img src={video.snippet.thumbnails.medium.url} alt={video.snippet.title} style={{ width: "100%" }} />
                </a>
                <p>{video.snippet.title}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;

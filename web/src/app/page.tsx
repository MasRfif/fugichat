"use client";
import { useState, useEffect } from "react";

const LiveStudioFugi = () => {
  const [isTalking, setIsTalking] = useState(false);
  const [talkDuration, setTalkDuration] = useState(3000); // Default 3s

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:62024");

    ws.onmessage = (event) => {
      console.log("Raw WebSocket message:", event.data);

      try {
        const { event: eventType, data } = JSON.parse(event.data);
        console.log(`Parsed Event: ${eventType}`, data);

        if (eventType === "chat" && data?.comment) {
          // Calculate duration based on text length (100ms per character)
          let duration = Math.min(
            Math.max(data.comment.length * 100, 2000),
            7000
          ); // Between 2s - 7s
          setTalkDuration(duration);

          // Show talking image
          setIsTalking(true);

          // Switch back to idle after the calculated duration
          setTimeout(() => setIsTalking(false), duration);
        }
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    };

    ws.onclose = () => console.log("WebSocket connection closed");
    ws.onerror = (err) => console.error("WebSocket error:", err);

    return () => ws.close();
  }, []);

  return (
    <div>
      <img
        src={isTalking ? "/talking.png" : "/idle.png"}
        alt="Fugi"
        style={{
          width: "400px", // Adjust as needed for Live Studio
          height: "400px",
          opacity: isTalking ? 1 : 0.2, // Instant switch
        }}
      />
    </div>
  );
};

export default LiveStudioFugi;

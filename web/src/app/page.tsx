"use client";
import { useState, useEffect } from "react";

const LiveStudioFugi = () => {
  const [isTalking, setIsTalking] = useState(false);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:62024");

    ws.onmessage = (event) => {
      console.log("Raw WebSocket message:", event.data);

      try {
        const { event: eventType, data } = JSON.parse(event.data);
        console.log(`Parsed Event: ${eventType}`, data);

        if (eventType === "chat" && data?.comment) {
          const duration = Math.min(
            Math.max(data.comment.length * 100, 2000),
            7000
          );

          setIsTalking(true);

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
        src={
          isTalking
            ? "https://i.imgur.com/ZV8eBNa.png"
            : "https://i.imgur.com/ZV8eBNa.png"
        }
        alt="Fugi"
        width={400}
        height={400}
        style={{
          filter: isTalking ? "brightness(1)" : "brightness(0.4)",
        }}
      />
    </div>
  );
};

export default LiveStudioFugi;

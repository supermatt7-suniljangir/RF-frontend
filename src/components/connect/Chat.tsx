"use client";
import { useSocket } from "@/contexts/SocketContext";
import { useEffect, useState } from "react";

export default function Chat() {
    const socket = useSocket();
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);

    // Listen for incoming messages
    useEffect(() => {
        if (socket) {
            socket.on("receiveMessage", (data) => {
                console.log("Received message:", data);
                setMessages((prev) => [...prev, data]);
            });
        }

        // Cleanup listener on unmount
        return () => {
            if (socket) {
                socket.off("receiveMessage");
            }
        };
    }, [socket]);

    const handleSendMessage = () => {
        if (socket && message) {
            console.log("Sending message:", message);
            socket.emit("sendMessage", { text: message, to: "67c5df22c49ca276a6e2af8e" });
            setMessage("");
        }
    };

    return (
        <div>
            <h1>Chat</h1>
            <div>
                {messages.map((msg, index) => (
                    <div key={index}>{msg.text}</div>
                ))}
            </div>
            <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
            />
            <button onClick={handleSendMessage}>Send</button>
        </div>
    );
}
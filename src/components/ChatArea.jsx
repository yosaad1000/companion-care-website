import React, { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { CircleX } from "lucide-react";

function ChatArea({ selectedUser }) {
  const { user } = useAuth();
  const userId = user.id;
  const roomId = selectedUser.roomIds.doctorRoomId;

  const [ws, setWs] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Request notification permission
    if (Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    const fetchPreviousChats = async () => {
      try {
        setIsLoading(true);
        const url = `${import.meta.env.VITE_BACKEND_URL}/chats/${roomId}`;
        const response = await axios.get(url);
        const res = await response.data;
        const chats = res.data.chats.map((chat) => ({
          senderId: chat.senderId,
          message: chat.message,
          messageType: chat.messageType,
          timestamp: chat.createdAt,
        }));
        setMessages(chats);
      } catch (error) {
        console.error("Error fetching previous chats:", error);
      }
      finally {
        setIsLoading(false);
      }
    };

    fetchPreviousChats();
  }, [selectedUser]);

  const showNotification = (messageData) => {
    if (Notification.permission === "granted") {
      new Notification(`New Message from ${selectedUser.name}`, {
        body: messageData.messageType === "text" ? messageData.message : "Sent an image",
        icon: "/assets/Logo.png",
      });
    }
  };

  useEffect(() => {
    const socket = new WebSocket(import.meta.env.VITE_SOCKET_URL);
    socket.onopen = () => {
      console.log("Connected to WebSocket");
      socket.send(
        JSON.stringify({
          type: "AUTH",
          userId: userId,
          roomId,
        })
      );
      setAuthenticated(true);
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.error) {
        console.error("WebSocket Error:", data.error);
      } else {
        setMessages((prev) => [...prev, data]);
        if (data.senderId !== userId) {
          showNotification(data);
        }
      }
    };

    socket.onclose = () => {
      console.log("WebSocket Disconnected");
      setAuthenticated(false);
    };

    setWs(socket);
    return () => {
      console.log("Closing previous WebSocket");
      socket.close();
    };
  }, [selectedUser]);

  const sendMessage = () => {
    if (!ws || !authenticated || input.trim() === "") return;

    const message = {
      type: "MESSAGE",
      roomId,
      senderId: userId,
      message: input,
      messageType: "text",
    };

    ws.send(JSON.stringify(message));
    setInput("");
  };

  const handleImageUpload = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        if (!ws || !authenticated) return;
        // console.log(reader.result);

        const message = {
          type: "MESSAGE",
          roomId,
          senderId: userId,
          image: reader.result,
          messageType: "image",
        };
        ws.send(JSON.stringify(message));
      };
    }
  };

  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
  };

  const closeImagePreview = () => {
    setSelectedImage(null);
  };

  return (
    <div className="flex-1 flex flex-col">
      <div className="p-4 border-b bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img
              src="/assets/Logo.png"
              alt="Contact"
              className="w-10 h-10 rounded-full"
            />
            <div>
              <h2 className="font-medium">{selectedUser.name}</h2>
              {/* <p className="text-sm text-green-500">Online</p> */}
            </div>
          </div>
          <svg
            className="w-6 h-6 text-gray-500"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
          </svg>
        </div>
      </div>

      {/* Messages - using native scroll */}
      <div className="flex-1 overflow-y-auto p-4 rounded-2xl bg-gray-100 ml-4 mr-4 mt-4">
        <div className="space-y-4">
          {isLoading &&
            <div className="text-green-500 text-center items-center">Loading...</div>
          }
          {!isLoading && messages.length === 0 ? (
            <div className="text-center text-gray-500">No chats with this user</div>
          ) : (
            messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.senderId === userId ? "justify-end" : "justify-start"
                  }`}
              >
                <div
                  className={`rounded-lg px-4 py-2 max-w-sm flex items-end space-x-2 ${message.senderId === userId
                      ? "bg-secondary-200 text-white"
                      : "bg-secondary text-white"
                    }`}
                >
                  {message.messageType === "text" ? (
                    <p className="break-words">{message.message}</p>
                  ) : (
                    <img
                      onClick={() => handleImageClick(message.message)}
                      className="rounded-lg max-w-full max-h-40 object-cover cursor-pointer transition-transform hover:scale-101"
                      src={message.message}
                      alt={message.index}
                    />
                  )}
                  <span className="text-xs opacity-75">
                    {new Date(message.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <AnimatePresence>
        {selectedImage && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <CircleX
              size={60}
              className="absolute top-4 right-4 text-white font-bold cursor-pointer rounded-full p-2 transition"
              onClick={() => setSelectedImage(null)} />

            <motion.img
              src={selectedImage}
              alt="Preview"
              className="rounded-lg max-w-full max-h-full"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Message input */}
      <div className="p-4 bg-white">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            placeholder="When we gonna meet?"
            value={input}
            className="flex-1 p-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />

          {/* Photo icon */}
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
            id="fileInput"
          />
          <button
            onClick={() => document.getElementById("fileInput")?.click()}
            className="p-2 text-black"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </button>
          {/* Send icon pointing right */}
          <button className="p-2 text-black" onClick={sendMessage}>
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatArea;

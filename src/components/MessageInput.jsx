import React from 'react'
import { useState, useRef } from 'react';
import { Image, Send, X, Smile, Paperclip } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useChatStore } from '../store/useChatStore';
import { motion, AnimatePresence } from 'motion/react';

const MessageInput = () => {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const { sendMessage, sendGroupMessage, selectedGroup } = useChatStore();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      toast.error("Image must be smaller than 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.onerror = () => {
      toast.error("Failed to read image file");
    };
    reader.readAsDataURL(file);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!text.trim() && !imagePreview) {
      toast.error("Message cannot be empty");
      return;
    }

    if (text.length > 5000) {
      toast.error("Message is too long (max 5000 characters)");
      return;
    }

    try {
      if (selectedGroup) {
        await sendGroupMessage({
          text: text.trim(),
          image: imagePreview,
        });
      } else {
        await sendMessage({
          text: text.trim(),
          image: imagePreview,
        });
      }

      // Clear form
      setText("");
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const removeMessageImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="p-4 w-full bg-base-100/30 backdrop-blur-md border-t border-base-content/10">
      <AnimatePresence>
        {imagePreview && (
          <motion.div 
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="mb-4 flex items-center gap-2"
          >
            <div className="relative group">
              <img
                src={imagePreview}
                alt="Preview"
                className="size-24 object-cover rounded-2xl border-2 border-primary/20 shadow-xl"
              />
              <button
                onClick={removeMessageImage}
                className="absolute -top-2 -right-2 size-6 rounded-full bg-error text-error-content
                flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
                type="button"
              >
                <X className="size-3.5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSendMessage} className="flex items-center gap-3">
        <div className="flex-1 flex items-center gap-2 bg-base-100/50 border border-base-content/10 rounded-2xl px-3 py-1.5 focus-within:ring-2 focus-within:ring-primary/20 transition-all">
          <button
            type="button"
            className={`btn btn-ghost btn-sm btn-circle hover:bg-primary/10 transition-colors
                     ${imagePreview ? "text-primary" : "text-base-content/40"}`}
            onClick={() => fileInputRef.current?.click()}
          >
            <Paperclip size={18} />
          </button>
          
          <input
            type="text"
            className="flex-1 bg-transparent border-none focus:outline-none text-sm py-2 placeholder:text-base-content/30"
            placeholder="Type your message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          
          <button
            type="button"
            className="btn btn-ghost btn-sm btn-circle text-base-content/40 hover:bg-primary/10 transition-colors"
          >
            <Smile size={18} />
          </button>

          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageChange}
          />
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          className="size-11 rounded-2xl bg-primary text-primary-content flex items-center justify-center shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          disabled={!text.trim() && !imagePreview}
        >
          <Send size={18} className={text.trim() || imagePreview ? "animate-pulse-subtle" : ""} />
        </motion.button>
      </form>
    </div>
  );
};

export default MessageInput;
"use client";
import { createContext, useContext, useState, ReactNode } from "react";

interface MessageContextType {
  inputMessage: string;
  setInputMessage: (message: string) => void;
}

const MessageContext = createContext<MessageContextType | undefined>(undefined);

export const MessageProvider = ({ children }: { children: ReactNode }) => {
  const [inputMessage, setInputMessage] = useState("");

  return (
    <MessageContext.Provider value={{ inputMessage, setInputMessage }}>
      {children}
    </MessageContext.Provider>
  );
};

export const useMessage = () => {
  const context = useContext(MessageContext);
  if (!context) {
    throw new Error("useMessage harus digunakan dalam MessageProvider");
  }
  return context;
};

"use client";

import { createContext, useContext, useState } from "react";

type ReplyData = {
  leadMessage: string;
  reply: string;
  tone: string;
  length: string;
};

type ReplyContextType = {
  selectedReply: ReplyData | null;
  setSelectedReply: (reply: ReplyData | null) => void;
};

const ReplyContext = createContext<ReplyContextType | null>(null);

export function ReplyProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [selectedReply, setSelectedReply] =
    useState<ReplyData | null>(null);

  return (
    <ReplyContext.Provider
      value={{
        selectedReply,
        setSelectedReply,
      }}
    >
      {children}
    </ReplyContext.Provider>
  );
}

export function useReply() {
  const context = useContext(ReplyContext);

  if (!context) {
    throw new Error("ReplyProvider missing");
  }

  return context;
}
import { MessageItem } from "@/lib/assistant";
import React from "react";
import ReactMarkdown from "react-markdown";

interface MessageProps {
  message: MessageItem;
}

const Message: React.FC<MessageProps> = ({ message }) => {
  const content = message.content[0];

  const renderContent = () => {
    if (content.type === "image_url") {
      return (
        <img
          src={content.image_url}
          alt="generated"
          className="max-w-full rounded-md"
        />
      );
    }
    return <ReactMarkdown>{content.text as string}</ReactMarkdown>;
  };

  return (
    <div className="text-sm">
      {message.role === "user" ? (
        <div className="flex justify-end">
          <div>
            <div className="ml-4 rounded-[16px] px-4 py-2 md:ml-24 bg-[#ededed] text-stone-900 font-light">
              {renderContent()}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col">
          <div className="flex">
            <div className="mr-4 rounded-[16px] px-4 py-2 md:mr-24 text-black bg-white font-light">
              {renderContent()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Message;

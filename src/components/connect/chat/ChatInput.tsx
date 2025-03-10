import React, {useState} from "react";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";

type ChatInputProps = {
    userId?: string;
    sendMessage: (text: string) => void;
};

const ChatInput: React.FC<ChatInputProps> = ({sendMessage}) => {
    const [message, setMessage] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (message.trim()) {
            sendMessage(message);
            setMessage("");
        }
    };

    return (
        <form onSubmit={handleSubmit} className=" flex w-full gap-4 justify-center items-center">
            <Input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
                className="w-5/6"
            />
            <Button type="submit" className="px-8 rounded-none" variant={'secondary'}>
                Send
            </Button>
        </form>
    );
};
export default ChatInput;

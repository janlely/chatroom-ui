import { useEffect, useRef, useState } from "react";
import axios from 'axios';
import {MessageType, MessageDivData} from "./common"
import "./Chat.css"

function Chat() {

  const connectionRef = useRef(false);
  const roomId = window.location.search.substring(1)
  const editorRef = useRef<HTMLDivElement>(null)
  const [ws, setWs] = useState<WebSocket | null>(null)
  const [messages, setMessages] = useState<MessageDivData[]>([])
  const pullMessage = () => {
    axios.post("/api/chat/pull", {
        uuid: messages[messages.length - 1].uuid
    }, {
        headers: {
            "RoomId": roomId
        }
    }).then(res => {
        const receivedMessages = res.data as MessageDivData[]
        setMessages([...messages,...receivedMessages])
    })
  }
  const doSendMessage = (message: MessageDivData) => {
    axios.post("/api/chat/send", message.message, {
        headers: {
            "RoomId": roomId
        }
    }).then(res => {
        console.log(`response status: ${res.status}`)
        if (res.status === 401) {
            window.location.href = "/Login"
            return
        }
        setMessages(prevMessages =>
            prevMessages.map(msg =>
                msg.message.messageId === message.message.messageId
                    ? { ...msg, success: true, uuid: res.data.uuid }
                    : msg
            )
        );
    })
  }
  const sendMessage = () => {
    const message: MessageDivData = {
        message: {
            messageId: Date.now(),
            type: MessageType.TEXT,
            data: editorRef.current!.innerText,
        },
        send: true,
        success: false,
        uuid: 0
    }
    doSendMessage(message)
    setMessages([...messages, message])
  }
  const handlerKeyDown = (e: any) => {
    const editor = editorRef.current!
    if (e.key === 'Enter' && e.shiftKey) {
        console.log("shift enter")
        const selection = window.getSelection()!;
        const range = selection.getRangeAt(0);
        const br = document.createElement('br');
        range.deleteContents();
        range.insertNode(br);
        range.setStartAfter(br);
        range.setEndAfter(br);
        selection?.removeAllRanges();
        selection?.addRange(range);
        return
    }

    if (e.key === "Enter") {
        console.log("enter")
        e.preventDefault()
        sendMessage()
        editor.innerHTML = ""
        return
    }
  }

  const handlerPaste = (e: any) => {
    console.log("paste")
  }

  const connect = () => {
    const wsClient = new WebSocket(`/chat-ws?${roomId}`);
  
    wsClient.onopen = () => {
      console.log("WebSocket connected");
      connectionRef.current = true;
    };
  
    wsClient.onclose = (e) => {
      console.log(`WebSocket disconnected, code: ${e.code}`);
      if (e.code === 3401) {
        window.location.href = "/Login";
      } else {
        setTimeout(connect, 1000);
      }
    };
  
    wsClient.onmessage = (e) => {
      if (e.data === "notify") {
        console.log("Received notification, pulling messages...");
        pullMessage();
      } else if (e.data === "pong") {
        console.log("Received pong");
      }
    };
  
    setWs(wsClient);
  };
  useEffect(() => {
    if (connectionRef.current) {
        return
    }
    console.log("should execute once")
    connect()
    connectionRef.current = true
  })

  return (
    <div>
        <div className="chat-body">
              {messages.map(msg => (
                  <div className="message-container" key={msg.message.messageId}>
                      {msg.send ? (
                        <div className="message-box-right">
                            {!msg.success && (
                                <div className="loading-container">
                                    <div className="spinner"></div>
                                </div>
                            )}
                            <div className="message-content">{msg.message.data}</div>
                        </div>
                      ) : (
                        <div className="message-box-left">
                            {msg.message.data}
                        </div>
                      )}
                  </div>
              ))}
        </div>
        <div
            ref={editorRef}
            className="chat-input"
            contentEditable="true"
            onPaste={handlerPaste}
            onKeyDown={handlerKeyDown}
        >
        </div>
    </div>
  );
}

export default Chat
import { useEffect, useRef, useState } from "react";
import axios from 'axios';
import {MessageType, MessageDivData} from "./common"
import "./Chat.css"

function Chat() {

  const roomId = window.location.search.substring(1)
  const editorRef = useRef<HTMLDivElement>(null)
  const [ws, setWs] = useState<WebSocket | null>(null)
  const [messages, setMessages] = useState<MessageDivData[]>([])
  const sendMessage = () => {
    const message: MessageDivData = {
        message: {
            messageId: Date.now(),
            type: MessageType.TEXT,
            data: editorRef.current!.innerText
        },
        send: true,
        success: false
    }
    axios.post("/api/chat/message", message.message, {
        headers: {
            "Room-Id": roomId
        }
    }).then(res => {
        console.log(`response status: ${res.status}`)
        if (res.status === 401) {
            window.location.href = "/Login"
            return
        }
        message.success = true
        setMessages(messages)
    })
    messages.push(message)
    setMessages(messages)
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
        // const text = editor.innerHTML
        // ws?.send(text)
        // console.log("send message: ", text)
        sendMessage()
        editor.innerHTML = ""
        return
    }
  }
  const setCursorAtStart = (element: HTMLDivElement) => {
    var range = document.createRange()
    var sel = window.getSelection()
    
    range.setStart(element.childNodes[2], 5)
    range.collapse(true)
    
    sel?.removeAllRanges()
    sel?.addRange(range)
  };

  const handlerPaste = (e: any) => {
    console.log("paste")
  }

  useEffect(() => {
    const editor = editorRef.current
    if (editor?.focus()) {
        setCursorAtStart(editor)
    }
    const wsClient = new WebSocket(`/chat-ws?${roomId}`)
    wsClient.onopen = () => {
        console.log("connected")
    }
    wsClient.onclose = (e) => {
        console.log(`disconnected, code is: ${e.code}`)
        if (e.code === 3401) {
            window.location.href = "/Login"
        }
    }
    wsClient.onmessage = (e) => {
        if (e.data === "notify") {
            console.log("need to pull messages")
            return 
        }
        if (e.data === "pong") {
            console.log("pong")
        }
    }
    setWs(wsClient)
  }, [])
  return (
    <div>
        <div className="chat-body">
              {messages.map(msg => (
                  <div className="message-container">
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
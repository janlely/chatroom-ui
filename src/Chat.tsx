import { useEffect, useRef, useState } from "react";
import axios from 'axios';
import {MessageType, MessageDivData, Memeber, generateThumbnail} from "./common"
import { useMediaQuery } from 'react-responsive'
import ChatPC from "./ChatPC";
import ChatMB from "./ChatMB";

function Chat() {
  //竖屏
  const isPortrait = useMediaQuery({ query: '(orientation: portrait)' });
  //横屏
  const isLandscape = useMediaQuery({ query: '(orientation: landscape)' });

  const roomId = window.location.search.substring(1)
  const editorRef = useRef<HTMLDivElement>(null)
  const msgDivRef = useRef<HTMLDivElement>(null)
  const [messages, setMessages] = useState<MessageDivData[]>([])
  const [members, setMembers] = useState<Memeber[]>([])
  const messagesRef = useRef<MessageDivData[]>([])
  const [scrollToBottomNeeded, setScrollToBottomNeeded] = useState(false);
  const connectionInited = useRef(false)

  useEffect(() => {
    messagesRef.current = messages
    if (scrollToBottomNeeded) {
        setScrollToBottomNeeded(false)
        scrollToBottom(msgDivRef.current!)
    }
    console.log(`message size: ${messages.length}, div size: ${msgDivRef.current?.childElementCount}`)
  }, [messages])

  const refreshMembers = () => {
    axios.get("/api/chat/members", {
        headers: {
            "RoomId": roomId
        }
    }).then(res => {
        setMembers(res.data)
    })
  }

  const findLastUuid = (msgs: MessageDivData[]) => {
    for (let i = msgs.length - 1; i >= 0; i--) {
        if (msgs[i].message.sender !== "me") {
            return msgs[i].uuid
        }
    }
    return 0
  }

  const pullMessage = (direction: string) => {
    const isAtBottom = isScrollbarAtBottom(editorRef.current!)
    const uuid = direction === "before" ?
        (messagesRef.current[0]?.uuid ?? 0) :
        findLastUuid(messagesRef.current)
    axios.post("/api/chat/pull", {
        uuid: uuid,
        direction: direction
    }, {
        headers: {
            "RoomId": roomId
        }
    }).then(res => {
        const receivedMessages = res.data as MessageDivData[]
        setMessages(
            direction == "before" ? [...receivedMessages, ...messagesRef.current] : [...messagesRef.current, ...receivedMessages]
        )
        if (isAtBottom) {
            console.log("need to set scroll to bottom")
            setScrollToBottomNeeded(true)
        }
    })
  }

  const retryMessage = (msgId: number) => {
    let msgIdx: number = messagesRef.current.findIndex(msg => msg.send && msg.message.messageId === msgId)
    if (messagesRef.current[msgIdx].message.type === MessageType.TEXT) {
      let data = messagesRef.current[msgIdx].message.data
      setMessages(messagesRef.current.splice(msgIdx, 1))
      sendMessage(data, MessageType.TEXT)
    } else if (messagesRef.current[msgIdx].message.type === MessageType.IMAGE) {
      let msgData = JSON.parse(messagesRef.current[msgIdx].message.data)
      if (!msgData.url && messagesRef.current[msgIdx]?.blob) {
        let blob = messagesRef.current[msgIdx].blob
        setMessages(messagesRef.current.splice(msgIdx, 1))
        sendImgMessage(blob)
      } else {
        let data = messagesRef.current[msgIdx].message.data
        setMessages(messagesRef.current.splice(msgIdx, 1))
        sendMessage(data, MessageType.TEXT)
      }
    }
  }

  const doSendMessage = (message: MessageDivData, sprend: (_: MessageDivData, __: any) => MessageDivData) => {
    axios.post("/api/chat/send", sprend(message,0), {
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
            uniqueByProperty(prevMessages.map(msg =>
                msg.message.messageId === message.message.messageId
                    ? sprend(msg, res.data.uuid) 
                    : msg
            ))
        );
        setScrollToBottomNeeded(true)
    })
  }

  const sendMessage = (content: string, type: MessageType) => {
    // const content = editorRef.current!.innerText
    if (!content || content === "") {
        return
    }
    const message: MessageDivData = {
        message: {
            messageId: Date.now(),
            type: type,
            data: content,
            sender: "me"
        },
        send: true,
        success: false,
        uuid: 0,
        failed: false
    }
    doSendMessage(message, (msg, uuid) => ({ ...msg, success: true, uuid: uuid }))
    setScrollToBottomNeeded(true)
    setMessages(uniqueByProperty([...messages, message]))
  }


  const sendImage = (blob: any, message: MessageDivData) => {
      const formData = new FormData();
      formData.append('file', blob, 'image.png'); // 第三个参数是文件名，根据实际情况修改

      axios.post('https://fars.ee/', formData, {
          headers: {
          'Content-Type': 'multipart/form-data'
          }
      })
      .then(response => {
        let newData = {...JSON.parse(message.message.data), url: response.data.url}
        doSendMessage(message,
          (msg, uuid) => {
            return { ...msg, success: true, uuid: uuid, message: { ...msg.message, data: JSON.stringify(newData) } }
          })
      })
      .catch(error => {
        setMessages(prevMessages =>
            uniqueByProperty(prevMessages.map(msg =>
                msg.message.messageId === message.message.messageId
                    ? {...msg, failed: true} 
                    : msg
            ))
        );
      });
  }

  const uploadImgThenSend = (blob: any, thumbnailUrl: string) => {
    
      const message: MessageDivData = {
          message: {
              messageId: Date.now(),
              type: MessageType.IMAGE,
              data: JSON.stringify({thumbnail: thumbnailUrl, url: ""}),
              sender: "me"
          },
          send: true,
          success: false,
          uuid: 0,
          failed: false
      }
      sendImage(blob, message)
      setMessages(uniqueByProperty([...messagesRef.current, message]))
      setScrollToBottomNeeded(true)
  }

  const sendImgMessage = (blob: any, thumbnailUrl?: string) => {
    if (!blob) {
        return
    }
    if (thumbnailUrl) {
      uploadImgThenSend(blob, thumbnailUrl!)
      return
    } 
    generateThumbnail(blob, 100, 100).then(thumbnailUrl=> {
      uploadImgThenSend(blob, thumbnailUrl)
    }).catch(err => {
      console.log("error create thumbnail", err)
    })
  }

  const connect = () => {
    const wsClient = new WebSocket(`/chat-ws?${roomId}`);
  
    wsClient.onopen = () => {
      console.log("WebSocket connected");
      refreshMembers()
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
        pullMessage("after");
      } else if (e.data === "members") {
        refreshMembers()
      } else if (e.data === "pong") {
        console.log("Received pong");
      }
    };
    return wsClient
  }

  useEffect(() => {

    if (connectionInited.current) {
        return
    }
    console.log("should execute once")
    const wsClient = connect()
    connectionInited.current = true
    pullMessage("before")
    return () => {
        console.log("关闭连接")
        wsClient.close()
    }
  })

  const isScrollbarAtBottom = (element: HTMLDivElement) => {
      return element.scrollTop + element.clientHeight >= element.scrollHeight;
  }

  const scrollToBottom = (element: HTMLDivElement) => {
    element.scrollTop = element.scrollHeight - element.clientHeight;
  }


  const uniqueByProperty = (items: any[]): any[] => {
      const seen = new Set();
      return items.filter(item => {
          const propValue = item.uuid;
          if (seen.has(propValue)) {
              return false;
          } else {
              seen.add(propValue);
              return true;
          }
      });
  }

  return (
    <div>
          {isLandscape &&
              <ChatPC
                  roomId={roomId}
                  messages={messages}
                  members={members}
                  editorRef={editorRef}
                  msgDivRef={msgDivRef}
                  handlerSendImg={sendImgMessage}
                  handlerSendTxt={sendMessage}
                  handlerRetry={retryMessage}
              />}
          {isPortrait &&
              <ChatMB
                  roomId={roomId}
                  messages={messages}
                  members={members}
                  editorRef={editorRef}
                  msgDivRef={msgDivRef}
                  handlerSendImg={sendImgMessage}
                  handlerSendTxt={sendMessage}
                  handlerRetry={retryMessage}
              />}
    </div>
  );
}

export default Chat
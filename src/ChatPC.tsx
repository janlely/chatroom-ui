import { ChatProps, MessageType } from "./common"
import TxtMessage from "./TxtMessage"
import ImgMessage from "./ImgMessage"
import "./ChatPC.css" 
import { useCallback } from "react"
import axios from "axios"
import FormData from "form-data"

const ChatPC: React.FC<ChatProps> = (props) => {
    const handlerKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        const editor = props.editorRef.current!
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
            props.handlerSendTxt(editor.innerText, MessageType.TEXT)
            editor.innerHTML = ""
            return
        }
    }
    const sendImage = (blob: any) => {
        const formData = new FormData();
        formData.append('file', blob, 'image.png'); // 第三个参数是文件名，根据实际情况修改

        axios.post('https://fars.ee/', formData, {
            headers: {
            'Content-Type': 'multipart/form-data'
            }
        })
        .then(response => {
            console.log('Upload successful:', response.data.url);
            props.handlerSendImg(response.data.url)
        })
        .catch(error => {
            console.error('Upload error:', error);
        });
    }
    const handlePaste = useCallback((event: any) => {
        event.preventDefault();
        const items = (event.clipboardData || event.originalEvent.clipboardData).items;
        for (let item of items) {
            if (item.kind === 'file') {
                const blob = item.getAsFile();
                if (blob && blob.type.startsWith('image')) {
                    sendImage(blob)
                }
            }
        }
    }, []);

    return (
        <div className="pc-parent">
            <div className="pc-room-members-container">
                {props.members.map(member => (
                    <div className="pc-room-member" key={member.username}>
                        {member.avatar && <div>{member.avatar}</div>}
                        <div>{member.username}</div>
                    </div>
                ))}
            </div>
            <div className="pc-chat-place">
                <div className="pc-chat-body" ref={props.msgDivRef}>
                    {props.messages.map(msg => (
                        <div className="pc-message-container" key={msg.message.messageId}>
                            {msg.send ? (
                                <div className="pc-message-box-right">
                                    {!msg.success && (
                                        msg.failed ? (
                                            <div onClick={() => props.handlerRetry(msg.message.messageId)}>
                                                <span>重试</span>
                                            </div>
                                        ) : (
                                            <div className="mb-loading-container">
                                                <div className="mb-spinner"></div>
                                            </div>
                                        )
                                    )}
                                </div>
                            ) : (
                                <div className="pc-message-box-left">
                                    <div>
                                        {msg.message.type == MessageType.TEXT ? <TxtMessage message={msg} /> : <ImgMessage message={msg}/>}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
                <div
                    ref={props.editorRef}
                    className="pc-chat-input"
                    contentEditable
                    onPaste={handlePaste}
                    onKeyDown={handlerKeyDown}
                >
                </div>
            </div>
        </div>
    )
}

export default ChatPC 
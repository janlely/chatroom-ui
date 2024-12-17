import { ChatProps, MessageType } from "./common"
import TxtMessage from "./TxtMessage"
import "./ChatMB.css"
import { useCallback } from "react"
import axios from "axios"
import ImgMessage from "./ImgMessage"

const ChatMB: React.FC<ChatProps> = (props) => {

    const handlerClick = () => {
        props.handlerSendTxt(props.editorRef.current!.innerText)
        props.editorRef.current!.innerHTML = ''
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
        <div className="mb-parent">
            <div className="mb-room-members-container">
                {props.members.map(member => (
                    <div className="mb-room-member" key={member.username}>
                        {member.avatar && <div>{member.avatar}</div>}
                        <div>{member.username}</div>
                    </div>
                ))}
            </div>
            <div className="mb-chat-place">
                <div className="mb-chat-header">{props.roomId}</div>
                <div className="mb-chat-body" ref={props.msgDivRef}>
                    {props.messages.map(msg => (
                        <div className="mb-message-container" key={msg.message.messageId}>
                            {msg.send ? (
                                <div className="mb-message-box-right">
                                    {!msg.success && (
                                        <div className="mb-loading-container">
                                            <div className="mb-spinner"></div>
                                        </div>
                                    )}
                                    <div>
                                        {msg.message.type == MessageType.TEXT ? <TxtMessage message={msg} /> : <ImgMessage message={msg}/>}
                                    </div>
                                </div>
                            ) : (
                                <div className="mb-message-box-left">
                                    <div>
                                        {msg.message.type == MessageType.TEXT ? <TxtMessage message={msg} /> : <ImgMessage message={msg}/>}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
                <div className="mb-chat-input-container">
                    <div
                        ref={props.editorRef}
                        className="mb-chat-input"
                        contentEditable="true"
                        onPaste={handlePaste}
                    />
                    <button className="mb-chat-send" onClick={handlerClick}>发送</button>
                </div>
            </div>
        </div>
    )
}

export default ChatMB
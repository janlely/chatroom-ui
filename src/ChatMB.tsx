import { ChatProps, MessageType } from "./common"
import TxtMessage from "./TxtMessage"
import "./ChatMB.css"
import { useCallback, useRef } from "react"
import ImgMessage from "./ImgMessage"

const ChatMB: React.FC<ChatProps> = (props) => {

    const fileInputRef = useRef<HTMLInputElement>(null);
    const handleImageChange = (e: any) => {
        e.preventDefault();

        let file = e.target.files[0]; // 获取File对象

        if (file) {
            props.handlerSendImg(file)
        }
    };

    const openImgSelection = () => {
        fileInputRef.current?.click();
    }
    const handlerClick = () => {
        props.handlerSendTxt(props.editorRef.current!.innerText, MessageType.TEXT)
        props.editorRef.current!.innerHTML = ''
    }

    const handlePaste = useCallback((event: any) => {
        const items = (event.clipboardData || event.originalEvent.clipboardData).items;
        for (let item of items) {
            if (item.kind === 'file') {
                const blob = item.getAsFile();
                if (blob && blob.type.startsWith('image')) {
                    // sendImage(blob)
                    props.handlerSendImg(blob)
                    event.preventDefault();
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
                    <input
                        type="file"
                        accept="image/*"
                        // capture="environment"
                        ref={fileInputRef}
                        onChange={handleImageChange}
                        style={{ display: 'none' }} // 隐藏原始input
                    />
                    <button className="mb-circle-button" onClick={openImgSelection}>
                        <span className="mb-plus">+</span>
                    </button>
                    <button className="mb-chat-send" onClick={handlerClick}>发送</button>
                </div>
            </div>
        </div>
    )
}

export default ChatMB
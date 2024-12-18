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
                                            <div className="mb-resend-contanier" onClick={() => props.handlerRetry(msg.message.messageId)}>
                                                <button className="mb-resend-button">
                                                    <svg
                                                        width="24"
                                                        height="24"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                    >
                                                        <path
                                                            d="M5.33929 4.46777H7.33929V7.02487C8.52931 6.08978 10.0299 5.53207 11.6607 5.53207C15.5267 5.53207 18.6607 8.66608 18.6607 12.5321C18.6607 16.3981 15.5267 19.5321 11.6607 19.5321C9.51025 19.5321 7.58625 18.5623 6.30219 17.0363L7.92151 15.8515C8.83741 16.8825 10.1732 17.5321 11.6607 17.5321C14.4222 17.5321 16.6607 15.2935 16.6607 12.5321C16.6607 9.77065 14.4222 7.53207 11.6607 7.53207C10.5739 7.53207 9.56805 7.87884 8.74779 8.46777L11.3393 8.46777V10.4678H5.33929V4.46777Z"
                                                            fill="currentColor"
                                                        />
                                                    </svg>
                                                </button>
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
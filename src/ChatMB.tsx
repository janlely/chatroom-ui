import { ChatProps } from "./common"
import Message from "./Message"
import "./ChatMB.css"

const ChatMB: React.FC<ChatProps> = (props) => {

    const handlerClick = () => {
        props.handlerSend(props.editorRef.current!.innerText)
        props.editorRef.current!.innerHTML = ''
    }
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
                                        <Message message={msg} />
                                    </div>
                                </div>
                            ) : (
                                <div className="mb-message-box-left">
                                    <div>
                                        <Message message={msg} />
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
                        onPaste={props.handlerPaste}
                    />
                    <button className="mb-chat-send" onClick={handlerClick}>发送</button>
                </div>
            </div>
        </div>
    )
}

export default ChatMB
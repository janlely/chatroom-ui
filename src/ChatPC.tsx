import { ChatProps } from "./common"
import Message from "./Message"
import "./ChatPC.css" 

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
            props.handlerSend(editor.innerText)
            editor.innerHTML = ""
            return
        }
    }
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
                                        <div className="pc-loading-container">
                                            <div className="pc-spinner"></div>
                                        </div>
                                    )}
                                    <div>
                                        <Message message={msg} />
                                    </div>
                                </div>
                            ) : (
                                <div className="pc-message-box-left">
                                    <div>
                                        <Message message={msg} />
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
                <div
                    ref={props.editorRef}
                    className="pc-chat-input"
                    contentEditable="true"
                    onPaste={props.handlerPaste}
                    onKeyDown={handlerKeyDown}
                >
                </div>
            </div>
        </div>
    )
}

export default ChatPC 
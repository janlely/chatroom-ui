import { MessageDivData} from "./common"
import "./Message.css"

interface MessageProps {
    message: MessageDivData
}
const Message: React.FC<MessageProps> = ({ message}) => {
    return (
        <div className="message">
            <div>
                <div className={`message-sender ${message.send ? 'align-right' : 'align-left'}`}>{message.message.sender}</div>
                <div className="message-content">{message.message.data}</div>
            </div>
        </div>
    )
}

export default Message
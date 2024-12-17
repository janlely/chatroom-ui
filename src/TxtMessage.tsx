import { MessageProps } from "./common"
import "./TxtMessage.css"

const TxtMessage: React.FC<MessageProps> = ({ message}) => {
    return (
        <div className="message">
            <div>
                <div className={`txt-message-sender ${message.send ? 'align-right' : 'align-left'}`}>{message.message.sender}</div>
                <div className="txt-message-content">{message.message.data}</div>
            </div>
        </div>
    )
}

export default TxtMessage
import { useState } from "react";
import { MessageProps} from "./common"
import "./ImgMessage.css"

const ImgMessage: React.FC<MessageProps> = ({ message}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleImageClick = () => {
    setIsFullscreen(!isFullscreen);
  };
    return (
        <div className="message">
            <div>
                <div className={`message-sender ${message.send ? 'align-right' : 'align-left'}`}>{message.message.sender}</div>
                <div className="message-content">
                    <img
                        className="thumbnail"
                        src={JSON.parse(message.message.data).thumbnail}
                        alt="Thumbnail"
                        onClick={handleImageClick}
                        style={{ cursor: 'pointer' }}
                    />
                    {isFullscreen && (
                        <div className="fullscreen" onClick={handleImageClick}>
                            <img src={JSON.parse(message.message.data).url} alt="Full Size" />
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default ImgMessage
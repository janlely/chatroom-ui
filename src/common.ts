export enum MessageType {
    TEXT,
    IMAGE
}

export interface Message {
    messageId: number,
    type: MessageType,
    data: string,
    sender?: string
}

export interface Memeber {
    avatar?: string,
    username: string
}

export interface MessageDivData {
    message: Message
    send: boolean
    success: boolean
    uuid: number
}

export interface ChatProps {
    roomId: string,
    members: Memeber[],
    messages: MessageDivData[],
    editorRef: React.RefObject<HTMLDivElement>,
    msgDivRef: React.RefObject<HTMLDivElement>,
    handlerSendImg: (url: string) => void,
    handlerSendTxt: (msg: string) => void,
}

export interface MessageProps {
    message: MessageDivData
}
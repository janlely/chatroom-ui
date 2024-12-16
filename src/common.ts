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
export enum MessageType {
    TEXT,
    IMAGE
}

export interface Message {
    messageId: number,
    type: MessageType,
    data: string
}

export interface MessageDivData {
    message: Message
    send: boolean
    success: boolean
    uuid: number
}
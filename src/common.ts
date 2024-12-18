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
    uuid: number,
    failed: boolean,
    blob?: Blob,
    thumbnailUrl?: string
}

export interface ChatProps {
    roomId: string,
    members: Memeber[],
    messages: MessageDivData[],
    editorRef: React.RefObject<HTMLDivElement>,
    msgDivRef: React.RefObject<HTMLDivElement>,
    handlerSendImg: (blob: any) => void,
    handlerSendTxt: (msg: string, type: MessageType) => void,
    handlerRetry: (msgId: number) => void
}

export interface MessageProps {
    message: MessageDivData
}
export function generateThumbnail(blob: Blob, maxWidth: number, maxHeight: number): Promise<string> {
  return new Promise((resolve, reject) => {
    // 创建一个新的 Image 对象
    const img = new Image();

    const imageUrl = URL.createObjectURL(blob);
    img.src = imageUrl;

    // 当图像加载完成后执行的回调函数
    img.onload = () => {
      // 获取原始图像的宽度和高度
      const originalWidth = img.width;
      const originalHeight = img.height;

      // 计算缩放比例
      let scale = 1;
      if (originalWidth > maxWidth || originalHeight > maxHeight) {
        const widthScale = maxWidth / originalWidth;
        const heightScale = maxHeight / originalHeight;
        scale = Math.min(widthScale, heightScale);
      }

      // 计算缩放后的宽度和高度
      const thumbnailWidth = Math.floor(originalWidth * scale);
      const thumbnailHeight = Math.floor(originalHeight * scale);

      // 创建一个新的 canvas 元素
      const canvas = document.createElement('canvas');
      canvas.width = thumbnailWidth;
      canvas.height = thumbnailHeight;

      // 获取 canvas 的 2D 绘图上下文
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('无法获取 canvas 上下文'));
        return;
      }

      // 将图像绘制到 canvas 上，并进行缩放
      ctx.drawImage(img, 0, 0, thumbnailWidth, thumbnailHeight);

      // 将 canvas 上的内容导出为 Blob
      canvas.toBlob(
        (thumbnailBlob) => {
          if (thumbnailBlob) {
            resolve(URL.createObjectURL(thumbnailBlob));
          } else {
            reject(new Error('无法生成缩略图 Blob'));
          }
        },
        'image/png', // 指定导出的图像格式
        0.92 // 图像质量（0 到 1 之间，默认 0.92）
      );
    };

    // 如果图像加载失败，捕获错误
    img.onerror = (error) => {
      reject(new Error('图像加载失败'));
    };

//     // 将 Blob 转换为 URL，并设置为 Image 的 src 属性
//     const imageUrl = URL.createObjectURL(blob);
//     img.src = imageUrl;

//     // 在图像加载完成后释放 URL
//     img.onload = () => {
//       URL.revokeObjectURL(imageUrl);
//     };
  });
}

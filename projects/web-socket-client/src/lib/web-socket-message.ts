
export class WebSocketMessage {
  get action(): string {
    return this.messageAction;
  }

  get data(): string {
    return this.messageData;
  }

  static parseJSON( payload: string ): WebSocketMessage|null {
    try {
      const message = JSON.parse(payload);
      return new WebSocketMessage(message.action, message.data);
    } catch (e) {
      return null;
    }
  }

  constructor(
    private messageAction: string = '',
    private messageData: any = null,
    private messageRoom: string = ''
  ) {
  }

  public toJSON(): any {
    return {
      action: this.messageAction,
      data: this.messageData,
      room: this.messageRoom
    };
  }
}

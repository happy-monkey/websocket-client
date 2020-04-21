
export class WebSocketMessage {
  get action(): string {
    return this.messageAction;
  }

  get data(): string {
    return this.messageData;
  }

  get isCallback(): boolean {
    return !!this.callback;
  }

  static parseJSON( payload: string ): WebSocketMessage|null {
    try {
      const message = JSON.parse(payload);
      return new WebSocketMessage(message.action, message.data, null, message.callback);
    } catch (e) {
      return null;
    }
  }

  constructor(
    private messageAction: string = '',
    private messageData: any = null,
    private messageRoom: string = '',
    private callback: string = ''
  ) {
  }

  public toJSON(): any {
    return {
      action: this.messageAction,
      data: this.messageData,
      room: this.messageRoom,
      callback: this.callback
    };
  }
}

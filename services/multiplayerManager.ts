import { GameMessage, MatchState, PlayerState } from "../types";

const CHANNEL_NAME = "banana_football_multiplayer";

export class MultiplayerManager {
  private channel: BroadcastChannel;
  private onMessageCallback: (msg: GameMessage) => void;
  public playerId: string;

  constructor(playerId: string, onMessage: (msg: GameMessage) => void) {
    this.playerId = playerId;
    this.onMessageCallback = onMessage;
    this.channel = new BroadcastChannel(CHANNEL_NAME);
    this.channel.onmessage = (event) => {
      const msg = event.data as GameMessage;
      if (msg.senderId !== this.playerId) {
        this.onMessageCallback(msg);
      }
    };
  }

  public sendMessage(type: GameMessage["type"], payload: any) {
    const msg: GameMessage = {
      type,
      payload,
      senderId: this.playerId,
    };
    this.channel.postMessage(msg);
  }

  public disconnect() {
    this.channel.close();
  }
}

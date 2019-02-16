import { Message } from './message';
import { PlaybackState } from '../services/player.service';

export class ClientUpdateMessage extends Message {
    currentPlaybackTime: number;
    currentPlaybackDuration: number;
    currentPlaybackState: PlaybackState;
}

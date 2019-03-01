import { Component, OnInit, OnDestroy, Input, SimpleChanges, SimpleChange, OnChanges } from '@angular/core';
import { PlayerService } from 'src/app/services/player.service';
import { Subscription, from } from 'rxjs';
import { MusicKitService } from 'src/app/services/music-kit.service';
import { Song } from 'src/app/model/song';
import { UserService } from 'src/app/services/user.service';
import { QueueService } from 'src/app/services/queue.service';
import { ConfigService } from 'src/app/services/config.service';
import { WarningModalComponent } from '../..//warning-modal/warning-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

const artworkWidth = 50;
const artworkHeight = 50;

@Component({
  selector: 'app-list-song',
  templateUrl: './list-song.component.html',
  styleUrls: ['./list-song.component.css'],
})
export class ListSongComponent implements OnInit, OnChanges, OnDestroy {

  @Input() songs: Song[];
  @Input() showArtwork: boolean;
  @Input() showHeaders: boolean;
  @Input() showRequestedBy: boolean;
  @Input() allowSongSelection: boolean;
  @Input() shouldFilterNonAppleMusicIfApplicable: boolean; //allow components to bypass the filter if they're sure its already apple music
  @Input() canRemoveSongFromQueue: boolean;
  private subscriptions: Subscription = new Subscription();

  constructor(private playerService: PlayerService, 
    private musicKitService: MusicKitService, 
    private userService: UserService,
    private queueService: QueueService,
    private configService: ConfigService, 
    private modalService: NgbModal
  ) { }

  ngOnInit() { }

  ngOnChanges(changes: SimpleChanges) {
    let songChange: SimpleChange = changes.songs;
    let newSongs: Song[] = songChange.currentValue;
    this.songs = this.filterNonAppleMusicSongsIfApplicable(newSongs);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  public onSongSelected(index): void {
    if(this.allowSongSelection) {
      if(this.configService.getStandAloneAppMode()) {
        this.handleSongSelectedStandAloneMode(index);
      } else {
        this.handleSongSelectedShareMode(index);
      }
    }
  }

  public isSelectedSong(index: number): boolean {
    if(!this.allowSongSelection) {
      return false;
    }

    let currentSongId = this.playerService.getCurrentlyPlayingSongId();
    if(currentSongId && this.songs) {
      return (this.songs[index].id === currentSongId);
    }

    return false;
  }

  public shouldDisableNonAppleMusicSongWithIndex(index: number): boolean {
    return this.shouldDisableNonAppleMusicSong(this.songs[index]);
  }

  public removeSongFromQueue(index): void {
    if(this.canRemoveSongFromQueue && !this.configService.getStandAloneAppMode()) {
      this.queueService.removeSongFromQueue(this.songs[index]);
    }
  }

  public userCanRemoveSong(index): boolean {
    if(this.songs[index] && (this.songs[index].requestedBy.id === this.userService.getUserId())) {
      return true;
    }

    return false;
  }

  private shouldDisableNonAppleMusicSong(song: Song): boolean {
    if(this.shouldFilterNonAppleMusicIfApplicable
        && !this.configService.getStandAloneAppMode()) {
      if(!this.isAppleMusicSong(song)) {
        return true;
      }
    }

    return false;
  }

  private isAppleMusicSong(song: Song): boolean {
    if(song
      && song.attributes
      && song.attributes.playParams
      && song.attributes.playParams.catalogId) {
      return true;
    }

    return false;
  }

  getMinutesAndSeconds(durationInMillis: any): string {
    let seconds = (durationInMillis / 1000);
    let minutes = (seconds / 60);

    let roundedMinutes = Math.floor(minutes);
    let roundedSeconds = (minutes - Math.floor(minutes)) * 60;
    roundedSeconds = Math.floor(roundedSeconds);

    let roundedSecondsString = roundedSeconds.toString();
    if(roundedSecondsString.length === 1) {
      roundedSecondsString = "0" + roundedSecondsString;
    }

    return roundedMinutes + ':' + roundedSecondsString;
  }

  getValidArtworkUrl(artworkUrl: string): string {
    return this.musicKitService.getFormattedArtworkUrl(artworkUrl, artworkWidth, artworkHeight);
  }

  getArtworkWidth(): number {
    return artworkWidth;
  }

  getArtworkHeight(): number {
    return artworkHeight;
  }

  private handleSongSelectedStandAloneMode(index: number): void {
    this.subscriptions.add(this.playerService.playSong(this.songs, index).subscribe());
  }

  private handleSongSelectedShareMode(index: number): void {
    let isConnectedToServerForShare: boolean = this.queueService.getIsConnected();
    let isAppleMusicSong: boolean = this.isAppleMusicSong(this.songs[index]);

    if(isConnectedToServerForShare && isAppleMusicSong) {
      this.queueSongInSharedQueue(index);
    } else if (isConnectedToServerForShare && !isAppleMusicSong) {
      this.showAppleMusicWarningModal();
    } else if (!isConnectedToServerForShare) {
      this.showNotConnectedWarningModal();
    }
  }

  private queueSongInSharedQueue(index: number): void {
    let selectedSong: Song = this.songs[index];
    this.queueService.queueSong(selectedSong, this.userService.getUser());
  }

  private showAppleMusicWarningModal(): void {
    let title: string = 'Song not found in Apple Music';
    let body: string = 'This song is not able to be queued because it was not found in the Apple Music Store. You can hide these songs in Settings';
    this.showModal(title, body);
  }

  private showNotConnectedWarningModal(): void {
    let title: string = "Can't Queue Song - Not Connected";
    let body: string = "You are not connected to a room. Please go to settings and create a room or join a friend's."
    this.showModal(title, body);
  }

  private showModal(title: string, body: string): void {
    const modal = this.modalService.open(WarningModalComponent, { centered: true });
    modal.componentInstance.title = title;
    modal.componentInstance.body = body;
  }

  private filterNonAppleMusicSongsIfApplicable(songs: Song[]): Song[] {
    if(this.shouldFilterNonAppleMusicIfApplicable 
        && this.configService.getShouldHideNonAppleMusic()) {
      let filteredSongs: Song[] = [];
      filteredSongs = songs.filter(
        song => !this.shouldDisableNonAppleMusicSong(song)
      );

      return filteredSongs;
    }

    return songs;
  }

}

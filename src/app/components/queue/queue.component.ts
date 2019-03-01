import { Component, OnInit } from '@angular/core';
import { QueueService } from 'src/app/services/queue.service';
import { Song } from 'src/app/model/song';
import { ConfigService } from 'src/app/services/config.service';

@Component({
  selector: 'app-queue',
  templateUrl: './queue.component.html',
  styleUrls: ['./queue.component.css']
})
export class QueueComponent implements OnInit {

  queue: Song[] = [];

  constructor(
    private queueService: QueueService, 
    private configService: ConfigService
  ) { }

  ngOnInit() {
    if(this.isSocketConnectionActive()) {
      this.updateQueue();
    }
  }

  updateQueue(): void {
    return this.queueService.queueRequest();
  }

  getCurrentQueue(): Song[] {
    return this.queueService.getCurrentQueue(); 
  }

  isSocketConnectionActive(): boolean {
    return this.queueService.getIsConnected();
  }

  isStandAloneAppMode(): boolean {
    return this.configService.getStandAloneAppMode();
  }
}

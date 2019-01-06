import { Component, OnInit } from '@angular/core';
import { QueueService } from 'src/app/services/queue.service';
import { Song } from 'src/app/model/song';

@Component({
  selector: 'app-queue',
  templateUrl: './queue.component.html',
  styleUrls: ['./queue.component.css']
})
export class QueueComponent implements OnInit {
  constructor(private queueService: QueueService) { }

  ngOnInit() {
  }

  getCurrentQueue(): Song[] {
    return this.queueService.getCurrentQueue();
  }

  isSocketConnectionActive(): boolean {
    return this.queueService.getIsConnected();
  }
}

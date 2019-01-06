import { Component, OnInit } from '@angular/core';
import { QueueService } from 'src/app/services/queue.service';
import { Message } from 'src/app/model/message';
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

  sendTestMessage(): void {
    this.queueService.sendTestMessage();
  }

  getMessages(): Message[] {
    return this.queueService.getMessages();
  }

  getCurrentQueue(): Song[] {
    return this.queueService.getCurrentQueue();
  }
}

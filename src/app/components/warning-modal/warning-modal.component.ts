import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-warning-modal',
  templateUrl: './warning-modal.component.html',
  styleUrls: ['./warning-modal.component.css']
})
export class WarningModalComponent {
  @Input() title;
  @Input() body;

  constructor(public activeModal: NgbActiveModal) {}
}

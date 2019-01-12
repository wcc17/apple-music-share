import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  private isStandAloneAppMode: boolean = false;

  constructor() { }

  setStandAloneAppMode(isStandAloneAppMode: boolean) {
    this.isStandAloneAppMode = isStandAloneAppMode;
  }

  getStandAloneAppMode(): boolean {
    return this.isStandAloneAppMode;
  }
}

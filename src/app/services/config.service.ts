import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  private isStandAloneAppMode: boolean = false;
  private shouldHideNonAppleMusic: boolean = false;

  constructor() { }

  setStandAloneAppMode(isStandAloneAppMode: boolean): void {
    this.isStandAloneAppMode = isStandAloneAppMode;
  }

  getStandAloneAppMode(): boolean {
    return this.isStandAloneAppMode;
  }

  setShouldHideNonAppleMusic(shouldHideNonAppleMusic: boolean): void {
    this.shouldHideNonAppleMusic = shouldHideNonAppleMusic;
  }

  getShouldHideNonAppleMusic(): boolean {
    return this.shouldHideNonAppleMusic;
  }
}

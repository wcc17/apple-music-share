import { User } from './user';

//TODO: move PlayParams, Artwork, and possibly attributes to their own classes if they need to be reused by artists, albums, or playlists
export class PlayParams {
    id: string;
    isLibrary: boolean;
    kind: string;
    catalogId: string;
}

export class Artwork {
    width: number;
    height: number;
    url: string;
    bgColor: string;
    textColor1: string;
}

export class Song {
    attributes: Attributes;
    id: string;
    type: string;
    href: string;

    //not from apple music
    requestedBy: User;
}

export class Attributes {
    releaseDate: string;
    albumName: string;
    artistName: string;
    durationInMillis: number;
    name: string;
    trackNumber: number;
    playParams: PlayParams;
    artwork: Artwork;
    contentRating: string;
}
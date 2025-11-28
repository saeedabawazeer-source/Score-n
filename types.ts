
export interface PlayerBio {
  height: string; // e.g. "180 cm"
  age: number;
  strongFoot: 'Right' | 'Left' | 'Both';
  weakFoot: number; // 1-5
}

export interface PlayerProfile {
  name: string;
  position: string;
  image?: string;
  bio: PlayerBio;
}

export enum Position {
  FWD = 'FWD',
  MID = 'MID',
  DEF = 'DEF',
  GK = 'GK'
}
export interface ClientEvents {
  getCurrentSong(song: string): void;
}

export interface ServerEvents {
  getCurrentSong(): void;
  startMusic(): void;
  stopMusic(): void;
}

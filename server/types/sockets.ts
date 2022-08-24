export interface ClientEvents {
  addDeath(): void;
  getCurrentSong(song: string): void;
}

export interface ServerEvents {
  getCurrentSong(): void;
}

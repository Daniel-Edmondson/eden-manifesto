/**
 * THE EDEN PROJECT — MUSIC PLAYER TRACK LIST
 *
 * All 29 tracks curated for the experience.
 *
 * To get a Spotify track ID:
 * 1. Open Spotify, find the song
 * 2. Right-click → Share → Copy Song Link
 * 3. The ID is the string after /track/ (e.g., spotify.com/track/ABC123 → "ABC123")
 *
 * Set spotifyId to null for tracks not on Spotify (the player will show a search link instead).
 */

export const tracks = [
  {
    title: 'Minty',
    artist: 'MIKE, SURF GANG',
    spotifyId: '1pyDwjJ1Purrpb9FjkrjyB',
  },
  {
    title: 'ATL (APPR3CIAT3 TH3 LOV3)',
    artist: 'Mike WiLL Made-It, 21 Savage',
    spotifyId: '2TiE2oSxAeaJFYWIMcCJsi',
  },
  {
    title: 'Tu Dime Cuando',
    artist: 'DJ Koze, Ada, Sofia Kourtesis, Inez',
    spotifyId: '6bVEKuUtyvQz4Z6ItzygGu',
  },
  {
    title: 'From A Woman',
    artist: 'Mariah the Scientist',
    spotifyId: '5YVmVthPhqjBUrqB2Rp5di',
  },
  {
    title: 'Chanel',
    artist: 'Frank Ocean',
    spotifyId: '6Nle9hKrkL1wQpwNfEkxjh',
  },
  {
    title: 'Goomba',
    artist: 'oopsy',
    spotifyId: '4IUHaAHFtJVENz8iWmFoOC',
  },
  {
    title: 'HIGH2GETBY',
    artist: 'Mercury',
    spotifyId: '3lB5cmc6YVzvIXLNBqB9lF',
  },
  {
    title: 'Still Here',
    artist: 'Lecrae',
    spotifyId: '7m0iB86deRY9Xy8LtiL1ts',
  },
  {
    title: 'bite marks',
    artist: 'cr1tter',
    spotifyId: '0hy9cnVTCoimnBn5r1dFkv',
  },
  {
    title: 'INTUITION',
    artist: 'Kenny Mason',
    spotifyId: '3X1s6f6txsJRmDH1tgchu5',
  },
  {
    title: 'either on or off the drugs',
    artist: 'JPEGMAFIA',
    spotifyId: '3EWaU5exMayFzQMkIfTX7w',
  },
  {
    title: 'Diet Pepsi',
    artist: 'Addison Rae',
    spotifyId: '6MzofobZt2dm0Kf1hTThFz',
  },
  {
    title: 'Call Me Irresponsible',
    artist: 'Bobby Darin',
    spotifyId: '0Juciz8gOjrO89qw5KwQV5',
  },
  {
    title: 'Cinderella',
    artist: 'Future, Metro Boomin, Travis Scott',
    spotifyId: '0hKtu53OlIFXVuYkZwcn3o',
  },
  {
    title: 'The Latter Teens',
    artist: 'Vansire',
    spotifyId: '6qr6qpP9J9YBBYsVmJFd5c',
  },
  {
    title: 'Art Vandelay',
    artist: 'Ducktails',
    spotifyId: '7c6CQz9iCQJ8hcDT2M34yQ',
  },
  {
    title: 'Not the 1975',
    artist: 'Knox',
    spotifyId: '5mzoTEYokJSroGlOw0LDp0',
  },
  {
    title: 'Were You There',
    artist: 'Sam Cooke, The Soul Stirrers',
    spotifyId: '6dCLsfPKHagxMI1vFATv2M',
  },
  {
    title: 'Love On Top',
    artist: 'Beyoncé',
    spotifyId: '1z6WtY7X4HQJvzxC4UgkSf',
  },
  {
    title: 'Empty And Silent',
    artist: 'Mount Kimbie, King Krule',
    spotifyId: '1SFUxSbBQbJqjN9rFOmYGk',
  },
  {
    title: 'Rejected - Chill House Remix',
    artist: 'Julie Ragbeer',
    spotifyId: '7bF1pumxu5dnnoE9JSijGo',
  },
  {
    title: 'Lens',
    artist: 'Frank Ocean',
    spotifyId: '371H6HjS4SXGbQ9IVfFUIL',
  },
  {
    title: 'All New',
    artist: 'SliccMic',
    spotifyId: '2MW29MviXnwUhbrgqbPZxs',
  },
  {
    title: 'Noonside',
    artist: 'Yaeji',
    spotifyId: '6fMipfFtGlw86Bzf5EMGPB',
  },
  {
    title: 'NFL',
    artist: 'Lil Uzi Vert',
    spotifyId: '1X1dy95bo2OirAmMkBIwkS',
  },
  {
    title: 'Icing on the Cake',
    artist: 'Grace Ives',
    spotifyId: '14Ao5GwSPhlroo0EhAgtRS',
  },
  {
    title: 'Nothing Can Change This Love',
    artist: 'Sam Cooke',
    spotifyId: '5FWm79n2VBgTDEhHGdJ0Qe',
  },
  {
    title: 'HALLOWEEN',
    artist: 'Kenny Mason',
    spotifyId: '5hN6nMxy9yvFFyBO8Wdzuh',
  },
  {
    title: 'No Romance',
    artist: 'Tirzah',
    spotifyId: '1vep0Lc0RtuZZ7ZE5NqPfX',
  },
];

// Generate a Spotify search URL for tracks without an ID
export function getSpotifySearchUrl(track) {
  const query = encodeURIComponent(`${track.title} ${track.artist}`);
  return `https://open.spotify.com/search/${query}`;
}

// Generate a Spotify embed URL for tracks with an ID
export function getSpotifyEmbedUrl(track) {
  if (!track.spotifyId) return null;
  return `https://open.spotify.com/embed/track/${track.spotifyId}?utm_source=generator&theme=0`;
}

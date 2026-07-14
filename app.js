'use strict';

/* ── SONG DATA ─────────────────────────────────────────────── */
const SONGS = [
  { id:1,  title:'Electric Dreams',  artist:'Luna Echo',            album:'Neon Horizon',   genre:'Electronic',     year:2024, cover:'https://picsum.photos/seed/elec1/300/300',  audio:'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',  color:'#0d1b4b' },
  { id:2,  title:'Midnight Groove',  artist:'The Jazz Collective',  album:'Blue Hour',       genre:'Jazz',           year:2024, cover:'https://picsum.photos/seed/jazz2/300/300',  audio:'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',  color:'#1a0a40' },
  { id:3,  title:'Urban Pulse',      artist:'Metro Beats',          album:'City Lights',     genre:'Hip Hop',        year:2024, cover:'https://picsum.photos/seed/urb3/300/300',   audio:'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',  color:'#0a2010' },
  { id:4,  title:'Neon Lights',      artist:'Synthwave Republic',   album:'Retro Future',    genre:'Synthwave',      year:2024, cover:'https://picsum.photos/seed/neon4/300/300',  audio:'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',  color:'#3a0a20' },
  { id:5,  title:'Deep Blue Ocean',  artist:'Ambient Soul',         album:'Depths',          genre:'Ambient',        year:2024, cover:'https://picsum.photos/seed/ocean5/300/300', audio:'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',  color:'#0a1a3e' },
  { id:6,  title:'Fire Dance',       artist:'Salsa Moderna',        album:'Caliente',        genre:'Latin',          year:2024, cover:'https://picsum.photos/seed/fire6/300/300',  audio:'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',  color:'#3a1a00' },
  { id:7,  title:'Rising Sun',       artist:'Orchestral Dreams',    album:'Epic Canvas',     genre:'Orchestral',     year:2024, cover:'https://picsum.photos/seed/sun7/300/300',   audio:'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3',  color:'#3a2800' },
  { id:8,  title:'Shadow Run',       artist:'Dark Matter',          album:'Void',            genre:'Dark Electronic',year:2024, cover:'https://picsum.photos/seed/shad8/300/300',  audio:'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',  color:'#0a0a20' },
  { id:9,  title:'Golden Era',       artist:'Retro Vibes',          album:'Throwback',       genre:'R&B',            year:2024, cover:'https://picsum.photos/seed/gold9/300/300',  audio:'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3',  color:'#2e1800' },
  { id:10, title:'Crystal Clear',    artist:'Indie Flow',           album:'Transparent',     genre:'Indie',          year:2024, cover:'https://picsum.photos/seed/crys10/300/300', audio:'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3', color:'#003030' },
];

/* ── STATE ──────────────────────────────────────────────────── */
let songs         = [...SONGS];
let currentIndex  = -1;
let isPlaying     = false;
let isShuffle     = false;
let repeatMode    = 0;   // 0=off 1=all 2=one
let likedSongs    = new Set();
let shuffleOrder  = [];
let isDragging    = false;

/* ── AUDIO ──────────────────────────────────────────────────── */
const audio = new Audio();
audio.volume = 0.7;
audio.crossOrigin = 'anonymous';

/* ── DOM REFS ───────────────────────────────────────────────── */
const $  = id => document.getElementById(id);
const el = {
  npBar:         $('nowPlayingBar'),
  npCover:       $('npCover'),
  npTitle:       $('npTitle'),
  npArtist:      $('npArtist'),
  npLike:        $('npLike'),
  npCurrentTime: $('npCurrentTime'),
  npTotalTime:   $('npTotalTime'),
  npProgress:    $('npProgress'),
  npFill:        $('npProgressFill'),
  npThumb:       $('npProgressThumb'),
  btnPlay:       $('btnPlayPause'),
  btnPrev:       $('btnPrev'),
  btnNext:       $('btnNext'),
  btnShuffle:    $('btnShuffle'),
  btnRepeat:     $('btnRepeat'),
  btnMute:       $('btnMute'),
  volSlider:     $('volumeSlider'),
  songList:      $('songList'),
  quickGrid:     $('quickPicksGrid'),
  bannerTitle:   $('bannerTitle'),
  bannerArtist:  $('bannerArtist'),
  bannerCover:   $('bannerCover'),
  bannerBg:      $('bannerBg'),
  btnBannerPlay: $('btnBannerPlay'),
  topbar:        $('topbar'),
  pageScroll:    $('pageScroll'),
  searchInput:   $('searchInput'),
  shuffleAllBtn: $('shuffleAllBtn'),
  iconPlay:      document.querySelector('.icon-play'),
  iconPause:     document.querySelector('.icon-pause'),
};

/* ── INIT ───────────────────────────────────────────────────── */
function init() {
  renderBanner(songs[0]);
  renderQuickPicks(songs.slice(0, 6));
  renderSongList(songs);
  bindEvents();
  tryFetchFromAPI();
}

/* try fetching from API (works on Vercel) — falls back to local data */
async function tryFetchFromAPI() {
  try {
    const res  = await fetch('/api/songs');
    if (!res.ok) return;
    const data = await res.json();
    if (data.songs && data.songs.length) {
      songs = data.songs;
      renderQuickPicks(songs.slice(0, 6));
      renderSongList(songs);
      renderBanner(songs[0]);
    }
  } catch (_) { /* use local SONGS data */ }
}

/* ── RENDER FUNCTIONS ───────────────────────────────────────── */
function renderBanner(song) {
  el.bannerTitle.textContent  = song.title;
  el.bannerArtist.textContent = `${song.artist} · ${song.album} · ${song.year}`;
  el.bannerCover.src          = song.cover;
  el.bannerCover.alt          = song.title;
  el.bannerBg.style.background =
    `linear-gradient(180deg, ${song.color}cc 0%, #121212 100%)`;
}

function renderQuickPicks(list) {
  el.quickGrid.innerHTML = list.map((s, i) => `
    <div class="song-card ${currentIndex === songs.indexOf(s) ? 'active' : ''}"
         data-idx="${songs.indexOf(s)}" id="card-${s.id}">
      <img class="song-card-cover" src="${s.cover}" alt="${s.title}" loading="lazy" />
      <button class="card-play-btn" data-idx="${songs.indexOf(s)}" title="Play ${s.title}">
        <svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
      </button>
      <div class="song-card-title">${s.title}</div>
      <div class="song-card-artist">${s.artist}</div>
    </div>
  `).join('');
}

function renderSongList(list) {
  el.songList.innerHTML = list.map((s, i) => {
    const realIdx = songs.indexOf(s);
    const active  = currentIndex === realIdx;
    return `
    <div class="song-row ${active ? 'active' : ''}"
         data-idx="${realIdx}" id="row-${s.id}">
      <div class="row-num">
        <span class="num-text">${i + 1}</span>
        <span class="row-play-icon">
          <svg viewBox="0 0 24 24">${active && isPlaying
            ? '<path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>'
            : '<path d="M8 5v14l11-7z"/>'}
          </svg>
        </span>
      </div>
      <div class="row-info">
        <img class="row-thumb" src="${s.cover}" alt="${s.title}" loading="lazy" />
        <div class="row-text">
          <div class="row-title">${s.title}</div>
          <div class="row-artist">${s.artist}</div>
        </div>
      </div>
      <div class="row-album">${s.album}</div>
      <div class="row-genre">${s.genre}</div>
      <div class="row-dur">${s.duration || '--:--'}</div>
    </div>`;
  }).join('');
}

/* ── PLAYBACK ───────────────────────────────────────────────── */
function playSong(idx) {
  if (idx < 0 || idx >= songs.length) return;
  currentIndex = idx;
  const song   = songs[idx];

  audio.src = song.audio;
  audio.load();
  audio.play().catch(() => showToast('Click play to start (browser policy)'));
  isPlaying = true;

  updateNowPlayingUI(song);
  updatePlayPauseIcon();
  updateActiveSongHighlight();
  el.npBar.classList.add('is-playing');
  renderBanner(song);
}

function togglePlay() {
  if (currentIndex === -1) { playSong(0); return; }
  if (isPlaying) {
    audio.pause();
    isPlaying = false;
    el.npBar.classList.remove('is-playing');
  } else {
    audio.play();
    isPlaying = true;
    el.npBar.classList.add('is-playing');
  }
  updatePlayPauseIcon();
  updateActiveSongHighlight();
}

function playNext() {
  if (songs.length === 0) return;
  let next;
  if (isShuffle) {
    if (!shuffleOrder.length) buildShuffleOrder();
    next = shuffleOrder.shift();
    if (shuffleOrder.length === 0) buildShuffleOrder();
  } else {
    next = (currentIndex + 1) % songs.length;
  }
  playSong(next);
}

function playPrev() {
  if (audio.currentTime > 3) { audio.currentTime = 0; return; }
  const prev = (currentIndex - 1 + songs.length) % songs.length;
  playSong(prev);
}

function buildShuffleOrder() {
  shuffleOrder = songs.map((_, i) => i)
    .filter(i => i !== currentIndex)
    .sort(() => Math.random() - 0.5);
}

/* ── UI UPDATE ──────────────────────────────────────────────── */
function updateNowPlayingUI(song) {
  el.npCover.src      = song.cover;
  el.npTitle.textContent  = song.title;
  el.npArtist.textContent = song.artist;
  el.npLike.classList.toggle('liked', likedSongs.has(song.id));
}

function updatePlayPauseIcon() {
  el.iconPlay.style.display  = isPlaying ? 'none' : 'block';
  el.iconPause.style.display = isPlaying ? 'block' : 'none';
}

function updateActiveSongHighlight() {
  document.querySelectorAll('.song-row').forEach(row => {
    const idx = parseInt(row.dataset.idx);
    row.classList.toggle('active', idx === currentIndex);
    const icon = row.querySelector('.row-play-icon svg');
    if (icon && idx === currentIndex) {
      icon.innerHTML = isPlaying
        ? '<path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" fill="currentColor"/>'
        : '<path d="M8 5v14l11-7z" fill="currentColor"/>';
    }
  });
  document.querySelectorAll('.song-card').forEach(card => {
    card.classList.toggle('active', parseInt(card.dataset.idx) === currentIndex);
  });
}

/* ── PROGRESS ───────────────────────────────────────────────── */
function updateProgress() {
  if (!audio.duration || isDragging) return;
  const pct = (audio.currentTime / audio.duration) * 100;
  el.npFill.style.width   = pct + '%';
  el.npThumb.style.left   = `calc(${pct}% - 6px)`;
  el.npCurrentTime.textContent = fmtTime(audio.currentTime);
}

function fmtTime(s) {
  if (!s || isNaN(s)) return '0:00';
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, '0')}`;
}

function seekTo(e) {
  const rect = el.npProgress.getBoundingClientRect();
  const pct  = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
  if (audio.duration) {
    audio.currentTime = pct * audio.duration;
    el.npFill.style.width = (pct * 100) + '%';
  }
}

/* ── VOLUME ─────────────────────────────────────────────────── */
function setVolume(val) {
  audio.volume = val / 100;
  audio.muted  = false;
  el.volSlider.style.setProperty('--vol', val + '%');
}

function toggleMute() {
  audio.muted = !audio.muted;
  el.btnMute.classList.toggle('active', audio.muted);
}

/* ── SEARCH ─────────────────────────────────────────────────── */
function handleSearch(q) {
  const query = q.trim().toLowerCase();
  if (!query) {
    renderSongList(songs);
    renderQuickPicks(songs.slice(0, 6));
    return;
  }
  const filtered = songs.filter(s =>
    s.title.toLowerCase().includes(query) ||
    s.artist.toLowerCase().includes(query) ||
    s.genre.toLowerCase().includes(query) ||
    s.album.toLowerCase().includes(query)
  );
  renderSongList(filtered);
}

/* ── TOAST ──────────────────────────────────────────────────── */
function showToast(msg) {
  let t = document.querySelector('.toast');
  if (!t) {
    t = document.createElement('div');
    t.className = 'toast';
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2800);
}

/* ── EVENT BINDING ──────────────────────────────────────────── */
function bindEvents() {
  /* Playback buttons */
  el.btnPlay.addEventListener('click', togglePlay);
  el.btnNext.addEventListener('click', playNext);
  el.btnPrev.addEventListener('click', playPrev);

  el.btnShuffle.addEventListener('click', () => {
    isShuffle = !isShuffle;
    el.btnShuffle.classList.toggle('active', isShuffle);
    if (isShuffle) buildShuffleOrder();
    showToast(isShuffle ? 'Shuffle on' : 'Shuffle off');
  });

  el.btnRepeat.addEventListener('click', () => {
    repeatMode = (repeatMode + 1) % 3;
    const labels = ['Repeat off', 'Repeat all', 'Repeat one'];
    el.btnRepeat.classList.toggle('active', repeatMode > 0);
    showToast(labels[repeatMode]);
  });

  el.npLike.addEventListener('click', () => {
    if (currentIndex === -1) return;
    const id = songs[currentIndex].id;
    likedSongs.has(id) ? likedSongs.delete(id) : likedSongs.add(id);
    el.npLike.classList.toggle('liked', likedSongs.has(id));
    showToast(likedSongs.has(id) ? '♥ Added to Liked Songs' : 'Removed from Liked Songs');
  });

  /* Song list clicks */
  el.songList.addEventListener('click', e => {
    const row = e.target.closest('.song-row');
    if (!row) return;
    const idx = parseInt(row.dataset.idx);
    if (idx === currentIndex) togglePlay();
    else playSong(idx);
  });

  /* Quick picks / cards */
  el.quickGrid.addEventListener('click', e => {
    const btn  = e.target.closest('.card-play-btn');
    const card = e.target.closest('.song-card');
    const src  = btn || card;
    if (!src) return;
    const idx = parseInt(src.dataset.idx);
    if (idx === currentIndex) togglePlay();
    else playSong(idx);
  });

  /* Banner play */
  el.btnBannerPlay.addEventListener('click', () => playSong(0));

  /* Shuffle all */
  el.shuffleAllBtn.addEventListener('click', e => {
    e.preventDefault();
    isShuffle = true;
    el.btnShuffle.classList.add('active');
    buildShuffleOrder();
    playSong(shuffleOrder.shift());
    showToast('Shuffling all songs');
  });

  /* Progress bar */
  el.npProgress.addEventListener('mousedown', e => {
    isDragging = true;
    seekTo(e);
  });
  document.addEventListener('mousemove', e => { if (isDragging) seekTo(e); });
  document.addEventListener('mouseup',   () => { isDragging = false; });

  /* Volume */
  el.volSlider.addEventListener('input', e => setVolume(parseInt(e.target.value)));
  el.btnMute.addEventListener('click', toggleMute);

  /* Search */
  el.searchInput.addEventListener('input', e => handleSearch(e.target.value));

  /* Topbar scroll effect */
  el.pageScroll.addEventListener('scroll', () => {
    el.topbar.classList.toggle('scrolled', el.pageScroll.scrollTop > 60);
  });

  /* Keyboard shortcuts */
  document.addEventListener('keydown', e => {
    const tag = e.target.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA') return;
    switch (e.code) {
      case 'Space':       e.preventDefault(); togglePlay(); break;
      case 'ArrowRight':  audio.currentTime = Math.min(audio.duration || 0, audio.currentTime + 5); break;
      case 'ArrowLeft':   audio.currentTime = Math.max(0, audio.currentTime - 5); break;
      case 'ArrowUp':     el.volSlider.value = Math.min(100, parseInt(el.volSlider.value) + 5); setVolume(parseInt(el.volSlider.value)); break;
      case 'ArrowDown':   el.volSlider.value = Math.max(0,   parseInt(el.volSlider.value) - 5); setVolume(parseInt(el.volSlider.value)); break;
      case 'KeyN':        playNext(); break;
      case 'KeyP':        playPrev(); break;
      case 'KeyM':        toggleMute(); break;
    }
  });

  /* Audio events */
  audio.addEventListener('timeupdate', updateProgress);

  audio.addEventListener('loadedmetadata', () => {
    el.npTotalTime.textContent = fmtTime(audio.duration);
  });

  audio.addEventListener('ended', () => {
    if (repeatMode === 2) { audio.currentTime = 0; audio.play(); }
    else { playNext(); }
  });

  audio.addEventListener('play',  () => {
    isPlaying = true;
    updatePlayPauseIcon();
    el.npBar.classList.add('is-playing');
    updateActiveSongHighlight();
  });

  audio.addEventListener('pause', () => {
    isPlaying = false;
    updatePlayPauseIcon();
    el.npBar.classList.remove('is-playing');
    updateActiveSongHighlight();
  });

  audio.addEventListener('error', () => {
    showToast('⚠ Could not load audio. Skipping…');
    setTimeout(playNext, 1500);
  });

  /* Volume slider CSS track fill */
  el.volSlider.addEventListener('input', e => {
    el.volSlider.style.setProperty('--vol', e.target.value + '%');
  });
  el.volSlider.style.setProperty('--vol', '70%');
}

/* ── BOOT ───────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', init);

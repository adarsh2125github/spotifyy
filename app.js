'use strict';

/* ── SONG DATA ─────────────────────────────────────────────── */
const SONGS = [
  { id: 'fHI8X4OXluQ', title: 'Blinding Lights', artist: 'The Weeknd', album: 'After Hours', genre: 'Synth-pop', year: 2020, cover: 'https://i.ytimg.com/vi/fHI8X4OXluQ/hqdefault.jpg', audio: '/api/stream?id=fHI8X4OXluQ', color: '#0d1b4b', duration: '3:21', durationSecs: 201 },
  { id: 'JGwWNGJdvx8', title: 'Shape of You', artist: 'Ed Sheeran', album: '÷ (Divide)', genre: 'Pop', year: 2017, cover: 'https://i.ytimg.com/vi/JGwWNGJdvx8/hqdefault.jpg', audio: '/api/stream?id=JGwWNGJdvx8', color: '#1a0a40', duration: '3:53', durationSecs: 233 },
  { id: '7wtfhZwyrcc', title: 'Believer', artist: 'Imagine Dragons', album: 'Evolve', genre: 'Alt-rock', year: 2017, cover: 'https://i.ytimg.com/vi/7wtfhZwyrcc/hqdefault.jpg', audio: '/api/stream?id=7wtfhZwyrcc', color: '#0a2010', duration: '3:24', durationSecs: 204 },
  { id: 'kTJczUoc26U', title: 'Stay', artist: 'The Kid LAROI & Justin Bieber', album: 'F*CK LOVE 3: OVER YOU', genre: 'Pop-rock', year: 2021, cover: 'https://i.ytimg.com/vi/kTJczUoc26U/hqdefault.jpg', audio: '/api/stream?id=kTJczUoc26U', color: '#3a0a20', duration: '2:21', durationSecs: 141 },
  { id: '34Na4j8AVgA', title: 'Starboy', artist: 'The Weeknd ft. Daft Punk', album: 'Starboy', genre: 'R&B/Electronic', year: 2016, cover: 'https://i.ytimg.com/vi/34Na4j8AVgA/hqdefault.jpg', audio: '/api/stream?id=34Na4j8AVgA', color: '#0a1a3e', duration: '3:50', durationSecs: 230 },
  { id: 'H5v3kku4y6Q', title: 'As It Was', artist: 'Harry Styles', album: "Harry's House", genre: 'Indie-pop', year: 2022, cover: 'https://i.ytimg.com/vi/H5v3kku4y6Q/hqdefault.jpg', audio: '/api/stream?id=H5v3kku4y6Q', color: '#3a1a00', duration: '2:47', durationSecs: 167 },
  { id: 'G7KNmW9a75Y', title: 'Flowers', artist: 'Miley Cyrus', album: 'Endless Summer Vacation', genre: 'Pop', year: 2023, cover: 'https://i.ytimg.com/vi/G7KNmW9a75Y/hqdefault.jpg', audio: '/api/stream?id=G7KNmW9a75Y', color: '#3a2800', duration: '3:20', durationSecs: 200 },
  { id: '2Vv-BfVoq4g', title: 'Perfect', artist: 'Ed Sheeran', album: '÷ (Divide)', genre: 'Pop', year: 2017, cover: 'https://i.ytimg.com/vi/2Vv-BfVoq4g/hqdefault.jpg', audio: '/api/stream?id=2Vv-BfVoq4g', color: '#0a0a20', duration: '4:23', durationSecs: 263 },
  { id: '0zGcUoRlpgY', title: 'Closer', artist: 'The Chainsmokers ft. Halsey', album: 'Collage', genre: 'EDM/Pop', year: 2016, cover: 'https://i.ytimg.com/vi/0zGcUoRlpgY/hqdefault.jpg', audio: '/api/stream?id=0zGcUoRlpgY', color: '#2e1800', duration: '4:05', durationSecs: 245 },
  { id: 'DyDfgMOUUA8', title: 'Bad Guy', artist: 'Billie Eilish', album: 'When We All Fall Asleep, Where Do We Go?', genre: 'Electropop', year: 2019, cover: 'https://i.ytimg.com/vi/DyDfgMOUUA8/hqdefault.jpg', audio: '/api/stream?id=DyDfgMOUUA8', color: '#003030', duration: '3:14', durationSecs: 194 }
];

/* ── STATE ──────────────────────────────────────────────────── */
let songs         = [...SONGS];
let trendingSongs = [...SONGS];
let currentIndex  = -1;
let isPlaying     = false;
let isShuffle     = false;
let repeatMode    = 0;   // 0=off 1=all 2=one
let likedSongs    = new Set();
let shuffleOrder  = [];
let isDragging    = false;
let apiBase       = 'http://127.0.0.1:8000';

/* ── YOUTUBE PLAYER ─────────────────────────────────────────── */
let ytPlayer = null;
let ytPlayerReady = false;
let progressInterval = null;

// Load YouTube Iframe API dynamically
const tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
const firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

window.onYouTubeIframeAPIReady = function() {
  ytPlayer = new YT.Player('yt-player', {
    height: '1',
    width: '1',
    videoId: '',
    playerVars: {
      'playsinline': 1,
      'controls': 0,
      'disablekb': 1,
      'fs': 0,
      'rel': 0,
      'showinfo': 0,
      'iv_load_policy': 3
    },
    events: {
      'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange,
      'onError': onPlayerError
    }
  });
};

function onPlayerReady(event) {
  ytPlayerReady = true;
  ytPlayer.setVolume(70);
}

function onPlayerStateChange(event) {
  if (event.data === YT.PlayerState.PLAYING) {
    isPlaying = true;
    updatePlayPauseIcon();
    el.npBar.classList.add('is-playing');
    updateActiveSongHighlight();
    
    clearInterval(progressInterval);
    progressInterval = setInterval(updateProgress, 500);
  } else if (event.data === YT.PlayerState.PAUSED) {
    isPlaying = false;
    updatePlayPauseIcon();
    el.npBar.classList.remove('is-playing');
    updateActiveSongHighlight();
    clearInterval(progressInterval);
  } else if (event.data === YT.PlayerState.ENDED) {
    isPlaying = false;
    updatePlayPauseIcon();
    el.npBar.classList.remove('is-playing');
    updateActiveSongHighlight();
    clearInterval(progressInterval);
    
    if (repeatMode === 2) {
      ytPlayer.seekTo(0, true);
      ytPlayer.playVideo();
    } else {
      playNext();
    }
  }
}

function onPlayerError(event) {
  showToast(`⚠ Could not load audio (Error Code: ${event.data}). Skipping…`);
  clearInterval(progressInterval);
  setTimeout(playNext, 1500);
}

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
    if (!res.ok) throw new Error();
    const data = await res.json();
    if (data.songs && data.songs.length) {
      apiBase = '';
      songs = data.songs.map(mapAudioUrl);
      trendingSongs = [...songs];
      renderQuickPicks(songs.slice(0, 6));
      renderSongList(songs);
      renderBanner(songs[0]);
    }
  } catch (_) {
    try {
      const res  = await fetch('http://127.0.0.1:8000/api/songs');
      if (!res.ok) throw new Error();
      const data = await res.json();
      if (data.songs && data.songs.length) {
        apiBase = 'http://127.0.0.1:8000';
        songs = data.songs.map(mapAudioUrl);
        trendingSongs = [...songs];
        renderQuickPicks(songs.slice(0, 6));
        renderSongList(songs);
        renderBanner(songs[0]);
      }
    } catch (err) {
      apiBase = 'http://127.0.0.1:8000';
      songs = SONGS.map(mapAudioUrl);
      trendingSongs = [...songs];
      renderQuickPicks(songs.slice(0, 6));
      renderSongList(songs);
      renderBanner(songs[0]);
    }
  }
}

function mapAudioUrl(song) {
  if (song.audio && song.audio.startsWith('/api/')) {
    return { ...song, audio: apiBase + song.audio };
  }
  return song;
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

  if (ytPlayer && ytPlayerReady) {
    ytPlayer.loadVideoById(song.id);
    ytPlayer.playVideo();
  }

  updateNowPlayingUI(song);
  renderBanner(song);
}

function togglePlay() {
  if (currentIndex === -1) { playSong(0); return; }
  if (!ytPlayer || !ytPlayerReady) return;
  
  const state = ytPlayer.getPlayerState();
  if (state === YT.PlayerState.PLAYING) {
    ytPlayer.pauseVideo();
  } else {
    ytPlayer.playVideo();
  }
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
  if (!ytPlayer || !ytPlayerReady) return;
  const currentTime = ytPlayer.getCurrentTime();
  if (currentTime > 3) {
    ytPlayer.seekTo(0, true);
    return;
  }
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
  if (!ytPlayer || !ytPlayerReady || isDragging) return;
  const currentTime = ytPlayer.getCurrentTime();
  const duration = ytPlayer.getDuration();
  if (!duration) return;
  
  const pct = (currentTime / duration) * 100;
  el.npFill.style.width   = pct + '%';
  el.npThumb.style.left   = `calc(${pct}% - 6px)`;
  el.npCurrentTime.textContent = fmtTime(currentTime);
  el.npTotalTime.textContent = fmtTime(duration);
}

function fmtTime(s) {
  if (!s || isNaN(s)) return '0:00';
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, '0')}`;
}

function seekTo(e) {
  if (!ytPlayer || !ytPlayerReady) return;
  const rect = el.npProgress.getBoundingClientRect();
  const pct  = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
  const duration = ytPlayer.getDuration();
  if (duration) {
    ytPlayer.seekTo(pct * duration, true);
    el.npFill.style.width = (pct * 100) + '%';
  }
}

/* ── VOLUME ─────────────────────────────────────────────────── */
function setVolume(val) {
  if (ytPlayer && ytPlayerReady) {
    ytPlayer.setVolume(val);
    ytPlayer.unMute();
  }
  el.volSlider.style.setProperty('--vol', val + '%');
}

function toggleMute() {
  if (!ytPlayer || !ytPlayerReady) return;
  if (ytPlayer.isMuted()) {
    ytPlayer.unMute();
    el.btnMute.classList.remove('active');
  } else {
    ytPlayer.mute();
    el.btnMute.classList.add('active');
  }
}

let searchTimeout = null;

async function handleSearch(q) {
  const query = q.trim();
  if (!query) {
    clearTimeout(searchTimeout);
    songs = [...trendingSongs];
    renderSongList(songs);
    renderQuickPicks(songs.slice(0, 6));
    return;
  }

  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(async () => {
    try {
      const res = await fetch((apiBase || '') + '/api/search?q=' + encodeURIComponent(query));
      if (!res.ok) throw new Error();
      const data = await res.json();
      if (data.songs && data.songs.length) {
        songs = data.songs.map(mapAudioUrl);
        renderSongList(songs);
      } else {
        el.songList.innerHTML = `<div style="padding: 20px; color: #b3b3b3; text-align: center;">No results found for "${query}"</div>`;
      }
    } catch (err) {
      const filtered = trendingSongs.filter(s =>
        s.title.toLowerCase().includes(query.toLowerCase()) ||
        s.artist.toLowerCase().includes(query.toLowerCase()) ||
        s.album.toLowerCase().includes(query.toLowerCase())
      );
      songs = filtered;
      renderSongList(songs);
    }
  }, 300);
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
    if (!ytPlayer || !ytPlayerReady) return;
    switch (e.code) {
      case 'Space':       e.preventDefault(); togglePlay(); break;
      case 'ArrowRight':  ytPlayer.seekTo(Math.min(ytPlayer.getDuration() || 0, ytPlayer.getCurrentTime() + 5), true); break;
      case 'ArrowLeft':   ytPlayer.seekTo(Math.max(0, ytPlayer.getCurrentTime() - 5), true); break;
      case 'ArrowUp':     el.volSlider.value = Math.min(100, parseInt(el.volSlider.value) + 5); setVolume(parseInt(el.volSlider.value)); break;
      case 'ArrowDown':   el.volSlider.value = Math.max(0,   parseInt(el.volSlider.value) - 5); setVolume(parseInt(el.volSlider.value)); break;
      case 'KeyN':        playNext(); break;
      case 'KeyP':        playPrev(); break;
      case 'KeyM':        toggleMute(); break;
    }
  });

  /* Volume slider CSS track fill */
  el.volSlider.addEventListener('input', e => {
    el.volSlider.style.setProperty('--vol', e.target.value + '%');
  });
  el.volSlider.style.setProperty('--vol', '70%');
}

/* ── BOOT ───────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', init);

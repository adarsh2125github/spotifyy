'use strict';

/* ── SONG DATA ─────────────────────────────────────────────── */
const SONGS = [
  { id: 'u6b8OPOfTnk', title: 'Blinding Lights',  artist: 'The Weeknd',                    album: 'After Hours',                        genre: 'Synth-pop',    year: 2020, cover: 'https://i.scdn.co/image/ab67616d0000b273b526d17e57c6b541fc112678', audio: '/api/stream?id=u6b8OPOfTnk', color: '#0d1b4b', duration: '3:21', durationSecs: 201 },
  { id: 'K5y2N0jZg8k', title: 'Shape of You',      artist: 'Ed Sheeran',                    album: '÷ (Divide)',                          genre: 'Pop',          year: 2017, cover: 'https://i.scdn.co/image/ab67616d0000b273ba5db46f4b83884b268a0c5c', audio: '/api/stream?id=K5y2N0jZg8k', color: '#1a0a40', duration: '3:53', durationSecs: 233 },
  { id: 'gOsM-DYAEhY', title: 'Believer',           artist: 'Imagine Dragons',               album: 'Evolve',                             genre: 'Alt-rock',     year: 2017, cover: 'https://i.scdn.co/image/ab67616d0000b2735f1fda6f9cf50c37747e9238', audio: '/api/stream?id=gOsM-DYAEhY', color: '#0a2010', duration: '3:24', durationSecs: 204 },
  { id: 'AnMYEee45dM', title: 'Stay',               artist: 'The Kid LAROI & Justin Bieber', album: 'F*CK LOVE 3: OVER YOU',              genre: 'Pop-rock',     year: 2021, cover: 'https://i.scdn.co/image/ab67616d0000b27341e31d6eaadb0d06115b3769', audio: '/api/stream?id=AnMYEee45dM', color: '#3a0a20', duration: '2:21', durationSecs: 141 },
  { id: '34Na4j8AVgA', title: 'Starboy',             artist: 'The Weeknd ft. Daft Punk',      album: 'Starboy',                            genre: 'R&B',          year: 2016, cover: 'https://i.scdn.co/image/ab67616d0000b2734718dec6954e110b45b0685d', audio: '/api/stream?id=34Na4j8AVgA', color: '#0a1a3e', duration: '3:50', durationSecs: 230 },
  { id: 'H5v3kku4y6Q', title: 'As It Was',          artist: 'Harry Styles',                  album: "Harry's House",                      genre: 'Indie-pop',    year: 2022, cover: 'https://i.scdn.co/image/ab67616d0000b273b4695c5b9f71c4c1a797c276', audio: '/api/stream?id=H5v3kku4y6Q', color: '#3a1a00', duration: '2:47', durationSecs: 167 },
  { id: 'a1yDcs95m84', title: 'Flowers',             artist: 'Miley Cyrus',                   album: 'Endless Summer Vacation',            genre: 'Pop',          year: 2023, cover: 'https://i.scdn.co/image/ab67616d0000b273f429549123d6a3f4ae29da60', audio: '/api/stream?id=a1yDcs95m84', color: '#3a2800', duration: '3:20', durationSecs: 200 },
  { id: '817P8W8-mGE', title: 'Perfect',             artist: 'Ed Sheeran',                    album: '÷ (Divide)',                          genre: 'Pop',          year: 2017, cover: 'https://i.scdn.co/image/ab67616d0000b273ba5db46f4b83884b268a0c5c', audio: '/api/stream?id=817P8W8-mGE', color: '#0a0a20', duration: '4:23', durationSecs: 263 },
  { id: '0zGcUoRlhmw', title: 'Closer',              artist: 'The Chainsmokers ft. Halsey',   album: 'Collage',                            genre: 'EDM/Pop',      year: 2016, cover: 'https://i.scdn.co/image/ab67616d0000b2732ce2ab8b49e29a997abf064b', audio: '/api/stream?id=0zGcUoRlhmw', color: '#2e1800', duration: '4:05', durationSecs: 245 },
  { id: 'DyDfgMOUHC8', title: 'Bad Guy',             artist: 'Billie Eilish',                 album: 'When We All Fall Asleep…',           genre: 'Electropop',   year: 2019, cover: 'https://i.scdn.co/image/ab67616d0000b27350aae1c3905cfaf57b1f558a', audio: '/api/stream?id=DyDfgMOUHC8', color: '#003030', duration: '3:14', durationSecs: 194 }
];

const COVER_FALLBACK = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='150' height='150' viewBox='0 0 24 24'%3E%3Crect width='24' height='24' fill='%23282828'/%3E%3Cpath d='M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z' fill='%23535353'/%3E%3C/svg%3E";

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
let apiBase       = '';

/* ── NATIVE AUDIO PLAYER ─────────────────────────────────────── */
let audio = null;

function setupAudioPlayer() {
  audio = document.getElementById('mainAudio');
  if (!audio) {
    audio = new Audio();
    audio.id = 'mainAudio';
    document.body.appendChild(audio);
  }

  audio.addEventListener('play', () => {
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

  audio.addEventListener('timeupdate', updateProgress);

  audio.addEventListener('ended', () => {
    if (repeatMode === 2) {
      audio.currentTime = 0;
      audio.play().catch(() => {});
    } else {
      playNext();
    }
  });

  audio.addEventListener('error', (e) => {
    console.error("Audio error:", e);
    // If the audio source fails (likely due to a rate limit or 403), fetch client-side stream url
    const song = songs[currentIndex];
    if (song && !song._retried) {
      song._retried = true;
      resolveClientStreamUrl(song.id).then(url => {
        if (url) {
          audio.src = url;
          audio.play().catch(() => {});
        } else {
          showToast("⚠ Stream error. Trying next song...");
          setTimeout(playNext, 1000);
        }
      });
    } else {
      showToast("⚠ Playback error. Skipping...");
      setTimeout(playNext, 1000);
    }
  });
}

// Bypasses backend rate limits by resolving directly using public client-side Invidious/Piped APIs
async function resolveClientStreamUrl(videoId) {
  const instances = [
    `https://invidious.projectsegfau.lt/api/v1/videos/${videoId}`,
    `https://invidious.flokinet.to/api/v1/videos/${videoId}`,
    `https://y.com.sb/api/v1/videos/${videoId}`
  ];

  for (let url of instances) {
    try {
      const res = await fetch(url);
      if (!res.ok) continue;
      const data = await res.json();
      if (data.formatStreams && data.formatStreams.length > 0) {
        return data.formatStreams[0].url;
      }
      if (data.adaptiveFormats && data.adaptiveFormats.length > 0) {
        // Find best audio format
        const audioFormats = data.adaptiveFormats.filter(f => f.type.startsWith('audio/'));
        if (audioFormats.length > 0) return audioFormats[0].url;
      }
    } catch (e) {
      console.warn("Client resolver failed for url", url, e);
    }
  }
  return null;
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
  featuredBanner:$('featuredBanner'),
  sectionQuickPicks: $('sectionQuickPicks'),
  sectionAllSongs:   $('sectionAllSongs'),
  iconPlay:      document.querySelector('.icon-play'),
  iconPause:     document.querySelector('.icon-pause'),
};

/* ── INIT ───────────────────────────────────────────────────── */
function init() {
  setupAudioPlayer();
  renderBanner(songs[0]);
  renderQuickPicks(songs.slice(0, 6));
  renderSongList(songs);
  bindEvents();
  tryFetchFromAPI();
}

async function tryFetchFromAPI() {
  try {
    const res  = await fetch('/api/songs');
    if (!res.ok) throw new Error();
    const data = await res.json();
    if (data.songs && data.songs.length) {
      songs = data.songs;
      trendingSongs = [...songs];
      renderQuickPicks(songs.slice(0, 6));
      renderSongList(songs);
      renderBanner(songs[0]);
    }
  } catch (_) { /* Keep default hardcoded songs */ }
}

/* ── RENDER FUNCTIONS ───────────────────────────────────────── */
function renderBanner(song) {
  el.bannerTitle.textContent  = song.title;
  el.bannerArtist.textContent = `${song.artist} · ${song.album} · ${song.year}`;
  el.bannerCover.src          = song.cover;
  el.bannerCover.onerror      = () => { el.bannerCover.src = COVER_FALLBACK; };
  el.bannerBg.style.background = `linear-gradient(180deg, ${song.color}cc 0%, #121212 100%)`;
}

function coverImg(src, cls) {
  return `<img class="${cls}" src="${src}" alt="" loading="lazy" onerror="this.onerror=null;this.src='${COVER_FALLBACK}';" />`;
}

function renderQuickPicks(list) {
  el.quickGrid.innerHTML = list.map(s => {
    const idx = songs.indexOf(s);
    return `
    <div class="song-card ${idx === currentIndex ? 'active' : ''}" data-idx="${idx}" id="card-${s.id}">
      ${coverImg(s.cover, 'song-card-cover')}
      <button class="card-play-btn" data-idx="${idx}" title="Play ${s.title}">
        <svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
      </button>
      <div class="song-card-title">${s.title}</div>
      <div class="song-card-artist">${s.artist}</div>
    </div>`;
  }).join('');
}

function renderSongList(list) {
  el.songList.innerHTML = list.map((s, i) => {
    const realIdx = songs.indexOf(s) === -1 ? i : songs.indexOf(s);
    const active  = currentIndex === realIdx;
    return `
    <div class="song-row ${active ? 'active' : ''}" data-idx="${realIdx}" id="row-${s.id}">
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
        ${coverImg(s.cover, 'row-thumb')}
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
async function playSong(idx) {
  if (idx < 0 || idx >= songs.length) return;
  currentIndex = idx;
  const song = songs[idx];

  // Primary: resolve via backend stream API.
  let audioUrl = song.audio;
  if (!audioUrl.startsWith('http') && !audioUrl.startsWith('/')) {
    audioUrl = `/api/stream?id=${song.id}`;
  }

  audio.src = audioUrl;
  audio.load();
  
  try {
    await audio.play();
  } catch (err) {
    // If browser auto-play policy blocks standard play, show message to prompt user click.
    console.warn("Autoplay block, retrying with click context helper", err);
    showToast("▶ Click play in player bar to listen");
  }

  updateNowPlayingUI(song);
  renderBanner(song);
  renderQuickPicks(songs.slice(0, 6));
  updateActiveSongHighlight();
}

function togglePlay() {
  if (currentIndex === -1) { playSong(0); return; }
  if (audio.paused) {
    audio.play().catch(() => {});
  } else {
    audio.pause();
  }
}

function playNext() {
  if (!songs.length) return;
  let next;
  if (isShuffle) {
    if (!shuffleOrder.length) buildShuffleOrder();
    next = shuffleOrder.shift();
    if (!shuffleOrder.length) buildShuffleOrder();
  } else {
    next = (currentIndex + 1) % songs.length;
  }
  playSong(next);
}

function playPrev() {
  if (audio.currentTime > 3) {
    audio.currentTime = 0;
    return;
  }
  playSong((currentIndex - 1 + songs.length) % songs.length);
}

function buildShuffleOrder() {
  shuffleOrder = songs.map((_, i) => i)
    .filter(i => i !== currentIndex)
    .sort(() => Math.random() - 0.5);
}

/* ── UI UPDATE ──────────────────────────────────────────────── */
function updateNowPlayingUI(song) {
  el.npCover.src = song.cover;
  el.npCover.onerror = () => { el.npCover.src = COVER_FALLBACK; };
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
  if (isDragging || !audio.duration) return;
  const pct = (audio.currentTime / audio.duration) * 100;
  el.npFill.style.width   = pct + '%';
  el.npThumb.style.left   = `calc(${pct}% - 6px)`;
  el.npCurrentTime.textContent = fmtTime(audio.currentTime);
  el.npTotalTime.textContent = fmtTime(audio.duration);
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
  audio.muted = false;
  el.volSlider.style.setProperty('--vol', val + '%');
}

function toggleMute() {
  audio.muted = !audio.muted;
  el.btnMute.classList.toggle('active', audio.muted);
}

/* ── SEARCH ─────────────────────────────────────────────────── */
let searchTimeout = null;
let isSearchActive = false;

function setSearchView(active) {
  if (isSearchActive === active) return;
  isSearchActive = active;
  el.featuredBanner.style.display    = active ? 'none' : 'flex';
  el.sectionQuickPicks.style.display = active ? 'none' : 'block';
  const title = el.sectionAllSongs.querySelector('.section-title');
  if (title) title.textContent = active ? 'Search Results' : 'All Songs';
}

async function handleSearch(q) {
  const query = q.trim();

  if (!query) {
    clearTimeout(searchTimeout);
    setSearchView(false);
    songs = [...trendingSongs];
    renderSongList(songs);
    renderQuickPicks(songs.slice(0, 6));
    return;
  }

  setSearchView(true);

  // Instant local filtering
  const localResults = trendingSongs.filter(s =>
    s.title.toLowerCase().includes(query.toLowerCase()) ||
    s.artist.toLowerCase().includes(query.toLowerCase()) ||
    s.album.toLowerCase().includes(query.toLowerCase())
  );
  songs = localResults.length ? localResults : [...trendingSongs];
  renderSongList(songs);
  
  if (!localResults.length) {
    el.songList.innerHTML = `<div style="padding: 40px; color: #b3b3b3; text-align: center;">Searching global library for "${query}"...</div>`;
  }

  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(async () => {
    try {
      const res = await fetch('/api/search?q=' + encodeURIComponent(query));
      if (!res.ok) throw new Error();
      const data = await res.json();
      if (data.songs && data.songs.length) {
        songs = data.songs;
        renderSongList(songs);
      } else if (!localResults.length) {
        el.songList.innerHTML = `<div style="padding: 40px; color: #b3b3b3; text-align: center;">No results found for "${query}"</div>`;
      }
    } catch (err) {
      // Keep showing local filter
    }
  }, 400);
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
    el.btnRepeat.classList.toggle('active', repeatMode > 0);
    showToast(['Repeat off', 'Repeat all', 'Repeat one'][repeatMode]);
  });

  el.npLike.addEventListener('click', () => {
    if (currentIndex === -1) return;
    const id = songs[currentIndex].id;
    likedSongs.has(id) ? likedSongs.delete(id) : likedSongs.add(id);
    el.npLike.classList.toggle('liked', likedSongs.has(id));
    showToast(likedSongs.has(id) ? '♥ Added to Liked Songs' : 'Removed from Liked Songs');
  });

  el.songList.addEventListener('click', e => {
    const row = e.target.closest('.song-row');
    if (!row) return;
    const idx = parseInt(row.dataset.idx);
    if (idx === currentIndex) togglePlay();
    else playSong(idx);
  });

  el.quickGrid.addEventListener('click', e => {
    const src = e.target.closest('.card-play-btn') || e.target.closest('.song-card');
    if (!src) return;
    const idx = parseInt(src.dataset.idx);
    if (idx === currentIndex) togglePlay();
    else playSong(idx);
  });

  el.btnBannerPlay.addEventListener('click', () => playSong(0));

  el.shuffleAllBtn.addEventListener('click', e => {
    e.preventDefault();
    isShuffle = true;
    el.btnShuffle.classList.add('active');
    buildShuffleOrder();
    playSong(shuffleOrder.shift());
    showToast('Shuffling all songs');
  });

  el.npProgress.addEventListener('mousedown', e => {
    isDragging = true;
    seekTo(e);
  });
  document.addEventListener('mousemove', e => { if (isDragging) seekTo(e); });
  document.addEventListener('mouseup',   () => { isDragging = false; });

  el.volSlider.addEventListener('input', e => setVolume(parseInt(e.target.value)));
  el.btnMute.addEventListener('click', toggleMute);

  el.searchInput.addEventListener('input', e => handleSearch(e.target.value));

  el.pageScroll.addEventListener('scroll', () => {
    el.topbar.classList.toggle('scrolled', el.pageScroll.scrollTop > 60);
  });

  document.addEventListener('keydown', e => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    if (!audio) return;
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

  el.volSlider.addEventListener('input', e => {
    el.volSlider.style.setProperty('--vol', e.target.value + '%');
  });
}

/* ── BOOT ───────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', init);

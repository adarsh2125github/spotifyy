'use strict';

/* ── SONG DATA ─────────────────────────────────────────────── */
const SONGS = [
  { id: 'u6b8OPOfTnk', title: 'Blinding Lights',  artist: 'The Weeknd',                    album: 'After Hours',                        genre: 'Synth-pop',    year: 2020, cover: 'https://i.scdn.co/image/ab67616d0000b273b526d17e57c6b541fc112678', color: '#0d1b4b', duration: '3:21', durationSecs: 201 },
  { id: 'K5y2N0jZg8k', title: 'Shape of You',      artist: 'Ed Sheeran',                    album: '÷ (Divide)',                          genre: 'Pop',          year: 2017, cover: 'https://i.scdn.co/image/ab67616d0000b273ba5db46f4b83884b268a0c5c', color: '#1a0a40', duration: '3:53', durationSecs: 233 },
  { id: 'gOsM-DYAEhY', title: 'Believer',           artist: 'Imagine Dragons',               album: 'Evolve',                             genre: 'Alt-rock',     year: 2017, cover: 'https://i.scdn.co/image/ab67616d0000b2735f1fda6f9cf50c37747e9238', color: '#0a2010', duration: '3:24', durationSecs: 204 },
  { id: 'AnMYEee45dM', title: 'Stay',               artist: 'The Kid LAROI & Justin Bieber', album: 'F*CK LOVE 3: OVER YOU',              genre: 'Pop-rock',     year: 2021, cover: 'https://i.scdn.co/image/ab67616d0000b27341e31d6eaadb0d06115b3769', color: '#3a0a20', duration: '2:21', durationSecs: 141 },
  { id: '34Na4j8AVgA', title: 'Starboy',             artist: 'The Weeknd ft. Daft Punk',      album: 'Starboy',                            genre: 'R&B',          year: 2016, cover: 'https://i.scdn.co/image/ab67616d0000b2734718dec6954e110b45b0685d', color: '#0a1a3e', duration: '3:50', durationSecs: 230 },
  { id: 'H5v3kku4y6Q', title: 'As It Was',          artist: 'Harry Styles',                  album: "Harry's House",                      genre: 'Indie-pop',    year: 2022, cover: 'https://i.scdn.co/image/ab67616d0000b273b4695c5b9f71c4c1a797c276', color: '#3a1a00', duration: '2:47', durationSecs: 167 },
  { id: 'a1yDcs95m84', title: 'Flowers',             artist: 'Miley Cyrus',                   album: 'Endless Summer Vacation',            genre: 'Pop',          year: 2023, cover: 'https://i.scdn.co/image/ab67616d0000b273f429549123d6a3f4ae29da60', color: '#3a2800', duration: '3:20', durationSecs: 200 },
  { id: '817P8W8-mGE', title: 'Perfect',             artist: 'Ed Sheeran',                    album: '÷ (Divide)',                          genre: 'Pop',          year: 2017, cover: 'https://i.scdn.co/image/ab67616d0000b273ba5db46f4b83884b268a0c5c', color: '#0a0a20', duration: '4:23', durationSecs: 263 },
  { id: '0zGcUoRlhmw', title: 'Closer',              artist: 'The Chainsmokers ft. Halsey',   album: 'Collage',                            genre: 'EDM/Pop',      year: 2016, cover: 'https://i.scdn.co/image/ab67616d0000b2732ce2ab8b49e29a997abf064b', color: '#2e1800', duration: '4:05', durationSecs: 245 },
  { id: 'DyDfgMOUHC8', title: 'Bad Guy',             artist: 'Billie Eilish',                 album: 'When We All Fall Asleep…',           genre: 'Electropop',   year: 2019, cover: 'https://i.scdn.co/image/ab67616d0000b27350aae1c3905cfaf57b1f558a', color: '#003030', duration: '3:14', durationSecs: 194 }
];

const COVER_FALLBACK = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='150' height='150' viewBox='0 0 24 24'%3E%3Crect width='24' height='24' fill='%23282828'/%3E%3Cpath d='M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z' fill='%23535353'/%3E%3C/svg%3E";

/* ── STATE ──────────────────────────────────────────────────── */
let songs          = [...SONGS];
let trendingSongs  = [...SONGS];
let currentIndex   = -1;
let isPlaying      = false;
let isShuffle      = false;
let repeatMode     = 0;   // 0=off 1=all 2=one
let likedSongs     = new Set();
let shuffleOrder   = [];
let isDragging     = false;
let audioUnlocked  = false;  // Has the browser's autoplay gate been passed?
let pendingIdx     = -1;     // Song to play after unlock

/* ── YOUTUBE PLAYER ─────────────────────────────────────────── */
let ytPlayer      = null;
let ytPlayerReady = false;
let progressInterval = null;

// Load YouTube Iframe API
const _tag = document.createElement('script');
_tag.src   = 'https://www.youtube.com/iframe_api';
document.head.appendChild(_tag);

window.onYouTubeIframeAPIReady = function () {
  ytPlayer = new YT.Player('yt-player', {
    height: '1', width: '1',
    videoId: '',
    playerVars: {
      playsinline:    1,
      controls:       0,
      disablekb:      1,
      fs:             0,
      rel:            0,
      iv_load_policy: 3,
      autoplay:       0,
      origin:         location.origin,
      enablejsapi:    1,
    },
    events: {
      onReady:       onPlayerReady,
      onStateChange: onPlayerStateChange,
      onError:       onPlayerError,
    },
  });
};

function onPlayerReady() {
  ytPlayerReady = true;
  ytPlayer.setVolume(70);

  // Grant autoplay permission to the cross-origin iframe
  const frame = document.querySelector('#yt-player iframe');
  if (frame) frame.setAttribute('allow', 'autoplay; encrypted-media; picture-in-picture');
}

function onPlayerStateChange(e) {
  if (e.data === YT.PlayerState.PLAYING) {
    isPlaying = true;
    updatePlayPauseIcon();
    el.npBar.classList.add('is-playing');
    updateActiveSongHighlight();
    clearInterval(progressInterval);
    progressInterval = setInterval(updateProgress, 500);
  } else if (e.data === YT.PlayerState.PAUSED) {
    isPlaying = false;
    updatePlayPauseIcon();
    el.npBar.classList.remove('is-playing');
    updateActiveSongHighlight();
    clearInterval(progressInterval);
  } else if (e.data === YT.PlayerState.ENDED) {
    isPlaying = false;
    updatePlayPauseIcon();
    el.npBar.classList.remove('is-playing');
    updateActiveSongHighlight();
    clearInterval(progressInterval);
    if (repeatMode === 2) { ytPlayer.seekTo(0, true); ytPlayer.playVideo(); }
    else playNext();
  }
}

function onPlayerError(e) {
  // Error 150/101 = embedding disabled. Silently skip without flooding toasts.
  clearInterval(progressInterval);
  if (e.data === 150 || e.data === 101) {
    // Try to find the song via API search and play that instead
    const song = songs[currentIndex];
    if (song) {
      fetchAndPlayAlternative(song);
    } else {
      setTimeout(playNext, 1500);
    }
  } else {
    showToast(`⚠ Could not load (Code ${e.data}) — skipping`);
    setTimeout(playNext, 1500);
  }
}

async function fetchAndPlayAlternative(song) {
  try {
    const res  = await fetch(`/api/search?q=${encodeURIComponent(song.title + ' ' + song.artist + ' lyrics')}`);
    const data = await res.json();
    if (data.songs && data.songs.length > 0) {
      const alt = data.songs[0];
      // Update the song in our list with the working alternative
      songs[currentIndex] = { ...song, id: alt.id, audio: alt.audio };
      if (ytPlayer && ytPlayerReady) {
        ytPlayer.loadVideoById(alt.id);
        ytPlayer.playVideo();
      }
    } else {
      setTimeout(playNext, 1500);
    }
  } catch (_) {
    setTimeout(playNext, 1500);
  }
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
  unlockOverlay: $('unlockOverlay'),
  unlockBtn:     $('unlockBtn'),
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

async function tryFetchFromAPI() {
  try {
    const res  = await fetch('/api/songs');
    if (!res.ok) throw new Error();
    const data = await res.json();
    if (data.songs && data.songs.length) {
      songs        = data.songs;
      trendingSongs = [...songs];
      renderQuickPicks(songs.slice(0, 6));
      renderSongList(songs);
      renderBanner(songs[0]);
    }
  } catch (_) { /* keep local SONGS */ }
}

/* ── RENDER ─────────────────────────────────────────────────── */
function renderBanner(song) {
  el.bannerTitle.textContent  = song.title;
  el.bannerArtist.textContent = `${song.artist} · ${song.album} · ${song.year}`;
  el.bannerCover.src          = song.cover;
  el.bannerCover.onerror      = () => { el.bannerCover.src = COVER_FALLBACK; };
  el.bannerBg.style.background = `linear-gradient(180deg, ${song.color}cc 0%, #121212 100%)`;
}

function coverImg(src, cls, size = 150) {
  return `<img class="${cls}" src="${src}" alt="" loading="lazy"
    onerror="this.onerror=null;this.src='${COVER_FALLBACK}';" />`;
}

function renderQuickPicks(list) {
  el.quickGrid.innerHTML = list.map(s => {
    const idx = songs.indexOf(s);
    const active = idx === currentIndex;
    return `
    <div class="song-card ${active ? 'active' : ''}" data-idx="${idx}" id="card-${s.id}">
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
        ${coverImg(s.cover, 'row-thumb', 40)}
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

/* ── AUTOPLAY UNLOCK ────────────────────────────────────────── */
function requireUnlock(idx) {
  if (audioUnlocked) { playSong(idx); return; }
  pendingIdx = idx;
  el.unlockOverlay.style.display = 'flex';
}

function doUnlock() {
  audioUnlocked = true;
  el.unlockOverlay.style.display = 'none';
  // Unlock the YouTube iframe by muting/playing then unmuting
  if (ytPlayer && ytPlayerReady) {
    ytPlayer.mute();
    ytPlayer.playVideo();
    setTimeout(() => { ytPlayer.stopVideo(); ytPlayer.unMute(); }, 300);
  }
  if (pendingIdx >= 0) { playSong(pendingIdx); pendingIdx = -1; }
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
  renderQuickPicks(songs.slice(0, Math.min(6, songs.length)));
  updateActiveSongHighlight();
}

function togglePlay() {
  if (currentIndex === -1) { requireUnlock(0); return; }
  if (!ytPlayer || !ytPlayerReady) return;
  const state = ytPlayer.getPlayerState();
  if (state === YT.PlayerState.PLAYING) ytPlayer.pauseVideo();
  else ytPlayer.playVideo();
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
  if (!ytPlayer || !ytPlayerReady) return;
  if (ytPlayer.getCurrentTime() > 3) { ytPlayer.seekTo(0, true); return; }
  playSong((currentIndex - 1 + songs.length) % songs.length);
}

function buildShuffleOrder() {
  shuffleOrder = songs.map((_, i) => i)
    .filter(i => i !== currentIndex)
    .sort(() => Math.random() - 0.5);
}

/* ── UI UPDATE ──────────────────────────────────────────────── */
function updateNowPlayingUI(song) {
  el.npCover.src     = song.cover;
  el.npCover.onerror = () => { el.npCover.src = COVER_FALLBACK; };
  el.npTitle.textContent  = song.title;
  el.npArtist.textContent = song.artist;
  el.npLike.classList.toggle('liked', likedSongs.has(song.id));
}

function updatePlayPauseIcon() {
  el.iconPlay.style.display  = isPlaying ? 'none'  : 'block';
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
  const cur = ytPlayer.getCurrentTime();
  const dur = ytPlayer.getDuration();
  if (!dur) return;
  const pct = (cur / dur) * 100;
  el.npFill.style.width        = pct + '%';
  el.npThumb.style.left        = `calc(${pct}% - 6px)`;
  el.npCurrentTime.textContent = fmtTime(cur);
  el.npTotalTime.textContent   = fmtTime(dur);
}

function fmtTime(s) {
  if (!s || isNaN(s)) return '0:00';
  return `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
}

function seekTo(e) {
  if (!ytPlayer || !ytPlayerReady) return;
  const rect = el.npProgress.getBoundingClientRect();
  const pct  = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
  const dur  = ytPlayer.getDuration();
  if (dur) { ytPlayer.seekTo(pct * dur, true); el.npFill.style.width = (pct * 100) + '%'; }
}

/* ── VOLUME ─────────────────────────────────────────────────── */
function setVolume(val) {
  if (ytPlayer && ytPlayerReady) { ytPlayer.setVolume(val); ytPlayer.unMute(); }
  el.volSlider.style.setProperty('--vol', val + '%');
}

function toggleMute() {
  if (!ytPlayer || !ytPlayerReady) return;
  if (ytPlayer.isMuted()) { ytPlayer.unMute(); el.btnMute.classList.remove('active'); }
  else                    { ytPlayer.mute();   el.btnMute.classList.add('active'); }
}

/* ── SEARCH ─────────────────────────────────────────────────── */
let searchTimeout  = null;
let searchApiCtrl  = null;  // AbortController for in-flight API request
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
    if (searchApiCtrl) { searchApiCtrl.abort(); searchApiCtrl = null; }
    setSearchView(false);
    songs = [...trendingSongs];
    renderSongList(songs);
    renderQuickPicks(songs.slice(0, 6));
    return;
  }

  setSearchView(true);

  // ① Instant local filter — shows results immediately
  const localResults = trendingSongs.filter(s =>
    s.title.toLowerCase().includes(query.toLowerCase()) ||
    s.artist.toLowerCase().includes(query.toLowerCase()) ||
    s.album.toLowerCase().includes(query.toLowerCase())
  );
  songs = localResults.length ? localResults : [...trendingSongs];
  renderSongList(songs);
  if (!localResults.length) {
    el.songList.innerHTML = `<div style="padding:40px;color:#b3b3b3;text-align:center">
      Searching YouTube for "<b>${query}</b>"…</div>`;
  }

  // ② Async API search — updates when ready
  clearTimeout(searchTimeout);
  if (searchApiCtrl) searchApiCtrl.abort();
  searchTimeout = setTimeout(async () => {
    searchApiCtrl = new AbortController();
    try {
      const res  = await fetch(`/api/search?q=${encodeURIComponent(query)}`, { signal: searchApiCtrl.signal });
      if (!res.ok) throw new Error();
      const data = await res.json();
      if (data.songs && data.songs.length) {
        songs = data.songs;
        renderSongList(songs);
      } else if (!localResults.length) {
        el.songList.innerHTML = `<div style="padding:40px;color:#b3b3b3;text-align:center">
          No results found for "<b>${query}</b>"</div>`;
      }
    } catch (err) {
      if (err.name === 'AbortError') return;
      // Keep showing local results if API fails
    }
  }, 400);
}

/* ── TOAST ──────────────────────────────────────────────────── */
function showToast(msg) {
  let t = document.querySelector('.toast');
  if (!t) { t = document.createElement('div'); t.className = 'toast'; document.body.appendChild(t); }
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2800);
}

/* ── EVENT BINDING ──────────────────────────────────────────── */
function bindEvents() {
  // Unlock overlay
  el.unlockBtn.addEventListener('click', doUnlock);
  el.unlockOverlay.addEventListener('click', e => { if (e.target === el.unlockOverlay) doUnlock(); });

  // Playback
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

  // Song list clicks
  el.songList.addEventListener('click', e => {
    const row = e.target.closest('.song-row');
    if (!row) return;
    const idx = parseInt(row.dataset.idx);
    if (idx === currentIndex) togglePlay();
    else requireUnlock(idx);
  });

  // Quick picks
  el.quickGrid.addEventListener('click', e => {
    const src = e.target.closest('.card-play-btn') || e.target.closest('.song-card');
    if (!src) return;
    const idx = parseInt(src.dataset.idx);
    if (idx === currentIndex) togglePlay();
    else requireUnlock(idx);
  });

  el.btnBannerPlay.addEventListener('click', () => requireUnlock(0));

  el.shuffleAllBtn.addEventListener('click', e => {
    e.preventDefault();
    isShuffle = true;
    el.btnShuffle.classList.add('active');
    buildShuffleOrder();
    requireUnlock(shuffleOrder.shift());
    showToast('Shuffling all songs');
  });

  // Progress bar (drag)
  el.npProgress.addEventListener('mousedown', e => { isDragging = true; seekTo(e); });
  document.addEventListener('mousemove', e => { if (isDragging) seekTo(e); });
  document.addEventListener('mouseup',   () => { isDragging = false; });

  // Volume
  el.volSlider.addEventListener('input', e => setVolume(parseInt(e.target.value)));
  el.btnMute.addEventListener('click', toggleMute);
  el.volSlider.style.setProperty('--vol', '70%');

  // Search
  el.searchInput.addEventListener('input', e => handleSearch(e.target.value));

  // Topbar scroll tint
  el.pageScroll.addEventListener('scroll', () => {
    el.topbar.classList.toggle('scrolled', el.pageScroll.scrollTop > 60);
  });

  // Keyboard shortcuts
  document.addEventListener('keydown', e => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    if (!ytPlayer || !ytPlayerReady) return;
    switch (e.code) {
      case 'Space':      e.preventDefault(); togglePlay(); break;
      case 'ArrowRight': ytPlayer.seekTo(Math.min(ytPlayer.getDuration() || 0, ytPlayer.getCurrentTime() + 5), true); break;
      case 'ArrowLeft':  ytPlayer.seekTo(Math.max(0, ytPlayer.getCurrentTime() - 5), true); break;
      case 'ArrowUp':    el.volSlider.value = Math.min(100, +el.volSlider.value + 5); setVolume(+el.volSlider.value); break;
      case 'ArrowDown':  el.volSlider.value = Math.max(0,   +el.volSlider.value - 5); setVolume(+el.volSlider.value); break;
      case 'KeyN':       playNext(); break;
      case 'KeyP':       playPrev(); break;
      case 'KeyM':       toggleMute(); break;
    }
  });
}

/* ── BOOT ───────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', init);

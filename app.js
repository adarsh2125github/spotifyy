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

const BROWSE_CATEGORIES = [
  { title: 'Podcasts', color: '#27856a', img: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?q=80&w=200&auto=format&fit=crop' },
  { title: 'Made For You', color: '#1e3264', img: 'https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?q=80&w=200&auto=format&fit=crop' },
  { title: 'New Releases', color: '#e8115b', img: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=200&auto=format&fit=crop' },
  { title: 'Discover', color: '#8d67ab', img: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=200&auto=format&fit=crop' },
  { title: 'Pop', color: '#148a08', img: 'https://images.unsplash.com/photo-1529518969858-8bbc65152f6e?q=80&w=200&auto=format&fit=crop' },
  { title: 'Hip-Hop', color: '#bc5900', img: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=200&auto=format&fit=crop' },
  { title: 'Rock', color: '#e91429', img: 'https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?q=80&w=200&auto=format&fit=crop' },
  { title: 'Latin', color: '#7d4b32', img: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=200&auto=format&fit=crop' }
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
let currentTab    = 'home'; // 'home' | 'search' | 'library' | 'liked'
let userLoggedIn  = false;
let playlists     = [
  { name: 'Chill Mix', songs: [] },
  { name: 'Workout Beats', songs: [] },
  { name: 'Late Night Vibes', songs: [] },
  { name: 'Road Trip', songs: [] },
  { name: 'Focus Mode', songs: [] }
];

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
  loginPage:     $('loginPage'),
  loginForm:     $('loginForm'),
  loginEmail:    $('loginEmail'),
  loginPassword: $('loginPassword'),
  loginError:    $('loginError'),
  btnLogout:     $('btnLogout'),
  userDropdown:  $('userDropdown'),
  btnUser:       $('btnUser'),
  navHome:       $('navHome'),
  navSearch:     $('navSearch'),
  navLibrary:    $('navLibrary'),
  btnLikedSongs: $('btnLikedSongs'),
  btnCreatePlaylist: $('btnCreatePlaylist')
};

/* ── INIT ───────────────────────────────────────────────────── */
function init() {
  setupAudioPlayer();
  checkLoginState();
  renderBanner(songs[0]);
  renderQuickPicks(songs.slice(0, 6));
  renderSongList(songs);
  renderBrowseCards();
  renderPlaylistsSidebar();
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
      // Re-populate Liked and Library if loaded
      if (currentTab === 'liked') renderLikedSongs();
      if (currentTab === 'library') renderLibrary();
    }
  } catch (_) { /* Keep default hardcoded songs */ }
}

/* ── AUTHENTICATION ─────────────────────────────────────────── */
function checkLoginState() {
  const loggedIn = localStorage.getItem('user_logged_in') === 'true';
  const username = localStorage.getItem('username');

  if (loggedIn) {
    userLoggedIn = true;
    if (el.loginPage) el.loginPage.style.display = 'none';
    if ($('app')) $('app').style.display = 'flex';
    if ($('sidebar')) $('sidebar').style.display = 'flex';
    if (el.npBar) el.npBar.style.display = 'flex';
    
    // Set username initials
    if (el.btnUser && username) {
      el.btnUser.textContent = username.charAt(0).toUpperCase();
    }
  } else {
    userLoggedIn = false;
    if (el.loginPage) el.loginPage.style.display = 'flex';
    if ($('app')) $('app').style.display = 'none';
    if ($('sidebar')) $('sidebar').style.display = 'none';
    if (el.npBar) el.npBar.style.display = 'none';
  }
}

function handleLoginSubmit() {
  const email = el.loginEmail.value.trim();
  const password = el.loginPassword.value.trim();

  if (email && password) {
    localStorage.setItem('user_logged_in', 'true');
    localStorage.setItem('username', email);
    el.loginError.style.display = 'none';
    checkLoginState();
    switchTab('home');
    showToast(`Welcome back, ${email}!`);
  } else {
    el.loginError.style.display = 'block';
  }
}

function handleLogout() {
  localStorage.removeItem('user_logged_in');
  localStorage.removeItem('username');
  checkLoginState();
  if (audio && !audio.paused) {
    audio.pause();
  }
  el.userDropdown.classList.remove('show');
  showToast("Logged out successfully");
}

/* ─── TAB ROUTING ─── */
function switchTab(tab) {
  currentTab = tab;

  // Clear active classes from sidebar items
  document.querySelectorAll('.nav-item').forEach(e => e.classList.remove('active'));
  document.querySelectorAll('.sidebar-action-btn').forEach(e => e.classList.remove('active'));

  // Set active class on active tab button
  if (tab === 'home' && el.navHome) el.navHome.classList.add('active');
  if (tab === 'search' && el.navSearch) el.navSearch.classList.add('active');
  if (tab === 'library' && el.navLibrary) el.navLibrary.classList.add('active');
  if (tab === 'liked' && el.btnLikedSongs) el.btnLikedSongs.classList.add('active');

  // Toggle Search input block in Topbar
  const searchBox = $('searchBox');
  if (searchBox) {
    searchBox.style.display = (tab === 'search') ? 'flex' : 'none';
  }

  // Swap panels
  document.querySelectorAll('.view-panel').forEach(panel => panel.classList.remove('active'));
  const targetId = 'view' + tab.charAt(0).toUpperCase() + tab.slice(1);
  const targetPanel = $(targetId);
  if (targetPanel) {
    targetPanel.classList.add('active');
  }

  // Focus and setup
  if (tab === 'search') {
    if (el.searchInput) {
      el.searchInput.value = '';
      el.searchInput.focus();
    }
    // Restore default browse cards view
    $('searchResultSection').style.display = 'none';
    document.querySelector('#viewSearch .content-section:first-child').style.display = 'block';
    renderBrowseCards();
  }

  if (tab === 'library') {
    renderLibrary();
  }

  if (tab === 'liked') {
    renderLikedSongs();
  }

  // Scroll to top
  if (el.pageScroll) {
    el.pageScroll.scrollTop = 0;
  }
}

/* ── RENDER FUNCTIONS ───────────────────────────────────────── */
function renderBanner(song) {
  if (!song) return;
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

function renderBrowseCards() {
  const grid = $('browseGrid');
  if (!grid) return;
  grid.innerHTML = BROWSE_CATEGORIES.map(cat => `
    <div class="browse-card" style="background-color: ${cat.color};">
      <div class="browse-card-title">${cat.title}</div>
      <img class="browse-card-img" src="${cat.img}" alt="" loading="lazy" />
    </div>
  `).join('');
}

function renderLibrary() {
  const grid = $('libraryGrid');
  if (!grid) return;

  const localList = songs.filter(s => s.id.startsWith('local_') || s.audio.startsWith('/songs/'));
  const likedCount = songs.filter(s => likedSongs.has(s.id)).length;

  let html = `
    <!-- Liked Songs Library Card -->
    <div class="song-card" style="grid-column: span 2; background: linear-gradient(135deg, #450af5 0%, #8e8ee0 100%);" id="cardLibraryLiked">
      <div style="font-size: 2.5rem; margin-bottom: 24px;">♥</div>
      <div class="song-card-title" style="font-size: 1.5rem; font-weight: 700; white-space: normal;">Liked Songs</div>
      <div class="song-card-artist" style="color: #fff;">${likedCount} songs</div>
    </div>
  `;

  // Render playlists
  playlists.forEach((pl, idx) => {
    html += `
      <div class="song-card playlist-card" data-pl-idx="${idx}">
        <div style="width: 100%; aspect-ratio: 1; border-radius: 6px; background: #282828; display: flex; align-items: center; justify-content: center; margin-bottom: 12px; font-size: 2.5rem; font-weight: 700; color: var(--accent);">
          🎵
        </div>
        <div class="song-card-title">${pl.name}</div>
        <div class="song-card-artist">${pl.songs.length} songs</div>
      </div>
    `;
  });

  // Render local downloads card if local tracks exist
  if (localList.length > 0) {
    html += `
      <div class="song-card local-card" id="cardLibraryLocal">
        <div style="width: 100%; aspect-ratio: 1; border-radius: 6px; background: #1e3264; display: flex; align-items: center; justify-content: center; margin-bottom: 12px; font-size: 2rem;">
          📥
        </div>
        <div class="song-card-title">Local Downloads</div>
        <div class="song-card-artist" style="color: #fff;">${localList.length} tracks</div>
      </div>
    `;
  }

  grid.innerHTML = html;
}

function renderLikedSongs() {
  const listEl = $('likedSongList');
  const countEl = $('likedCount');
  if (!listEl) return;

  const likedList = songs.filter(s => likedSongs.has(s.id));
  if (countEl) countEl.textContent = likedList.length;

  if (likedList.length === 0) {
    listEl.innerHTML = `<div style="padding: 40px; color: #b3b3b3; text-align: center;">Songs you like will appear here.</div>`;
    return;
  }

  listEl.innerHTML = likedList.map((s, i) => {
    const realIdx = songs.indexOf(s);
    const active  = currentIndex === realIdx;
    return `
    <div class="song-row ${active ? 'active' : ''}" data-idx="${realIdx}" id="row-liked-${s.id}">
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

function createPlaylist() {
  const name = prompt("Enter playlist name:", `My Playlist #${playlists.length + 1}`);
  if (!name) return;

  playlists.push({ name: name, songs: [] });
  renderPlaylistsSidebar();
  if (currentTab === 'library') renderLibrary();
  showToast(`Playlist "${name}" created!`);
}

function renderPlaylistsSidebar() {
  const container = $('sidebarPlaylists');
  if (!container) return;
  container.innerHTML = playlists.map((pl, idx) => `
    <p class="playlist-item" data-pl-idx="${idx}">${pl.name}</p>
  `).join('');
}

/* ── PLAYBACK ───────────────────────────────────────────────── */
// List of public Piped/Invidious instances for reliable proxy streaming
const STREAM_APIS = [
  id => `https://pipedproxy.kavin.rocks/streams/${id}`,
  id => `https://invidious.projectsegfau.lt/latest_version?id=${id}&itag=140`,
  id => `https://invidious.flokinet.to/latest_version?id=${id}&itag=140`,
  id => `/api/stream?id=${id}`
];

async function playSong(idx) {
  if (idx < 0 || idx >= songs.length) return;
  currentIndex = idx;
  const song = songs[idx];

  if (song.audio && song.audio.startsWith('http') && song.audio.includes('.mp3')) {
    audio.src = song.audio;
  } else if (song.audio && song.audio.startsWith('/songs/')) {
    audio.src = song.audio;
  } else {
    song._streamAttempts = 0;
    audio.src = `https://invidious.flokinet.to/latest_version?id=${song.id}&itag=140`;
  }
  
  audio.load();
  
  try {
    await audio.play();
  } catch (err) {
    if (err.name === 'NotAllowedError') {
      console.warn("Autoplay block, retrying with click context helper", err);
      showToast("▶ Click play in player bar to listen");
    }
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

async function handleSearch(q) {
  const query = q.trim();
  const searchResultSec = $('searchResultSection');
  const browseGridSec = document.querySelector('#viewSearch .content-section:first-child');
  const listEl = $('searchResultList');

  if (!query) {
    clearTimeout(searchTimeout);
    if (searchResultSec) searchResultSec.style.display = 'none';
    if (browseGridSec) browseGridSec.style.display = 'block';
    return;
  }

  if (searchResultSec) searchResultSec.style.display = 'block';
  if (browseGridSec) browseGridSec.style.display = 'none';

  // Instant local filtering
  const localResults = trendingSongs.filter(s =>
    s.title.toLowerCase().includes(query.toLowerCase()) ||
    s.artist.toLowerCase().includes(query.toLowerCase()) ||
    s.album.toLowerCase().includes(query.toLowerCase())
  );
  
  if (listEl) {
    listEl.innerHTML = (localResults.length ? localResults : trendingSongs).map((s, i) => {
      const realIdx = songs.indexOf(s);
      const active  = currentIndex === realIdx;
      return `
      <div class="song-row ${active ? 'active' : ''}" data-idx="${realIdx}" id="row-search-${s.id}">
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

  if (!localResults.length && listEl) {
    listEl.innerHTML = `<div style="padding: 40px; color: #b3b3b3; text-align: center;">Searching global library for "${query}"...</div>`;
  }

  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(async () => {
    try {
      const res = await fetch('/api/search?q=' + encodeURIComponent(query));
      if (!res.ok) throw new Error();
      const data = await res.json();
      if (data.songs && data.songs.length && listEl && query === el.searchInput.value.trim()) {
        listEl.innerHTML = data.songs.map((s, i) => {
          let realIdx = songs.findIndex(x => x.id === s.id);
          if (realIdx === -1) {
            songs.push(s);
            realIdx = songs.length - 1;
          }
          const active = currentIndex === realIdx;
          return `
          <div class="song-row ${active ? 'active' : ''}" data-idx="${realIdx}" id="row-search-${s.id}">
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
      } else if (!localResults.length && listEl && query === el.searchInput.value.trim()) {
        listEl.innerHTML = `<div style="padding: 40px; color: #b3b3b3; text-align: center;">No results found for "${query}"</div>`;
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
  // Authentication Forms
  if (el.loginForm) {
    el.loginForm.addEventListener('submit', handleLoginSubmit);
  }

  // Profile Menu Dropdown toggle
  if (el.btnUser) {
    el.btnUser.addEventListener('click', (e) => {
      e.stopPropagation();
      el.userDropdown.classList.toggle('show');
    });
  }

  // Close dropdown menu if clicking anywhere outside
  document.addEventListener('click', () => {
    if (el.userDropdown) el.userDropdown.classList.remove('show');
  });

  if (el.btnLogout) {
    el.btnLogout.addEventListener('click', handleLogout);
  }

  // Sidebar navigation switching
  if (el.navHome) el.navHome.addEventListener('click', (e) => { e.preventDefault(); switchTab('home'); });
  if (el.navSearch) el.navSearch.addEventListener('click', (e) => { e.preventDefault(); switchTab('search'); });
  if (el.navLibrary) el.navLibrary.addEventListener('click', (e) => { e.preventDefault(); switchTab('library'); });
  if (el.btnLikedSongs) el.btnLikedSongs.addEventListener('click', (e) => { e.preventDefault(); switchTab('liked'); });

  if (el.btnCreatePlaylist) {
    el.btnCreatePlaylist.addEventListener('click', createPlaylist);
  }

  // Sidebar dynamic playlist routing
  $('sidebarPlaylists').addEventListener('click', (e) => {
    const item = e.target.closest('.playlist-item');
    if (!item) return;
    const plIdx = parseInt(item.dataset.plIdx);
    showToast(`Loading Playlist: ${playlists[plIdx].name}`);
    switchTab('library');
  });

  // Library Dynamic Grid clicks
  $('libraryGrid').addEventListener('click', (e) => {
    const card = e.target.closest('.song-card');
    if (!card) return;
    if (card.id === 'cardLibraryLiked') {
      switchTab('liked');
    } else if (card.classList.contains('playlist-card')) {
      const plIdx = parseInt(card.dataset.plIdx);
      showToast(`Loading Playlist: ${playlists[plIdx].name}`);
    } else if (card.id === 'cardLibraryLocal') {
      showToast("Loading Local Downloads list...");
    }
  });

  // Playback Control binds
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
    // Live update liked views
    if (currentTab === 'liked') renderLikedSongs();
    if (currentTab === 'library') renderLibrary();
    showToast(likedSongs.has(id) ? '♥ Added to Liked Songs' : 'Removed from Liked Songs');
  });

  // PageScroll delegated listener for .song-row clicks
  el.pageScroll.addEventListener('click', e => {
    const row = e.target.closest('.song-row');
    if (!row) return;
    const idx = parseInt(row.dataset.idx);
    if (idx === currentIndex) togglePlay();
    else playSong(idx);
  });

  // Quick picks
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

  // Progress Bar dragging
  el.npProgress.addEventListener('mousedown', e => {
    isDragging = true;
    seekTo(e);
  });
  document.addEventListener('mousemove', e => { if (isDragging) seekTo(e); });
  document.addEventListener('mouseup',   () => { isDragging = false; });

  // Volume bindings
  el.volSlider.addEventListener('input', e => setVolume(parseInt(e.target.value)));
  el.btnMute.addEventListener('click', toggleMute);

  // Search input binding
  el.searchInput.addEventListener('input', e => handleSearch(e.target.value));

  // Topbar scroll tint
  el.pageScroll.addEventListener('scroll', () => {
    el.topbar.classList.toggle('scrolled', el.pageScroll.scrollTop > 60);
  });

  // Hotkeys
  document.addEventListener('keydown', e => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    if (!userLoggedIn || !audio) return;
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

  el.volSlider.style.setProperty('--vol', '70%');
  el.volSlider.addEventListener('input', e => {
    el.volSlider.style.setProperty('--vol', e.target.value + '%');
  });
}

/* ── BOOT ───────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', init);

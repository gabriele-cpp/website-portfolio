const menuButton = document.querySelector('button[aria-label="Open navigation"]');
const nav = document.querySelector("header nav");

if (menuButton && nav) {
  const closeMenu = () => {
    nav.classList.remove("open");
    menuButton.setAttribute("aria-expanded", "false");
  };

  menuButton.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    menuButton.setAttribute("aria-expanded", String(isOpen));
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });
}

/* ====================================================
   Lanyard API - Minimalist Real-Time Spotify Integration
   ==================================================== */
const DISCORD_USER_ID = "814707374714650665";
const spotifyCard = document.getElementById("spotify-card");
const spotifyTrack = document.getElementById("spotify-track");
const spotifyArtist = document.getElementById("spotify-artist");
const spotifyAlbumArt = document.getElementById("spotify-album-art");
const spotifyTrackLink = document.getElementById("spotify-track-link");
const spotifyProgressBar = document.getElementById("spotify-progress-bar");

let currentSongTimestamps = null;
let progressInterval = null;
let heartbeatInterval = null;

function updateProgressBar() {
  if (!currentSongTimestamps || !currentSongTimestamps.start || !spotifyProgressBar) {
    return;
  }

  const now = Date.now();
  const currentPos = now - currentSongTimestamps.start;
  const totalDuration = currentSongTimestamps.end - currentSongTimestamps.start;

  if (totalDuration <= 0) {
    return;
  }

  const percent = Math.min(100, Math.max(0, (currentPos / totalDuration) * 100));
  spotifyProgressBar.style.width = `${percent}%`;
}

function updateSpotifyUI(spotifyData) {
  if (!spotifyCard || !spotifyTrack || !spotifyArtist || !spotifyAlbumArt || !spotifyTrackLink) {
    return;
  }

  if (spotifyData && spotifyData.song) {
    spotifyTrack.textContent = spotifyData.song;
    spotifyArtist.textContent = spotifyData.artist;
    spotifyAlbumArt.src = spotifyData.album_art_url || "";

    if (spotifyData.track_id) {
      spotifyTrackLink.href = `https://open.spotify.com/track/${spotifyData.track_id}`;
    }

    spotifyCard.style.display = "flex";
    currentSongTimestamps = spotifyData.timestamps;
    updateProgressBar();

    if (!progressInterval) {
      progressInterval = window.setInterval(updateProgressBar, 1000);
    }

    return;
  }

  spotifyCard.style.display = "none";
  currentSongTimestamps = null;

  if (progressInterval) {
    window.clearInterval(progressInterval);
    progressInterval = null;
  }
}

function stopHeartbeat() {
  if (heartbeatInterval) {
    window.clearInterval(heartbeatInterval);
    heartbeatInterval = null;
  }
}

function connectLanyard() {
  const socket = new WebSocket("wss://api.lanyard.rest/socket");

  socket.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);

      if (data.op === 1) {
        const heartbeatDelay = data.d?.heartbeat_interval;
        stopHeartbeat();

        heartbeatInterval = window.setInterval(() => {
          if (socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify({ op: 3 }));
          }
        }, heartbeatDelay || 30000);

        socket.send(
          JSON.stringify({
            op: 2,
            d: {
              subscribe_to_id: DISCORD_USER_ID,
            },
          })
        );
      }

      if (data.op === 0 && (data.t === "INIT_STATE" || data.t === "PRESENCE_UPDATE")) {
        const presence = data.d;
        const spotifyStatus = presence?.listening_to_spotify && presence.spotify ? presence.spotify : null;
        updateSpotifyUI(spotifyStatus);
      }
    } catch (error) {
      console.error("Lanyard parse error:", error);
    }
  };

  socket.onclose = () => {
    stopHeartbeat();
    window.setTimeout(connectLanyard, 5000);
  };
}

connectLanyard();

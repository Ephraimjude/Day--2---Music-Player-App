

const image = document.getElementById('cover'),
    title = document.getElementById('music-title'),
    artist = document.getElementById('music-artist'),
    currentTimeEl = document.getElementById('current-time'),
    durationEl = document.getElementById('duration'),
    progress = document.getElementById('progress'),
    playerProgress = document.getElementById('player-progress'),
    prevBtn = document.getElementById('prev'),
    nextBtn = document.getElementById('next'),
    playBtn = document.getElementById('play'),
    volumeControl = document.querySelector('.volume-control input');
    shuffleBtn = document.getElementById('random');
    repeatBtn = document.getElementById('repeat');
    background = document.getElementById('bg-img');

const music = new Audio();

const songs = [
    {
        path: 'assets/1.mp3',
        displayName: 'The Charmer\'s Call',
        cover: 'assets/1.jpg',
        artist: 'Hanu Dixit',
    },
    {
        path: 'assets/2.mp3',
        displayName: 'You Will Never See Me Coming',
        cover: 'assets/2.jpg',
        artist: 'NEFFEX',
    },
    {
        path: 'assets/3.mp3',
        displayName: 'Intellect',
        cover: 'assets/3.jpg',
        artist: 'Yung Logos',
    }
];

let musicIndex = 0;
let isPlaying = false;
let isShuffle = false;
let isRepeat = false;

function togglePlay() {
    if (isPlaying) {
        pauseMusic();
    } else {
        playMusic();
    }
}

function playMusic() {
    isPlaying = true;
    // Change play button icon
    playBtn.classList.replace('fa-play', 'fa-pause');
    // Set button hover title
    playBtn.setAttribute('title', 'Pause');
    music.play();
}

function pauseMusic() {
    isPlaying = false;
    // Change pause button icon
    playBtn.classList.replace('fa-pause', 'fa-play');
    // Set button hover title
    playBtn.setAttribute('title', 'Play');
    music.pause();
}

function loadMusic(song) {
    music.src = song.path;
    title.textContent = song.displayName;
    artist.textContent = song.artist;
    image.src = song.cover;
    background.src = song.cover;
}

function changeMusic(direction) {
    musicIndex = (musicIndex + direction + songs.length) % songs.length;
    loadMusic(songs[musicIndex]);
    playMusic();
}

function updateProgressBar() {
    const { duration, currentTime } = music;
    const progressPercent = (currentTime / duration) * 100;
    progress.style.width = `${progressPercent}%`;

    const formatTime = (time) => String(Math.floor(time)).padStart(2, '0');
    durationEl.textContent = `${formatTime(duration / 60)}:${formatTime(duration % 60)}`;
    currentTimeEl.textContent = `${formatTime(currentTime / 60)}:${formatTime(currentTime % 60)}`;
}

function toggleShuffle() {
    isShuffle = !isShuffle;
    shuffleBtn.classList.toggle('active', isShuffle);
}
  
function toggleRepeat() {
    isRepeat = !isRepeat;
    repeatBtn.classList.toggle('active', isRepeat);
}
  

function setProgressBar(e) {
    const width = playerProgress.clientWidth;
    const clickX = e.offsetX;
    music.currentTime = (clickX / width) * music.duration;
}

playBtn.addEventListener('click', togglePlay);
prevBtn.addEventListener('click', () => changeMusic(-1));
nextBtn.addEventListener('click', () => changeMusic(1));
shuffleBtn.addEventListener('click', toggleShuffle);
repeatBtn.addEventListener('click', toggleRepeat);
music.addEventListener('timeupdate', updateProgressBar);
playerProgress.addEventListener('click', setProgressBar);

music.addEventListener('ended', () => {
    if (isRepeat) {
        // When repeat is active, play the same song again
        playMusic();
    } else if (isShuffle) {
        // When shuffle is active, play a random song
        const randomIndex = Math.floor(Math.random() * songs.length);
        musicIndex = randomIndex;
        loadMusic(songs[musicIndex]);
        playMusic();
    } else {
        // Play the next song in the normal order
        changeMusic(1);
    }
  });
  

loadMusic(songs[musicIndex]);

// songlist in the player

const showSongsButton = document.getElementById('show-songs-btn');
const songListModal = document.getElementById('song-list-modal');
const closeBtn = document.querySelector('.close');
const songList = document.getElementById('song-list');


// Flag to track modal visibility
let isModalOpen = false;

// Toggle the modal visibility when the button is clicked
showSongsButton.addEventListener('click', () => {
  if (!isModalOpen) {
    openModal();
  } else {
    closeModal();
  }
  isModalOpen = !isModalOpen;
});

closeBtn.addEventListener('click', closeModal);

//the list of songs in the modal with play buttons
function openModal() {
    songList.innerHTML = '';
    songs.forEach((song, index) => {
      const listItem = document.createElement('li');
      listItem.innerHTML = `
        <span>${index + 1}. ${song.displayName}</span>
        <button class="play-song-btn" data-index="${index}">
          PLAY
        </button>
      `;
      songList.appendChild(listItem);
    });
  
    songListModal.style.display = 'block';
  }
  
  function playMusic(index) {
    // Play the music associated with the given index
    musicIndex = index;
    loadMusic(songs[musicIndex]);
    playMusic();
  }
  
function closeModal() {
  songListModal.style.display = 'none';
}

window.addEventListener('click', (e) => {
  if (e.target === songListModal) {
    closeModal();
    isModalOpen = false;
  }
});

window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && songListModal.style.display === 'block') {
    closeModal();
    isModalOpen = false;
  }
});

songList.addEventListener('click', (e) => {
  if (e.target.classList.contains('play-song-btn')) {
    const index = e.target.getAttribute('data-index');
    musicIndex = parseInt(index);
    loadMusic(songs[musicIndex]);
    playMusic();
  }
});

function playMusic() {
    isPlaying = true;
    // Change play button icon
    playBtn.classList.replace('fa-play', 'fa-pause');
    // Set button hover title
    playBtn.setAttribute('title', 'Pause');
    music.play(); // Add this line to play the music
}


// to add songs from local storage 

const fileInput = document.getElementById('file-input');
const addMusicButton = document.getElementById('add-music-button');

// Function to handle the click on the add music button
function handleAddMusicClick() {
  fileInput.click();
}

// Add an event listener to the file input for when a file is selected
fileInput.addEventListener('change', (event) => {
  const file = event.target.files[0];

  if (file) {
    // Create a new song object
    const newSong = {
      path: URL.createObjectURL(file), // Use a blob URL for local playback
      displayName: file.name.replace(/\.[^.]+$/, ''), // Extract the filename without extension
      cover: 'assets/default-cover.jpg', // Replace with your default cover image path
      artist: 'Unknown Artist', // Replace with artist info
    };

    // Add the new song to the songs array
    songs.push(newSong);

    // Optionally, you can display the new song in the song list
    const listItem = document.createElement('li');
    listItem.innerHTML = `
      <span>${songs.length}. ${newSong.displayName}</span>
      <button class="play-song-btn" data-index="${songs.length - 1}">
        PLAY
      </button>
    `;
    songList.appendChild(listItem);

    // You can also load and play the new song if desired
    loadMusic(newSong);
    playMusic();

    // Clear the file input value
    fileInput.value = null;
  }
});

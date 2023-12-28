console.log("Welcome To Spotify");

const obj = document.createElement("audio");
console.log(obj.volume);
obj.volume = 0.2;
console.log(obj.volume);

let songs = [
  {
    songName: "Alan Walker - Faded",
    filePath: "songs/1.mp3",
    coverPath: "covers/1.jpg",
  },
  {
    songName: "Cartoon - On & On",
    filePath: "songs/2.mp3",
    coverPath: "covers/2.jpg",
  },
  {
    songName: "Alan Walker - Spectre",
    filePath: "songs/3.mp3",
    coverPath: "covers/3.jpg",
  },
  {
    songName: "NEFFEX - Destiny",
    filePath: "songs/4.mp3",
    coverPath: "covers/4.jpg",
  },
  {
    songName: "NEFFEX - Grateful",
    filePath: "songs/5.mp3",
    coverPath: "covers/5.jpg",
  },
  {
    songName: "Janji - HeroesTonight",
    filePath: "songs/6.mp3",
    coverPath: "covers/6.jpg",
  },
  {
    songName: "NEFFEX - Best of Me",
    filePath: "songs/7.mp3",
    coverPath: "covers/7.jpg",
  },
  {
    songName: "Electro-Light - Symbolism",
    filePath: "songs/8.mp3",
    coverPath: "covers/8.jpg",
  },
  {
    songName: "Electronomia - Sky High",
    filePath: "songs/9.mp3",
    coverPath: "covers/9.jpg",
  },
  {
    songName: "NEFFEX - Life",
    filePath: "songs/10.mp3",
    coverPath: "covers/10.jpg",
  },
];

let songIndex = 0;
let audioElement = new Audio("songs/1.mp3");
let playingSongName = document.getElementById("playingSongName");
let playPause = document.getElementById("playPause");
let progressBar = document.getElementById("progressBar");
let playingLogo = document.getElementById("playingLogo");
let gif = document.getElementById("gif");
let showDuration = document.getElementById("showDuration");

playPause.addEventListener("click", () => {
  if (audioElement.paused || audioElement.currentTime <= 0) {
    audioElement.play();
    playPause.classList.remove("fa-circle-play");
    playPause.classList.add("fa-circle-pause");
    document.getElementById(`${songIndex}`).classList.remove("fa-circle-play");
    document.getElementById(`${songIndex}`).classList.add("fa-circle-pause");
    playingLogo.style.opacity = 1;
    gif.src = "playing.gif";
  } else {
    audioElement.pause();
    gif.src = "playing.png";
    playPause.classList.remove("fa-circle-pause");
    playPause.classList.add("fa-circle-play");
    document.getElementById(`${songIndex}`).classList.remove("fa-circle-pause");
    document.getElementById(`${songIndex}`).classList.add("fa-circle-play");
  }
});

function time_convert(num) {
  let minutes = Math.floor(num / 60);
  let seconds = num % 60;
  return minutes + ":" + seconds;
}

audioElement.addEventListener("timeupdate", () => {
  progressBar.value = parseInt(
    (audioElement.currentTime / audioElement.duration) * 100
  );
  showDuration.innerHTML =
    time_convert(Math.floor(audioElement.currentTime)) +
    " / " +
    time_convert(Math.floor(audioElement.duration));
  if (progressBar.value == 100) {
    if (songIndex >= 9) {
      songIndex = 0;
    } else {
      songIndex += 1;
    }
    audioElement.src = `${songs[songIndex].filePath}`;
    playingSongName.innerText = songs[songIndex].songName;
    audioElement.currentTime = 0;
    audioElement.play();
    gif.style.opacity = 1;
    gif.src = "playing.gif";
    makeAllPlay();
    playPause.classList.remove("fa-circle-play");
    playPause.classList.add("fa-circle-pause");
    document.getElementById(`${songIndex}`).classList.remove("fa-circle-play");
    document.getElementById(`${songIndex}`).classList.add("fa-circle-pause");
  }
});

progressBar.addEventListener("change", () => {
  audioElement.currentTime = (progressBar.value * audioElement.duration) / 100;
});

const makeAllPlay = () => {
  Array.from(document.getElementsByClassName("playingSong")).forEach(
    (element) => {
      element.classList.remove("fa-circle-pause");
      element.classList.add("fa-circle-play");
    }
  );
};

Array.from(document.getElementsByClassName("playingSong")).forEach(
  (element) => {
    let playingTime = 0;
    element.addEventListener("click", (e) => {
      makeAllPlay();
      if (audioElement.paused || audioElement.currentTime <= 0) {
        songIndex = parseInt(e.target.id);
        e.target.classList.remove("fa-circle-play");
        e.target.classList.add("fa-circle-pause");
        audioElement.src = `${songs[songIndex].filePath}`;
        playingSongName.innerText = songs[songIndex].songName;
        audioElement.currentTime = playingTime;
        audioElement.play();
        playingLogo.style.opacity = 1;
        gif.src = "playing.gif";
        playPause.classList.remove("fa-circle-play");
        playPause.classList.add("fa-circle-pause");
      } else {
        if (
          e.target.classList ===
          document.getElementById(`${songIndex}`).classList
        ) {
          e.target.classList.remove("fa-circle-pause");
          e.target.classList.add("fa-circle-play");
          audioElement.pause();
          playingTime = audioElement.currentTime;
          gif.src = "playing.png";
          playPause.classList.remove("fa-circle-pause");
          playPause.classList.add("fa-circle-play");
        } else {
          songIndex = parseInt(e.target.id);
          e.target.classList.remove("fa-circle-play");
          e.target.classList.add("fa-circle-pause");
          audioElement.src = `${songs[songIndex].filePath}`;
          playingSongName.innerText = songs[songIndex].songName;
          audioElement.currentTime = playingTime;
          audioElement.play();
          playingTime = audioElement.currentTime;
          gif.src = "playing.gif";
          playPause.classList.remove("fa-circle-play");
          playPause.classList.add("fa-circle-pause");
        }
      }
    });
  }
);

document.getElementById("next").addEventListener("click", () => {
  if (songIndex >= 9) {
    songIndex = 0;
  } else {
    songIndex += 1;
  }
  audioElement.src = `${songs[songIndex].filePath}`;
  playingSongName.innerText = songs[songIndex].songName;
  audioElement.currentTime = 0;
  audioElement.play();
  gif.style.opacity = 1;
  gif.src = "playing.gif";
  makeAllPlay();
  playPause.classList.remove("fa-circle-play");
  playPause.classList.add("fa-circle-pause");
  document.getElementById(`${songIndex}`).classList.remove("fa-circle-play");
  document.getElementById(`${songIndex}`).classList.add("fa-circle-pause");
});

document.getElementById("prev").addEventListener("click", () => {
  if (songIndex <= 0) {
    songIndex = 9;
  } else {
    songIndex -= 1;
  }
  audioElement.src = `${songs[songIndex].filePath}`;
  playingSongName.innerText = songs[songIndex].songName;
  audioElement.currentTime = 0;
  audioElement.play();
  gif.style.opacity = 1;
  gif.src = "playing.gif";
  makeAllPlay();
  playPause.classList.remove("fa-circle-play");
  playPause.classList.add("fa-circle-pause");
  document.getElementById(`${songIndex}`).classList.remove("fa-circle-play");
  document.getElementById(`${songIndex}`).classList.add("fa-circle-pause");
});

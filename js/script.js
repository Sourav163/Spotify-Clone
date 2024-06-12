console.log("JS Linked!");

const cardsLogo = document.getElementsByClassName("cardsLogo");
const showCardsLogo = (index) => {
  cardsLogo[index].style.opacity = "1";
};
const hideCardsLogo = (index) => {
  cardsLogo[index].style.opacity = "0";
};

const audio = new Audio();
const songsContainerID = document.getElementById("songsContainerID");
const playBarID = document.getElementById("playBarID");
const prev = document.getElementById("prev");
const play = document.getElementById("play");
const pause = document.getElementById("pause");
const next = document.getElementById("next");
const playingSongName = document.getElementById("playingSongName");
const playingSongDuration = document.getElementById("playingSongDuration");
const seekBarContainerID = document.getElementById("seekBarContainerID");
const seekCircle = document.getElementById("seekCircle");
const seekBarFill = document.getElementById("seekBarFill");

let songsName = [];
let folderName = "ncs";
async function fetchSongs(folder) {
  const songs = await fetch(`./songs/${folder}/`);
  const songsText = await songs.text();
  const div = document.createElement("div");
  div.innerHTML = songsText;
  const as = div.getElementsByTagName("a");
  songsName = [];
  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".mp3")) {
      songsName.push(element.href);
    }
  }

  songsContainerID.innerHTML = "";
  for (let index = 0; index < songsName.length; index++) {
    const element = songsName[index];
    songsContainerID.innerHTML += `<li class="songList flex align-center trans-02"> <i class="fa-solid fa-music songIcon"></i> <span class="songTitle">
    ${decodeURIComponent(element.split(`/${folder}/`)[1])}
    </span> <i class="fa-solid fa-play songPlayIcon"></i> </li>`;
  }

  const songList = document.getElementsByClassName("songList");
  for (let index = 0; index < songList.length; index++) {
    const element = songList[index];
    element.addEventListener("click", () => {
      playBarID.style.bottom = "0";
      playBarID.style.opacity = "1";
      audio.src = songsName[index];
      playingSongNameUpdate(folder);
      playAudio();
    });
  }
}

function playAudio() {
  play.style.display = "none";
  pause.style.display = "initial";
  audio.play();
}

function pauseAudio() {
  pause.style.display = "none";
  play.style.display = "initial";
  audio.pause();
}

function playingSongNameUpdate() {
  if (decodeURIComponent(audio.src.split(`/${folderName}/`)[1]).length > 25) {
    playingSongName.innerHTML = decodeURIComponent(
      audio.src.split(`/${folderName}/`)[1]
    ).substring(0, 25);
    playingSongName.innerHTML += "...";
  } else {
    playingSongName.innerHTML = decodeURIComponent(
      audio.src.split(`/${folderName}/`)[1]
    );
  }
}

function nextAudio() {
  let index = songsName.indexOf(audio.src);
  if (index === songsName.length - 1) {
    audio.src = songsName[0];
  } else {
    audio.src = songsName[index + 1];
  }
}

async function displaySongCards() {
  const songFolders = await fetch(`./songs/`);
  const songFoldersText = await songFolders.text();
  const div = document.createElement("div");
  div.innerHTML = songFoldersText;
  let anchors = div.getElementsByTagName("a");

  let logoIndex = document.getElementsByClassName("cards").length - 1;
  for (let index = 0; index < anchors.length; index++) {
    const element = anchors[index];
    if (element.href.includes("/songs/")) {
      let foldersName = element.href.split("/songs/")[1];
      const songFolders = await fetch(`./songs/${foldersName}/info.json`);
      const songFoldersText = await songFolders.json();
      logoIndex += 1;
      document.querySelector(
        ".cardsContainer"
      ).innerHTML += `<div data-folder="${foldersName}" class="cards flex align-center" onmouseleave="hideCardsLogo(${logoIndex})"
                        onmouseenter="showCardsLogo(${logoIndex})">
                        <img src="./songs/${foldersName}/${songFoldersText.cover}" alt=""
                            class="cardsImg">
                        <img src="svg/play.svg" alt="play" data-folder="${foldersName}" class="cardsLogo trans-02">
                        <h4 class="cardsHead text-white">${songFoldersText.heading}</h4>
                        <p class="cardsPara text-grey">${songFoldersText.description}</p>
                    </div>`;
    }
  }

  Array.from(document.getElementsByClassName("cards")).forEach((element) => {
    element.addEventListener("click", async (item) => {
      folderName = item.currentTarget.dataset.folder;
      await fetchSongs(folderName);
    });
  });

  Array.from(document.getElementsByClassName("cardsLogo")).forEach(
    (element) => {
      element.addEventListener("click", async (item) => {
        folderName = item.currentTarget.dataset.folder;
        await fetchSongs(folderName);
        audio.src = songsName[0];
        playBarID.style.bottom = "0";
        playBarID.style.opacity = "1";
        playAudio();
        playingSongNameUpdate();
      });
    }
  );
}

async function main() {
  await fetchSongs("ncs");

  await displaySongCards();

  audio.addEventListener("timeupdate", () => {
    if (isNaN(audio.duration)) {
      playingSongDuration.innerHTML = `0:0 / 0:0`;
    } else {
      playingSongDuration.innerHTML = `${Math.floor(
        audio.currentTime / 60
      )}:${Math.floor(audio.currentTime % 60)} / ${Math.floor(
        audio.duration / 60
      )}:${Math.floor(audio.duration % 60)}`;
    }
    if (audio.currentTime === audio.duration) {
      nextAudio();
      audio.play();
      playingSongNameUpdate();
    }
    seekCircle.style.left = `${(audio.currentTime / audio.duration) * 100}%`;
    seekBarFill.style.width = seekCircle.style.left;
  });

  seekBarContainerID.addEventListener("click", (e) => {
    audio.currentTime =
      (e.offsetX / seekBarContainerID.offsetWidth) * audio.duration;
  });

  seekBarFill.style.width = "0%";
  seekBarContainerID.addEventListener("mouseenter", () => {
    seekCircle.style.opacity = "1";
    seekBarFill.style.backgroundColor = "#1fdd63";
  });
  seekBarContainerID.addEventListener("mouseleave", () => {
    seekCircle.style.opacity = "0";
    seekBarFill.style.backgroundColor = "white";
  });

  if (play) {
    play.addEventListener("click", () => {
      playAudio();
    });
  }
  if (pause) {
    pause.addEventListener("click", () => {
      pauseAudio();
    });
  }

  next.addEventListener("click", () => {
    nextAudio();
    playAudio();
    playingSongNameUpdate();
  });
  prev.addEventListener("click", () => {
    let index = songsName.indexOf(audio.src);
    if (index === 0) {
      audio.src = songsName[songsName.length - 1];
    } else {
      audio.src = songsName[index - 1];
    }
    playAudio();
    playingSongNameUpdate();
  });
}
main();

const bar = document.getElementById("bar");
const cross = document.getElementById("cross");
if (bar) {
  bar.addEventListener("click", () => {
    document.querySelector(".left").style.left = "0";
  });
}
if (cross) {
  cross.addEventListener("click", () => {
    document.querySelector(".left").style.left = "-260px";
  });
}

const songVolume = document.getElementById("songVolume");
const muteVolume = document.getElementById("muteVolume");
const noVolume = document.getElementById("noVolume");
const lowVolume = document.getElementById("lowVolume");
const highVolume = document.getElementById("highVolume");
audio.volume = 0.05;

songVolume.addEventListener("change", () => {
  audio.volume = songVolume.value / 100;
  muteVolume.style.display = "none";
  if (songVolume.value > 50) {
    noVolume.style.display = "none";
    lowVolume.style.display = "none";
    highVolume.style.display = "initial";
  } else if (songVolume.value > 0) {
    noVolume.style.display = "none";
    lowVolume.style.display = "initial";
    highVolume.style.display = "none";
  } else if (songVolume.value == 0) {
    noVolume.style.display = "initial";
    lowVolume.style.display = "none";
    highVolume.style.display = "none";
  }
});

if (noVolume) {
  noVolume.addEventListener("click", () => {
    noVolume.style.display = "none";
    muteVolume.style.display = "initial";
    audio.volume = 0;
  });
}
if (lowVolume) {
  lowVolume.addEventListener("click", () => {
    lowVolume.style.display = "none";
    muteVolume.style.display = "initial";
    audio.volume = 0;
  });
}
if (highVolume) {
  highVolume.addEventListener("click", () => {
    highVolume.style.display = "none";
    muteVolume.style.display = "initial";
    audio.volume = 0;
  });
}
if (muteVolume) {
  muteVolume.addEventListener("click", () => {
    muteVolume.style.display = "none";
    if (songVolume.value > 50) {
      highVolume.style.display = "initial";
      audio.volume = songVolume.value / 100;
    } else if (songVolume.value > 0) {
      lowVolume.style.display = "initial";
      audio.volume = songVolume.value / 100;
    } else if (songVolume.value == 0) {
      noVolume.style.display = "initial";
      audio.volume = songVolume.value / 100;
    }
  });
}

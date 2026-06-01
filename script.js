const board = document.getElementById("bubble-board");
const scoreElement = document.getElementById("score");
const joyElement = document.getElementById("joy");
const restartButton = document.getElementById("restart-button");
const startButton = document.getElementById("start-button");
const playAgainButton = document.getElementById("play-again-button");
const wishButton = document.getElementById("wish-button");
const dandelion = document.getElementById("dandelion");
const boardOverlay = document.getElementById("board-overlay");
const messageCard = document.getElementById("message-card");
const messageText = document.getElementById("message-text");
const finalCard = document.getElementById("final-card");
const fireworksLayer = document.getElementById("fireworks-layer");
const finalPhotoImage = document.getElementById("final-photo-image");
const photoPlaceholder = document.getElementById("photo-placeholder");

const bubbleCount = 16;
const unlockTarget = 12;
const bubbles = [];
const finalPhotoSrc = "./assets/finale-photo.png";

const notes = [
  "臭臭，晚上一定要盖好被子，我好想你！",
  "哼，p 人说自己不吃早饭啦，那我也不吃啦。",
  "小可耐，想给你造一个小宫殿。",
  "拽我最爱滴熊 no!",
  "么么 enenaa。",
  "刘禹小朋友，今天允许你幼稚到底。",
  "恭喜领取女朋友抱抱券 x1。",
  "烦恼正在被泡泡偷偷带走。",
];

let poppedCount = 0;
let gameStarted = false;
let hasUnlockedFinale = false;
let holdIntervalId = 0;
let holdTimeoutId = 0;
let isHoldingWish = false;
let burstTimeoutId = 0;

function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

function shuffledNotes() {
  const pool = [...notes];

  for (let index = pool.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [pool[index], pool[swapIndex]] = [pool[swapIndex], pool[index]];
  }

  return pool;
}

function updateStatus() {
  scoreElement.textContent = String(poppedCount);
  const progress = Math.min(100, Math.round((poppedCount / unlockTarget) * 100));
  joyElement.textContent = `${progress}%`;
}

function pulseMessageCard() {
  messageCard.classList.remove("pulse");
  window.requestAnimationFrame(() => {
    messageCard.classList.add("pulse");
  });
}

function showMessage(text) {
  messageText.textContent = text;
  pulseMessageCard();
}

function clearBubbles() {
  bubbles.splice(0, bubbles.length);
  board.querySelectorAll(".bubble").forEach((bubble) => bubble.remove());
}

function clearFireworks() {
  fireworksLayer.replaceChildren();
}

function addSpark(originX, originY, color) {
  const spark = document.createElement("span");
  spark.className = "spark";
  spark.style.setProperty("--spark-x", `${originX}%`);
  spark.style.setProperty("--spark-y", `${originY}%`);
  spark.style.setProperty("--spark-dx", `${randomBetween(-58, 58).toFixed(0)}px`);
  spark.style.setProperty("--spark-dy", `${randomBetween(-62, 62).toFixed(0)}px`);
  spark.style.setProperty("--spark-color", color);
  fireworksLayer.appendChild(spark);

  window.setTimeout(() => {
    spark.remove();
  }, 900);
}

function launchFireworkBurst() {
  const colors = ["#ff89c7", "#ffe88f", "#9fe7ff", "#d6beff", "#ffffff"];
  const originX = randomBetween(18, 82);
  const originY = randomBetween(18, 72);

  for (let index = 0; index < 18; index += 1) {
    addSpark(originX, originY, colors[index % colors.length]);
  }
}

function celebrateWithFireworks() {
  clearFireworks();

  for (let burst = 0; burst < 4; burst += 1) {
    window.setTimeout(launchFireworkBurst, burst * 220);
  }
}

function createSeed() {
  const seed = document.createElement("span");
  const dandelionBox = dandelion.getBoundingClientRect();
  const boardBox = board.getBoundingClientRect();
  const left = ((dandelionBox.left - boardBox.left + dandelionBox.width * randomBetween(0.48, 0.66)) / boardBox.width) * 100;
  const top = ((dandelionBox.top - boardBox.top + dandelionBox.height * randomBetween(0.16, 0.34)) / boardBox.height) * 100;

  seed.className = "seed";
  seed.style.setProperty("--seed-left", `${left}%`);
  seed.style.setProperty("--seed-top", `${top}%`);
  seed.style.setProperty("--seed-drift-x", `${randomBetween(50, 160).toFixed(0)}px`);
  seed.style.setProperty("--seed-drift-y", `${randomBetween(-120, -32).toFixed(0)}px`);
  seed.style.setProperty("--seed-rotate", `${randomBetween(40, 180).toFixed(0)}deg`);
  seed.style.setProperty("--seed-speed", `${randomBetween(1800, 2800).toFixed(0)}ms`);
  board.appendChild(seed);

  window.setTimeout(() => {
    seed.remove();
  }, 2900);
}

function burstSeeds(count = 6) {
  for (let index = 0; index < count; index += 1) {
    window.setTimeout(() => {
      const seed = document.createElement("span");
      const dandelionBox = dandelion.getBoundingClientRect();
      const boardBox = board.getBoundingClientRect();
      const left = ((dandelionBox.left - boardBox.left + dandelionBox.width * randomBetween(0.44, 0.62)) / boardBox.width) * 100;
      const top = ((dandelionBox.top - boardBox.top + dandelionBox.height * randomBetween(0.12, 0.28)) / boardBox.height) * 100;

      seed.className = "seed seed-burst";
      seed.style.setProperty("--seed-left", `${left}%`);
      seed.style.setProperty("--seed-top", `${top}%`);
      seed.style.setProperty("--seed-drift-x", `${randomBetween(120, 240).toFixed(0)}px`);
      seed.style.setProperty("--seed-drift-y", `${randomBetween(-90, 24).toFixed(0)}px`);
      seed.style.setProperty("--seed-rotate", `${randomBetween(80, 240).toFixed(0)}deg`);
      seed.style.setProperty("--seed-speed", `${randomBetween(1200, 2000).toFixed(0)}ms`);
      board.appendChild(seed);

      window.setTimeout(() => {
        seed.remove();
      }, 2100);
    }, index * 36);
  }
}

function stopHoldingWish() {
  isHoldingWish = false;
  dandelion.classList.remove("blowing");
  wishButton.classList.remove("holding");
  window.clearTimeout(holdTimeoutId);
  window.clearInterval(holdIntervalId);
  window.clearTimeout(burstTimeoutId);
}

function startHoldingWish(event) {
  event.preventDefault();

  if (isHoldingWish) {
    return;
  }

  isHoldingWish = true;
  dandelion.classList.add("blowing");
  wishButton.classList.add("holding");
  showMessage("呼一口气，把小臭宝今天的疲惫轻轻吹散。");

  holdTimeoutId = window.setTimeout(() => {
    burstSeeds(10);
    createSeed();
    holdIntervalId = window.setInterval(createSeed, 180);
    burstTimeoutId = window.setInterval(() => burstSeeds(4), 560);
  }, 180);
}

function setupFinalPhoto() {
  finalPhotoImage.addEventListener("load", () => {
    finalPhotoImage.classList.remove("hidden");
    photoPlaceholder.classList.add("hidden");
  });

  finalPhotoImage.addEventListener("error", () => {
    finalPhotoImage.classList.add("hidden");
    photoPlaceholder.classList.remove("hidden");
  });

  finalPhotoImage.src = finalPhotoSrc;
}

function unlockFinale() {
  if (hasUnlockedFinale) {
    return;
  }

  hasUnlockedFinale = true;
  finalCard.classList.remove("hidden");
  celebrateWithFireworks();
  showMessage("六一限定大奖已解锁。今天的小臭宝要一直开心。");
}

function popBubble(bubble, text) {
  if (bubble.classList.contains("popped") || hasUnlockedFinale) {
    return;
  }

  bubble.classList.add("popped");
  poppedCount += 1;
  updateStatus();
  showMessage(text);

  if (poppedCount >= unlockTarget) {
    window.setTimeout(unlockFinale, 260);
  }

  window.setTimeout(() => {
    bubble.remove();
  }, 360);
}

function createBubble(index, text, special = false) {
  const bubble = document.createElement("button");
  const size = randomBetween(64, 110);
  const left = randomBetween(6, 78);
  const top = randomBetween(16, 78);
  const driftX = `${randomBetween(-18, 18).toFixed(0)}px`;
  const driftY = `${randomBetween(-20, 12).toFixed(0)}px`;

  bubble.type = "button";
  bubble.className = `bubble${special ? " special" : ""}`;
  bubble.style.width = `${size}px`;
  bubble.style.height = `${size}px`;
  bubble.style.left = `${left}%`;
  bubble.style.top = `${top}%`;
  bubble.style.zIndex = String(index + 1);
  bubble.style.setProperty("--drift-x", driftX);
  bubble.style.setProperty("--drift-y", driftY);
  bubble.style.setProperty("--speed", `${randomBetween(5.8, 9.4).toFixed(1)}s`);
  bubble.setAttribute("aria-label", `泡泡 ${index + 1}`);

  const icon = document.createElement("span");
  icon.textContent = special ? "✨" : index % 3 === 0 ? "💗" : index % 3 === 1 ? "☁️" : "🫧";
  bubble.appendChild(icon);

  bubble.addEventListener("click", () => popBubble(bubble, text));
  board.appendChild(bubble);
  bubbles.push(bubble);
}

function populateBubbles() {
  const pool = shuffledNotes();

  for (let index = 0; index < bubbleCount; index += 1) {
    const text = pool[index % pool.length];
    const special = index === bubbleCount - 1;
    createBubble(index, text, special);
  }
}

function hideIntro() {
  boardOverlay.classList.add("hidden");
}

function resetGame() {
  poppedCount = 0;
  gameStarted = false;
  hasUnlockedFinale = false;
  stopHoldingWish();
  updateStatus();
  clearBubbles();
  clearFireworks();
  finalCard.classList.add("hidden");
  boardOverlay.classList.remove("hidden");
  showMessage("准备接收小臭宝专属夸夸。");
}

function startGame() {
  if (gameStarted) {
    return;
  }

  gameStarted = true;
  hideIntro();
  clearBubbles();
  populateBubbles();
  showMessage("第一颗泡泡已经准备好啦，点它。");
}

startButton.addEventListener("click", startGame);
restartButton.addEventListener("click", resetGame);
playAgainButton.addEventListener("click", resetGame);
wishButton.addEventListener("pointerdown", startHoldingWish);
wishButton.addEventListener("pointerup", stopHoldingWish);
wishButton.addEventListener("pointerleave", stopHoldingWish);
wishButton.addEventListener("pointercancel", stopHoldingWish);
setupFinalPhoto();

resetGame();

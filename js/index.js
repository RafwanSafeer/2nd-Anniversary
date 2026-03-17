(function() {
  function $(id) {
    return document.getElementById(id);
  }

  var card = $('card'),
      openB = $('open'),
      closeB = $('close'),
      insideCloseB = $('inside-close'),
      welcomeModal = document.getElementById('welcome-modal'),
      welcomeNext = document.getElementById('welcome-next'),
      introModal = document.getElementById('intro-modal'),
      rewardModal = document.getElementById('reward-modal'),
      rewardNext = document.getElementById('reward-next'),
      videoStage = document.getElementById('video-stage'),
      videoEl = document.getElementById('anniv-video'),
      videoNext = document.getElementById('video-next'),
      gameStage = document.getElementById('game-stage'),
      gameWinModal = document.getElementById('game-win-modal'),
      gameWinNext = document.getElementById('game-win-next'),
      photoStage = document.getElementById('photo-stage'),
      photoNext = document.getElementById('photo-next'),
      passwordModal = document.getElementById('password-modal'),
      secretInput = document.getElementById('secret-input'),
      secretSubmit = document.getElementById('secret-submit'),
      finalVideoStage = document.getElementById('final-video-stage'),
      mainVideo = document.getElementById('main-video'),
      mobileModal = document.getElementById('mobile-modal'),
      mobileCopy = document.getElementById('mobile-copy'),
      mobileContinue = document.getElementById('mobile-continue'),
      mobileLinkEl = document.getElementById('mobile-link'),
      timer = null,
      bgm = $('bgm'),
      musicToggle = $('musicToggle'),
      effectsLayer = document.getElementById('effects-layer');

  // Mobile hint popup (show once)
  (function () {
    if (!mobileModal) return;
    var alreadyShown = false;
    try {
      alreadyShown = localStorage.getItem('anniv_mobile_hint_shown') === '1';
    } catch (e) {}
    if (alreadyShown) return;

    var isMobileUa = /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(navigator.userAgent || '');
    var isSmallScreen = window.matchMedia && window.matchMedia('(max-width: 900px)').matches;
    var isTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints && navigator.maxTouchPoints > 0);
    var shouldShow = (isMobileUa || (isSmallScreen && isTouch));

    if (!shouldShow) return;

    mobileModal.classList.remove('hidden');
    try {
      localStorage.setItem('anniv_mobile_hint_shown', '1');
    } catch (e) {}

    var linkText = (mobileLinkEl && mobileLinkEl.textContent) ? mobileLinkEl.textContent.trim() : window.location.href;

    function hide() {
      mobileModal.classList.add('hidden');
    }

    if (mobileContinue) {
      mobileContinue.addEventListener('click', hide);
    }

    if (mobileCopy) {
      mobileCopy.addEventListener('click', function () {
        var text = linkText;
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text).then(function () {
            mobileCopy.textContent = 'Copied!';
            setTimeout(function () { mobileCopy.textContent = 'Copy link'; }, 1200);
          }).catch(function () {});
        } else {
          // Fallback
          var ta = document.createElement('textarea');
          ta.value = text;
          ta.setAttribute('readonly', '');
          ta.style.position = 'fixed';
          ta.style.left = '-9999px';
          document.body.appendChild(ta);
          ta.select();
          try { document.execCommand('copy'); } catch (e) {}
          document.body.removeChild(ta);
          mobileCopy.textContent = 'Copied!';
          setTimeout(function () { mobileCopy.textContent = 'Copy link'; }, 1200);
        }
      });
    }
  })();

  function safePlayAt20Percent() {
    if (!bgm) return;
    bgm.volume = 0.1;
    bgm.play().catch(function () {
      // Autoplay may be blocked until user gesture; ignore quietly.
    });
  }

  function updateMusicUi() {
    if (!musicToggle || !bgm) return;
    var playing = !bgm.paused;
    musicToggle.textContent = playing ? 'Pause music' : 'Play music';
    musicToggle.setAttribute('aria-pressed', playing ? 'true' : 'false');
  }

  openB.addEventListener('click', function () {
    card.setAttribute('class', 'open-half');
    if (timer) clearTimeout(timer);
    timer = setTimeout(function () {
      card.setAttribute('class', 'open-fully');
      timer = null;
    }, 1000);

    safePlayAt20Percent();
    updateMusicUi();
  });

  function closeCard() {
    card.setAttribute('class', 'close-half');
    if (timer) clearTimeout(timer);
    timer = setTimeout(function () {
      card.setAttribute('class', '');
      timer = null;
    }, 1000);
  }

  closeB.addEventListener('click', closeCard);

  function fadeOutCardAndShowIntro() {
    if (!card) return;
    card.classList.add('card-fade-out');
    setTimeout(function () {
      card.style.display = 'none';
      if (welcomeModal) {
        welcomeModal.classList.remove('hidden');
      }
    }, 600);
  }

  if (insideCloseB) {
    insideCloseB.addEventListener('click', fadeOutCardAndShowIntro);
  }

  if (musicToggle && bgm) {
    bgm.volume = 0.1;
    musicToggle.addEventListener('click', function () {
      if (bgm.paused) {
        safePlayAt20Percent();
      } else {
        bgm.pause();
      }
      updateMusicUi();
    });

    bgm.addEventListener('play', updateMusicUi);
    bgm.addEventListener('pause', updateMusicUi);
    updateMusicUi();
  }

  if (bgm) {
    // Try to autoplay on page load (may be blocked by browser policies).
    safePlayAt20Percent();
  }

  function spawnHeart() {
    if (!effectsLayer) return;
    var heart = document.createElement('div');
    heart.className = 'heart';
    var startLeft = Math.random() * 100;
    heart.style.left = startLeft + 'vw';
    heart.style.bottom = '-40px';
    heart.style.animationDuration = (4 + Math.random() * 3).toFixed(1) + 's';
    heart.style.opacity = 0.9;
    effectsLayer.appendChild(heart);
    setTimeout(function () {
      if (heart.parentNode) {
        heart.parentNode.removeChild(heart);
      }
    }, 8000);
  }

  function spawnFirework() {
    if (!effectsLayer) return;
    var rect = effectsLayer.getBoundingClientRect();
    var x = rect.width * (0.1 + Math.random() * 0.8);
    var y = rect.height * (0.1 + Math.random() * 0.55);
    spawnFireworkAt(x, y);
  }

  function spawnFireworkAt(x, y) {
    if (!effectsLayer) return;
    var fw = document.createElement('div');
    fw.className = 'firework';
    fw.style.left = x + 'px';
    fw.style.top = y + 'px';
    effectsLayer.appendChild(fw);

    var particles = 26 + Math.floor(Math.random() * 12);
    var palette = ['#ff4b6e', '#ffd36b', '#ff7ee5', '#88e0ff', '#c7ff9e', '#ffa26b', '#fff1a6'];
    for (var i = 0; i < particles; i++) {
      var spark = document.createElement('div');
      spark.className = 'spark';
      spark.style.left = x + 'px';
      spark.style.top = y + 'px';

      var angle = (Math.PI * 2 * i) / particles + (Math.random() * 0.6 - 0.3);
      var radius = 110 + Math.random() * 110;
      var dx = Math.cos(angle) * radius;
      var dy = Math.sin(angle) * radius * -1; // go upwards visually

      spark.style.setProperty('--dx', dx.toFixed(1) + 'px');
      spark.style.setProperty('--dy', dy.toFixed(1) + 'px');
      var color = palette[Math.floor(Math.random() * palette.length)];
      spark.style.setProperty('--spark-color', color);

      // Tiny offset so not all sparks start exactly together.
      spark.style.animationDelay = (Math.random() * 0.12).toFixed(2) + 's';

      effectsLayer.appendChild(spark);

      (function (node) {
        setTimeout(function () {
          if (node.parentNode) node.parentNode.removeChild(node);
        }, 1600);
      })(spark);
    }

    setTimeout(function () {
      if (fw.parentNode) fw.parentNode.removeChild(fw);
    }, 2400);
  }

  function launchRocket() {
    if (!effectsLayer) return;
    var rect = effectsLayer.getBoundingClientRect();
    var startX = rect.width * (0.05 + Math.random() * 0.9);
    var endX = rect.width * (0.1 + Math.random() * 0.8);
    var endY = rect.height * (0.12 + Math.random() * 0.45);

    var rocket = document.createElement('div');
    rocket.className = 'rocket';
    rocket.style.left = startX + 'px';
    rocket.style.top = (rect.height + 20) + 'px';

    rocket.style.setProperty('--dx', (endX - startX).toFixed(0) + 'px');
    rocket.style.setProperty('--dy', (endY - (rect.height + 20)).toFixed(0) + 'px');
    rocket.style.setProperty('--dur', (1.0 + Math.random() * 0.9).toFixed(2) + 's');

    effectsLayer.appendChild(rocket);

    rocket.addEventListener('animationend', function () {
      if (rocket.parentNode) rocket.parentNode.removeChild(rocket);
      // Blast at the rocket’s target area.
      spawnFireworkAt(endX, endY);
      // Small chance for a second pop nearby for variety.
      if (Math.random() < 0.35) {
        spawnFireworkAt(endX + (Math.random() * 80 - 40), endY + (Math.random() * 60 - 30));
      }
    }, { once: true });
  }

  if (effectsLayer) {
    setInterval(function () {
      spawnHeart();
      if (Math.random() < 0.7) spawnHeart();
    }, 380);
    setInterval(function () {
      // Rockets launching from bottom
      if (Math.random() < 0.95) launchRocket();
    }, 850);
    setInterval(function () {
      // Occasional ambient bursts so it feels alive
      if (Math.random() < 0.6) spawnFirework();
    }, 1100);
  }

  var answered = { 1: false, 2: false, 3: false };
  var quizButtons = document.querySelectorAll('.quiz-option');
  var quiz3Seen = { A: false, B: false, C: false };

  function checkAllAnswered() {
    return answered[1] && answered[2] && answered[3];
  }

  if (quizButtons && introModal && rewardModal) {
    quizButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var quizId = this.getAttribute('data-quiz');
        var isCorrect = this.hasAttribute('data-correct');

        if (quizId === '3') {
          var choice = this.getAttribute('data-choice');
          if (choice && quiz3Seen.hasOwnProperty(choice)) {
            quiz3Seen[choice] = true;
            if (quiz3Seen.A && quiz3Seen.B && quiz3Seen.C) {
              var hiddenOption = document.querySelector('.quiz-options[data-quiz="3"] .hidden-option');
              if (hiddenOption) {
                hiddenOption.classList.remove('hidden-option');
              }
            }
          }

          if (isCorrect) {
            this.classList.add('correct');
            answered[3] = true;
          } else {
            this.classList.add('wrong');
            setTimeout(() => this.classList.remove('wrong'), 600);
          }
        } else {
          if (isCorrect) {
            this.classList.add('correct');
            answered[quizId] = true;
          } else {
            this.classList.add('wrong');
            setTimeout(() => this.classList.remove('wrong'), 600);
          }
        }

        if (checkAllAnswered()) {
          introModal.classList.add('hidden');
          rewardModal.classList.remove('hidden');
        }
      });
    });
  }

  if (welcomeNext && welcomeModal && introModal) {
    welcomeNext.addEventListener('click', function () {
      welcomeModal.classList.add('hidden');
      introModal.classList.remove('hidden');
    });
  }

  if (rewardNext && rewardModal && videoStage) {
    rewardNext.addEventListener('click', function () {
      rewardModal.classList.add('hidden');
      videoStage.classList.remove('hidden');
      if (videoEl) {
        videoEl.pause();
        videoEl.currentTime = 0;
      }
    });
  }

  // Game setup
  var gameInitialized = false;
  var gameFinished = false;

  function initGame() {
    if (gameInitialized) return;
    gameInitialized = true;

    var canvas = document.getElementById('gameCanvas');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');

    // Bigger, wider maze (more branches & dead-ends)
    var tileSize = 26;
    var rows = 21;
    var cols = 55;

    function generateMaze(r, c) {
      // Ensure odd dimensions for clean corridors
      if (r % 2 === 0) r += 1;
      if (c % 2 === 0) c += 1;

      var grid = Array.from({ length: r }, function () {
        return Array.from({ length: c }, function () { return 1; }); // 1 = wall
      });

      function inBounds(x, y) {
        return x > 0 && y > 0 && x < c - 1 && y < r - 1;
      }

      function shuffle(arr) {
        for (var i = arr.length - 1; i > 0; i--) {
          var j = Math.floor(Math.random() * (i + 1));
          var tmp = arr[i];
          arr[i] = arr[j];
          arr[j] = tmp;
        }
        return arr;
      }

      function carve(x, y) {
        grid[y][x] = 0; // floor
        var dirs = shuffle([
          [2, 0],
          [-2, 0],
          [0, 2],
          [0, -2]
        ]);
        for (var i = 0; i < dirs.length; i++) {
          var dx = dirs[i][0];
          var dy = dirs[i][1];
          var nx = x + dx;
          var ny = y + dy;
          if (!inBounds(nx, ny)) continue;
          if (grid[ny][nx] === 1) {
            // Knock down wall between
            grid[y + dy / 2][x + dx / 2] = 0;
            carve(nx, ny);
          }
        }
      }

      carve(1, 1);

      // Keep a solid border
      for (var yy = 0; yy < r; yy++) {
        grid[yy][0] = 1;
        grid[yy][c - 1] = 1;
      }
      for (var xx = 0; xx < c; xx++) {
        grid[0][xx] = 1;
        grid[r - 1][xx] = 1;
      }

      return { grid: grid, rows: r, cols: c };
    }

    var generated = generateMaze(rows, cols);
    var maze = generated.grid;
    rows = generated.rows;
    cols = generated.cols;

    canvas.width = cols * tileSize;
    canvas.height = rows * tileSize;

    var player = {x:1, y:1};

    function randomFloor(filterFn) {
      var cells = [];
      for (var y = 0; y < rows; y++) {
        for (var x = 0; x < cols; x++) {
          if (maze[y][x] === 0 && !(x === player.x && y === player.y)) {
            if (!filterFn || filterFn(x, y)) {
              cells.push({ x: x, y: y });
            }
          }
        }
      }
      if (!cells.length) return { x: 1, y: 1 };
      return cells[Math.floor(Math.random() * cells.length)];
    }

    var keyPos = randomFloor(function (x, y) { return x < cols / 3; });
    var heartPos = randomFloor(function (x, y) { return x > (cols * 2) / 3; });

    var heart = {x:heartPos.x, y:heartPos.y, collected:false};
    var key = {x:keyPos.x, y:keyPos.y, collected:false};
    // Place chest near the middle-bottom-ish on a floor tile.
    var chestPos = randomFloor(function (x, y) {
      return Math.abs(x - Math.floor(cols / 2)) < Math.floor(cols / 6) && y > Math.floor(rows / 2);
    });
    var chest = { x: chestPos.x, y: chestPos.y };

    var imgPlayer = new Image();
    var imgHeart = new Image();
    var imgKey = new Image();
    var imgChest = new Image();

    imgPlayer.src = 'rafwan.png';
    imgHeart.src = 'heart.png';
    imgKey.src = 'key.png';
    imgChest.src = 'chest.png';

    function drawTile(x, y, color){
      ctx.fillStyle = color;
      ctx.fillRect(x*tileSize, y*tileSize, tileSize, tileSize);
    }

    function drawMaze(){
      ctx.clearRect(0,0,canvas.width,canvas.height);
      for(let y=0;y<rows;y++){
        for(let x=0;x<cols;x++){
          if(maze[y][x]===1){
            // wall
            drawTile(x, y, "#000");
          } else {
            // floor
            drawTile(x, y, "#fff");
          }
        }
      }

      // Chest
      if (imgChest.complete && imgChest.naturalWidth) {
        ctx.drawImage(imgChest, chest.x*tileSize+4, chest.y*tileSize+4, tileSize-8, tileSize-8);
      } else {
        drawTile(chest.x, chest.y, "#888");
      }

      if(!heart.collected){
        if (imgHeart.complete && imgHeart.naturalWidth) {
          ctx.drawImage(imgHeart, heart.x*tileSize+4, heart.y*tileSize+4, tileSize-8, tileSize-8);
        } else {
          ctx.fillStyle = "#f00";
          ctx.fillRect(heart.x*tileSize+5, heart.y*tileSize+5, tileSize-10, tileSize-10);
        }
      }

      if(!key.collected){
        if (imgKey.complete && imgKey.naturalWidth) {
          ctx.drawImage(imgKey, key.x*tileSize+6, key.y*tileSize+6, tileSize-12, tileSize-12);
        } else {
          ctx.fillStyle = "#ff0";
          ctx.fillRect(key.x*tileSize+8, key.y*tileSize+8, tileSize-16, tileSize-16);
        }
      }

      if (imgPlayer.complete && imgPlayer.naturalWidth) {
        ctx.drawImage(imgPlayer, player.x*tileSize+4, player.y*tileSize+4, tileSize-8, tileSize-8);
      } else {
        drawTile(player.x, player.y, "#0f0");
      }
    }

    function movePlayer(dx, dy){
      var newX = player.x + dx;
      var newY = player.y + dy;
      if (newY < 0 || newY >= rows || newX < 0 || newX >= cols) {
        return;
      }
      if(maze[newY][newX]===0){
        player.x = newX;
        player.y = newY;

        if(player.x === heart.x && player.y === heart.y){
          heart.collected = true;
          alert("You picked up the ♥!");
        }

        if(player.x === key.x && player.y === key.y){
          key.collected = true;
          alert("You picked up the 🔑!");
        }

        if(!gameFinished && player.x === chest.x && player.y === chest.y){
          if(heart.collected && key.collected){
            gameFinished = true;
            if (gameWinModal) {
              gameWinModal.classList.remove('hidden');
            }
          } else if(heart.collected){
            alert("You need the key to lock the chest!");
          }
        }
      }
      drawMaze();
    }

    window.addEventListener("keydown", function (e){
      if (gameStage && (gameStage.classList.contains('hidden') || gameFinished)) return;
      switch(e.key){
        case "ArrowUp": movePlayer(0,-1); break;
        case "ArrowDown": movePlayer(0,1); break;
        case "ArrowLeft": movePlayer(-1,0); break;
        case "ArrowRight": movePlayer(1,0); break;
      }
    });

    [imgPlayer, imgHeart, imgKey, imgChest].forEach(function (img) {
      img.addEventListener('load', drawMaze);
    });
    drawMaze();
  }

  if (videoNext && videoStage && gameStage) {
    videoNext.addEventListener('click', function () {
      if (videoEl) {
        videoEl.pause();
      }
      videoStage.classList.add('hidden');
      gameStage.classList.remove('hidden');
      initGame();
    });
  }

  if (gameWinNext && gameWinModal && gameStage && photoStage) {
    gameWinNext.addEventListener('click', function () {
      gameWinModal.classList.add('hidden');
      gameStage.classList.add('hidden');
      photoStage.classList.remove('hidden');
    });
  }

  if (photoNext && photoStage && photoStage) {
    photoNext.addEventListener('click', function () {
      photoStage.classList.add('hidden');
      if (passwordModal) {
        passwordModal.classList.remove('hidden');
      }
    });
  }

  function tryUnlockSecret() {
    if (!secretInput || !passwordModal || !finalVideoStage) return;
    var value = (secretInput.value || '').trim();
    if (value.toLowerCase() === 'motomoto') {
      passwordModal.classList.add('hidden');
      finalVideoStage.classList.remove('hidden');
      secretInput.classList.remove('error');
      if (bgm && !bgm.paused) {
        bgm.pause();
      }
      updateMusicUi();
      if (mainVideo) {
        mainVideo.play().catch(function () {});
      }
    } else {
      secretInput.classList.add('error');
    }
  }

  if (secretSubmit && secretInput) {
    secretSubmit.addEventListener('click', tryUnlockSecret);
    secretInput.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        tryUnlockSecret();
      }
    });
  }

}());

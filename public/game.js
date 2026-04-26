// ============================================
// SONAM & HRITESH'S VIRTUAL CINEMA 🖤🌸
// ============================================

let scene, camera, renderer, socket, playerName;
let otherPlayers = {};
let clock;
let playerGroup, playerBody, playerLegL, playerLegR, playerArmL, playerArmR;
let moveForward = false, moveBackward = false, moveLeft = false, moveRight = false;
let canInteract = false, nearObject = '';
let currentSong = 0;
let audio = null;
let songPlaying = false;
let yaw = 0;
let currentPhoto = 0;
let isJumping = false;
let jumpVelocity = 0;
let playerY = 0.5;
let isSitting = false;
let candlesLeft = 3;
let micActive = false;
let confettiParticles = [];
let isLocked = false;
let flames = [];
let flameLights = [];
let dinnerCandleFlames = [];
let dinnerCandleLights = [];
let fairyBulbs = [];

const photos = [
  { file: 'photo1.jpeg', caption: "Didn't want you to leave 🥺" },
  { file: 'photo2.jpeg', caption: 'Love our toto rides 🛺💕' },
  { file: 'photo3.jpeg', caption: "I'd melt in this kiss forever 😘" },
  { file: 'photo4.jpeg', caption: 'Me vs Her 😂🖤' },
  { file: 'photo5.jpeg', caption: "She'd prolly say this pic sucks 😅" },
  { file: 'photo6.jpeg', caption: 'My Shaylaaaa 🌸' },
  { file: 'photo7.jpeg', caption: 'Some city gazing with my ladyyy 🌃' },
  { file: 'photo8.jpeg', caption: 'She made us cupcakes literally 🧁✨' },
];

const songs = [
  { file: 'song1.mp3', name: 'Best Part 🎵' },
  { file: 'song2.mp3', name: 'Our Song 2 🎵' },
  { file: 'song3.mp3', name: 'Our Song 3 🎵' },
  { file: 'song4.mp3', name: 'Our Song 4 🎵' },
  { file: 'song5.mp3', name: 'Our Song 5 🎵' },
];

// ============================================
// ENTER CINEMA
// ============================================
function enterCinema() {
  const input = document.getElementById('nameInput').value.trim();
  if (!input) { alert('Please enter your name! 💕'); return; }
  playerName = input;
  document.getElementById('nameScreen').style.display = 'none';
  document.getElementById('hud').style.display = 'block';
  document.getElementById('online').style.display = 'block';
  document.getElementById('playerNameTag').textContent = '👤 ' + playerName;
  init();
}

// ============================================
// INIT
// ============================================
function init() {
  clock = new THREE.Clock();
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0d0012);
  scene.fog = new THREE.Fog(0x0d0012, 14, 38);

  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.0;
  document.body.appendChild(renderer.domElement);

  buildRoom();
  buildLights();
  buildFairyLights();
  buildSofa();
  buildScreen();
  buildCakeTable();
  buildDinnerTable();
  buildMemoryWall();
  buildMusicPlayer();
  buildBirthdayBanner();
  buildPlayer();
  setupControls();
  connectMultiplayer();
  buildMusicUI();
  buildPhotoModal();
  buildChatUI();
  buildVideoModal();
  buildHUD();

  setTimeout(() => launchConfetti(100), 1200);
  animate();
}

// ============================================
// LIGHTS — warm cosy candlelight, NOT neon
// ============================================
function buildLights() {
  // Soft warm base — like a dimly lit room
  scene.add(new THREE.AmbientLight(0x1a0e10, 1.4));

  // Main warm overhead — very soft golden
  const overhead = new THREE.PointLight(0xffe8c0, 0.5, 30);
  overhead.position.set(0, 4.8, 0);
  scene.add(overhead);

  // Warm candlelight from birthday cake
  const cake1 = new THREE.PointLight(0xffaa44, 1.2, 9);
  cake1.position.set(-6, 2, 0);
  scene.add(cake1);

  // Warm candlelight from dinner table
  const dinner1 = new THREE.PointLight(0xffbb55, 1.0, 7);
  dinner1.position.set(6, 1.8, -5);
  scene.add(dinner1);

  // Soft rose from center — very gentle
  const centerRose = new THREE.PointLight(0xffb0c8, 0.35, 18);
  centerRose.position.set(0, 3, 0);
  scene.add(centerRose);

  // Warm screen glow — soft lavender, low intensity
  const screenGlow = new THREE.SpotLight(0xc8a8e8, 0.6, 18, Math.PI / 5);
  screenGlow.position.set(0, 4.5, -6);
  screenGlow.target.position.set(0, 2, -9);
  screenGlow.castShadow = true;
  scene.add(screenGlow);
  scene.add(screenGlow.target);

  // Warm sofa area
  const sofaGlow = new THREE.PointLight(0xffcc88, 0.4, 8);
  sofaGlow.position.set(0, 2.5, 3);
  scene.add(sofaGlow);

  // Warm memory wall light
  const wallGlow = new THREE.PointLight(0xffd4a0, 0.6, 10);
  wallGlow.position.set(7.5, 2.5, 0);
  scene.add(wallGlow);

  // Jukebox soft glow
  const jukeGlow = new THREE.PointLight(0xffccaa, 0.5, 6);
  jukeGlow.position.set(6, 2, 3);
  scene.add(jukeGlow);
}

// ============================================
// ROOM
// ============================================
function buildRoom() {
  const roomW = 20, roomH = 5, roomD = 20;
  const wallMat = new THREE.MeshLambertMaterial({ color: 0x180e20 });

  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(roomW, roomD),
    new THREE.MeshLambertMaterial({ color: 0x100c18 })
  );
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  scene.add(floor);

  const ceil = new THREE.Mesh(
    new THREE.PlaneGeometry(roomW, roomD),
    new THREE.MeshLambertMaterial({ color: 0x0a0810 })
  );
  ceil.rotation.x = Math.PI / 2;
  ceil.position.y = roomH;
  scene.add(ceil);

  ['back','front','left','right'].forEach((side) => {
    const geo = side === 'left' || side === 'right'
      ? new THREE.PlaneGeometry(roomD, roomH)
      : new THREE.PlaneGeometry(roomW, roomH);
    const wall = new THREE.Mesh(geo, wallMat);
    if (side === 'back')  { wall.position.set(0, roomH/2, -roomD/2); }
    if (side === 'front') { wall.position.set(0, roomH/2, roomD/2); wall.rotation.y = Math.PI; }
    if (side === 'left')  { wall.position.set(-roomW/2, roomH/2, 0); wall.rotation.y = Math.PI/2; }
    if (side === 'right') { wall.position.set(roomW/2, roomH/2, 0); wall.rotation.y = -Math.PI/2; }
    scene.add(wall);
  });

  // Warm dark checkered floor
  for (let i = -4; i < 4; i++) {
    for (let j = -4; j < 4; j++) {
      if ((i + j) % 2 === 0) {
        const tile = new THREE.Mesh(
          new THREE.PlaneGeometry(2.4, 2.4),
          new THREE.MeshLambertMaterial({ color: 0x150a1e })
        );
        tile.rotation.x = -Math.PI / 2;
        tile.position.set(i * 2.5, 0.01, j * 2.5);
        scene.add(tile);
      }
    }
  }

  // Warm rose gold wall trim
  const trimMat = new THREE.MeshLambertMaterial({ color: 0x6b2a40 });
  const trimBack = new THREE.Mesh(new THREE.BoxGeometry(roomW, 0.05, 0.04), trimMat);
  trimBack.position.set(0, 1, -9.97);
  scene.add(trimBack);
  const trimL = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.05, roomD), trimMat);
  trimL.position.set(-9.97, 1, 0);
  scene.add(trimL);
  const trimR = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.05, roomD), trimMat);
  trimR.position.set(9.97, 1, 0);
  scene.add(trimR);
}

// ============================================
// FAIRY LIGHTS — warm soft twinkle, NOT neon
// ============================================
function buildFairyLights() {
  // Warm soft colors — like real fairy lights
  const warmColors = [0xfffbe6, 0xffe4b5, 0xffd4a0, 0xffeccc, 0xfff0d0];

  function addString(positions, yPos, zPos, isZAxis) {
    // Wire
    const wireMat = new THREE.MeshBasicMaterial({ color: 0x2a1a10 });
    const wireLen = isZAxis ? 20 : 20;
    const wire = new THREE.Mesh(
      new THREE.BoxGeometry(isZAxis ? 0.015 : wireLen, 0.015, isZAxis ? wireLen : 0.015),
      wireMat
    );
    wire.position.set(isZAxis ? zPos : 0, yPos + 0.05, isZAxis ? 0 : zPos);
    scene.add(wire);

    positions.forEach((pos, i) => {
      const color = warmColors[Math.floor(Math.random() * warmColors.length)];

      // Very dim point light — like a real bulb, not neon
      const light = new THREE.PointLight(color, 0.18, 2.2);
      light.position.set(
        isZAxis ? zPos : pos,
        yPos,
        isZAxis ? pos : zPos
      );
      scene.add(light);

      // Small glass bulb
      const bulb = new THREE.Mesh(
        new THREE.SphereGeometry(0.055, 8, 8),
        new THREE.MeshBasicMaterial({ color })
      );
      bulb.position.copy(light.position);
      scene.add(bulb);

      // Tiny cap on bulb
      const cap = new THREE.Mesh(
        new THREE.CylinderGeometry(0.025, 0.025, 0.04, 6),
        new THREE.MeshLambertMaterial({ color: 0x1a0a00 })
      );
      cap.position.set(bulb.position.x, bulb.position.y + 0.07, bulb.position.z);
      scene.add(cap);

      fairyBulbs.push({ light, bulb, baseIntensity: 0.18, offset: i * 0.7 });
    });
  }

  // Back wall string
  const backPositions = [];
  for (let x = -9; x <= 9; x += 1.4) backPositions.push(x);
  addString(backPositions, 4.7, -9.5, false);

  // Left wall string
  const leftPositions = [];
  for (let z = -9; z <= 9; z += 1.6) leftPositions.push(z);
  addString(leftPositions, 4.7, -9.5, true);

  // Right wall string
  const rightPositions = [];
  for (let z = -9; z <= 9; z += 1.6) rightPositions.push(z);
  addString(rightPositions, 4.7, 9.5, true);

  // Ceiling criss-cross strings — like a cosy cafe
  for (let x = -6; x <= 6; x += 4) {
    const ceilPos = [];
    for (let z = -9; z <= 9; z += 2) ceilPos.push(z);
    addString(ceilPos, 4.75, x, true);
  }
}

// ============================================
// BIRTHDAY BANNER — now at front of room, visible
// ============================================
function buildBirthdayBanner() {
  const bannerMat = new THREE.MeshLambertMaterial({ color: 0x6b0030 });
  const goldMat = new THREE.MeshBasicMaterial({ color: 0xffd700 });
  const pinkMat = new THREE.MeshLambertMaterial({ color: 0xff6b9d });
  const roseMat = new THREE.MeshLambertMaterial({ color: 0xff9dc4 });

  // Main banner — hanging from ceiling, center of room
  const banner = new THREE.Mesh(
    new THREE.BoxGeometry(7.5, 0.75, 0.06), bannerMat
  );
  banner.position.set(0, 4.3, 0);
  scene.add(banner);

  // Gold top border
  const topBorder = new THREE.Mesh(new THREE.BoxGeometry(7.7, 0.07, 0.07), goldMat);
  topBorder.position.set(0, 4.68, 0);
  scene.add(topBorder);

  // Gold bottom border
  const botBorder = new THREE.Mesh(new THREE.BoxGeometry(7.7, 0.07, 0.07), goldMat);
  botBorder.position.set(0, 3.92, 0);
  scene.add(botBorder);

  // Hanging strings from ceiling to banner
  for (let x = -3.5; x <= 3.5; x += 1.75) {
    const string = new THREE.Mesh(
      new THREE.BoxGeometry(0.018, 0.3, 0.018),
      new THREE.MeshBasicMaterial({ color: 0xffd700 })
    );
    string.position.set(x, 4.85, 0);
    scene.add(string);
  }

  // Bunting triangles below banner
  for (let x = -3.3; x <= 3.3; x += 1.1) {
    const colors = [pinkMat, roseMat, bannerMat];
    const tri = new THREE.Mesh(
      new THREE.ConeGeometry(0.15, 0.3, 4),
      colors[Math.floor(Math.random() * colors.length)]
    );
    tri.position.set(x, 3.7, 0);
    scene.add(tri);

    // String connecting triangles
    if (x < 3.3) {
      const conn = new THREE.Mesh(
        new THREE.BoxGeometry(1.1, 0.015, 0.015),
        new THREE.MeshBasicMaterial({ color: 0xffd700 })
      );
      conn.position.set(x + 0.55, 3.85, 0);
      scene.add(conn);
    }
  }

  // Gold star decorations on banner
  for (let x = -3; x <= 3; x += 1.5) {
    const star = new THREE.Mesh(
      new THREE.SphereGeometry(0.07, 8, 8),
      goldMat
    );
    star.position.set(x, 4.3, 0.05);
    scene.add(star);
  }

  // Warm glow on banner
  const bannerGlow = new THREE.PointLight(0xffd4a0, 0.9, 6);
  bannerGlow.position.set(0, 4.0, 0.5);
  scene.add(bannerGlow);

  // Second banner — above cinema screen, angled
  const banner2 = new THREE.Mesh(
    new THREE.BoxGeometry(5, 0.5, 0.05),
    new THREE.MeshLambertMaterial({ color: 0x4a0020 })
  );
  banner2.position.set(0, 4.6, -7.5);
  scene.add(banner2);

  const b2Border = new THREE.Mesh(new THREE.BoxGeometry(5.2, 0.05, 0.06), goldMat);
  b2Border.position.set(0, 4.35, -7.5);
  scene.add(b2Border);
  const b2BorderT = new THREE.Mesh(new THREE.BoxGeometry(5.2, 0.05, 0.06), goldMat);
  b2BorderT.position.set(0, 4.85, -7.5);
  scene.add(b2BorderT);

  for (let x = -2.2; x <= 2.2; x += 0.9) {
    const tri2 = new THREE.Mesh(
      new THREE.ConeGeometry(0.12, 0.24, 4),
      x % 2 === 0 ? pinkMat : roseMat
    );
    tri2.position.set(x, 4.12, -7.5);
    scene.add(tri2);
  }
}

// ============================================
// SOFA
// ============================================
function buildSofa() {
  const sofaMat = new THREE.MeshLambertMaterial({ color: 0x3a1040 });
  const darkMat = new THREE.MeshLambertMaterial({ color: 0x200828 });
  const pillowMat = new THREE.MeshLambertMaterial({ color: 0x7a1a45 });

  const seat = new THREE.Mesh(new THREE.BoxGeometry(3.5, 0.45, 1.4), sofaMat);
  seat.position.set(0, 0.4, 2);
  seat.castShadow = true;
  scene.add(seat);

  const back = new THREE.Mesh(new THREE.BoxGeometry(3.5, 1.0, 0.25), darkMat);
  back.position.set(0, 1.0, 2.72);
  scene.add(back);

  const armL = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.7, 1.4), darkMat);
  armL.position.set(-1.87, 0.7, 2);
  scene.add(armL);

  const armR = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.7, 1.4), darkMat);
  armR.position.set(1.87, 0.7, 2);
  scene.add(armR);

  const p1 = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.35, 0.6), pillowMat);
  p1.position.set(-0.9, 0.82, 2.1);
  scene.add(p1);

  const p2 = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.35, 0.6), pillowMat);
  p2.position.set(0.9, 0.82, 2.1);
  scene.add(p2);

  [[-1.5,1.5],[1.5,1.5],[-1.5,2.5],[1.5,2.5]].forEach(([x,z]) => {
    const leg = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.2, 0.12),
      new THREE.MeshLambertMaterial({ color: 0x3a1428 }));
    leg.position.set(x, 0.1, z);
    scene.add(leg);
  });
}

// ============================================
// CINEMA SCREEN
// ============================================
function buildScreen() {
  const frame = new THREE.Mesh(
    new THREE.BoxGeometry(8.6, 4.8, 0.12),
    new THREE.MeshLambertMaterial({ color: 0x120820 })
  );
  frame.position.set(0, 2.8, -9.44);
  scene.add(frame);

  const screenMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(8, 4),
    new THREE.MeshBasicMaterial({ color: 0x06040e })
  );
  screenMesh.position.set(0, 2.8, -9.38);
  scene.add(screenMesh);

  // Very soft screen glow
  const glowLight = new THREE.PointLight(0xc0a8e0, 0.7, 12);
  glowLight.position.set(0, 2.8, -8.5);
  scene.add(glowLight);

  window.screenZone = { x: 0, z: -7, radius: 3.5, label: 'the Cinema Screen 🎬' };
}

// ============================================
// BIRTHDAY CAKE TABLE
// ============================================
function buildCakeTable() {
  const tableMat = new THREE.MeshLambertMaterial({ color: 0x3a1040 });
  const cakeMat = new THREE.MeshLambertMaterial({ color: 0xffb6c1 });

  const table = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.1, 1.2), tableMat);
  table.position.set(-6, 0.8, 0);
  scene.add(table);

  [[-0.7,-0.45],[0.7,-0.45],[-0.7,0.45],[0.7,0.45]].forEach(([x,z]) => {
    const leg = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.8, 0.09), tableMat);
    leg.position.set(-6+x, 0.4, z);
    scene.add(leg);
  });

  const bottom = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 0.22, 20), cakeMat);
  bottom.position.set(-6, 0.96, 0);
  scene.add(bottom);

  const mid = new THREE.Mesh(
    new THREE.CylinderGeometry(0.3, 0.3, 0.2, 20),
    new THREE.MeshLambertMaterial({ color: 0xff8fab })
  );
  mid.position.set(-6, 1.17, 0);
  scene.add(mid);

  const top = new THREE.Mesh(
    new THREE.CylinderGeometry(0.2, 0.2, 0.18, 20),
    new THREE.MeshLambertMaterial({ color: 0xff6b9d })
  );
  top.position.set(-6, 1.36, 0);
  scene.add(top);

  // Frosting rings
  [{ y: 0.95, r: 0.4 }, { y: 1.16, r: 0.3 }, { y: 1.35, r: 0.2 }].forEach(({ y, r }) => {
    const drip = new THREE.Mesh(
      new THREE.TorusGeometry(r, 0.022, 8, 20),
      new THREE.MeshLambertMaterial({ color: 0xffffff })
    );
    drip.position.set(-6, y + 0.11, 0);
    scene.add(drip);
  });

  // Candles
  flames = []; flameLights = [];
  const candleColors = [0xff6b9d, 0xd4a0ff, 0xffd4a0];
  for (let i = 0; i < 3; i++) {
    const cx = -6 + (i - 1) * 0.18;
    const candle = new THREE.Mesh(
      new THREE.CylinderGeometry(0.03, 0.03, 0.2, 8),
      new THREE.MeshLambertMaterial({ color: candleColors[i] })
    );
    candle.position.set(cx, 1.55, 0);
    scene.add(candle);

    const flame = new THREE.Mesh(
      new THREE.SphereGeometry(0.055, 8, 8),
      new THREE.MeshBasicMaterial({ color: 0xffee44 })
    );
    flame.position.set(cx, 1.68, 0);
    scene.add(flame);
    flames.push(flame);

    const fl = new THREE.PointLight(0xffaa33, 0.9, 2.5);
    fl.position.copy(flame.position);
    scene.add(fl);
    flameLights.push(fl);
  }

  window.cakeZone = { x: -6, z: 0, radius: 2.5, label: 'the Birthday Cake 🎂' };
}

// ============================================
// CANDLELIGHT DINNER TABLE 🕯️
// ============================================
function buildDinnerTable() {
  const tableMat = new THREE.MeshLambertMaterial({ color: 0x2a0e1e });
  const clothMat = new THREE.MeshLambertMaterial({ color: 0x6b0030 });
  const plateMat = new THREE.MeshLambertMaterial({ color: 0xf5f0e8 });
  const glassMat = new THREE.MeshLambertMaterial({ color: 0xd4f0ff });
  const roseMat  = new THREE.MeshLambertMaterial({ color: 0xcc2244 });
  const stemMat  = new THREE.MeshLambertMaterial({ color: 0x1a4a1a });

  // Table base
  const table = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 0.9, 0.08, 24), tableMat);
  table.position.set(6, 0.82, -5);
  scene.add(table);

  // Tablecloth — slightly larger, draped look
  const cloth = new THREE.Mesh(new THREE.CylinderGeometry(1.0, 1.08, 0.06, 24), clothMat);
  cloth.position.set(6, 0.85, -5);
  scene.add(cloth);

  // Table leg (pedestal style)
  const pedestal = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.18, 0.82, 12), tableMat);
  pedestal.position.set(6, 0.41, -5);
  scene.add(pedestal);

  // Base
  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 0.06, 16), tableMat);
  base.position.set(6, 0.03, -5);
  scene.add(base);

  // Plates × 2
  [{ x: 6 - 0.42, z: -5 }, { x: 6 + 0.42, z: -5 }].forEach(({ x, z }) => {
    const plate = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.025, 20), plateMat);
    plate.position.set(x, 0.9, z);
    scene.add(plate);

    // Inner plate ring
    const inner = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.03, 20),
      new THREE.MeshLambertMaterial({ color: 0xe8e0d0 }));
    inner.position.set(x, 0.915, z);
    scene.add(inner);

    // Fork
    const fork = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.18, 0.02), plateMat);
    fork.position.set(x - 0.28, 0.9, z);
    scene.add(fork);

    // Knife
    const knife = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.18, 0.02), plateMat);
    knife.position.set(x + 0.28, 0.9, z);
    scene.add(knife);

    // Wine glass stem
    const gstem = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.22, 8), glassMat);
    gstem.position.set(x + 0.32, 1.01, z - 0.28);
    scene.add(gstem);

    // Wine glass bowl
    const gbowl = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.03, 0.12, 12), glassMat);
    gbowl.position.set(x + 0.32, 1.13, z - 0.28);
    scene.add(gbowl);

    // Wine glass base
    const gbase = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.015, 12), glassMat);
    gbase.position.set(x + 0.32, 0.9, z - 0.28);
    scene.add(gbase);
  });

  // Centre candle holder
  const holder = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.08, 0.06, 12),
    new THREE.MeshLambertMaterial({ color: 0xffd700 }));
  holder.position.set(6, 0.9, -5);
  scene.add(holder);

  // Dinner candle
  const dCandle = new THREE.Mesh(
    new THREE.CylinderGeometry(0.035, 0.035, 0.3, 10),
    new THREE.MeshLambertMaterial({ color: 0xfff5e0 })
  );
  dCandle.position.set(6, 1.08, -5);
  scene.add(dCandle);

  // Dinner flame
  const dFlame = new THREE.Mesh(
    new THREE.SphereGeometry(0.05, 8, 8),
    new THREE.MeshBasicMaterial({ color: 0xffee44 })
  );
  dFlame.position.set(6, 1.25, -5);
  scene.add(dFlame);
  dinnerCandleFlames.push(dFlame);

  const dLight = new THREE.PointLight(0xffaa33, 1.1, 4.5);
  dLight.position.set(6, 1.25, -5);
  scene.add(dLight);
  dinnerCandleLights.push(dLight);

  // Rose centrepiece
  const rStem = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.25, 8), stemMat);
  rStem.position.set(5.82, 1.0, -5.1);
  scene.add(rStem);

  const rHead = new THREE.Mesh(new THREE.SphereGeometry(0.075, 10, 10), roseMat);
  rHead.position.set(5.82, 1.13, -5.1);
  scene.add(rHead);

  // Rose petals
  for (let a = 0; a < 5; a++) {
    const angle = (a / 5) * Math.PI * 2;
    const petal = new THREE.Mesh(
      new THREE.SphereGeometry(0.055, 8, 8),
      new THREE.MeshLambertMaterial({ color: 0xdd3355 })
    );
    petal.position.set(
      5.82 + Math.cos(angle) * 0.07,
      1.11,
      -5.1 + Math.sin(angle) * 0.07
    );
    scene.add(petal);
  }

  // Second rose
  const rStem2 = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.28, 8), stemMat);
  rStem2.position.set(6.18, 1.0, -4.92);
  scene.add(rStem2);

  const rHead2 = new THREE.Mesh(new THREE.SphereGeometry(0.065, 10, 10),
    new THREE.MeshLambertMaterial({ color: 0xff6b9d }));
  rHead2.position.set(6.18, 1.14, -4.92);
  scene.add(rHead2);

  // Scatter small rose petals on table
  for (let i = 0; i < 6; i++) {
    const petal = new THREE.Mesh(
      new THREE.SphereGeometry(0.03, 6, 6),
      new THREE.MeshLambertMaterial({ color: 0xcc2244 })
    );
    const angle = (i / 6) * Math.PI * 2;
    petal.position.set(
      6 + Math.cos(angle) * 0.5,
      0.9,
      -5 + Math.sin(angle) * 0.5
    );
    scene.add(petal);
  }

  // Chairs × 2
  const chairMat = new THREE.MeshLambertMaterial({ color: 0x2a0e1e });
  const chairCushion = new THREE.MeshLambertMaterial({ color: 0x5a1030 });

  [{ x: 6, z: -3.6, ry: Math.PI }, { x: 6, z: -6.4, ry: 0 }].forEach(({ x, z, ry }) => {
    const seat = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.07, 0.65), chairMat);
    seat.position.set(x, 0.55, z);
    seat.rotation.y = ry;
    scene.add(seat);

    const cushion = new THREE.Mesh(new THREE.BoxGeometry(0.58, 0.06, 0.58), chairCushion);
    cushion.position.set(x, 0.62, z);
    scene.add(cushion);

    const backrest = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.65, 0.07), chairMat);
    backrest.position.set(x, 0.97, z + (ry === Math.PI ? -0.3 : 0.3));
    scene.add(backrest);

    [[-0.28,-0.28],[0.28,-0.28],[-0.28,0.28],[0.28,0.28]].forEach(([dx,dz]) => {
      const leg = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.55, 0.05), chairMat);
      leg.position.set(x+dx, 0.27, z+dz);
      scene.add(leg);
    });
  });

  // Zone
  window.dinnerZone = { x: 6, z: -5, radius: 2.5, label: 'the Dinner Table 🕯️' };
}

// ============================================
// MEMORY WALL
// ============================================
function buildMemoryWall() {
  const frameMat = new THREE.MeshLambertMaterial({ color: 0x7a1a45 });
  const loader = new THREE.TextureLoader();

  photos.forEach((photo, i) => {
    const col = i % 4;
    const row = Math.floor(i / 4);
    const z = -6 + col * 4;
    const y = 3.2 - row * 1.8;

    const frame = new THREE.Mesh(new THREE.BoxGeometry(0.06, 1.55, 2.15), frameMat);
    frame.position.set(9.28, y, z);
    scene.add(frame);

    const inner = new THREE.Mesh(
      new THREE.BoxGeometry(0.05, 1.38, 1.98),
      new THREE.MeshLambertMaterial({ color: 0x120818 })
    );
    inner.position.set(9.26, y, z);
    scene.add(inner);

    loader.load('photos/' + photo.file, (texture) => {
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;
      texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
      const aspect = texture.image.width / texture.image.height;
      let pw, ph;
      if (aspect >= 1) { pw = 1.85; ph = 1.85 / aspect; }
      else { ph = 1.3; pw = 1.3 * aspect; }
      const photoMesh = new THREE.Mesh(
        new THREE.PlaneGeometry(ph, pw),
        new THREE.MeshBasicMaterial({ map: texture })
      );
      photoMesh.position.set(9.22, y, z);
      photoMesh.rotation.y = -Math.PI / 2;
      scene.add(photoMesh);
    });

    const photoLight = new THREE.PointLight(0xffd4a0, 0.55, 3);
    photoLight.position.set(7.5, y + 0.5, z);
    scene.add(photoLight);
  });

  window.memoryZone = { x: 7, z: 0, radius: 5, label: 'the Memory Wall 🖼️' };
}

// ============================================
// MUSIC PLAYER
// ============================================
function buildMusicPlayer() {
  const mat = new THREE.MeshLambertMaterial({ color: 0x3a1040 });
  const darkMat = new THREE.MeshLambertMaterial({ color: 0x200828 });

  const body = new THREE.Mesh(new THREE.BoxGeometry(0.9, 1.5, 0.55), mat);
  body.position.set(6, 0.95, 3);
  scene.add(body);

  const top = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.3, 0.55), darkMat);
  top.position.set(6, 1.8, 3);
  scene.add(top);

  const grille = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.55, 0.05),
    new THREE.MeshLambertMaterial({ color: 0x7a1a45 }));
  grille.position.set(6, 0.75, 3.3);
  scene.add(grille);

  const jukeLight = new THREE.PointLight(0xffccaa, 0.7, 4);
  jukeLight.position.set(6, 1.8, 3.6);
  scene.add(jukeLight);

  window.musicZone = { x: 6, z: 3, radius: 2.5, label: 'the Music Player 🎵' };
}

// ============================================
// PLAYER — Hritesh
// ============================================
function buildPlayer() {
  playerGroup = new THREE.Group();

  playerBody = new THREE.Mesh(
    new THREE.BoxGeometry(0.52, 0.72, 0.32),
    new THREE.MeshLambertMaterial({ color: 0x4a2d88 })
  );
  playerBody.position.y = 0.56;
  playerGroup.add(playerBody);

  const head = new THREE.Mesh(
    new THREE.BoxGeometry(0.42, 0.42, 0.42),
    new THREE.MeshLambertMaterial({ color: 0xc8845a })
  );
  head.position.y = 1.08;
  playerGroup.add(head);

  const hair = new THREE.Mesh(
    new THREE.BoxGeometry(0.44, 0.14, 0.44),
    new THREE.MeshLambertMaterial({ color: 0x0f0600 })
  );
  hair.position.y = 1.28;
  playerGroup.add(hair);

  const eyeMat = new THREE.MeshLambertMaterial({ color: 0x111111 });
  [-0.1, 0.1].forEach(x => {
    const eye = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.07, 0.04), eyeMat);
    eye.position.set(x, 1.08, 0.22);
    playerGroup.add(eye);
  });

  const smile = new THREE.Mesh(
    new THREE.BoxGeometry(0.14, 0.04, 0.04),
    new THREE.MeshLambertMaterial({ color: 0x7a2a1a })
  );
  smile.position.set(0, 0.97, 0.22);
  playerGroup.add(smile);

  const armMat = new THREE.MeshLambertMaterial({ color: 0x4a2d88 });
  playerArmL = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.52, 0.16), armMat);
  playerArmL.position.set(-0.35, 0.55, 0);
  playerGroup.add(playerArmL);

  playerArmR = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.52, 0.16), armMat);
  playerArmR.position.set(0.35, 0.55, 0);
  playerGroup.add(playerArmR);

  const legMat = new THREE.MeshLambertMaterial({ color: 0x18224a });
  playerLegL = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.5, 0.2), legMat);
  playerLegL.position.set(-0.14, 0.08, 0);
  playerGroup.add(playerLegL);

  playerLegR = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.5, 0.2), legMat);
  playerLegR.position.set(0.14, 0.08, 0);
  playerGroup.add(playerLegR);

  const shoeMat = new THREE.MeshLambertMaterial({ color: 0xe8e0d0 });
  [-0.14, 0.14].forEach(x => {
    const shoe = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.1, 0.28), shoeMat);
    shoe.position.set(x, -0.18, 0.04);
    playerGroup.add(shoe);
  });

  playerGroup.position.set(0, playerY, 3);
  scene.add(playerGroup);
}

// ============================================
// OTHER PLAYERS — Sonam
// ============================================
function createPlayerMesh() {
  const group = new THREE.Group();

  const body = new THREE.Mesh(
    new THREE.BoxGeometry(0.5, 0.75, 0.3),
    new THREE.MeshLambertMaterial({ color: 0xd63060 })
  );
  body.position.y = 0.56;
  group.add(body);

  const dress = new THREE.Mesh(
    new THREE.CylinderGeometry(0.26, 0.38, 0.32, 14),
    new THREE.MeshLambertMaterial({ color: 0xd63060 })
  );
  dress.position.y = 0.24;
  group.add(dress);

  const head = new THREE.Mesh(
    new THREE.BoxGeometry(0.4, 0.4, 0.4),
    new THREE.MeshLambertMaterial({ color: 0xc8845a })
  );
  head.position.y = 1.08;
  group.add(head);

  const hairBack = new THREE.Mesh(
    new THREE.BoxGeometry(0.44, 0.72, 0.1),
    new THREE.MeshLambertMaterial({ color: 0x0f0600 })
  );
  hairBack.position.set(0, 0.86, -0.19);
  group.add(hairBack);

  const hairTop = new THREE.Mesh(
    new THREE.BoxGeometry(0.44, 0.14, 0.44),
    new THREE.MeshLambertMaterial({ color: 0x0f0600 })
  );
  hairTop.position.y = 1.28;
  group.add(hairTop);

  [-0.23, 0.23].forEach(x => {
    const side = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.52, 0.12),
      new THREE.MeshLambertMaterial({ color: 0x0f0600 }));
    side.position.set(x, 0.94, 0.1);
    group.add(side);
  });

  const eyeMat = new THREE.MeshLambertMaterial({ color: 0x111111 });
  [-0.1, 0.1].forEach(x => {
    const eye = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.08, 0.04), eyeMat);
    eye.position.set(x, 1.1, 0.21);
    group.add(eye);
  });

  const smile = new THREE.Mesh(
    new THREE.BoxGeometry(0.14, 0.04, 0.04),
    new THREE.MeshLambertMaterial({ color: 0xaa2020 })
  );
  smile.position.set(0, 0.98, 0.21);
  group.add(smile);

  const bow = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.1, 0.08),
    new THREE.MeshLambertMaterial({ color: 0xff6b9d }));
  bow.position.set(0.22, 1.32, 0.1);
  group.add(bow);

  const armMat = new THREE.MeshLambertMaterial({ color: 0xc8845a });
  [-0.32, 0.32].forEach(x => {
    const arm = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.45, 0.14), armMat);
    arm.position.set(x, 0.6, 0);
    group.add(arm);
  });

  const shoeMat = new THREE.MeshLambertMaterial({ color: 0xff6b9d });
  [-0.12, 0.12].forEach(x => {
    const shoe = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.1, 0.24), shoeMat);
    shoe.position.set(x, -0.05, 0.03);
    group.add(shoe);
  });

  return group;
}

// ============================================
// CONFETTI
// ============================================
function launchConfetti(count) {
  const cols = [0xff6b9d, 0xffd4a0, 0xd4a0ff, 0xffb6c1, 0xffd700, 0xff8fab];
  for (let i = 0; i < count; i++) {
    const piece = new THREE.Mesh(
      new THREE.BoxGeometry(0.09, 0.09, 0.02),
      new THREE.MeshBasicMaterial({ color: cols[Math.floor(Math.random() * cols.length)] })
    );
    piece.position.set((Math.random()-0.5)*16, 5, (Math.random()-0.5)*16);
    piece.userData.velocity = {
      x: (Math.random()-0.5)*0.05,
      y: -(Math.random()*0.04+0.02),
      z: (Math.random()-0.5)*0.05
    };
    piece.userData.rotSpeed = { x: (Math.random()-0.5)*0.1, y: (Math.random()-0.5)*0.1 };
    scene.add(piece);
    confettiParticles.push(piece);
  }
}

function updateConfetti() {
  for (let i = confettiParticles.length - 1; i >= 0; i--) {
    const p = confettiParticles[i];
    p.position.x += p.userData.velocity.x;
    p.position.y += p.userData.velocity.y;
    p.position.z += p.userData.velocity.z;
    p.rotation.x += p.userData.rotSpeed.x;
    p.rotation.y += p.userData.rotSpeed.y;
    if (p.position.y < -1) {
      scene.remove(p);
      confettiParticles.splice(i, 1);
    }
  }
}

// ============================================
// CONTROLS
// ============================================
function setupControls() {
  document.addEventListener('keydown', (e) => {
    if (e.code === 'KeyW') moveForward = true;
    if (e.code === 'KeyS') moveBackward = true;
    if (e.code === 'KeyA') moveLeft = true;
    if (e.code === 'KeyD') moveRight = true;
    if (e.code === 'Space') { e.preventDefault(); doJump(); }
    if (e.code === 'KeyF') toggleSit();
    if (e.code === 'KeyE') handleInteract();
    if (e.code === 'Escape') { closePhoto(); closeVideoModal(); }
  });

  document.addEventListener('keyup', (e) => {
    if (e.code === 'KeyW') moveForward = false;
    if (e.code === 'KeyS') moveBackward = false;
    if (e.code === 'KeyA') moveLeft = false;
    if (e.code === 'KeyD') moveRight = false;
  });

  renderer.domElement.addEventListener('click', () => {
    const photoOpen = document.getElementById('photoModal').style.display === 'flex';
    const videoOpen = document.getElementById('videoModal').style.display === 'flex';
    if (!photoOpen && !videoOpen) renderer.domElement.requestPointerLock();
  });

  document.addEventListener('pointerlockchange', () => {
    isLocked = document.pointerLockElement === renderer.domElement;
  });

  document.addEventListener('mousemove', (e) => {
    if (!isLocked) return;
    yaw -= e.movementX * 0.002;
  });

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}

function doJump() {
  if (!isJumping && !isSitting) { isJumping = true; jumpVelocity = 0.12; }
}

function toggleSit() {
  const nearSofa = Math.abs(playerGroup.position.x) < 2.2 &&
    playerGroup.position.z > 0.5 && playerGroup.position.z < 3.5;
  if (!nearSofa) { showToast('Walk to the sofa to sit! 🛋️'); return; }
  isSitting = !isSitting;
  if (isSitting) {
    playerGroup.position.set(0, 0.62, 2.1);
    playerGroup.rotation.y = Math.PI;
    if (playerLegL) playerLegL.rotation.x = -Math.PI / 2.2;
    if (playerLegR) playerLegR.rotation.x = -Math.PI / 2.2;
    showToast('Sitting on the sofa 🛋️ Press F to stand');
  } else {
    if (playerLegL) playerLegL.rotation.x = 0;
    if (playerLegR) playerLegR.rotation.x = 0;
    showToast('');
  }
}

function showToast(msg) {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.style.cssText = `
      position:fixed; top:20px; left:50%; transform:translateX(-50%);
      background:rgba(10,0,20,0.92); border:1px solid #7a1a45;
      color:#ffb6c1; padding:8px 22px; border-radius:20px;
      font-family:sans-serif; font-size:13px; z-index:300;
      display:none; letter-spacing:0.5px;
      box-shadow:0 0 20px rgba(255,107,157,0.25);
    `;
    document.body.appendChild(toast);
  }
  if (!msg) { toast.style.display = 'none'; return; }
  toast.textContent = msg;
  toast.style.display = 'block';
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => { toast.style.display = 'none'; }, 3000);
}

// ============================================
// INTERACTION
// ============================================
function handleInteract() {
  if (!canInteract) return;
  if (nearObject === 'the Cinema Screen 🎬') openVideoModal();
  if (nearObject === 'the Birthday Cake 🎂') startMicBlowing();
  if (nearObject === 'the Memory Wall 🖼️') openPhotoModal(0);
  if (nearObject === 'the Music Player 🎵') toggleMusicUI();
  if (nearObject === 'the Dinner Table 🕯️') showToast('🕯️ A candlelight dinner for two 🌹 Just for you, Sonam 💕');
}

// ============================================
// MIC CANDLE BLOWING
// ============================================
function startMicBlowing() {
  if (candlesLeft === 0) { showToast('All candles blown! 🎂 Happy Birthday Sonam! 🌸'); return; }
  showToast('🎤 Blow into your mic to blow out a candle!');
  navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const analyser = audioCtx.createAnalyser();
    const source = audioCtx.createMediaStreamSource(stream);
    source.connect(analyser);
    analyser.fftSize = 256;
    const data = new Uint8Array(analyser.frequencyBinCount);
    micActive = true;

    const check = setInterval(() => {
      analyser.getByteFrequencyData(data);
      const avg = data.reduce((a, b) => a + b, 0) / data.length;
      if (avg > 28) {
        const idx = 3 - candlesLeft;
        if (flames[idx]) { scene.remove(flames[idx]); flameLights[idx].intensity = 0; }
        candlesLeft--;
        if (socket) socket.emit('blowCandle', { player: playerName, left: candlesLeft });
        if (candlesLeft === 0) {
          showToast('🎂 All candles blown! Happy Birthday Sonam!! 🌸');
          launchConfetti(160);
        } else {
          showToast(`💨 ${candlesLeft} candle${candlesLeft > 1 ? 's' : ''} left! Keep going!`);
        }
        clearInterval(check);
        stream.getTracks().forEach(t => t.stop());
        micActive = false;
      }
    }, 200);

    setTimeout(() => {
      clearInterval(check);
      stream.getTracks().forEach(t => t.stop());
      micActive = false;
      if (candlesLeft > 0) showToast('Try again! Blow harder 💨');
    }, 5000);

  }).catch(() => {
    const idx = 3 - candlesLeft;
    if (flames[idx]) { scene.remove(flames[idx]); flameLights[idx].intensity = 0; }
    candlesLeft--;
    if (socket) socket.emit('blowCandle', { player: playerName, left: candlesLeft });
    if (candlesLeft === 0) launchConfetti(160);
    showToast(candlesLeft === 0 ? '🎂 Happy Birthday Sonam!! 🌸' : `💨 ${candlesLeft} candles left!`);
  });
}

// ============================================
// CHAT UI
// ============================================
function buildChatUI() {
  const chat = document.createElement('div');
  chat.id = 'chatBox';
  chat.style.cssText = 'position:fixed;bottom:20px;left:20px;z-index:50;font-family:sans-serif;';
  chat.innerHTML = `
    <div id="chatMessages" style="
      background:rgba(8,0,18,0.88); border:1px solid #7a1a45;
      border-radius:10px 10px 0 0; padding:10px 12px;
      width:260px; height:130px; overflow-y:auto;
      font-size:12px; color:#ffb6c1; line-height:1.6;
    "></div>
    <div style="display:flex;">
      <input id="chatInput" type="text" maxlength="80" placeholder="Say something sweet 💕"
        style="flex:1;background:rgba(8,0,18,0.95);border:1px solid #7a1a45;border-top:none;border-right:none;border-radius:0 0 0 10px;color:#ffb6c1;padding:8px 10px;font-size:12px;outline:none;"/>
      <button onclick="sendChat()" style="background:#7a1a45;border:none;color:#fff;padding:8px 12px;border-radius:0 0 10px 0;cursor:pointer;font-size:13px;">➤</button>
    </div>`;
  document.body.appendChild(chat);
  document.getElementById('chatInput').addEventListener('keydown', (e) => {
    if (e.code === 'Enter') sendChat();
    e.stopPropagation();
  });
}

function sendChat() {
  const input = document.getElementById('chatInput');
  const msg = input.value.trim();
  if (!msg) return;
  input.value = '';
  if (socket) socket.emit('chat', { player: playerName, msg });
  addChatMessage(playerName, msg);
}

function addChatMessage(player, msg) {
  const box = document.getElementById('chatMessages');
  const line = document.createElement('div');
  const isMe = player === playerName;
  line.style.color = isMe ? '#ffd4a0' : '#d4a0ff';
  line.textContent = (isMe ? '💛 ' : '💜 ') + player + ': ' + msg;
  box.appendChild(line);
  box.scrollTop = box.scrollHeight;
}

// ============================================
// VIDEO MODAL
// ============================================
function buildVideoModal() {
  const modal = document.createElement('div');
  modal.id = 'videoModal';
  modal.style.cssText = `display:none;position:fixed;inset:0;background:rgba(0,0,0,0.93);z-index:200;align-items:center;justify-content:center;flex-direction:column;`;
  modal.innerHTML = `
    <div style="text-align:center;width:90vw;max-width:860px;">
      <div style="color:#ffb6c1;font-size:18px;margin-bottom:14px;font-family:sans-serif;">🎬 Cinema Screen</div>
      <div style="width:100%;padding-top:56.25%;position:relative;background:#06040e;border-radius:10px;border:2px solid #7a1a45;box-shadow:0 0 40px rgba(192,168,224,0.3);">
        <iframe id="ytFrame" src="" frameborder="0" allow="accelerometer;autoplay;clipboard-write;encrypted-media;gyroscope;picture-in-picture" allowfullscreen
          style="position:absolute;inset:0;width:100%;height:100%;border-radius:8px;"></iframe>
      </div>
      <div style="display:flex;gap:10px;justify-content:center;margin-top:16px;">
        <input id="ytInput" type="text" placeholder="Paste YouTube URL here..."
          style="background:rgba(8,0,18,0.95);border:1px solid #7a1a45;color:#ffb6c1;padding:9px 14px;border-radius:8px;font-size:13px;width:300px;outline:none;"/>
        <button onclick="loadVideo()" style="background:#7a1a45;border:none;color:#fff;padding:9px 18px;border-radius:8px;cursor:pointer;font-size:13px;">▶ Play</button>
        <button onclick="closeVideoModal()" style="background:#180820;border:1px solid #3a1040;color:#9b59b6;padding:9px 18px;border-radius:8px;cursor:pointer;font-size:13px;">✕ Close</button>
      </div>
    </div>`;
  document.body.appendChild(modal);
  document.getElementById('ytInput').addEventListener('keydown', e => {
    if (e.code === 'Enter') loadVideo();
    e.stopPropagation();
  });
}

function openVideoModal() {
  document.getElementById('videoModal').style.display = 'flex';
  if (document.pointerLockElement) document.exitPointerLock();
}

function closeVideoModal() {
  document.getElementById('videoModal').style.display = 'none';
  document.getElementById('ytFrame').src = '';
}

function getYouTubeID(url) {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?]+)/);
  return match ? match[1] : null;
}

function loadVideo() {
  const url = document.getElementById('ytInput').value.trim();
  const id = getYouTubeID(url);
  if (!id) { showToast('Paste a valid YouTube link! 🎬'); return; }
  document.getElementById('ytFrame').src = `https://www.youtube.com/embed/${id}?autoplay=1`;
  if (socket) socket.emit('videoPlay', { id });
}

// ============================================
// MUSIC UI
// ============================================
function buildMusicUI() {
  const ui = document.createElement('div');
  ui.id = 'musicUI';
  ui.style.cssText = `display:none;position:fixed;bottom:20px;right:20px;background:rgba(8,0,18,0.97);border:1px solid #7a1a45;border-radius:14px;padding:18px 22px;color:#ffb6c1;font-family:sans-serif;font-size:13px;min-width:230px;z-index:50;box-shadow:0 0 24px rgba(255,107,157,0.18);`;
  ui.innerHTML = `
    <div style="font-size:15px;font-weight:600;margin-bottom:8px;">🎵 Music Player</div>
    <div id="songName" style="color:#d4a0ff;margin-bottom:14px;">${songs[0].name}</div>
    <div style="display:flex;gap:8px;justify-content:center;margin-bottom:8px;">
      <button onclick="prevSong()" style="background:#3a1040;border:none;color:#ffb6c1;padding:7px 14px;border-radius:8px;cursor:pointer;">⏮</button>
      <button onclick="toggleSong()" id="playBtn" style="background:#7a1a45;border:none;color:#fff;padding:7px 18px;border-radius:8px;cursor:pointer;">▶ Play</button>
      <button onclick="nextSong()" style="background:#3a1040;border:none;color:#ffb6c1;padding:7px 14px;border-radius:8px;cursor:pointer;">⏭</button>
    </div>
    <div style="font-size:10px;color:#4a2040;text-align:center;">Walk to jukebox → press E</div>`;
  document.body.appendChild(ui);
}

function toggleMusicUI() {
  const ui = document.getElementById('musicUI');
  ui.style.display = ui.style.display === 'none' ? 'block' : 'none';
  if (document.pointerLockElement) document.exitPointerLock();
}

function toggleSong() {
  if (!audio) { audio = new Audio('music/' + songs[currentSong].file); audio.onended = nextSong; }
  if (songPlaying) { audio.pause(); songPlaying = false; document.getElementById('playBtn').textContent = '▶ Play'; }
  else { audio.play(); songPlaying = true; document.getElementById('playBtn').textContent = '⏸ Pause'; }
}

function nextSong() { currentSong = (currentSong+1)%songs.length; changeSong(); }
function prevSong() { currentSong = (currentSong-1+songs.length)%songs.length; changeSong(); }
function changeSong() {
  if (audio) { audio.pause(); audio = null; }
  songPlaying = false;
  document.getElementById('playBtn').textContent = '▶ Play';
  document.getElementById('songName').textContent = songs[currentSong].name;
  toggleSong();
}

// ============================================
// PHOTO MODAL
// ============================================
function buildPhotoModal() {
  const modal = document.createElement('div');
  modal.id = 'photoModal';
  modal.style.cssText = `display:none;position:fixed;inset:0;background:rgba(0,0,0,0.93);z-index:200;align-items:center;justify-content:center;flex-direction:column;`;
  modal.innerHTML = `
    <div style="text-align:center;max-width:85vw;">
      <img id="modalImg" src="" style="max-width:80vw;max-height:60vh;border-radius:10px;border:2px solid #7a1a45;box-shadow:0 0 40px rgba(255,107,157,0.35);"/>
      <div id="modalCaption" style="color:#ffb6c1;font-size:20px;margin-top:16px;font-family:sans-serif;text-shadow:0 0 10px rgba(255,182,193,0.5);"></div>
      <div style="display:flex;gap:12px;justify-content:center;margin-top:20px;">
        <button onclick="prevPhoto()" style="background:#3a1040;border:1px solid #7a1a45;color:#ffb6c1;padding:9px 22px;border-radius:8px;font-size:14px;cursor:pointer;">← Prev</button>
        <button onclick="closePhoto()" style="background:#180820;border:1px solid #3a1040;color:#9b59b6;padding:9px 22px;border-radius:8px;font-size:14px;cursor:pointer;">✕ Close</button>
        <button onclick="nextPhoto()" style="background:#3a1040;border:1px solid #7a1a45;color:#ffb6c1;padding:9px 22px;border-radius:8px;font-size:14px;cursor:pointer;">Next →</button>
      </div>
      <div style="color:#4a2040;font-size:11px;margin-top:10px;font-family:sans-serif;">${photos.length} memories 🖤</div>
    </div>`;
  document.body.appendChild(modal);
}

function openPhotoModal(i) { currentPhoto=i; showPhoto(); document.getElementById('photoModal').style.display='flex'; if(document.pointerLockElement)document.exitPointerLock(); }
function showPhoto() { document.getElementById('modalImg').src='photos/'+photos[currentPhoto].file; document.getElementById('modalCaption').textContent=photos[currentPhoto].caption; }
function nextPhoto() { currentPhoto=(currentPhoto+1)%photos.length; showPhoto(); }
function prevPhoto() { currentPhoto=(currentPhoto-1+photos.length)%photos.length; showPhoto(); }
function closePhoto() { document.getElementById('photoModal').style.display='none'; }

// ============================================
// HUD
// ============================================
function buildHUD() {
  const hud = document.getElementById('hud');
  const controls = hud ? hud.querySelector('.controls') : null;
  if (controls) controls.innerHTML = `W/S — Move<br>A/D — Turn<br>Space — Jump 🐇<br>F — Sit on sofa 🛋️<br>E — Interact<br>Esc — Close panels`;
}

// ============================================
// MULTIPLAYER
// ============================================
function connectMultiplayer() {
  socket = io();

  socket.on('players', (allPlayers) => {
    document.getElementById('onlineCount').textContent = Object.keys(allPlayers).length;
    Object.keys(allPlayers).forEach((id) => {
      if (id === socket.id) return;
      if (!otherPlayers[id]) { const mesh = createPlayerMesh(); scene.add(mesh); otherPlayers[id] = mesh; }
      const p = allPlayers[id];
      otherPlayers[id].position.set(p.x, p.y||0.5, p.z);
      otherPlayers[id].rotation.y = p.ry||0;
    });
    Object.keys(otherPlayers).forEach((id) => {
      if (!allPlayers[id]) { scene.remove(otherPlayers[id]); delete otherPlayers[id]; }
    });
  });

  socket.on('blowCandle', (data) => {
    showToast('💨 ' + data.player + ' blew a candle! 🎂');
    if (data.left === 0) launchConfetti(160);
  });

  socket.on('chat', (data) => addChatMessage(data.player, data.msg));

  socket.on('videoPlay', (data) => {
    document.getElementById('ytFrame').src = `https://www.youtube.com/embed/${data.id}?autoplay=1`;
    document.getElementById('videoModal').style.display = 'flex';
  });
}

// ============================================
// GAME LOOP
// ============================================
function animate() {
  requestAnimationFrame(animate);
  const delta = clock.getDelta();
  const t = Date.now() * 0.006;

  // Movement
  if (!isSitting) {
    const speed = 5;
    if (moveForward)  { playerGroup.position.x -= Math.sin(yaw)*speed*delta; playerGroup.position.z -= Math.cos(yaw)*speed*delta; }
    if (moveBackward) { playerGroup.position.x += Math.sin(yaw)*speed*delta; playerGroup.position.z += Math.cos(yaw)*speed*delta; }
    if (moveLeft)  yaw += 1.8*delta;
    if (moveRight) yaw -= 1.8*delta;
  }

  // Jump
  if (isJumping) {
    playerY += jumpVelocity;
    jumpVelocity -= 0.008;
    if (playerY <= 0.5) { playerY = 0.5; isJumping = false; jumpVelocity = 0; }
  }

  if (!isSitting) {
    playerGroup.position.x = Math.max(-8.5, Math.min(8.5, playerGroup.position.x));
    playerGroup.position.z = Math.max(-8.5, Math.min(8.5, playerGroup.position.z));
    playerGroup.position.y = playerY;
    playerGroup.rotation.y = yaw;
  }

  // Walk animation
  const isMoving = (moveForward || moveBackward) && !isSitting;
  if (playerLegL) playerLegL.rotation.x = isMoving ? Math.sin(t*6)*0.4 : 0;
  if (playerLegR) playerLegR.rotation.x = isMoving ? -Math.sin(t*6)*0.4 : 0;
  if (playerArmL) playerArmL.rotation.x = isMoving ? -Math.sin(t*6)*0.3 : 0;
  if (playerArmR) playerArmR.rotation.x = isMoving ? Math.sin(t*6)*0.3 : 0;

  // Birthday cake flame flicker
  flames.forEach((flame, i) => {
    if (flame.parent) {
      flame.position.y = 1.68 + Math.sin(t*8+i)*0.015;
      if (flameLights[i]) flameLights[i].intensity = 0.8 + Math.sin(t*7+i*1.3)*0.3;
    }
  });

  // Dinner candle flicker
  dinnerCandleFlames.forEach((flame, i) => {
    if (flame.parent) {
      flame.position.y = 1.25 + Math.sin(t*9+i+2)*0.012;
      if (dinnerCandleLights[i]) dinnerCandleLights[i].intensity = 1.0 + Math.sin(t*6+i*2)*0.35;
    }
  });

  // Fairy light twinkle — soft random flicker
  fairyBulbs.forEach((fb) => {
    fb.light.intensity = fb.baseIntensity * (0.7 + Math.sin(t*2.5 + fb.offset)*0.3);
  });

  updateConfetti();

  // 3rd person camera
  if (!isSitting) {
    camera.position.x = playerGroup.position.x + Math.sin(yaw)*3.5;
    camera.position.z = playerGroup.position.z + Math.cos(yaw)*3.5;
    camera.position.y = playerGroup.position.y + 2.5;
    camera.lookAt(playerGroup.position.x, playerGroup.position.y+1, playerGroup.position.z);
  }

  // Zone detection
  const zones = [window.screenZone, window.cakeZone, window.memoryZone, window.musicZone, window.dinnerZone];
  canInteract = false; nearObject = '';
  zones.forEach((zone) => {
    if (!zone) return;
    const dx = playerGroup.position.x - zone.x;
    const dz = playerGroup.position.z - zone.z;
    if (Math.sqrt(dx*dx + dz*dz) < zone.radius) { canInteract = true; nearObject = zone.label; }
  });

  const prompt = document.getElementById('prompt');
  if (canInteract) { prompt.style.display='block'; prompt.textContent='Press E — '+nearObject; }
  else { prompt.style.display='none'; }

  if (socket && socket.connected) {
    socket.emit('move', { x:playerGroup.position.x, y:playerGroup.position.y, z:playerGroup.position.z, ry:yaw, name:playerName });
  }

  renderer.render(scene, camera);
}
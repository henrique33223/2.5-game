const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
	
let colB = [{x: 100,y:100,w: 200,h: 50}];
const drawB = () => {
	colB.forEach((b) => {
		ctx.fillStyle = 'skyblue';
		ctx.fillRect(b.x,b.y,b.w,b.h);
	});
}


let player = { x: canvas.width / 2, y: canvas.height / 2, a: 0, s: 0 };

const calc = (x, y, s, a) => {
  let nextX = x + Math.cos((Math.PI / 180) * a) * s;
  let nextY = y + Math.sin((Math.PI / 180) * a) * s;
  return { nextX, nextY };
};

const drawPlayer = () => {
  ctx.fillStyle = 'skyblue';
  ctx.strokeStyle = 'white';
  ctx.lineWidth = 1;

  ctx.save();
  ctx.translate(player.x, player.y);
  ctx.rotate((Math.PI / 180) * player.a);
  ctx.fillRect(-10, -10, 20, 20);
  ctx.restore();
};

document.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowUp') player.s += 2.5;
  if (event.key === 'ArrowDown') player.s -= 2.5;
  if (event.key === 'ArrowLeft') player.a -= 5;
  if (event.key === 'ArrowRight') player.a += 5;
});

const check = (x1, y1, x2, y2, w, h) => {
  return x1 > x2 && x1 < x2 + w && y1 > y2 && y1 < y2 + h;
};
const dist = (x1,x2,y1,y2) => {
	return Math.sqrt(((x2 - x1) ** 2) + ((y2 - y1) ** 2));
}
let rays = [];
let dists = [];
const updRays = () => {
  rays.forEach((r) => {
    let startX = r.x;
    let startY = r.y;
    let hit = false;

    
    while (!hit) {
      let nX = r.x + Math.cos((Math.PI / 180) * r.a) * 3;
      let nY = r.y + Math.sin((Math.PI / 180) * r.a) * 3;

    
      if (check(nX, nY, colB[0].x, colB[0].y, colB[0].w, colB[0].h)) {
        hit = true; 
        dists.push(dist(startX, r.x, startY, r.y));
      
      } else {
        r.x = nX;
        r.y = nY;
      }

    
      if (nX < 0 || nX > canvas.width || nY < 0 || nY > canvas.height) {
        hit = true;
		dists.push(dist(startX,r.x,startY,r.y));
      }
    }
	
  });
};

const drawRays = () => {
	for(let i = -20;i < 20;i++){
		let sideX = player.x + Math.cos((Math.PI / 180) * (player.a - 90)) * -i;
		let sideY = player.y + Math.sin((Math.PI / 180) * (player.a - 90)) * -i;
		
		rays.push({x: sideX,y: sideY,a: player.a});
	}
	
};


const updP = () => {
  player.x += Math.cos((Math.PI / 180) * player.a) * player.s;
  player.y += Math.sin((Math.PI / 180) * player.a) * player.s;

  player.x = Math.max(0, Math.min(canvas.width, player.x));
  player.y = Math.max(0, Math.min(canvas.height, player.y));
};
const create25 = () => {
	for(let i = 0;i < dists.length;i++){
		ctx.fillStyle = 'white';
		let size = canvas.width / dists.length;
		ctx.fillRect(size * i - 1,dists[i] / 2,size + 2,canvas.height - dists[i]);
	}
}
const loop = () => {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
	
	updP();
	
	
    player.s *= 0.8;
	rays = [];
	dists = [];
	drawRays();
	updRays();
	create25();
	drawPlayer();
		requestAnimationFrame(loop);
	
};
 
loop();

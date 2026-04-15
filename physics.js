const canvas=document.getElementById("c");
const ctx=canvas.getContext("2d");

function resize(){
 canvas.width=innerWidth;
 canvas.height=innerHeight;
}
onresize=resize;
resize();

function Ball(id,x,y,dx,dy,r){
 return {id,x,y,dx,dy,r};
}

function createWorld(n){
 const balls=[];
 for(let i=0;i<n;i++){
  balls.push(
   Ball(
    i,
    Math.random()*0.8+0.1,
    Math.random()*0.8+0.1,
    Math.random()*0.8-0.4,
    Math.random()*0.8-0.4,
    0.02
   )
  );
 }
 return {time:0,balls};
}

function moveBall(b,dt){
 return {...b,x:b.x+b.dx*dt,y:b.y+b.dy*dt};
}

function wall(b){
 let {x,y,dx,dy,r}=b;
 if(x<r){x=r;dx=-dx;}
 if(x>1-r){x=1-r;dx=-dx;}
 if(y<r){y=r;dy=-dy;}
 if(y>1-r){y=1-r;dy=-dy;}
 return {...b,x,y,dx,dy};
}

function collide(a,b){
 const dx=b.x-a.x;
 const dy=b.y-a.y;
 const dist=Math.hypot(dx,dy);

 if(dist>=a.r+b.r||dist<1e-6)
  return[a,b];

 const nx=dx/dist;
 const ny=dy/dist;
 const overlap=a.r+b.r-dist;

 const a2={...a,dx:-a.dx,dy:-a.dy,
  x:a.x-nx*overlap*0.5,
  y:a.y-ny*overlap*0.5};

 const b2={...b,dx:-b.dx,dy:-b.dy,
  x:b.x+nx*overlap*0.5,
  y:b.y+ny*overlap*0.5};

 return[a2,b2];
}

function physics(world,dt){
 let balls=world.balls.map(b=>wall(moveBall(b,dt)));

 for(let i=0;i<balls.length;i++){
  for(let j=i+1;j<balls.length;j++){
   [balls[i],balls[j]]=collide(balls[i],balls[j]);
  }
 }

 return{time:world.time+dt,balls};
}

function draw(world){
 ctx.clearRect(0,0,canvas.width,canvas.height);

 world.balls.forEach(b=>{
  ctx.beginPath();
  ctx.arc(
   b.x*canvas.width,
   b.y*canvas.height,
   b.r*Math.min(canvas.width,canvas.height),
   0,Math.PI*2
  );
  ctx.fillStyle="white";
  ctx.fill();
 });
}

let world=createWorld(30);

function tick(){
 world=physics(world,0.016);
 draw(world);
 requestAnimationFrame(tick);
}

tick();

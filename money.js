import * as THREE from './assets/three.module.js';
const host=document.querySelector('#money-canvas'),reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
let renderer;
try{renderer=new THREE.WebGLRenderer({alpha:true,antialias:true,powerPreference:'low-power'});}catch{}
if(renderer){
 renderer.setPixelRatio(Math.min(devicePixelRatio,1.6));renderer.setClearColor(0x10120f,0);renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.25;renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;host.appendChild(renderer.domElement);host.classList.add('ready');
 const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(34,1,.1,70);camera.position.set(6,5.5,8);camera.lookAt(0,.1,0);
 scene.add(new THREE.HemisphereLight(0xe8f4dc,0x142016,2.7));const key=new THREE.DirectionalLight(0xffffff,4);key.position.set(-3,7,5);key.castShadow=true;key.shadow.mapSize.set(1024,1024);key.shadow.camera.left=-5;key.shadow.camera.right=5;key.shadow.camera.top=5;key.shadow.camera.bottom=-5;scene.add(key);const rim=new THREE.DirectionalLight(0xd7f34a,2.8);rim.position.set(4,5,-4);scene.add(rim);
 const steel=new THREE.MeshStandardMaterial({color:0x7a8379,metalness:.7,roughness:.35}),red=new THREE.MeshStandardMaterial({color:0x9a171c,metalness:.4,roughness:.4}),dark=new THREE.MeshStandardMaterial({color:0x242e22,metalness:.35,roughness:.6});
 const group=new THREE.Group();scene.add(group);
 function box(w,h,d,x,y,z,material,parent=group){const mesh=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),material);mesh.position.set(x,y,z);mesh.castShadow=true;mesh.receiveShadow=true;parent.add(mesh);return mesh;}
 box(5.9,.16,3.3,0,-.55,0,steel);box(5.98,.08,3.37,0,-.48,0,dark);
 for(const x of [-2.65,2.65])for(const z of [-1.35,1.35])box(.13,2,.13,x,-1.6,z,red);
 for(const z of [-1.35,1.35]){box(5.45,.1,.1,0,-1.05,z,red);box(5.45,.08,.08,0,-2.4,z,red);}for(const x of [-2.65,2.65])box(.08,.08,2.7,x,-2.4,0,red);
 // Bills are deliberately abstract teaching props, not reproductions of a banknote.
 function billTexture(color){const c=document.createElement('canvas');c.width=256;c.height=128;const ctx=c.getContext('2d');ctx.fillStyle=color;ctx.fillRect(0,0,256,128);ctx.strokeStyle='#233d2d88';ctx.lineWidth=2;ctx.strokeRect(9,8,238,112);ctx.strokeRect(14,13,228,102);ctx.beginPath();ctx.ellipse(128,64,39,45,0,0,Math.PI*2);ctx.stroke();ctx.fillStyle='#1f3a2b66';ctx.font='bold 22px monospace';ctx.textAlign='center';ctx.fillText('COP',128,72);for(let x=24;x<240;x+=14){ctx.beginPath();ctx.moveTo(x,20);ctx.lineTo(x+8,28);ctx.moveTo(x,108);ctx.lineTo(x+8,100);ctx.stroke();}const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;return t;}
 const paperEdge=new THREE.MeshStandardMaterial({color:0xc7ccb4,roughness:.9}),band=new THREE.MeshStandardMaterial({color:0xdde7b5,roughness:.85}),billTop=new THREE.MeshStandardMaterial({map:billTexture('#9aa876'),roughness:.85}),billAlt=new THREE.MeshStandardMaterial({map:billTexture('#adc2aa'),roughness:.85});
 const stacks=[];
 const piles=[{x:-1.85,count:15,material:billTop},{x:0,count:2,material:billAlt},{x:1.85,count:7,material:billTop}];
 piles.forEach((p,pi)=>{const pile=new THREE.Group();pile.position.set(p.x,-.4,0);group.add(pile);stacks.push(pile);for(let j=0;j<p.count;j++){const bundle=new THREE.Group();bundle.position.set((j%2)*.06,j*.075,Math.sin(j*1.9)*.04);bundle.rotation.y=Math.sin(j*2.3)*.045;pile.add(bundle);const material=[paperEdge,paperEdge,p.material,paperEdge,paperEdge,paperEdge];box(1.32,.065,.68,0,.032,0,material,bundle);box(.26,.075,.685,0,.037,0,band,bundle);for(let line=0;line<3;line++)box(1.3,.002,.003,0,.018+line*.012,.342,paperEdge,bundle);}
 const tag=box(1.45,.025,.42,p.x,-.405,1.03,dark);tag.rotation.x=.04;
 });
 const floor=new THREE.Mesh(new THREE.PlaneGeometry(30,30),new THREE.ShadowMaterial({opacity:.28}));floor.rotation.x=-Math.PI/2;floor.position.y=-2.53;floor.receiveShadow=true;scene.add(floor);const grid=new THREE.GridHelper(13,26,0x526a32,0x273c23);grid.position.y=-2.52;grid.material.transparent=true;grid.material.opacity=.15;scene.add(grid);
 let active=Number(document.body.dataset.tourIndex)===8,paused=false,start=performance.now(),pauseAt=0,progress=0,last=0;
 window.addEventListener('tour-station',e=>{active=e.detail.index===8;if(active){start=performance.now();progress=0;}});
 window.addEventListener('tour-pause',e=>{paused=e.detail.paused;if(paused)pauseAt=performance.now();else start+=performance.now()-pauseAt;});
 function resize(){const w=host.clientWidth,h=host.clientHeight;if(!w||!h)return;renderer.setSize(w,h,false);camera.aspect=w/h;camera.position.set(innerWidth<701?6.8:6,innerWidth<701?6.5:5.5,innerWidth<701?10.2:8);camera.lookAt(0,-.5,0);camera.updateProjectionMatrix();}new ResizeObserver(resize).observe(host);resize();
 function render(time){requestAnimationFrame(render);if(document.hidden||!active||time-last<32)return;last=time;if(!paused)progress=reduced?1:Math.min(1,(time-start)/2200);stacks.forEach((p,i)=>{const t=reduced?1:THREE.MathUtils.clamp((progress-i*.15)/.7,0,1);p.scale.y=.02+.98*(1-Math.pow(1-t,3));p.position.y=-.4+(1-t)*.4;});group.rotation.y=reduced?-.08:-.08+Math.sin(Math.min(progress,1)*Math.PI)*.1;camera.position.x=THREE.MathUtils.lerp(camera.position.x,innerWidth<701?6.2:5.2,.035);camera.lookAt(0,-.55,0);renderer.render(scene,camera);}
 requestAnimationFrame(render);renderer.render(scene,camera);window.__money={get ready(){return true},get progress(){return progress},get proportions(){return [15,2,7]}};
}

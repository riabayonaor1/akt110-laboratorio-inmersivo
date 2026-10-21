import * as THREE from './assets/three.module.js';
const host=document.querySelector('#engine-canvas');
const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let renderer;
try{renderer=new THREE.WebGLRenderer({alpha:true,antialias:true,powerPreference:'low-power'});}catch(e){document.querySelector('#view-hint').textContent='FOTOGRAFÍA DEL BANCO REAL';document.querySelector('#explode-view').disabled=true;document.querySelector('#reset-view').disabled=true;}
if(renderer){
renderer.setPixelRatio(Math.min(window.devicePixelRatio,1.8));renderer.setClearColor(0x10120f,0);renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.25;renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;host.appendChild(renderer.domElement);
const scene=new THREE.Scene(), camera=new THREE.PerspectiveCamera(36,1,.1,100);camera.position.set(5.6,3.2,7.4);camera.lookAt(0,-.2,0);
const studio=document.createElement('canvas');studio.width=1024;studio.height=512;const ctx=studio.getContext('2d');let grad=ctx.createLinearGradient(0,0,0,512);grad.addColorStop(0,'#c9d7c6');grad.addColorStop(.5,'#555d50');grad.addColorStop(1,'#171e11');ctx.fillStyle=grad;ctx.fillRect(0,0,1024,512);ctx.fillStyle='#ffffff';ctx.fillRect(80,45,110,300);ctx.fillRect(610,90,75,230);ctx.fillStyle='#d3dfb2';ctx.fillRect(800,50,180,130);const env=new THREE.CanvasTexture(studio);env.mapping=THREE.EquirectangularReflectionMapping;env.colorSpace=THREE.SRGBColorSpace;const pmrem=new THREE.PMREMGenerator(renderer);scene.environment=pmrem.fromEquirectangular(env).texture;pmrem.dispose();env.dispose();
scene.add(new THREE.HemisphereLight(0xe8f4dc,0x252e1e,2.0));const light=new THREE.DirectionalLight(0xffffff,4);light.position.set(-3,6,4);light.castShadow=true;light.shadow.mapSize.set(1024,1024);light.shadow.camera.left=-5;light.shadow.camera.right=5;light.shadow.camera.top=5;light.shadow.camera.bottom=-5;light.shadow.normalBias=.025;scene.add(light);const rim=new THREE.DirectionalLight(0xe4f5ad,2.8);rim.position.set(4,2,-5);scene.add(rim);const fill=new THREE.DirectionalLight(0xadd9ff,1.1);fill.position.set(-5,1,-2);scene.add(fill);
const assembly=new THREE.Group();scene.add(assembly);assembly.position.y=.3;
const silver=new THREE.MeshStandardMaterial({color:0x9da39e,metalness:.88,roughness:.29});const lightSilver=new THREE.MeshStandardMaterial({color:0xbec5bf,metalness:.88,roughness:.24});const darkSilver=new THREE.MeshStandardMaterial({color:0x5f685f,metalness:.85,roughness:.35});const steel=new THREE.MeshStandardMaterial({color:0x787e75,metalness:1,roughness:.2});const black=new THREE.MeshStandardMaterial({color:0x161b16,metalness:.4,roughness:.45});const rubber=new THREE.MeshStandardMaterial({color:0x141813,roughness:.72});const red=new THREE.MeshStandardMaterial({color:0x9a171c,metalness:.42,roughness:.34});const copper=new THREE.MeshStandardMaterial({color:0xb46d2f,metalness:.8,roughness:.28});const green=new THREE.MeshStandardMaterial({color:0xd7f34a,metalness:.25,roughness:.3});
function mesh(g,m,parent=assembly,pos=[0,0,0]){const o=new THREE.Mesh(g,m);o.position.set(...pos);o.castShadow=true;o.receiveShadow=true;parent.add(o);return o}
function box(w,h,d,pos,m=silver,p=assembly){return mesh(new THREE.BoxGeometry(w,h,d),m,p,pos)}
function cyl(r,h,pos,m=silver,p=assembly,axis='z',r2=r,n=48){const o=mesh(new THREE.CylinderGeometry(r2,r,h,n,1),m,p,pos);if(axis==='z')o.rotation.x=Math.PI/2;if(axis==='x')o.rotation.z=Math.PI/2;return o}
function torus(r,t,pos,m=steel,p=assembly){return mesh(new THREE.TorusGeometry(r,t,12,64),m,p,pos)}
function rounded(w,h,r){const s=new THREE.Shape();s.moveTo(-w/2+r,-h/2);s.lineTo(w/2-r,-h/2);s.quadraticCurveTo(w/2,-h/2,w/2,-h/2+r);s.lineTo(w/2,h/2-r);s.quadraticCurveTo(w/2,h/2,w/2-r,h/2);s.lineTo(-w/2+r,h/2);s.quadraticCurveTo(-w/2,h/2,-w/2,h/2-r);s.lineTo(-w/2,-h/2+r);s.quadraticCurveTo(-w/2,-h/2,-w/2+r,-h/2);return s;}
function plate(shape,depth,pos,m=silver,p=assembly,bevel=.04){return mesh(new THREE.ExtrudeGeometry(shape,{depth,bevelEnabled:true,bevelSegments:3,steps:1,bevelSize:bevel,bevelThickness:bevel,curveSegments:32}),m,p,pos)}
function wire(points,color,r=.025,p=assembly){const path=new THREE.CatmullRomCurve3(points.map(p=>new THREE.Vector3(...p)));const material=new THREE.MeshStandardMaterial({color,roughness:.5,metalness:.1});return mesh(new THREE.TubeGeometry(path,48,r,8,false),material,p);}
function bolt(x,y,z,p=assembly,r=.052){const b=cyl(r,.055,[x,y,z],steel,p,'z',r,6);cyl(r*.42,.058,[x,y,z+.008],black,p);return b}
const engine=new THREE.Group();assembly.add(engine);
// Cast crankcase silhouette, with separate side cover and fasteners.
const caseShape=new THREE.Shape();caseShape.moveTo(-.78,-.43);caseShape.bezierCurveTo(-.96,-.12,-.88,.45,-.5,.65);caseShape.bezierCurveTo(-.05,.83,.55,.71,.91,.57);caseShape.lineTo(1.18,.58);caseShape.quadraticCurveTo(1.5,.55,1.51,.22);caseShape.lineTo(1.46,-.55);caseShape.quadraticCurveTo(1.42,-.82,.98,-.83);caseShape.lineTo(-.22,-.82);caseShape.quadraticCurveTo(-.64,-.8,-.78,-.43);
plate(caseShape,.69,[0,0,-.35],silver,engine,.07);plate(caseShape,.045,[0,0,.365],darkSilver,engine,.035);
const cover=new THREE.Group();engine.add(cover);plate(caseShape,.1,[0,0,.41],lightSilver,cover,.055);
cyl(.62,.10,[-.13,-.03,.62],silver,cover);cyl(.56,.06,[-.13,-.03,.69],lightSilver,cover);torus(.55,.012,[-.13,-.03,.73],darkSilver,cover);cyl(.105,.025,[-.13,.04,.745],darkSilver,cover);box(.13,.014,.012,[-.13,.04,.766],black,cover);
for(let i=0;i<9;i++){let a=i/9*Math.PI*2;bolt(-.13+Math.cos(a)*.645,-.03+Math.sin(a)*.645,.61,cover,.038);}
[[-.68,-.43],[-.64,.47],[-.18,.64],[.5,.60],[1.16,.50],[1.38,.15],[1.35,-.52],[.9,-.72],[.27,-.73]].forEach(([x,y])=>bolt(x,y,.565,cover));
// Raised ribs follow the casting on the transmission half.
for(let i=0;i<4;i++){const x=.63+i*.22;box(.018,.72,.032,[x,-.07,.59],silver,cover)}
box(.73,.024,.035,[.95,.27,.59],silver,cover);box(.65,.022,.035,[.95,-.44,.59],silver,cover);
for(let i=0;i<7;i++)box(1.45,.018,.12,[.28,-.78-i*.035,.04],darkSilver,engine);
cyl(.26,.15,[1.35,-.1,-.46],steel,engine);cyl(.16,.23,[1.35,-.1,-.56],black,engine);for(let i=0;i<12;i++){const a=i*Math.PI/6;const t=box(.085,.07,.06,[1.35+Math.cos(a)*.25,-.1+Math.sin(a)*.25,-.51],steel,engine);t.rotation.z=a;}
// Approximate flywheel and copper stator, revealed by the exploded cover.
cyl(.48,.18,[-.12,-.04,.37],darkSilver,engine);torus(.37,.07,[-.12,-.04,.49],copper,engine);for(let i=0;i<12;i++){const a=i*Math.PI/6;const winding=box(.15,.10,.15,[-.12+Math.cos(a)*.37,-.04+Math.sin(a)*.37,.47],copper,engine);winding.rotation.z=a;}
cyl(.1,.27,[-.12,-.04,.44],steel,engine);
// Horizontal, finned cylinder and OHC head. The axis rises slightly toward the head.
const cylinder=new THREE.Group();cylinder.position.set(-.68,.38,0);cylinder.rotation.z=-.15;engine.add(cylinder);cyl(.40,1.12,[-.54,0,0],black,cylinder,'x');
for(let i=0;i<12;i++){const fin=plate(rounded(.88,.86,.11),.018,[0,0,0],i%3===0?darkSilver:black,cylinder,.012);fin.rotation.y=Math.PI/2;fin.position.x=-.08-i*.086;}
for(const y of [-.28,.28])for(const z of [-.28,.28])cyl(.027,1.55,[-.6,y,z],steel,cylinder,'x');
const head=new THREE.Group();head.position.x=-1.2;cylinder.add(head);const headBody=plate(rounded(.88,.88,.17),.42,[0,0,-.21],silver,head,.055);headBody.rotation.y=Math.PI/2;
for(let i=0;i<7;i++){const fin=plate(rounded(1.04,.96,.12),.02,[0,0,0],lightSilver,head,.012);fin.rotation.y=Math.PI/2;fin.position.x=-.2+i*.07;}
const headCap=plate(rounded(.86,.92,.18),.09,[-.28,0,0],lightSilver,head,.045);headCap.rotation.y=-Math.PI/2;
cyl(.32,.09,[0,.02,.50],silver,head);torus(.29,.014,[0,.02,.555],darkSilver,head);
for(let i=0;i<5;i++)box(.40,.025,.022,[0,-.14+i*.085,.57],darkSilver,head);[[-.27,.31],[.27,.31],[-.27,-.27],[.27,-.27]].forEach(([x,y])=>bolt(x,y,.52,head,.04));
// Spark plug, ceramic insulator and cap.
const plug=new THREE.Group();plug.position.set(-.17,.49,.14);plug.rotation.z=.18;head.add(plug);cyl(.073,.15,[0,0,0],steel,plug,'y',.073,6);cyl(.055,.19,[0,.14,0],new THREE.MeshStandardMaterial({color:0xdce2d4,roughness:.35}),plug,'y');for(let i=0;i<4;i++)cyl(.062,.015,[0,.08+i*.033,0],lightSilver,plug,'y');cyl(.076,.2,[0,.30,0],black,plug,'y');
// Top-mounted starter motor and intake carburettor.
const starter=new THREE.Group();starter.position.set(.35,.79,-.02);engine.add(starter);cyl(.235,.87,[0,0,0],black,starter,'x');cyl(.24,.08,[-.44,0,0],silver,starter,'x');cyl(.21,.10,[.46,0,0],silver,starter,'x');box(.65,.06,.35,[0,-.22,0],silver,starter);bolt(-.22,-.22,.2,starter);bolt(.22,-.22,.2,starter);cyl(.035,.08,[.28,.2,.12],copper,starter,'y');
wire([[-1.82,.92,-.05],[-1.81,1.25,-.05],[-1.36,1.34,-.05],[-1.16,1.52,-.05]],0x909b91,.105,engine);
const carb=new THREE.Group();carb.position.set(-1.17,1.48,-.06);engine.add(carb);cyl(.18,.38,[0,0,0],silver,carb,'y');cyl(.16,.13,[0,.22,0],darkSilver,carb,'y');cyl(.22,.20,[0,-.24,0],silver,carb,'y',.16);cyl(.16,.4,[.18,.03,0],black,carb,'x');cyl(.17,.04,[.38,.03,0],steel,carb,'x');box(.1,.25,.07,[-.16,.01,.19],darkSilver,carb);bolt(0,-.22,.17,carb,.035);wire([[-1.17,1.74,-.06],[-1.12,2,-.1],[-.5,1.98,-.2]],0x111611,.018,engine);
wire([[-2.1,-.03,-.18],[-2.23,-.42,-.2],[-1.82,-.75,-.30],[-.70,-.85,-.45],[1.3,-.83,-.48]],0x494f44,.095,engine);
// Ignition cable and mounting lugs.
wire([[-2.0,1.23,.15],[-1.75,1.57,.35],[-.85,1.35,.42],[.52,.56,-.15]],0x10160e,.035,engine);
for(const x of [-.25,1.1]){cyl(.13,.18,[x,.72,-.1],silver,engine);cyl(.055,.2,[x,.72,-.1],black,engine)}
cyl(.12,.13,[1.13,.61,.24],black,engine,'y');cyl(.08,.05,[1.13,.70,.24],silver,engine,'y');
// Red welded test stand, matching the construction documented in the photos.
const stand=new THREE.Group();assembly.add(stand);const sy=-1.05;for(const z of [-.57,.57]){box(3,.10,.10,[.0,sy,z],red,stand);for(const x of [-1.42,1.42])box(.10,1.25,.10,[x,sy-.62,z],red,stand);box(2.94,.07,.07,[0,sy-1.16,z],red,stand)}for(const x of [-1.42,1.42]){box(.10,.10,1.24,[x,sy,0],red,stand);box(.07,.07,1.14,[x,sy-1.16,0],red,stand)}
for(const x of [-.4,.98]){box(.12,.38,.12,[x,-.85,.37],red,stand);bolt(x,-.65,.45,stand,.06);box(.12,.38,.12,[x,-.85,-.33],red,stand)}
const battery=new THREE.Group();battery.position.set(1.62,-.80,-.05);stand.add(battery);box(.57,.53,.39,[0,0,0],black,battery);box(.61,.06,.43,[0,.29,0],rubber,battery);cyl(.04,.07,[-.17,.35,0],copper,battery,'y');cyl(.04,.07,[.17,.35,0],steel,battery,'y');box(.3,.22,.006,[0,0,.20],darkSilver,battery);
wire([[1.45,-.43,0],[1.64,-.18,.65],[1.31,.56,.70],[.65,1.0,.10]],0xb72524,.027,assembly);wire([[1.79,-.43,0],[1.87,-.88,.5],[.95,-1.12,.55],[.14,-.55,.52]],0x171d14,.03,assembly);
const coil=box(.26,.38,.23,[1.1,-1.38,.55],black,stand);for(let i=0;i<5;i++)box(.31,.025,.25,[1.1,-1.53+i*.07,.55],darkSilver,stand);wire([[1.14,-1.36,.64],[.56,-1.5,.73],[-.26,-.9,.73],[-.72,-.51,.65]],0xc9b339,.016,assembly);wire([[1.07,-1.36,.65],[.37,-1.61,.7],[-.46,-.96,.7],[-.69,-.46,.63]],0x3d8160,.016,assembly);
// Soft floor shadow and a quiet technical grid.
const shadow=mesh(new THREE.PlaneGeometry(30,30),new THREE.ShadowMaterial({opacity:.22}),scene,[0,-2.05,0]);shadow.rotation.x=-Math.PI/2;shadow.castShadow=false;
const grid=new THREE.GridHelper(12,24,0x59663a,0x333b2b);grid.position.y=-2.04;grid.material.transparent=true;grid.material.opacity=.20;scene.add(grid);
const ring=mesh(new THREE.RingGeometry(2.7,2.706,128),new THREE.MeshBasicMaterial({color:0xa8c56b,transparent:true,opacity:.18,side:THREE.DoubleSide}),scene,[0,-2.03,0]);ring.rotation.x=-Math.PI/2;
const accentLight=new THREE.PointLight(0xd7f34a,0,2.5);accentLight.position.set(-2,1.2,.5);assembly.add(accentLight);

const chargeTarget=new THREE.Object3D();chargeTarget.position.set(-.12,-.04,.45);engine.add(chargeTarget);
const sparkMarker=mesh(new THREE.SphereGeometry(.047,14,10),new THREE.MeshBasicMaterial({color:0xeaff91}),plug,[0,.42,0]);
const focusLight=new THREE.PointLight(0xe6ff8a,0,3);scene.add(focusLight);
const focusBox=new THREE.Box3Helper(new THREE.Box3(),0xd7f34a);focusBox.material.transparent=true;focusBox.material.opacity=.4;focusBox.material.depthTest=false;focusBox.renderOrder=100;scene.add(focusBox);
const coverMaterials=[];cover.traverse(o=>{if(o.isMesh){o.material=o.material.clone();o.material.transparent=true;coverMaterials.push(o.material);}});
let beat=0,targetAngle=-.35,angle=-.35,userAngle=0,pitch=.03,targetExplode=0,explode=0,dragging=false,lastX=0,lastY=0,visible=true,running=false,starting=false,scrollPart=0,chargeReveal=0;
const cameraLook=new THREE.Vector3(0,-.2,0),desiredLook=new THREE.Vector3(),worldFocus=new THREE.Vector3(),cameraGoal=new THREE.Vector3();
const labels=[['Motor horizontal · 4 tiempos','Tres funciones que se complementan'],['Motor de arranque','Convierte electricidad en el primer giro'],['Bujía y encendido','La chispa inicia la combustión'],['Rotor, estator y carga','El giro genera electricidad']];
const captions=[['VISTA GENERAL','Un banco para ver, comprender y comprobar.'],['01 / MOVIMIENTO INICIAL','El acercamiento muestra el motor de arranque sobre el cárter.'],['02 / CHISPA SINCRONIZADA','La bujía está en la culata: allí comienza la combustión.'],['03 / RECUPERAR ENERGÍA','La tapa se separa para mostrar el conjunto generador de forma conceptual.']];
function resize(){const r={width:host.clientWidth,height:host.clientHeight};if(r.width<1||r.height<1)return;renderer.setSize(r.width,r.height,false);camera.aspect=r.width/r.height;camera.updateProjectionMatrix();}
new ResizeObserver(resize).observe(host);document.fonts.ready.then(resize);resize();
function syncTour(e){visible=e.detail.index<4;if(!visible)return;beat=e.detail.index;scrollPart=.5;targetAngle=[-.35,-.65,.35,-.20][beat];const l=labels[beat];document.querySelector('#part-title').textContent=l[0];document.querySelector('#part-sub').textContent=l[1];document.querySelector('#stage-index').textContent=['VISTA GENERAL / 00','FOCO: ARRANQUE / 01','FOCO: ENCENDIDO / 02','FOCO: CARGA / 03'][beat];document.querySelector('.engine-stage').dataset.focus=String(beat);}
window.addEventListener('tour-station',syncTour);syncTour({detail:{index:Number(document.body.dataset.tourIndex)||0}});
host.addEventListener('pointerdown',e=>{dragging=true;lastX=e.clientX;lastY=e.clientY;if(e.pointerType==='mouse')host.setPointerCapture(e.pointerId)});host.addEventListener('pointermove',e=>{if(!dragging)return;const dx=e.clientX-lastX,dy=e.clientY-lastY;if(e.pointerType==='touch'&&Math.abs(dy)>Math.abs(dx)*1.5){dragging=false;return}userAngle+=dx*.009;pitch=THREE.MathUtils.clamp(pitch+dy*.002,-.2,.3);lastX=e.clientX;lastY=e.clientY;});['pointerup','pointercancel','lostpointercapture'].forEach(evt=>host.addEventListener(evt,()=>dragging=false));
document.querySelector('#reset-view').addEventListener('click',()=>{userAngle=0;pitch=.03;targetExplode=0;document.querySelector('#explode-view').setAttribute('aria-pressed','false')});
document.querySelector('#explode-view').addEventListener('click',e=>{targetExplode=targetExplode?0:1;e.currentTarget.setAttribute('aria-pressed',String(!!targetExplode));document.querySelector('#part-title').textContent=targetExplode?'Despiece conceptual':labels[beat][0];document.querySelector('#part-sub').textContent=targetExplode?'Separación ilustrativa · no es una guía de montaje':labels[beat][1]});
window.addEventListener('lab-state',e=>{running=e.detail.running;starting=e.detail.starting;});
new IntersectionObserver(entries=>{visible=entries[0].isIntersecting},{rootMargin:'100px'}).observe(document.querySelector('.engine-stage'));
const highlightBox=new THREE.Box3(),projected=new THREE.Vector3();
let lastRender=0;
function frame(time){requestAnimationFrame(frame);if(!visible||document.hidden||time-lastRender<30)return;lastRender=time;const k=reduced?1:.06;angle=THREE.MathUtils.lerp(angle,targetAngle+userAngle,k);explode=THREE.MathUtils.lerp(explode,targetExplode,k);chargeReveal=THREE.MathUtils.lerp(chargeReveal,beat===3?1:0,k);assembly.rotation.y=angle;assembly.rotation.x=pitch;assembly.position.y=.3;head.position.x=-1.2-explode*.62;cover.position.z=Math.max(explode*.85,chargeReveal*.95);starter.position.y=.79+explode*.4;carb.position.y=1.48+explode*.35;cylinder.position.x=-.68-explode*.12;coverMaterials.forEach(m=>m.opacity=1-chargeReveal*.75);assembly.updateMatrixWorld(true);
const focusObject=beat===1?starter:beat===2?plug:chargeTarget;focusObject.getWorldPosition(worldFocus);
if(beat===0){desiredLook.set(-.10,-.05,0);cameraGoal.set(5.3,3.05,7.25);}else{desiredLook.copy(worldFocus);if(beat===1)cameraGoal.copy(worldFocus).add(new THREE.Vector3(3.35,1.7,5.55-scrollPart*.35));if(beat===2)cameraGoal.copy(worldFocus).add(new THREE.Vector3(3.1,1.2,5.15-scrollPart*.35));if(beat===3)cameraGoal.copy(worldFocus).add(new THREE.Vector3(2.4,1.2,5.4));}
if(window.innerWidth<701){if(beat===0)cameraGoal.set(5.5,3.1,8.9);else cameraGoal.copy(worldFocus).add(new THREE.Vector3(beat===2?1.8:2.1,1,beat===2?3.8:4.5));}camera.position.lerp(cameraGoal,reduced?1:.045);cameraLook.lerp(desiredLook,reduced?1:.055);camera.lookAt(cameraLook);
focusLight.position.copy(worldFocus).add(new THREE.Vector3(0,.5,1));focusLight.intensity=beat>0?1.6:0;accentLight.intensity=beat===2?1.4:0;sparkMarker.visible=beat===2;sparkMarker.material.opacity=1;sparkMarker.scale.setScalar(beat===2&&!reduced?1+Math.max(0,Math.sin(time*.008))*.8:1);
focusBox.visible=beat>0;if(beat>0){if(beat===3){highlightBox.setFromCenterAndSize(worldFocus,new THREE.Vector3(1.2,1.2,.25));}else highlightBox.setFromObject(beat===1?starter:head);focusBox.box.copy(highlightBox);focusBox.updateMatrixWorld(true);}
const label=document.querySelector('#engine-label'),leader=document.querySelector('#focus-leader');if(beat>0){projected.copy(worldFocus).project(camera);const h=host.getBoundingClientRect(),stage=document.querySelector('.engine-stage').getBoundingClientRect();const px=(projected.x*.5+.5)*h.width+h.left-stage.left,py=(-projected.y*.5+.5)*h.height+h.top-stage.top;const lx=THREE.MathUtils.clamp(px-170,15,Math.max(15,stage.width-280)),ly=THREE.MathUtils.clamp(py+40,20,Math.max(20,stage.height-105));label.style.left=lx+'px';label.style.top=ly+'px';label.style.bottom='auto';leader.style.opacity='1';const line=document.querySelector('#focus-line'),dot=document.querySelector('#focus-dot');line.setAttribute('x1',px);line.setAttribute('y1',py);line.setAttribute('x2',lx+7);line.setAttribute('y2',ly+26);dot.setAttribute('cx',px);dot.setAttribute('cy',py);}else{label.style.left='';label.style.top='';label.style.bottom='';leader.style.opacity='0';}
renderer.render(scene,camera);}
requestAnimationFrame(frame);renderer.render(scene,camera);document.body.classList.add('webgl-ready');
window.__engine={get beat(){return beat},get meshes(){return renderer.info.render.calls},get exploded(){return targetExplode},get rotation(){return assembly.rotation.y},ready:true};
}

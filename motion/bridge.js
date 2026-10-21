
/* Website-only adapter. Disabled in HyperFrames' default render/check context. */
(()=>{
 if(!new URLSearchParams(location.search).has('embed')||window.parent===window)return;
 const lab=window.__lab;if(!lab)return;
 const timeline=lab.timeline;
 // Responsive website wrapper. The HyperFrames canvas remains 1200×640 for deterministic authoring.
 const stage=document.getElementById('stage');
 document.documentElement.style.width='100%';document.documentElement.style.height='100%';
 document.body.style.width='100%';document.body.style.height='100%';
 function fit(){const scale=Math.min(innerWidth/1200,innerHeight/640);stage.style.transformOrigin='0 0';stage.style.transform='scale('+scale+')';stage.style.position='absolute';stage.style.left=((innerWidth-1200*scale)/2)+'px';stage.style.top=((innerHeight-640*scale)/2)+'px';}
 addEventListener('resize',fit);fit();
 const send=type=>parent.postMessage({type,system:lab.system,duration:lab.duration,time:timeline.time(),step:lab.getStep(),playing:!timeline.paused()&&timeline.time()<lab.duration},location.origin);
 timeline.eventCallback('onUpdate',()=>send('hf-progress'));
 timeline.eventCallback('onComplete',()=>{timeline.pause();send('hf-progress');});
 addEventListener('message',event=>{
  if(event.origin!==location.origin||event.source!==parent||!event.data||event.data.type!=='hf-control')return;
  const msg=event.data;
  switch(msg.action){
   case 'ping':send('hf-ready');return;
   case 'play':timeline.timeScale(Math.max(.15,Math.min(2,Number(msg.rate)||1)));if(timeline.time()>=lab.duration)timeline.time(0,false);timeline.resume();break;
   case 'pause':timeline.pause();break;
   case 'seek':timeline.pause();timeline.time(Math.min(lab.duration,Math.max(0,Number(msg.time)||0)),false);lab.renderFrame(timeline.time());break;
   case 'reset':timeline.pause();timeline.time(0,false);lab.renderFrame(0);break;
   case 'fault':lab.setFault(msg.value);break;
   default:return;
  }
  send('hf-progress');
 });
 send('hf-ready');send('hf-progress');
})();

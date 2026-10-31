import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";

const presets={
  "01":{name:"Равномерное движение",kind:"linear",object:"Шар движется вдоль оси координат",param:"Начальная скорость v₀"},
  "02":{name:"Второй закон Ньютона",kind:"force",object:"Равнодействующая силы сообщает телу ускорение",param:"Сила F"},
  "03":{name:"Движение по окружности",kind:"circle",object:"Скорость направлена по касательной, ускорение — к центру",param:"Радиус r"},
  "04":{name:"Превращение энергии",kind:"energy",object:"Кинетическая и потенциальная энергия переходят друг в друга",param:"Высота h"},
  "05":{name:"Столкновение тел",kind:"collision",object:"Два тела обмениваются импульсом при столкновении",param:"Масса m₁"},
  "06":{name:"Гармонические колебания",kind:"oscillation",object:"Пружинный маятник совершает периодическое движение",param:"Амплитуда A"},
  "07":{name:"Вращательное движение",kind:"rotation",object:"Твёрдое тело вращается вокруг неподвижной оси",param:"Момент инерции I"},
  "08":{name:"Давление жидкости",kind:"fluid",object:"Давление возрастает с глубиной",param:"Глубина h"},
  "09":{name:"Электрическое поле",kind:"charges",object:"Силовые линии выходят из положительного заряда",param:"Заряд q"},
  "10":{name:"Закон Гаусса",kind:"gauss",object:"Замкнутая поверхность охватывает электрический заряд",param:"Заряд q"},
  "11":{name:"Электрический потенциал",kind:"potential",object:"Потенциал меняется с расстоянием от заряда",param:"Расстояние r"},
  "12":{name:"Конденсатор",kind:"capacitor",object:"Электрическое поле между двумя обкладками",param:"Ёмкость C"},
  "13":{name:"Электрическая цепь",kind:"circuit",object:"Источник, проводники и нагрузка образуют замкнутую цепь",param:"Сопротивление R"},
  "14":{name:"Магнитное поле",kind:"magnet",object:"Магнитные силовые линии замыкаются вокруг магнита",param:"Магнитная индукция B"},
  "15":{name:"Электромагнитная индукция",kind:"induction",object:"Изменение магнитного потока вызывает ЭДС индукции",param:"Изменение потока ΔΦ"}
};

function init(root){
 const id=root.dataset.chapter, cfg=presets[id]||presets["01"], canvas=root.querySelector("canvas"), speed=root.querySelector("[data-speed]"), speedOut=root.querySelector("[data-speed-out]"), play=root.querySelector("button"), phase=root.querySelector("[data-phase]"), phaseOut=root.querySelector("[data-phase-out]");
 const paramName=root.querySelector("[data-phase-name]");if(paramName)paramName.textContent=cfg.param||"Параметр";
 const motionPreference=window.matchMedia("(prefers-reduced-motion: reduce)");
 let renderer,scene,camera,object,group,clock=new THREE.Clock(),running=!motionPreference.matches,elapsed=0,drag=false,lastX=0,lastY=0,rotX=-.28,rotY=.42;
 play.textContent=running?"Пауза":"Продолжить";
 try{
  renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:true});renderer.setPixelRatio(Math.min(devicePixelRatio||1,2));renderer.setSize(canvas.clientWidth,canvas.clientHeight,false);renderer.outputColorSpace=THREE.SRGBColorSpace;
 }catch(e){root.querySelector(".physics-stage").innerHTML='<p style="padding:20px">Для 3D-модели включите WebGL в настройках браузера.</p>';return;}
 scene=new THREE.Scene();scene.background=new THREE.Color("#f8f8f5");camera=new THREE.PerspectiveCamera(38,canvas.clientWidth/canvas.clientHeight,.1,100);camera.position.set(6,5,8);camera.lookAt(0,0,0);
 scene.add(new THREE.HemisphereLight(0xffffff,0xb4b0a8,2));const light=new THREE.DirectionalLight(0xffffff,2.2);light.position.set(4,7,5);scene.add(light);
 group=new THREE.Group();scene.add(group);
 const mat=(color,roughness=.55)=>new THREE.MeshStandardMaterial({color,roughness,metalness:.04});
 const red=mat("#d95b43"),dark=mat("#34363a"),blue=mat("#6487a5"),gold=mat("#d6a45d"),pale=mat("#d8d8d1"),green=mat("#6c947d");
 const sphere=(r,m,x=0,y=0,z=0)=>{const o=new THREE.Mesh(new THREE.SphereGeometry(r,32,24),m);o.position.set(x,y,z);group.add(o);return o;};
 const box=(x,y,z,m,px=0,py=0,pz=0)=>{const o=new THREE.Mesh(new THREE.BoxGeometry(x,y,z),m);o.position.set(px,py,pz);group.add(o);return o;};
 const line=(points,color="#aaa9a2",opacity=1)=>{const g=new THREE.BufferGeometry().setFromPoints(points);const o=new THREE.Line(g,new THREE.LineBasicMaterial({color,transparent:opacity<1,opacity}));group.add(o);return o;};
 const arrow=(from,to,color="#d95b43",head=.16)=>{const d=new THREE.Vector3(...to).sub(new THREE.Vector3(...from));const a=new THREE.ArrowHelper(d.clone().normalize(),new THREE.Vector3(...from),d.length(),color,head,head*.65);group.add(a);return a;};
 const grid=new THREE.GridHelper(10,20,"#c9c8c1","#e4e3dd");grid.position.y=-1.45;group.add(grid);
 // Shared coordinate axes
 line([new THREE.Vector3(-4,-1.43,0),new THREE.Vector3(4,-1.43,0)],"#aaa9a2");
 switch(cfg.kind){
 case "linear": object=sphere(.34,red,-2,-.8,0);line([new THREE.Vector3(-3,-.8,0),new THREE.Vector3(3,-.8,0)],"#9a9992");arrow([-2,-.1,0],[0,-.1,0]);break;
 case "force": object=box(1,1,1,blue,0,-.8,0);arrow([.55,-.8,0],[2.6,-.8,0]);arrow([0,-.2,0],[0,1.2,0],"#6487a5");break;
 case "circle": {const pts=[];for(let i=0;i<=100;i++){let a=i/100*Math.PI*2;pts.push(new THREE.Vector3(1.8*Math.cos(a),-.75,1.8*Math.sin(a)));}line(pts,"#aaa9a2");object=sphere(.25,red,1.8,-.75,0);arrow([1.8,-.75,0],[1.8,1,0]);arrow([1.8,-.75,0],[.75,-.75,0],"#6487a5");break;}
 case "energy": {const ramp=box(4,.12,1,pale,0,-.15,0);ramp.rotation.z=-.35;object=sphere(.28,red,-1.55,.55,0);arrow([-1.5,1.2,0],[-1.5,.2,0],"#6487a5");break;}
 case "collision": object=sphere(.42,red,-2,-.7,0);sphere(.42,blue,2,-.7,0);arrow([-1.5,-.1,0],[-.4,-.1,0]);arrow([1.5,-.1,0],[.4,-.1,0],"#6487a5");break;
 case "oscillation": {box(2,.12,.5,dark,-2,1.1,0);for(let i=0;i<7;i++)line([new THREE.Vector3(-1.2+i*.16,1.05,0),new THREE.Vector3(-1.2+i*.16,0,0)],"#aaa9a2");object=sphere(.48,red,0,-.65,0);break;}
 case "rotation": {const axle=new THREE.Mesh(new THREE.CylinderGeometry(.07,.07,3,20),dark);axle.position.y=0;group.add(axle);object=new THREE.Mesh(new THREE.TorusGeometry(1.35,.16,16,80),blue);object.rotation.x=Math.PI/2;group.add(object);for(let i=0;i<4;i++){let a=i*Math.PI/2;line([new THREE.Vector3(0,0,0),new THREE.Vector3(1.35*Math.cos(a),0,1.35*Math.sin(a))],"#d95b43");}break;}
 case "fluid": {box(3,2.5,2,new THREE.MeshStandardMaterial({color:"#d8e5eb",transparent:true,opacity:.45,roughness:.2}),0,-.1,0);for(let i=0;i<4;i++)arrow([-1.7,-1+i*.55,0],[-.9,-1+i*.55,0],"#6487a5",.12);object=box(.65,.65,.65,gold,0,.65,0);break;}
 case "charges": sphere(.38,red,-1,0,0);sphere(.38,blue,1,0,0);for(let j=-1;j<=1;j++){const pts=[];for(let i=0;i<=60;i++){let t=i/60*Math.PI*2;pts.push(new THREE.Vector3(-1+Math.cos(t)*(.55+j*.18),Math.sin(t)*(.55+j*.18),0));}line(pts,"#d6a45d",.8);}break;
 case "gauss": {object=sphere(.28,red,0,0,0);const shell=new THREE.Mesh(new THREE.SphereGeometry(1.5,32,24),new THREE.MeshBasicMaterial({color:"#6487a5",wireframe:true,transparent:true,opacity:.4}));group.add(shell);for(let i=0;i<8;i++){let a=i*Math.PI/4;arrow([0,0,0],[2*Math.cos(a),1.2*Math.sin(a),0],"#d95b43",.12);}break;}
 case "potential": {for(let i=1;i<=5;i++){const ring=new THREE.Mesh(new THREE.TorusGeometry(i*.38,.018,8,80),new THREE.MeshBasicMaterial({color:i%2?"#6487a5":"#d6a45d"}));ring.position.y=-.7;ring.rotation.x=Math.PI/2;group.add(ring);}object=sphere(.3,red,0,-.7,0);break;}
 case "capacitor": {box(.12,2.6,2,blue,-.9,0,0);box(.12,2.6,2,red,.9,0,0);for(let i=-2;i<=2;i++)arrow([-.75,i*.35,0],[.75,i*.35,0],"#d6a45d",.1);break;}
 case "circuit": {const pts=[[-1.5,0,0],[-1.5,1.3,0],[1.5,1.3,0],[1.5,0,0],[1.5,-1.1,0],[-1.5,-1.1,0],[-1.5,0,0]].map(p=>new THREE.Vector3(...p));line(pts,"#55575b",.9);box(.55,.7,.45,gold,0,1.3,0);box(.7,.35,.45,red,1.5,-.5,0);arrow([-1.2,-1.1,0],[.8,-1.1,0],"#d95b43",.12);break;}
 case "magnet": {box(2.4,.6,.7,red,-.7,0,0);box(2.4,.6,.7,blue,.7,0,0);for(let i=0;i<5;i++){let y=-1.2+i*.6;const pts=[];for(let j=0;j<=50;j++){let t=j/50*Math.PI;pts.push(new THREE.Vector3(2.1*Math.cos(t),y+Math.sin(t)*(.7+i*.05),0));}line(pts,"#d6a45d",.9);}break;}
 case "induction": {const ring=new THREE.Mesh(new THREE.TorusGeometry(1.1,.09,16,80),gold);ring.rotation.x=Math.PI/2;group.add(ring);for(let i=0;i<5;i++)arrow([-.5+i*.25,1.8,0],[-.5+i*.25,.8,0],"#6487a5",.12);object=sphere(.22,red,0,2.1,0);break;}
 }
 const resize=()=>{const w=canvas.clientWidth,h=canvas.clientHeight;if(!w||!h)return;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();};new ResizeObserver(resize).observe(canvas);
 canvas.addEventListener("pointerdown",e=>{drag=true;lastX=e.clientX;lastY=e.clientY;canvas.setPointerCapture(e.pointerId);});canvas.addEventListener("pointerup",()=>drag=false);canvas.addEventListener("pointermove",e=>{if(!drag)return;rotY+=(e.clientX-lastX)*.008;rotX+=(e.clientY-lastY)*.008;rotX=Math.max(-1.1,Math.min(1.1,rotX));lastX=e.clientX;lastY=e.clientY;});
 const plot=root.querySelector("[data-physics-plot]"),valueOut=root.querySelector("[data-physics-value]"),labelOut=root.querySelector("[data-physics-label]"),formulaOut=root.querySelector("[data-physics-formula]");
 const pctx=plot?.getContext("2d");
 const calc=p=>{
  const t=elapsed,fmt=(v,n=2)=>Number(v).toFixed(n).replace(".",",");
  let val=0,label="",formula="",series=[];
  const sample=fn=>Array.from({length:61},(_,i)=>fn(i/60*4));
  switch(cfg.kind){
   case "linear":{const v=1+7*p;val=v;label="скорость, м/с";formula="x(t) = v · t";series=sample(t=>v*t/4);break;}
   case "force":{const F=2+18*p,m=2;val=F/m;label="ускорение, м/с²";formula="a = F / m = "+fmt(F)+" / "+fmt(m);series=sample(t=>val);break;}
   case "circle":{const r=.5+2.5*p,v=3;val=v*v/r;label="центростремительное ускорение, м/с²";formula="aц = v² / r = 9 / "+fmt(r);series=sample(()=>val);break;}
   case "energy":{const h=1+9*p;val=9.81*h;label="потенциальная энергия на 1 кг, Дж/кг";formula="Eп / m = g · h = 9,81 · "+fmt(h);series=sample(()=>val);break;}
   case "collision":{const m=.5+4.5*p,v=3;val=m*v;label="импульс, кг·м/с";formula="p = m · v = "+fmt(m)+" · 3";series=sample(t=>t<2?val*(1-t/2):0);break;}
   case "oscillation":{const A=.1+.9*p,T=2;val=A*Math.cos(2*Math.PI*t/T);label="смещение, м";formula="x(t) = A cos(2πt/T), A = "+fmt(A)+" м";series=sample(t=>A*Math.cos(2*Math.PI*t/T));break;}
   case "rotation":{const I=.1+1.9*p,tau=2;val=tau/I;label="угловое ускорение, рад/с²";formula="α = τ / I = 2 / "+fmt(I);series=sample(()=>val);break;}
   case "fluid":{const h=.2+4.8*p;val=1000*9.81*h;label="гидростатическое давление, Па";formula="p = ρgh = 1000 · 9,81 · "+fmt(h);series=sample(()=>val);break;}
   case "charges":{const q=1+9*p;val=8.99*q;label="напряжённость при r = 1 м, Н/Кл";formula="E = kq/r², q = "+fmt(q)+" нКл";series=sample(()=>val);break;}
   case "gauss":{const q=1+9*p;val=q*1e-9/8.854e-12;label="поток поля, Н·м²/Кл";formula="Φ = q / ε₀, q = "+fmt(q)+" нКл";series=sample(t=>val);break;}
   case "potential":{const r=.2+4.8*p;val=8.99/r;label="потенциал при q = 1 нКл, В";formula="V = kq/r = 8,99 / "+fmt(r);series=sample(t=>8.99/(r+.5*t));break;}
   case "capacitor":{const C=1+9*p,V=12;val=C*V;label="заряд, мкКл";formula="Q = CV = "+fmt(C)+" · 12";series=sample(t=>val*(1-Math.exp(-t*1.3)));break;}
   case "circuit":{const R=1+19*p;val=12/R;label="сила тока, А";formula="I = U / R = 12 / "+fmt(R);series=sample(t=>val);break;}
   case "magnet":{const B=.1+1.9*p;val=2*B;label="модуль силы Лоренца, Н (θ меняется)";formula="F = |q|vB|sin θ|, θ(t) меняется";series=sample(t=>val*Math.abs(Math.sin(t*1.5)));break;}
   case "induction":{const d=.01+.19*p;val=d/.1;label="ЭДС индукции, В";formula="|ε| = |ΔΦ| / Δt = "+fmt(d)+" / 0,1";series=sample(t=>val*Math.abs(Math.sin(t*1.6)));break;}
  }
  valueOut.textContent=fmt(val,Math.abs(val)>=100?0:2);
  labelOut.textContent=label;formulaOut.textContent=formula;
  if(pctx){const w=plot.clientWidth||320,h=plot.clientHeight||112;plot.width=w*devicePixelRatio;plot.height=h*devicePixelRatio;pctx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0);pctx.clearRect(0,0,w,h);pctx.strokeStyle="#deded8";pctx.lineWidth=1;for(let j=1;j<4;j++){pctx.beginPath();pctx.moveTo(24,j*h/4);pctx.lineTo(w-5,j*h/4);pctx.stroke();}const max=Math.max(...series.map(Math.abs),1e-9);pctx.strokeStyle="#d95b43";pctx.lineWidth=2;pctx.beginPath();series.forEach((v,i)=>{const x=24+i/60*(w-30),y=h/2-v/max*(h*.38);i?pctx.lineTo(x,y):pctx.moveTo(x,y)});pctx.stroke();pctx.fillStyle="#888";pctx.font="9px monospace";pctx.fillText("t",w-12,h-5);pctx.fillText("0",5,h-5);}
 };
 const render=()=>{requestAnimationFrame(render);const dt=Math.min(clock.getDelta(),.04);if(running)elapsed+=dt*(.35+(+speed.value)/10);const p=+phase.value/100;if(cfg.kind==="oscillation"){const A=.1+.9*p,current=A*Math.cos(2*Math.PI*elapsed/2);valueOut.textContent=current.toFixed(2).replace(".",",");}speedOut.textContent=(+speed.value).toFixed(1).replace(".",",")+"×";phaseOut.textContent=Math.round(p*100)+"%";
  group.rotation.set(rotX,rotY,0);group.scale.setScalar(1);
  if(object){if(cfg.kind==="linear")object.position.x=-2+((elapsed*(.3+p*1.8))%4);if(cfg.kind==="force")object.position.x=Math.sin(elapsed*(.2+p))*((.2+p)*.8);if(cfg.kind==="circle"){const r=.5+2.5*p;object.position.x=r*Math.cos(elapsed);object.position.z=r*Math.sin(elapsed);}if(cfg.kind==="energy")object.position.x=-1.55+1.8*p;if(cfg.kind==="collision"){object.position.x=-2+2*p;group.children.find(o=>o.isMesh&&o.material===blue)?.position.set(2-2*p,-.7,0);}if(cfg.kind==="oscillation")object.position.y=-.65+Math.sin(elapsed*(.5+p*3))* (.2+p*.3);if(cfg.kind==="rotation")object.rotation.y=elapsed*(.3+p*2);if(cfg.kind==="fluid")object.position.y=.4+Math.sin(elapsed)*(.05+p*.3);if(cfg.kind==="gauss")object.rotation.y=elapsed*.4;if(cfg.kind==="potential")object.position.y=-.7+Math.sin(elapsed)*.08;if(cfg.kind==="circuit")object.rotation.y=elapsed*.5;if(cfg.kind==="induction")object.position.z=Math.sin(elapsed*(.3+p*3))*.65;}
  renderer.render(scene,camera);
 };calc(+phase.value/100);render();
 play.addEventListener("click",()=>{running=!running;play.textContent=running?"Пауза":"Продолжить";});
 motionPreference.addEventListener("change",e=>{running=!e.matches;play.textContent=running?"Пауза":"Продолжить";});
 speed.addEventListener("input",()=>speedOut.textContent=(+speed.value).toFixed(1).replace(".",",")+"×");phase.addEventListener("input",()=>{phaseOut.textContent=phase.value+"%";calc(+phase.value/100);});
 const observer=new IntersectionObserver(entries=>{for(const e of entries)if(e.isIntersecting)running=!motionPreference.matches;else running=false;},{threshold:.08});observer.observe(root);
}
document.querySelectorAll("[data-physics-lab]").forEach(init);

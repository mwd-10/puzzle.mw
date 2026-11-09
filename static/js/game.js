const characters = [
 {id:"dali",ar:"سلفادور دالي",en:"Salvador Dalí",field:"الفن والرسم",accepted:["سلفادور","دالي"],bio:"رسام إسباني وأحد أبرز فناني المدرسة السريالية. اشتهر بصوره الغريبة والمشاهد التي تمزج الأحلام بالواقع، وبشاربه اللافت الذي أصبح جزءًا من صورته العامة.",fact:"من أشهر أعماله لوحة «إصرار الذاكرة» التي تظهر فيها الساعات الذائبة.",pieces:4},
 {id:"dostoevsky",ar:"فيودور دوستويفسكي",en:"Fyodor Dostoevsky",field:"الأدب والرواية",accepted:["فيودور","دوستويفسكي","دوستويفسكى"],bio:"روائي روسي من كبار كتّاب الأدب العالمي. تناول في رواياته النفس البشرية والصراع الأخلاقي والإيمان والحرية والذنب.",fact:"من أشهر رواياته: الجريمة والعقاب، والأخوة كارامازوف، والأبله.",pieces:4},
 {id:"fischer",ar:"بوبي فيشر",en:"Bobby Fischer",field:"الشطرنج",accepted:["بوبي","فيشر"],bio:"لاعب شطرنج أمريكي أصبح بطل العالم عام 1972 بعد فوزه على بوريس سباسكي. عُرف بتركيزه الشديد وفهمه العميق للعبة.",fact:"فوزه ببطولة العالم عام 1972 كان حدثًا عالميًا بارزًا في تاريخ الشطرنج.",pieces:6},
 {id:"aqqad",ar:"عباس محمود العقاد",en:"Abbas Mahmoud al-Aqqad",field:"الأدب والفكر",accepted:["عباس","محمود","العقاد","عقاد"],bio:"كاتب ومفكر وشاعر مصري، ترك مؤلفات كثيرة في الأدب والفكر والسير والتراجم. كان من أبرز أعلام النهضة الأدبية العربية الحديثة.",fact:"كان من مؤسسي مدرسة الديوان النقدية بالاشتراك مع إبراهيم المازني وعبد الرحمن شكري.",pieces:6},
 {id:"gogol",ar:"نيكولاي غوغول",en:"Nikolai Gogol",field:"الأدب والرواية",accepted:["نيكولاي","غوغول","جوجول","غوغُل"],bio:"كاتب روسي من أصول أوكرانية، عُرف بالسخرية الاجتماعية والخيال الغرائبي. أثّر في تطور القصة والرواية الروسية.",fact:"من أشهر أعماله رواية «النفوس الميتة» والقصة القصيرة «المعطف».",pieces:8},
 {id:"freud",ar:"سيغموند فرويد",en:"Sigmund Freud",field:"طب الأعصاب والتحليل النفسي",accepted:["سيغموند","فرويد"],bio:"طبيب أعصاب نمساوي أسّس مدرسة التحليل النفسي. أثّرت أفكاره حول اللاوعي والأحلام في تاريخ علم النفس، رغم أن كثيرًا من نظرياته محل نقاش علمي اليوم.",fact:"بدأ فرويد مسيرته المهنية طبيبًا متخصصًا في طب الأعصاب قبل أن يطوّر منهجه في التحليل النفسي.",pieces:8},
 {id:"elia",ar:"إيليا أبو ماضي",en:"Elia Abu Madi",field:"الشعر العربي",accepted:["إيليا","ابو ماضي","أبو ماضي","ماضي"],bio:"شاعر لبناني من شعراء المهجر في الولايات المتحدة، تميّز شعره بالتأمل في الحياة والطبيعة والإنسان، وبنزعة إنسانية متفائلة.",fact:"كان عضوًا في الرابطة القلمية التي جمعت عددًا من أدباء المهجر.",pieces:10},
 {id:"haytham",ar:"الحسن بن الهيثم",en:"Ibn al-Haytham",field:"البصريات والفيزياء",accepted:["الحسن","ابن الهيثم","الهيثم"],bio:"عالم عربي مسلم من رواد علم البصريات. درس الضوء والرؤية، واعتمد التجربة والملاحظة في اختبار الأفكار العلمية.",fact:"كتابه «المناظر» كان له أثر كبير في تطور دراسة الضوء والرؤية.",pieces:12},
 {id:"zahrawi",ar:"أبو القاسم الزهراوي",en:"Al-Zahrawi",field:"الطب والجراحة",accepted:["الزهراوي","ابو القاسم","أبو القاسم"],bio:"طبيب وجراح أندلسي يُعد من أبرز رواد الجراحة في التاريخ. جمع خبراته الطبية في موسوعة «التصريف لمن عجز عن التأليف».",fact:"احتوى كتابه على وصف لأدوات جراحية وطرق علاجية أثّرت في تعليم الطب لقرون.",pieces:12},
 {id:"tufail",ar:"ابن طفيل",en:"Ibn Tufail",field:"الفلسفة والطب والأدب",accepted:["طفيل","ابن طفيل"],bio:"فيلسوف وطبيب أندلسي، جمع بين الفلسفة والطب والأدب. اشتهر بعمله الفلسفي القصصي «حي بن يقظان».",fact:"تُرجمت «حي بن يقظان» إلى لغات أوروبية وأثّرت في تاريخ الأدب الفلسفي.",pieces:16}
];

const $ = id => document.getElementById(id);
const screens = ["welcome","game","guessChoice","identify","result","final"];
let levelIndex=0, score=0, wins=0, startedAt=0, elapsed=0, timerId=null, remaining=30, locked=false, currentOutcome=null;
let canvas,ctx,board,tiles=[],dragging=null,scale=1;
const portraitUrls = {};
const W=1100,H=650,BOARD={x:35,y:45,size:560},TRAY={x:630,y:45,w:435,h:560};

function showScreen(name){screens.forEach(s=>$(s).classList.toggle("active",s===name));window.scrollTo({top:0,behavior:"smooth"});}
function showToast(msg){const t=$("toast");t.textContent=msg;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),1900);}
function shuffle(a){for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
function gridFor(n){
 const rows=Math.ceil(Math.sqrt(n));
 const base=Math.floor(n/rows),extra=n%rows;
 return Array.from({length:rows},(_,i)=>base+(i<extra?1:0));
}
function normalize(s){return (s||"").toLowerCase().replace(/[ًٌٍَُِّْـ]/g,"").replace(/[أإآٱ]/g,"ا").replace(/ى/g,"ي").replace(/[^\u0600-\u06FFa-z0-9\s]/gi," ").replace(/\s+/g," ").trim();}
function isCorrect(raw,ch){const answer=normalize(raw);if(!answer)return false;const tokens=answer.split(" ").filter(Boolean);const accepted=ch.accepted.map(normalize);return tokens.some(t=>accepted.some(a=>a===t|| (t.length>=4 && a.length>=4 && (a.includes(t)||t.includes(a)))));}
function updateProgress(){const n=levelIndex+1;$("progressText").textContent=String(n).padStart(2,"0")+" / 10";$("progressBar").style.width=(n*10)+"%";$("levelTitle").textContent="المرحلة "+["الأولى","الثانية","الثالثة","الرابعة","الخامسة","السادسة","السابعة","الثامنة","التاسعة","العاشرة"][levelIndex];$("scoreNow").textContent=score;}
function startGame(){levelIndex=0;score=0;wins=0;elapsed=0;startedAt=Date.now();loadLevel();}
function loadLevel(){
 clearInterval(timerId);locked=false;remaining=30;currentOutcome=null;updateProgress();
 const ch=characters[levelIndex];ch.pieces=9+levelIndex;$("pieceCount").textContent=ch.pieces+" قطع";$("timer").classList.remove("urgent");$("timer").querySelector("strong").textContent="30";
 showScreen("game");setupPuzzle(ch);
}
function startTimer(){clearInterval(timerId);timerId=setInterval(()=>{if(locked)return;remaining--; $("timer").querySelector("strong").textContent=remaining;$("timer").classList.toggle("urgent",remaining<=8);if(remaining<=0){clearInterval(timerId);locked=true;showGuessChoice(true);}},1000);}
async function setupPuzzle(ch){
 canvas=$("puzzleCanvas");ctx=canvas.getContext("2d");tiles=[];
 const wrap=canvas.parentElement;const oldRetry=$("imageRetry");if(oldRetry)oldRetry.remove();
 try{
   // Recover portraits that failed during the initial bulk download.
   const controller = new AbortController();
   const timeout = setTimeout(() => controller.abort(), 30000);
   let response;
   try { response = await fetch("/api/ensure-image/"+encodeURIComponent(ch.id), {cache:"no-store", signal:controller.signal}); }
   finally { clearTimeout(timeout); }
   const status=await response.json();
   if(!response.ok||!status.ok)throw new Error(status.error||"تعذّر تنزيل الصورة");
   const imageUrl = status.url || ("/portrait/"+ch.id);
   portraitUrls[ch.id] = imageUrl;
   const img=new Image();
   img.onload=()=>{buildTiles(img,ch);startTimer();};
   img.onerror=()=>showImageRetry(ch,"وصل ملف الصورة لكن المتصفح لم يتمكن من فتحه. أعيد المحاولة.");
   img.src=imageUrl+"?v="+Date.now();
 }catch(error){
   const detail = error && error.name === "AbortError" ? "انتهت مهلة الاتصال" : (error.message || "تعذّر الاتصال بمصدر الصورة");
   showImageRetry(ch,"تعذّر تحميل صورة "+ch.ar+" ("+detail+"). افحص الاتصال ثم أعيد المحاولة.");
 }
}
function showImageRetry(ch,message){
 clearInterval(timerId);locked=true;showToast(message);
 let retry=$("imageRetry");if(!retry){retry=document.createElement("button");retry.id="imageRetry";retry.className="primary-btn";retry.type="button";retry.style.cssText="display:block;margin:18px auto;";retry.textContent="إعادة تحميل الصورة";canvas.parentElement.insertAdjacentElement("afterend",retry);}
 retry.onclick=()=>{retry.remove();locked=false;setupPuzzle(ch);};
}
function buildTiles(img,ch){
 const n=ch.pieces,rowCounts=gridFor(n),rows=rowCounts.length,cells=[];
 const cropSize=Math.min(img.naturalWidth||img.width,img.naturalHeight||img.height);
 const cropX=((img.naturalWidth||img.width)-cropSize)/2;
 const cropY=((img.naturalHeight||img.height)-cropSize)/2;
 let id=0;
 rowCounts.forEach((count,r)=>{
   const targetH=BOARD.size/rows,sourceH=cropSize/rows;
   for(let c=0;c<count;c++){
     const targetW=BOARD.size/count,sourceW=cropSize/count;
     cells.push({id:id++,r,c,rowCount:count,sourceX:cropX+c*sourceW,sourceY:cropY+r*sourceH,sourceW,sourceH,
       targetX:BOARD.x+c*targetW,targetY:BOARD.y+r*targetH,targetW,targetH});
   }
 });
 const order=shuffle([...cells]);tiles=[];
 const gap=8,maxTargetW=Math.max(...cells.map(x=>x.targetW)),maxTargetH=Math.max(...cells.map(x=>x.targetH));
 const miniScale=Math.min(.64,TRAY.w/(4*maxTargetW+3*gap),TRAY.h/(4*maxTargetH+3*gap));
 const boxW=maxTargetW*miniScale,boxH=maxTargetH*miniScale;
 const trayCols=Math.max(1,Math.floor((TRAY.w+gap)/(boxW+gap)));
 const trayRows=Math.ceil(n/trayCols);
 const usedW=Math.min(trayCols,n)*boxW+(Math.min(trayCols,n)-1)*gap;
 const usedH=trayRows*boxH+(trayRows-1)*gap;
 const startX=TRAY.x+(TRAY.w-usedW)/2,startY=TRAY.y+Math.max(0,(TRAY.h-usedH)/2);
 order.forEach((cell,i)=>{
   const tc=i%trayCols,tr=Math.floor(i/trayCols),w=cell.targetW*miniScale,h=cell.targetH*miniScale;
   tiles.push({...cell,img,x:startX+tc*(boxW+gap)+(boxW-w)/2,y:startY+tr*(boxH+gap)+(boxH-h)/2,w,h,placed:false,miniScale});
 });
 board={count:n,rows:rowCounts.length};drawPuzzle();
}
function drawPuzzle(){
 ctx.clearRect(0,0,W,H);
 ctx.fillStyle="#e8ece8";ctx.fillRect(0,0,W,H);
 ctx.fillStyle="#f7f8f4";ctx.fillRect(BOARD.x,BOARD.y,BOARD.size,BOARD.size);
 ctx.strokeStyle="#cbd3cb";ctx.lineWidth=1;ctx.strokeRect(BOARD.x,BOARD.y,BOARD.size,BOARD.size);
 for(const t of tiles){
   ctx.fillStyle=(t.r+t.c)%2?"#f0f2ed":"#e9ede7";
   ctx.fillRect(t.targetX+1,t.targetY+1,t.targetW-2,t.targetH-2);
   ctx.strokeStyle="#d8ded6";ctx.strokeRect(t.targetX,t.targetY,t.targetW,t.targetH);
 }
 ctx.fillStyle="#8d9a91";ctx.font="600 14px 'IBM Plex Sans Arabic'";ctx.textAlign="center";ctx.fillText("اسحب القطع من هنا",TRAY.x+TRAY.w/2,TRAY.y-13);
 ctx.fillStyle="#e0e5df";ctx.fillRect(TRAY.x,TRAY.y,TRAY.w,TRAY.h);ctx.strokeStyle="#d3dbd3";ctx.strokeRect(TRAY.x,TRAY.y,TRAY.w,TRAY.h);
 tiles.forEach(t=>drawTile(t));
}
function drawTile(t){
 const x=t.x,y=t.y,w=t.w,h=t.h;
 ctx.save();ctx.shadowColor=t===dragging?"#17263844":"#17263820";ctx.shadowBlur=t===dragging?16:7;ctx.shadowOffsetY=3;
 ctx.fillStyle="#fff";ctx.fillRect(x-1,y-1,w+2,h+2);ctx.restore();
 ctx.save();ctx.beginPath();ctx.rect(x,y,w,h);ctx.clip();
 ctx.drawImage(t.img,t.sourceX,t.sourceY,t.sourceW,t.sourceH,x,y,w,h);
 ctx.restore();
 ctx.strokeStyle=t===dragging?"#c79b55":"#ffffff";ctx.lineWidth=t===dragging?3:1.5;ctx.strokeRect(x,y,w,h);
 if(t.placed){ctx.fillStyle="#4b806d";ctx.globalAlpha=.15;ctx.fillRect(x,y,w,h);ctx.globalAlpha=1;}
}
function pointerPos(e){const rect=canvas.getBoundingClientRect();return {x:(e.clientX-rect.left)*W/rect.width,y:(e.clientY-rect.top)*H/rect.height};}
canvas=$("puzzleCanvas");
canvas.addEventListener("pointerdown",e=>{if(locked||!tiles.length)return;const p=pointerPos(e);for(let i=tiles.length-1;i>=0;i--){const t=tiles[i];if(!t.placed&&p.x>=t.x&&p.x<=t.x+t.w&&p.y>=t.y&&p.y<=t.y+t.h){dragging=t;dragging.dx=p.x-t.x;dragging.dy=p.y-t.y;canvas.setPointerCapture(e.pointerId);tiles.splice(i,1);tiles.push(dragging);drawPuzzle();break;}}});
canvas.addEventListener("pointermove",e=>{if(!dragging)return;const p=pointerPos(e);dragging.x=p.x-dragging.dx;dragging.y=p.y-dragging.dy;drawPuzzle();});
canvas.addEventListener("pointerup",()=>{if(!dragging)return;const t=dragging,targetX=t.targetX,targetY=t.targetY,cx=t.x+t.w/2,cy=t.y+t.h/2,tx=targetX+t.targetW/2,ty=targetY+t.targetH/2;const threshold=Math.max(28,Math.min(t.targetW,t.targetH)*.43);if(Math.hypot(cx-tx,cy-ty)<threshold){t.x=targetX;t.y=targetY;t.w=t.targetW;t.h=t.targetH;t.placed=true;showToast("قطعة صحيحة!");}else{t.x=Math.max(TRAY.x,Math.min(TRAY.x+TRAY.w-t.w,t.x));t.y=Math.max(TRAY.y,Math.min(TRAY.y+TRAY.h-t.h,t.y));}dragging=null;drawPuzzle();if(tiles.every(x=>x.placed)){clearInterval(timerId);locked=true;onPuzzleComplete();}});
canvas.addEventListener("pointercancel",()=>{dragging=null;drawPuzzle();});
function showGuessChoice(timedOut=false){
 const heading = $("guessChoice").querySelector(".identify-top h2");
 const message = $("guessChoice").querySelector(".identify-top p:not(.eyebrow)");
 if(timedOut){
   heading.textContent="انتهى الوقت!";
   message.textContent="ما لحقت تكمّل البازل، لكن الصورة الكاملة مش رح تنكشف إلا إذا اخترت. بدك تختبر معرفتك؟";
 } else {
   heading.textContent="اكتملت الصورة!";
   message.textContent="هل تريدين اختبار ذاكرتك ومحاولة معرفة الشخصية، أم تفضّلين كشف هويتها الآن؟";
 }
 showScreen("guessChoice");
} 
function onPuzzleComplete(){ showGuessChoice(false); }
$("guessBtn").addEventListener("click",()=>{
 const ch=characters[levelIndex];$("identifyImage").src=portraitUrls[ch.id]||("/portrait/"+ch.id);$("answerInput").value="";showScreen("identify");setTimeout(()=>$ ("answerInput").focus(),250);
});
$("revealBtn").addEventListener("click",()=>showResult(false,"اخترت كشف الشخصية بدل تخمينها.",true));
$("answerForm").addEventListener("submit",async e=>{
 e.preventDefault();const ch=characters[levelIndex];const ok=isCorrect($("answerInput").value,ch);
 if(ok){try{await fetch("/api/known/"+encodeURIComponent(ch.id),{method:"POST"});}catch(_){}}
 showResult(ok,ok?"إجابة صحيحة! تعرّفت على الشخصية.":"الإجابة غير صحيحة، لكن تعرّف الآن على الشخصية.");
});
function showResult(ok,message,revealed=false){
 clearInterval(timerId);locked=true;const ch=characters[levelIndex];currentOutcome=ok;
 if(ok){wins++;score+=100+remaining*2;}else if(!revealed&&remaining>0){score+=20;}
 $("resultIcon").textContent=ok?"✓":"×";$("resultIcon").classList.toggle("wrong",!ok);
 $("resultEyebrow").textContent=ok?"IDENTITY CONFIRMED":(revealed?"IDENTITY REVEALED":"MEET THE PERSON");
 $("resultTitle").textContent=ok?"أحسنت! إجابة صحيحة":(revealed?"هذه هي الشخصية!":"لم تكن الإجابة صحيحة");
 $("resultMessage").textContent=message;
 $("resultImage").src=portraitUrls[ch.id]||("/portrait/"+ch.id);$("personArabic").textContent=ch.ar;$("personEnglish").textContent=ch.en;$("personField").textContent=ch.field;$("personBio").textContent=ch.bio;$("personFact").textContent=ch.fact;
 $("earnedPoints").textContent=ok?("+"+(100+remaining*2)+" نقطة"): (revealed?"لم تُحتسب نقاط للتخمين":"+20 نقطة");
 $("nextBtn").textContent=levelIndex===9?"عرض النتيجة النهائية ←":"المرحلة التالية ←";
 $("scoreNow").textContent=score;showScreen("result");loadKnownCount(ch.id);
}
async function loadKnownCount(key){
 const el=$("knownCount");el.textContent="جارٍ تحميل العدد…";
 try{const res=await fetch("/api/known/"+encodeURIComponent(key));const data=await res.json();el.textContent="عدد مرات الإجابة الصحيحة: " + (data.count||0);}
 catch(_){el.textContent="إحصائية التعرّف غير متاحة حاليًا";}
}
function finishGame(){elapsed=Math.floor((Date.now()-startedAt)/1000);$("finalScore").textContent=score;$("finalWins").textContent=wins+"/10";$("finalTime").textContent=String(Math.floor(elapsed/60)).padStart(2,"0")+":"+String(elapsed%60).padStart(2,"0");const old=Number(localStorage.getItem("portraitPuzzleBest")||0);const best=Math.max(old,score);localStorage.setItem("portraitPuzzleBest",String(best));$("bestScore").textContent=score>=old?"رقمك الأفضل الجديد!":"أفضل نتيجة محفوظة: "+best+" نقطة";showScreen("final");}
$("startBtn").addEventListener("click",startGame);$("nextBtn").addEventListener("click",()=>{if(levelIndex===9){finishGame();return;}levelIndex++;loadLevel();});$("restartBtn").addEventListener("click",startGame);$("quitBtn").addEventListener("click",()=>{if(confirm("هل تريد إنهاء الجولة والعودة إلى البداية؟")){clearInterval(timerId);showScreen("welcome");}});

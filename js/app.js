// ===== PENGATURAN (isi nanti) =====
var GC_SELEKSI_URL="";   // link grup seleksi (dibantu admin)
var CHAT_URL="https://chat.whatsapp.com/CjrVQiMQr6j5zGGSLOpjDR?s=cl&p=a&iam=2";   // link chat tujuan setelah lolos
var CHECK_URL="";        // endpoint serverless/worker untuk cek otomatis video TikTok
var MEMBER_COUNT=45;
var cur=0,P=document.querySelectorAll(".page"),B=document.querySelectorAll(".pg"),D=document.querySelectorAll(".tab"),T=document.querySelector(".tabs");
var S={un:"",cn:"",link:false};
function $(i){return document.getElementById(i)}
function dockTo(n){
  if(!T||!D[n])return;
  var a=D[n].getBoundingClientRect(),b=T.getBoundingClientRect();
  T.style.setProperty("--x",(a.left-b.left-T.clientLeft)+"px");
  T.style.setProperty("--w",a.width+"px")
}
// Kira semula posisi pil bila saiz skrin/font berubah (tanpa animasi lompat)
function redock(){
  if(!T)return;
  T.classList.add("nt");
  dockTo(cur);
  T.offsetWidth;
  T.classList.remove("nt")
}
window.addEventListener("resize",redock);
window.addEventListener("orientationchange",redock);
window.addEventListener("load",redock);
if(document.fonts&&document.fonts.ready)document.fonts.ready.then(redock);
function go(n){
  if(n<0||n>2)return;
  var dir=n>cur?"from-right":n<cur?"from-left":"";
  cur=n;
  P.forEach(function(p,i){
    p.classList.remove("from-left","from-right");
    if(i==n&&dir)p.classList.add(dir);
    p.classList.toggle("on",i==n)
  });
  D.forEach(function(d,i){d.classList.toggle("on",i==n)});
  B.forEach(function(b,i){b.classList.toggle("on",i==n)});
  dockTo(n);
  scrollTo({top:0,behavior:"smooth"})
}
function openM(i){$(i).classList.add("on")}
function closeM(){document.querySelectorAll(".modal").forEach(m=>m.classList.remove("on"))}
function toast(t){var e=$("ts");e.textContent=t;e.classList.add("on");setTimeout(()=>e.classList.remove("on"),2200)}
function gc(){if(GC_SELEKSI_URL)location.href=GC_SELEKSI_URL;else toast("Link grup seleksi belum diisi admin")}
function cp(btn,t){var done=()=>{var o=btn.textContent;btn.textContent="Tersalin ✓";setTimeout(()=>btn.textContent=o,1400)};
  if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(t).then(done).catch(()=>fb(t,done))}else fb(t,done)}
function fb(t,done){var a=document.createElement("textarea");a.value=t;document.body.appendChild(a);a.select();try{document.execCommand("copy");done()}catch(e){toast("Gagal menyalin, salin manual ya")}a.remove()}
function mk(){var n=$("un").value.trim().replace(/^@/,"");
  if(!n){$("e1").textContent="Isi nama akun TikTok dulu ya";return}
  $("e1").textContent="";S.un=n;S.cn="";
  var f=[n+" `𝙕𝙤𝙙𝙞𝙖𝙘",n+" `𝒁𝒐𝒅𝒊𝒂𝒄",n+" `𝐙𝐨𝐝𝐢𝐚𝐜",n+" 𝖋𝖙 𝙕𝙁","众 - "+n];
  $("cns").innerHTML="<p class='cap' style='margin-top:10px'>Pilih CN yang kamu mau pakai:</p>";
  f.forEach(function(t){var r=document.createElement("div");r.className="row";r.innerHTML="<span></span>";r.firstChild.textContent=t;
    var b=document.createElement("button");b.className="btn sm";b.textContent="Copy";b.onclick=function(){cp(b,t)};r.appendChild(b);
    r.onclick=function(){document.querySelectorAll("#cns .row").forEach(x=>x.classList.remove("sel"));r.classList.add("sel");S.cn=t;upd()};$("cns").appendChild(r)});
  upd()}
function valid(u){return /^https?:\/\/((vt|vm|www|m)\.)?tiktok\.com\/\S+/i.test(u)}
async function check(){var u=$("lk").value.trim(),e=$("e3");e.className="err";S.link=false;
  if(!S.un){e.textContent="Isi username dulu di langkah 1";upd();return}
  if(!valid(u)){e.textContent="Link TikTok tidak valid, salin ulang dari tombol Bagikan";upd();return}
  e.textContent="Memeriksa...";e.className="err okk";
  if(CHECK_URL){try{var r=await fetch(CHECK_URL,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({username:S.un,link:u,cn:S.cn})});var j=await r.json();rend(j.checks);
    if(!j.ok){e.className="err";e.textContent=j.message||"Syarat belum terpenuhi";upd();return}}catch(x){e.className="err";e.textContent="Server cek sedang bermasalah, coba lagi";upd();return}}
  S.link=true;e.textContent="Link video valid ✓";upd()}
function rend(c){var k=[["cn","1. CN di nickname"],["bio","2. Bio"],["tag","3. Hashtag"]],h="";if(!c){$("res").innerHTML="";return}
  k.forEach(function(x){if(c[x[0]])h+="<div class='rc "+(c[x[0]].ok?"ok":"no")+"'><b>"+(c[x[0]].ok?"✔ ":"✘ ")+x[1]+"</b><small></small></div>"});
  $("res").innerHTML=h;var s=$("res").querySelectorAll("small"),i=0;k.forEach(function(x){if(c[x[0]])s[i++].textContent=c[x[0]].detail||""})}
function upd(){var st=[["Username diisi",!!S.un],["CN dipilih & dipakai",!!S.cn&&$("ck1").checked],["Bio diganti",$("ck2").checked],["Video + hashtag valid",S.link]];
  var n=st.filter(x=>x[1]).length,p=n*25;$("fill").style.width=p+"%";$("pct").textContent=p+"%";
  $("steps").innerHTML=st.map(x=>"<div class='"+(x[1]?"d":"")+"'>"+(x[1]?"✅ ":"⬜ ")+x[0]+"</div>").join("");
  var j=$("join");j.disabled=p<100;j.textContent=p<100?"🔒 Masuk Chat":"💬 Masuk Chat";
  if(p==100&&!window.sh){window.sh=1;toast("Semua syarat terpenuhi! 🎉")}}
function mid(){var h=0;for(var i=0;i<S.un.length;i++)h=(h*31+S.un.charCodeAt(i))%9000;return "ZF-"+String(1000+h)}
function joinChat(){$("okt").textContent="Selamat "+S.un+", kamu lolos seleksi mandiri Zodiac Family.";$("mid").textContent="ID: "+mid();$("jl").href=CHAT_URL||"#";$("jl").style.display=CHAT_URL?"":"none";$("jc").style.display=CHAT_URL?"":"none";openM("mOk")}
$("ck1").onchange=upd;$("ck2").onchange=upd;
function animMem(n){var c=0,i=setInterval(function(){c+=Math.ceil(n/40);if(c>=n){c=n;clearInterval(i)}$("cnt").textContent=c+"+";$("pm").textContent=c},30)}
$("adm").textContent=document.querySelectorAll("#stf tr.adm").length;
if(CHECK_URL)fetch(CHECK_URL).then(function(r){return r.json()}).then(function(j){animMem(typeof j.registered==="number"?MEMBER_COUNT+j.registered:MEMBER_COUNT)}).catch(function(){animMem(MEMBER_COUNT)});else animMem(MEMBER_COUNT);
upd();
var tx=0;
var tOK=true;
document.addEventListener("touchstart",function(e){tOK=!e.target.closest(".tabs");tx=e.touches[0].clientX},{passive:true});
document.addEventListener("touchend",function(e){var d=e.changedTouches[0].clientX-tx,t=(document.activeElement||{}).tagName||"";if(tOK&&Math.abs(d)>110&&!/INPUT|TEXTAREA/.test(t)&&!document.querySelector(".modal.on"))go(cur+(d<0?1:-1))},{passive:true});

// ===== DOCK: TAHAN & GESER =====
// Langkah: (1) pointerdown catat posisi awal, (2) pointermove geser pil,
// (3) pointerup tempelkan pil ke tab terdekat lalu pindah halaman.
(function(){
  if(!T||!window.PointerEvent)return;
  var down=false,drag=false,sx=0,startX=0,minX=0,maxX=0,pw=0,pid=null,pv=-1,moved=false;
  function metrics(){
    var tr=T.getBoundingClientRect(),r0=D[0].getBoundingClientRect(),r2=D[D.length-1].getBoundingClientRect();
    minX=r0.left-tr.left-T.clientLeft;
    maxX=r2.left-tr.left-T.clientLeft;
    pw=D[cur].getBoundingClientRect().width;
    startX=D[cur].getBoundingClientRect().left-tr.left-T.clientLeft
  }
  function nearest(x){
    var c=x+pw/2,best=0,bd=1e9,tr=T.getBoundingClientRect();
    D.forEach(function(d,i){var r=d.getBoundingClientRect(),m=r.left-tr.left-T.clientLeft+r.width/2,k=Math.abs(m-c);if(k<bd){bd=k;best=i}});
    return best
  }
  function mark(n){D.forEach(function(d,i){d.classList.toggle("on",i==n)})}
  T.addEventListener("pointerdown",function(e){
    if(e.pointerType==="mouse"&&e.button!==0)return;
    down=true;drag=false;moved=false;sx=e.clientX;pid=e.pointerId;metrics();pv=cur
  });
  T.addEventListener("pointermove",function(e){
    if(!down||e.pointerId!==pid)return;
    var dx=e.clientX-sx;
    if(!drag){
      if(Math.abs(dx)<6)return;              // di bawah 6px dianggap ketukan biasa
      drag=true;moved=true;
      try{T.setPointerCapture(pid)}catch(x){}
      T.classList.add("drag")
    }
    var x=Math.max(minX,Math.min(maxX,startX+dx));
    T.style.setProperty("--x",x+"px");
    var n=nearest(x);
    if(n!==pv){pv=n;mark(n);if(navigator.vibrate)navigator.vibrate(8)}
  });
  function end(e){
    if(!down||(e&&e.pointerId!==pid))return;
    down=false;
    if(!drag)return;
    drag=false;
    try{T.releasePointerCapture(pid)}catch(x){}
    T.classList.remove("drag");
    var n=pv<0?cur:pv;
    if(n!==cur)go(n);else{mark(cur);dockTo(cur)}
  }
  T.addEventListener("pointerup",end);
  T.addEventListener("pointercancel",end);
  // Setelah geser, jangan anggap sebagai klik pada tab
  T.addEventListener("click",function(e){if(moved){e.stopPropagation();e.preventDefault();moved=false}},true);
})();

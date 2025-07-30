import { apps } from "../apps/apps.js";
import { vfs, saveVFS } from "./vfs.js";
import { renderTaskbar, renderStartMenu } from "./ui.js";

export function bootOS() {
  // ログイン処理
  const loginCover = document.getElementById('login-cover');
  const loginBox = document.getElementById('login-box');
  const loginBtn = document.getElementById('login-btn');
  const loginError = document.getElementById('login-error');
  const desktop = document.getElementById('desktop');
  const taskbar = document.getElementById('taskbar');
  const LOGIN_USER = "user";
  const LOGIN_PASS = "os1234";

  loginBox.onsubmit = loginBtn.onclick = function(){
    const id = document.getElementById('login-id').value;
    const pw = document.getElementById('login-pass').value;
    if(id===LOGIN_USER && pw===LOGIN_PASS){
      loginCover.style.opacity = 0;
      setTimeout(()=>{
        loginCover.style.display='none';
        desktop.style.display='';
        taskbar.style.display='';
        OS.init();
      },500);
      loginError.innerText = "";
    }else{
      loginError.innerText = "ユーザーIDまたはパスワードが違います";
    }
  };

  // OS本体
  window.OS = {
    z:100,
    wins:[],
    nextid:0,
    init: function() {
      this.wins = [];
      this.nextid = 0;
      document.getElementById('desktop').innerHTML = '';
      this.renderIcons();
      this.openApp('about');
      this.renderTasks();
    },
    renderIcons: function(){
      const desktop = document.getElementById('desktop');
      desktop.innerHTML = '';
      apps.forEach(a=>{
        let ic = document.createElement('div');
        ic.className = 'icon';
        ic.innerHTML = `<div style="font-size:2em">${a.icon}</div><div class="icon-label">${a.name}</div>`;
        ic.onclick = ()=>OS.openApp(a.id);
        desktop.appendChild(ic);
      });
    },
    openApp: function(appid,arg){
      let app = apps.find(a=>a.id===appid);
      if(!app)return;
      let winid = ++this.nextid;
      let win = {id:winid, appid, app, arg, minimized:false};
      this.wins.push(win);
      this.renderWin(win);
      this.focusWin(winid);
      this.renderTasks();
    },
    renderWin: function(win){
      let winEl = document.createElement('div');
      winEl.className = 'window';
      winEl.id = 'win-'+win.id;
      winEl.style.top = (60 + 30*Math.random())+'px';
      winEl.style.left = (80 + 40*Math.random())+'px';
      winEl.innerHTML = `
        <div class="titlebar" id="tb-${win.id}">
          <span>${win.app.icon} ${win.app.name}${win.arg?` <small>[${win.arg}]</small>`:''}</span>
          <div class="window-btns">
            <div class="window-btn min" title="最小化" onclick="OS.minimizeWin(${win.id})">–</div>
            <div class="window-btn max" title="最大化/復元" onclick="OS.maximizeWin(${win.id})">□</div>
            <div class="window-btn close" title="閉じる" onclick="OS.closeWin(${win.id})">×</div>
          </div>
        </div>
        <div class="win-content" id="content-${win.id}">${app.render(win.arg)}</div>
        <div class="window-resizer"></div>
      `;
      document.body.appendChild(winEl);

      // --- ウィンドウ移動 ---
      let tb = winEl.querySelector('.titlebar');
      let isDrag=false,dx,dy;
      tb.onmousedown = e=>{
        isDrag=true;dx=e.clientX-winEl.offsetLeft;dy=e.clientY-winEl.offsetTop;document.body.style.userSelect='none';
      };
      document.onmousemove = e=>{
        if(isDrag){
          winEl.style.left = (e.clientX-dx)+'px';
          winEl.style.top = (e.clientY-dy)+'px';
        }
      };
      document.onmouseup = ()=>{isDrag=false;document.body.style.userSelect='';};

      // --- ウィンドウリサイズ ---
      let resizer = winEl.querySelector('.window-resizer');
      let isResize=false,rx,ry,startW,startH;
      resizer.onmousedown = e=>{
        isResize=true;rx=e.clientX;ry=e.clientY;startW=winEl.offsetWidth;startH=winEl.offsetHeight;
        e.stopPropagation();document.body.style.userSelect='none';
      };
      document.onmousemove = e=>{
        if(isResize){
          winEl.style.width = Math.max(220, startW + (e.clientX - rx)) + "px";
          winEl.style.height = Math.max(120, startH + (e.clientY - ry)) + "px";
          let iframe=winEl.querySelector('.webview');
          if(iframe){
            let p=iframe.parentElement;
            iframe.style.height=Math.max(100,p.offsetHeight-60)+'px';
          }
        }
      };
      document.onmouseup = ()=>{isResize=false;document.body.style.userSelect='';};

      winEl.onclick = ()=>this.focusWin(win.id);
    },
    focusWin: function(id){
      this.wins.forEach(w=>{
        let el = document.getElementById('win-'+w.id);
        if(el)el.classList.toggle('inactive',w.id!==id);
        if(el)el.style.zIndex = w.id===id ? 999 : (100+w.id);
      });
    },
    closeWin: function(id){
      this.wins = this.wins.filter(w=>w.id!==id);
      let el = document.getElementById('win-'+id);
      if(el)el.remove();
      this.renderTasks();
    },
    minimizeWin: function(id){
      let el = document.getElementById('win-'+id);
      if(el)el.style.display='none';
      let win = this.wins.find(w=>w.id===id);
      if(win)win.minimized=true;
      this.renderTasks();
    },
    maximizeWin: function(id){
      let el = document.getElementById('win-'+id);
      if(!el)return;
      if(el.classList.toggle('maxed')){
        el.style.top='0';el.style.left='0';el.style.width='100vw';el.style.height='calc(100vh - 44px)';
        let iframe=el.querySelector('.webview');
        if(iframe){
          let p=iframe.parentElement;
          iframe.style.height=Math.max(100,p.offsetHeight-60)+'px';
        }
      }else{
        el.style.width='';el.style.height='';el.style.top='60px';el.style.left='80px';
      }
    },
    restoreWin: function(id){
      let el = document.getElementById('win-'+id);
      if(el)el.style.display='';
      let win = this.wins.find(w=>w.id===id);
      if(win)win.minimized=false;
      this.focusWin(id);
      this.renderTasks();
    },
    renderTasks: function(){
      let tbar = document.getElementById('tasks');
      tbar.innerHTML = '';
      this.wins.forEach(w=>{
        let btn = document.createElement('div');
        btn.className = 'task'+(w.minimized?'':' active');
        btn.innerText = w.app.icon+' '+w.app.name+(w.arg?`[${w.arg}]`:'');
        btn.onclick = ()=>{
          if(w.minimized)this.restoreWin(w.id);
          else this.focusWin(w.id);
        }
        tbar.appendChild(btn);
      });
    },
    refresh: function(){
      // 全ウィンドウ再描画（ファイルリスト更新用）
      this.wins.forEach(w=>{
        let c = document.getElementById('content-'+w.id);
        if(c){ c.innerHTML = w.app.render(w.arg);}
      });
    }
  };

  // タスクバー時計
  setInterval(()=>{let c=document.getElementById('clock');if(c)c.innerText=new Date().toLocaleTimeString();},1000);

  // スタートメニュー
  const startBtn = document.getElementById('start-btn');
  const startMenu = document.getElementById('start-menu');
  if(startBtn)startBtn.onclick = ()=>{
    startMenu.style.display = startMenu.style.display==='block'?'none':'block';
    if(startMenu.style.display==='block'){
      startMenu.innerHTML = apps.map(a=>`<div class="menu-app" onclick="OS.openApp('${a.id}')">${a.icon} ${a.name}</div>`).join('');
    }
  };
  if(desktop)desktop.onclick = ()=>{startMenu.style.display='none';};
}

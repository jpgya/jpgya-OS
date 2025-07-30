export const browser = {
  id:'browser',
  name:'Webビューア',
  icon:'🌐',
  render: function(){
    return `<input id="url" placeholder="https://..." style="width:68%" value="https://www.example.com">
      <button onclick="openWeb()">開く</button>
      <iframe id="webview" src="https://www.example.com" class="webview"></iframe>
      <script>
      function openWeb(){
        let u=document.getElementById('url').value;
        if(!u.startsWith('http'))u='https://'+u;
        document.getElementById('webview').src=u;
      }
      function fitIframe(){
        let iframe=document.getElementById('webview');
        let p=iframe.parentElement;
        iframe.style.height=Math.max(100,p.offsetHeight-60)+'px';
      }
      fitIframe();
      window.addEventListener('resize',fitIframe);
      </script>`;
  }
};

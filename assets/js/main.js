
// 本地直接打开 index.html 时，浏览器可能会记住上次滚动位置，导致顶部 logo 栏看起来“消失”。
// 这里强制首页加载后回到顶部，保证首页与内页顶部一致。
(function(){
  try {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    var path = (location.pathname || '').replace(/\\/g, '/');
    var isHome = /\/index\.html?$/.test(path) || /\/qhu_teaching_award_site\/?$/.test(path);
    if (isHome) {
      window.addEventListener('load', function(){ setTimeout(function(){ window.scrollTo(0, 0); }, 0); });
    }
  } catch(e) {}
})();


(function(){
  var slides = Array.prototype.slice.call(document.querySelectorAll('.hero-slide'));
  var dots = Array.prototype.slice.call(document.querySelectorAll('.hero-dot'));
  var prev = document.querySelector('[data-hero-prev]');
  var next = document.querySelector('[data-hero-next]');
  if(!slides.length) return;
  var index = 0;
  function show(i){
    index = (i + slides.length) % slides.length;
    slides.forEach(function(s, k){ s.classList.toggle('active', k === index); });
    dots.forEach(function(d, k){ d.classList.toggle('active', k === index); });
  }
  dots.forEach(function(dot, i){ dot.addEventListener('click', function(){ show(i); }); });
  if(prev) prev.addEventListener('click', function(){ show(index - 1); });
  if(next) next.addEventListener('click', function(){ show(index + 1); });
  setInterval(function(){ show(index + 1); }, 5000);
})();


// PDF 下载防护（方案A）：移除便捷下载入口后，进一步阻止常见的右键/快捷键保存。
// 说明：网页无法 100% 阻止下载，此处仅拦截普通用户的常规操作。
(function(){
  // 禁用右键菜单
  document.addEventListener('contextmenu', function(e){ e.preventDefault(); });
  // 拦截 Ctrl/Cmd + S(保存) / P(打印) / U(查看源码)
  document.addEventListener('keydown', function(e){
    var k = (e.key || '').toLowerCase();
    if ((e.ctrlKey || e.metaKey) && (k === 's' || k === 'p' || k === 'u')) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
  });
  // 禁止拖拽图片/PDF 预览框另存
  document.addEventListener('dragstart', function(e){
    var t = e.target;
    if (t && (t.tagName === 'IMG' || t.tagName === 'IFRAME')) e.preventDefault();
  });
})();


// 首页「成果简介」折叠：裁到与「成果视频」等高，末尾省略号可点击展开/收起。
(function(){
  var box = document.querySelector('.home-main .intro-box');
  var vid = document.querySelector('.home-main .video-box');
  if (!box || !vid) return;
  var toggle = document.createElement('span');
  toggle.className = 'intro-toggle';
  box.appendChild(toggle);
  function clamp(on){
    if (on){
      box.style.height = vid.offsetHeight + 'px';
      box.classList.add('intro-clamped');
      toggle.textContent = '……展开';
    } else {
      box.style.height = '';
      box.classList.remove('intro-clamped');
      toggle.textContent = '收起';
    }
  }
  clamp(true);
  // 内容本就不超高则无需折叠
  if (box.scrollHeight <= box.clientHeight){
    box.style.height = '';
    box.classList.remove('intro-clamped');
    toggle.remove();
    return;
  }
  toggle.addEventListener('click', function(){
    clamp(!box.classList.contains('intro-clamped'));
  });
})();

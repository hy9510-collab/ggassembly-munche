/* 공통 셸 · 유틸 — 문화체육관광위원회 의정지원 시스템 */
const NAV = [
  ['index.html',    '종합 현황',      '📊'],
  ['members.html',  '의원 현황',      '👤'],
  ['committee.html','상임위원회',     '⚖'],
  ['executives.html','소관 실국·기관','🏢'],
  ['ordinances.html','조례 현황',     '📚'],
  ['maptree.html',  '조례 체계도',    '🌳'],
  ['budget.html',   '예산안 자료',    '💰'],
  ['audit.html',    '행정사무감사',   '🔎'],
  ['HAENG',         '행감 준비(별도)','🗂'],
  ['reports.html',  '업무보고',       '📑'],
  ['schedule.html', '회기 일정',      '🗓'],
  ['links.html',    '자료실·바로가기','🔗'],
];

/* ── 실행 환경 ──
   file:// 또는 localhost = 내 컴퓨터(전체 자료), github.io = 공개 주소(예산 자료 없음) */
const ONLINE = location.protocol.startsWith('http') &&
               !/^(localhost|127\.|\[?::1|0\.0\.0\.0)/.test(location.hostname);

/* 다른 저장소로 배포된 페이지 — 공개 주소에서는 깃허브 주소로 연결 */
const HOME_URL  = ONLINE ? 'https://hy9510-collab.github.io/ggassembly-gongmo/'   : '../index.html';
const HAENG_URL = ONLINE ? 'https://hy9510-collab.github.io/ggassembly-haenggam/' : '../행정사무감사/index.html';

function shell(active){
  const nav = NAV.map(([h,t,i]) => {
    const href = h === 'HAENG' ? HAENG_URL : h;
    return `<a href="${href}"${h===active?' class="on"':''}>${i} ${t}</a>`;
  }).join('');
  document.body.insertAdjacentHTML('afterbegin', `
  <div class="topbar"><div class="topbar-in">
    <div class="crest">道</div>
    <div class="brand">
      <b><a href="index.html">경기도의회 문화체육관광위원회</a></b>
      <span>제12대 전반기 · 의정지원 시스템</span>
    </div>
    <div class="topbar-act">
      <a class="tb-btn" href="${HOME_URL}">← 시스템 홈</a>
      <button class="tb-btn" onclick="window.print()">🖨 인쇄</button>
    </div>
  </div></div>
  <nav class="nav"><div class="nav-in">${nav}</div></nav>`);

  document.body.insertAdjacentHTML('beforeend', `
  <footer>
    <b>경기도의회 문화체육관광위원회 의정지원 시스템</b><br>
    <span class="np">제12대 전반기 · 정책지원관 김하영</span><br>
    <span class="np" style="font-size:11px">조례 : 국가법령정보센터·경기도 상임위원회별 조례 현황 (2026. 7. 16. 기준 131건)
    ${ONLINE ? '' : '· 예산 : 2026년도 본예산안 총괄자료(문화체육관광국 제출, 상임위 심사용)'}</span>
  </footer>`);

  // 현재 페이지 탭을 가로 스크롤 시야에 넣기
  const cur = document.querySelector('.nav a.on');
  if (cur) cur.scrollIntoView({block:'nearest', inline:'center'});

  // 내 컴퓨터에서만 열리는 링크 — 공개 주소에서는 눌리지 않게 표시
  if (ONLINE) document.querySelectorAll('a.localonly').forEach(a=>{
    a.classList.add('off'); a.removeAttribute('href');
    a.insertAdjacentHTML('beforeend', '<em>내 컴퓨터에서만 열림</em>');
  });
}

/* ── 숫자 포맷 (예산 원자료 단위: 천원) ── */
const fmt  = n => Number(n).toLocaleString('ko-KR');
// 천원 → 억원
const eok  = n => (n/100000);
const eokS = (n,d=0) => eok(n).toLocaleString('ko-KR',{minimumFractionDigits:d,maximumFractionDigits:d});
const joS  = n => (n/100000000).toLocaleString('ko-KR',{minimumFractionDigits:2,maximumFractionDigits:2});

function delta(a,b){                      // a=당해, b=전년
  if(!b) return {t:'순증', cls:'up-t', pct:null};
  const p = (a-b)/b*100;
  return {t:(p>=0?'▲ ':'▼ ') + Math.abs(p).toFixed(1) + '%',
          cls:p>=0?'up-t':'dn-t', pct:p};
}

function bars(rows, max){                  // rows: [{lb, v, vs}]
  const m = max || Math.max(...rows.map(r=>r.v));
  return `<div class="bars">` + rows.map(r=>`
    <div class="bar-row">
      <div class="lb" title="${r.lb}">${r.lb}</div>
      <div class="bar-track"><div class="bar-fill" style="width:${(r.v/m*100).toFixed(1)}%"></div></div>
      <div class="vl">${r.vs}</div>
    </div>`).join('') + `</div>`;
}

const PIE = ['#185FA5','#2e8fbf','#5eb3d9','#7c3aed','#d97706','#16a34a','#db2777','#0891b2','#94a3b8'];

function donut(rows, size){                // rows: [{lb, v}]
  const s = size||168, r = s/2-14, c = 2*Math.PI*r, tot = rows.reduce((a,b)=>a+b.v,0);
  let off = 0;
  const segs = rows.map((row,i)=>{
    const len = row.v/tot*c;
    const el = `<circle cx="${s/2}" cy="${s/2}" r="${r}" fill="none" stroke="${PIE[i%PIE.length]}"
      stroke-width="20" stroke-dasharray="${len.toFixed(2)} ${(c-len).toFixed(2)}"
      stroke-dashoffset="${(-off).toFixed(2)}" transform="rotate(-90 ${s/2} ${s/2})"><title>${row.lb}</title></circle>`;
    off += len; return el;
  }).join('');
  const leg = rows.map((row,i)=>
    `<div><i style="background:${PIE[i%PIE.length]}"></i>${row.lb}<b>${(row.v/tot*100).toFixed(1)}%</b></div>`).join('');
  return `<div class="donut-wrap">
    <svg width="${s}" height="${s}" viewBox="0 0 ${s} ${s}" role="img">${segs}</svg>
    <div class="legend">${leg}</div></div>`;
}

/* ── 검색 하이라이트 ── */
const esc = s => String(s).replace(/[&<>"]/g, m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]));
function hl(text, q){
  const t = esc(text);
  if(!q) return t;
  return t.replace(new RegExp('(' + q.replace(/[.*+?^${}()|[\]\\]/g,'\\$&') + ')','gi'), '<mark>$1</mark>');
}

/* ── CSV 내려받기 (엑셀에서 바로 열리도록 BOM 포함) ── */
function toCSV(head, rows, filename){
  const q = v => `"${String(v==null?'':v).replace(/"/g,'""')}"`;
  const csv = '﻿' + [head, ...rows].map(r=>r.map(q).join(',')).join('\r\n');
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([csv], {type:'text/csv;charset=utf-8'}));
  a.download = filename;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(()=>URL.revokeObjectURL(a.href), 1000);
}

const load = async f => (await fetch('data/' + f)).json();

/* ── 예산 자료(로컬 전용) ──
   집행부가 제출한 심사용 예산자료는 깃허브에 올리지 않는다(.gitignore).
   파일이 있으면 예산 화면이 모두 나오고, 없으면 해당 영역만 조용히 빠진다. */
const loadBudget = async () => {
  try {
    const r = await fetch('data/budget.json');
    if (!r.ok) return null;
    return await r.json();
  } catch { return null; }
};

const BUDGET_NOTE = `<div class="note budget-note">💻 <b>예산 자료는 내 컴퓨터에서만 보입니다.</b>
  문화체육관광국이 제출한 상임위 심사용 예산자료는 공개 주소에 올리지 않았습니다.
  예산 화면을 보시려면 <code>실습\\문화체육관광위원회\\</code> 폴더에서 이 페이지를 여세요.</div>`;

/* 예산 자료가 없을 때 특정 영역을 통째로 감춘다.
   sel 로 넘긴 요소와 그 바로 앞 h2.sec(제목)까지 함께 제거한다. */
function hideBudgetBlocks(...sels){
  sels.forEach(sel => document.querySelectorAll(sel).forEach(el=>{
    let p = el.previousElementSibling;
    while (p && !/^(H2|H3)$/.test(p.tagName) && !p.classList.contains('tbl-wrap')) {
      if (p.classList.contains('searchbar') || p.classList.contains('note')) { const q = p.previousElementSibling; p.remove(); p = q; }
      else break;
    }
    if (p && p.tagName === 'H2') p.remove();
    el.remove();
  }));
}

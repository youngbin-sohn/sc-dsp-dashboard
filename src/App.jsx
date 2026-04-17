import { useState, useRef, useEffect } from "react";

// ── 샘플 데이터 ───────────────────────────────────────────────────
const CAMPAIGNS = [
  { id:"C-001", name:"pizzaready_aos_inhouse_ua",  status:"ON",  app:"Pizza Ready!",   creative:"CR-Video-v3",  creativeType:"video",    os:"Android", country:"US", sourceApp:"Snake Clash! (Android)", adFormat:"Interstitial", spend:14200, imp:2780000, clicks:1531000, bids:540000, bidReqs:680000, wins:108000, inst:10540, noFillCnt:51000, cvr:0.38, cpi:1.35, cpm:5.11, ctr:55.1, cpc:0.009, bidRate:79.4, winRate:19.8, noFill:7.4, avgBid:5.21, d0Rev:2880, d7Rev:9110, d0RoasAd:20.3, d7RoasAd:64.1, d0RoasAll:22.1, d7RoasAll:70.2, d0Ltv:0.27, d7Ltv:0.88, d0Ret:41.2, d7Ret:18.4, d14Ret:11.2, d28Ret:6.8, iapRatio:2.1 },
  { id:"C-002", name:"snakeclash_aos_inhouse_ua",   status:"ON",  app:"Snake Clash!",   creative:"CR-Play-v1",   creativeType:"playable", os:"Android", country:"US", sourceApp:"Pizza Ready! (Android)", adFormat:"Rewarded Video", spend:11800, imp:2300000, clicks:1426000, bids:440000, bidReqs:560000, wins:88000,  inst:8760,  noFillCnt:43000, cvr:0.38, cpi:1.35, cpm:5.13, ctr:62.0, cpc:0.008, bidRate:78.6, winRate:19.4, noFill:7.8, avgBid:5.18, d0Rev:2490, d7Rev:7810, d0RoasAd:21.1, d7RoasAd:66.3, d0RoasAll:23.0, d7RoasAll:72.1, d0Ltv:0.29, d7Ltv:0.91, d0Ret:43.1, d7Ret:19.2, d14Ret:12.1, d28Ret:7.2, iapRatio:1.8 },
  { id:"C-003", name:"outletsrush_aos_inhouse_ua",  status:"OFF", app:"Outlets Rush",   creative:"CR-Video-v2",  creativeType:"video",    os:"Android", country:"KR", sourceApp:"Burger (Android)",       adFormat:"Interstitial", spend:7480,  imp:1410000, clicks:867000,  bids:275000, bidReqs:340000, wins:55000,  inst:5520,  noFillCnt:27000, cvr:0.39, cpi:1.35, cpm:5.30, ctr:61.5, cpc:0.009, bidRate:80.9, winRate:19.6, noFill:8.1, avgBid:5.30, d0Rev:1380, d7Rev:4760, d0RoasAd:18.4, d7RoasAd:63.8, d0RoasAll:20.1, d7RoasAll:68.4, d0Ltv:0.25, d7Ltv:0.84, d0Ret:38.4, d7Ret:16.8, d14Ret:10.1, d28Ret:5.9, iapRatio:1.5 },
  { id:"C-004", name:"burger_aos_inhouse_ua",       status:"ON",  app:"Burger!",        creative:"CR-Banner-v1", creativeType:"banner",   os:"iOS",     country:"JP", sourceApp:"Outlets Rush (Android)", adFormat:"Banner",       spend:5100,  imp:990000,  clicks:614000,  bids:198000, bidReqs:248000, wins:39000,  inst:3820,  noFillCnt:18000, cvr:0.39, cpi:1.34, cpm:5.15, ctr:62.0, cpc:0.008, bidRate:79.8, winRate:20.1, noFill:6.9, avgBid:5.09, d0Rev:1010, d7Rev:3120, d0RoasAd:19.8, d7RoasAd:61.2, d0RoasAll:21.4, d7RoasAll:65.8, d0Ltv:0.26, d7Ltv:0.82, d0Ret:39.8, d7Ret:17.1, d14Ret:10.4, d28Ret:6.1, iapRatio:1.2 },
];

// ── 전체 컬럼 정의 ────────────────────────────────────────────────
const ALL_COLS = [
  // 기본 (항상 고정)
  { key:"status",     label:"Status",        tier:"default", fixed:true,  fmt: v => v },
  { key:"spend",      label:"Spend",         tier:"default", fixed:false, fmt: v => "$"+v.toLocaleString() },
  { key:"imp",        label:"Impressions",   tier:"default", fixed:false, fmt: v => fmtN(v) },
  { key:"clicks",     label:"Clicks",        tier:"default", fixed:false, fmt: v => fmtN(v) },
  { key:"inst",       label:"Installs",      tier:"default", fixed:false, fmt: v => fmtN(v) },
  { key:"cvr",        label:"CVR",           tier:"default", fixed:false, fmt: v => v.toFixed(2)+"%" },
  { key:"cpi",        label:"CPI",           tier:"default", fixed:false, fmt: v => "$"+v.toFixed(2) },
  { key:"cpm",        label:"CPM",           tier:"default", fixed:false, fmt: v => "$"+v.toFixed(2) },
  { key:"winRate",    label:"Win Rate",      tier:"default", fixed:false, fmt: v => v.toFixed(2)+"%" },
  { key:"noFill",     label:"No-fill Rate",  tier:"default", fixed:false, fmt: v => v.toFixed(2)+"%" },
  { key:"d0RoasAd",   label:"D0 ROAS",       tier:"default", fixed:false, fmt: v => v.toFixed(2)+"%" },
  { key:"d7RoasAd",   label:"D7 ROAS",       tier:"default", fixed:false, fmt: v => v.toFixed(2)+"%" },
  { key:"d0Ltv",      label:"D0 LTV",        tier:"default", fixed:false, fmt: v => "$"+v.toFixed(2) },
  { key:"d7Ltv",      label:"D7 LTV",        tier:"default", fixed:false, fmt: v => "$"+v.toFixed(2) },
  { key:"d0Ret",      label:"Retention D0",  tier:"default", fixed:false, fmt: v => v.toFixed(1)+"%" },
  { key:"d7Ret",      label:"Retention D7",  tier:"default", fixed:false, fmt: v => v.toFixed(1)+"%" },
  // Tier 1 추가
  { key:"bidReqs",    label:"Bid Requests",  tier:"T1", fixed:false, fmt: v => fmtN(v) },
  { key:"bids",       label:"Bids",          tier:"T1", fixed:false, fmt: v => fmtN(v) },
  { key:"bidRate",    label:"Bid Rate",      tier:"T1", fixed:false, fmt: v => v.toFixed(2)+"%" },
  { key:"wins",       label:"Wins",          tier:"T1", fixed:false, fmt: v => fmtN(v) },
  { key:"ctr",        label:"CTR",           tier:"T1", fixed:false, fmt: v => v.toFixed(2)+"%" },
  { key:"noFillCnt",  label:"No-fill Count", tier:"T1", fixed:false, fmt: v => fmtN(v) },
  // Tier 2 추가
  { key:"cpc",        label:"CPC",           tier:"T2", fixed:false, fmt: v => "$"+v.toFixed(3) },
  { key:"avgBid",     label:"Avg Bid Price", tier:"T2", fixed:false, fmt: v => "$"+v.toFixed(2) },
  // Tier 3 추가
  { key:"d0Rev",      label:"D0 Revenue",    tier:"T3", fixed:false, fmt: v => "$"+v.toLocaleString() },
  { key:"d7Rev",      label:"D7 Revenue",    tier:"T3", fixed:false, fmt: v => "$"+v.toLocaleString() },
  { key:"d0RoasAll",  label:"D0 ROAS All",   tier:"T3", fixed:false, fmt: v => v.toFixed(2)+"%" },
  { key:"d7RoasAll",  label:"D7 ROAS All",   tier:"T3", fixed:false, fmt: v => v.toFixed(2)+"%" },
  { key:"d14Ret",     label:"Retention D14", tier:"T3", fixed:false, fmt: v => v.toFixed(1)+"%" },
  { key:"d28Ret",     label:"Retention D28", tier:"T3", fixed:false, fmt: v => v.toFixed(1)+"%" },
  { key:"iapRatio",   label:"IAP Ratio",     tier:"T3", fixed:false, fmt: v => v.toFixed(1)+"%" },
];

const fmtN = n => n>=1e6?(n/1e6).toFixed(2)+"M":n>=1e3?(n/1e3).toFixed(1)+"K":String(n);

const PRESET_RANGES = ["오늘","어제","최근 7일","최근 14일","최근 30일","최근 60일","최근 90일","이번 달","지난 달"];
const getRange = p => {
  const now = new Date("2026-04-17");
  const fmt = d => d.toISOString().slice(0,10);
  const sub = (d,n) => { const r=new Date(d); r.setDate(r.getDate()-n); return r; };
  const m = { "오늘":[fmt(now),fmt(now)], "어제":[fmt(sub(now,1)),fmt(sub(now,1))], "최근 7일":[fmt(sub(now,6)),fmt(now)], "최근 14일":[fmt(sub(now,13)),fmt(now)], "최근 30일":[fmt(sub(now,29)),fmt(now)], "최근 60일":[fmt(sub(now,59)),fmt(now)], "최근 90일":[fmt(sub(now,89)),fmt(now)], "이번 달":[fmt(new Date(now.getFullYear(),now.getMonth(),1)),fmt(now)] };
  if (p==="지난 달") return [fmt(new Date(now.getFullYear(),now.getMonth()-1,1)),fmt(new Date(now.getFullYear(),now.getMonth(),0))];
  return m[p]||m["최근 30일"];
};

// 드롭다운 공통
function Dropdown({ label, options, value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef();
  useEffect(() => { const h=e=>{ if(ref.current&&!ref.current.contains(e.target)) setOpen(false); }; document.addEventListener("mousedown",h); return()=>document.removeEventListener("mousedown",h); },[]);
  const active = value !== "all";
  return (
    <div className="relative" ref={ref}>
      <button onClick={()=>setOpen(o=>!o)}
        className={`flex items-center gap-1.5 border rounded-lg px-3 py-1.5 text-xs transition-colors
          ${active?"bg-blue-900 border-blue-500 text-blue-300":"bg-gray-800 border-gray-600 text-gray-300 hover:border-gray-400"}`}>
        {label}{active?`: ${options.find(o=>o.value===value)?.label||value}`:""}
        <svg className="w-3 h-3 text-gray-400 ml-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/></svg>
      </button>
      {open && (
        <div className="absolute top-full mt-1 left-0 bg-gray-800 border border-gray-600 rounded-xl shadow-xl z-50 min-w-max py-1">
          {[{value:"all",label:"전체"},...options].map(o=>(
            <button key={o.value} onClick={()=>{onChange(o.value);setOpen(false);}}
              className={`w-full text-left px-4 py-1.5 text-xs hover:bg-gray-700 transition-colors
                ${value===o.value?"text-blue-400 font-semibold":"text-gray-300"}`}>
              {o.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// 날짜 선택
function DatePicker({ preset, setPreset, range }) {
  const [open, setOpen] = useState(false);
  const ref = useRef();
  useEffect(()=>{ const h=e=>{if(ref.current&&!ref.current.contains(e.target))setOpen(false);}; document.addEventListener("mousedown",h); return()=>document.removeEventListener("mousedown",h); },[]);
  return (
    <div className="relative" ref={ref}>
      <button onClick={()=>setOpen(o=>!o)}
        className="flex items-center gap-2 bg-gray-800 border border-gray-600 hover:border-gray-400 rounded-lg px-3 py-1.5 text-xs transition-colors">
        <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
        <span className="text-gray-400 font-medium">UTC</span>
        <span className="text-gray-500">{preset}:</span>
        <span className="text-white font-medium">{range[0]} - {range[1]}</span>
        <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/></svg>
      </button>
      {open && (
        <div className="absolute right-0 mt-1 bg-gray-800 border border-gray-600 rounded-xl shadow-xl z-50 w-44 py-1">
          {PRESET_RANGES.map(p=>(
            <button key={p} onClick={()=>{setPreset(p);setOpen(false);}}
              className={`w-full text-left px-4 py-1.5 text-xs hover:bg-gray-700 transition-colors ${preset===p?"text-blue-400 font-semibold":"text-gray-300"}`}>
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// 컬럼 선택 패널
function ColumnSelector({ visibleKeys, setVisibleKeys }) {
  const [open, setOpen] = useState(false);
  const ref = useRef();
  useEffect(()=>{ const h=e=>{if(ref.current&&!ref.current.contains(e.target))setOpen(false);}; document.addEventListener("mousedown",h); return()=>document.removeEventListener("mousedown",h); },[]);
  const tiers = [
    { label:"기본 컬럼", cols: ALL_COLS.filter(c=>c.tier==="default"&&!c.fixed) },
    { label:"Tier 1 — Funnel", cols: ALL_COLS.filter(c=>c.tier==="T1") },
    { label:"Tier 2 — Cost", cols: ALL_COLS.filter(c=>c.tier==="T2") },
    { label:"Tier 3 — Revenue & Quality", cols: ALL_COLS.filter(c=>c.tier==="T3") },
  ];
  const toggle = key => {
    setVisibleKeys(prev => prev.includes(key) ? prev.filter(k=>k!==key) : [...prev, key]);
  };
  const added = ALL_COLS.filter(c=>!c.fixed&&visibleKeys.includes(c.key)&&c.tier!=="default").length;
  return (
    <div className="relative" ref={ref}>
      <button onClick={()=>setOpen(o=>!o)}
        className="flex items-center gap-1.5 bg-gray-800 border border-gray-600 hover:border-gray-400 rounded-lg px-3 py-1.5 text-xs text-gray-300 transition-colors">
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7"/></svg>
        Columns {added>0&&<span className="bg-blue-600 text-white text-xs rounded-full px-1.5">{added}</span>}
      </button>
      {open && (
        <div className="absolute right-0 mt-1 bg-gray-800 border border-gray-600 rounded-xl shadow-xl z-50 w-72 py-2 max-h-96 overflow-y-auto">
          <div className="px-4 py-1.5 text-xs font-semibold text-gray-400 border-b border-gray-700 mb-1">컬럼 추가/제거</div>
          {tiers.map(({ label, cols }) => (
            <div key={label} className="mb-1">
              <div className="px-4 py-1 text-xs text-gray-500 font-medium">{label}</div>
              {cols.map(col => (
                <label key={col.key} className="flex items-center gap-2.5 px-4 py-1.5 hover:bg-gray-700 cursor-pointer transition-colors">
                  <input type="checkbox"
                    checked={visibleKeys.includes(col.key)}
                    onChange={()=>toggle(col.key)}
                    className="accent-blue-500 w-3.5 h-3.5"/>
                  <span className="text-xs text-gray-300">{col.label}</span>
                </label>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── 메인 ──────────────────────────────────────────────────────────
const DEFAULT_VISIBLE = ALL_COLS.filter(c=>c.tier==="default").map(c=>c.key);

export default function App() {
  const [preset, setPreset]   = useState("최근 30일");
  const [range, setRange]     = useState(getRange("최근 30일"));
  const [sortKey, setSortKey] = useState("spend");
  const [sortAsc, setSortAsc] = useState(false);
  const [search, setSearch]   = useState("");
  const [visibleKeys, setVisibleKeys] = useState(DEFAULT_VISIBLE);

  // 디멘션 필터 state
  const [fStatus,      setFStatus]      = useState("all");
  const [fApp,         setFApp]         = useState("all");
  const [fCreativeType,setFCreativeType]= useState("all");
  const [fOS,          setFOS]          = useState("all");
  const [fCountry,     setFCountry]     = useState("all");
  const [fSourceApp,   setFSourceApp]   = useState("all");
  const [fAdFormat,    setFAdFormat]    = useState("all");

  const handlePreset = p => { setPreset(p); setRange(getRange(p)); };

  // 유니크 옵션 추출
  const uniq = (key) => [...new Set(CAMPAIGNS.map(r=>r[key]))].map(v=>({value:v,label:v}));

  const filtered = CAMPAIGNS
    .filter(r =>
      (fStatus==="all"||r.status===fStatus) &&
      (fApp==="all"||r.app===fApp) &&
      (fCreativeType==="all"||r.creativeType===fCreativeType) &&
      (fOS==="all"||r.os===fOS) &&
      (fCountry==="all"||r.country===fCountry) &&
      (fSourceApp==="all"||r.sourceApp===fSourceApp) &&
      (fAdFormat==="all"||r.adFormat===fAdFormat) &&
      (search===""||r.name.toLowerCase().includes(search.toLowerCase()))
    )
    .sort((a,b) => {
      const v = a[sortKey]>b[sortKey]?1:-1;
      return sortAsc?v:-v;
    });

  // 표시할 컬럼 (fixed는 항상 포함, 나머지는 visibleKeys 기준)
  const visibleCols = ALL_COLS.filter(c=>c.fixed||visibleKeys.includes(c.key));

  const handleSort = k => { if(sortKey===k) setSortAsc(a=>!a); else { setSortKey(k); setSortAsc(false); } };

  // 합계/평균 행
  const totOrAvg = (col) => {
    const sumKeys = ["spend","imp","clicks","inst","bids","bidReqs","wins","noFillCnt","d0Rev","d7Rev"];
    const avgKeys = ["cvr","cpi","cpm","ctr","cpc","bidRate","winRate","noFill","avgBid","d0RoasAd","d7RoasAd","d0RoasAll","d7RoasAll","d0Ltv","d7Ltv","d0Ret","d7Ret","d14Ret","d28Ret","iapRatio"];
    if(col.key==="status") return null;
    if(sumKeys.includes(col.key)) return col.fmt(filtered.reduce((s,r)=>s+r[col.key],0));
    if(avgKeys.includes(col.key)&&filtered.length) return col.fmt(filtered.reduce((s,r)=>s+r[col.key],0)/filtered.length);
    return "—";
  };

  return (
    <div className="bg-gray-900 min-h-screen text-white font-sans text-xs">
      {/* 헤더 */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-gray-700">
        <h1 className="text-sm font-bold">Reporting</h1>
        <DatePicker preset={preset} setPreset={handlePreset} range={range}/>
      </div>

      <div className="px-5 py-4">
        {/* 필터 바 */}
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          {/* 캠페인 디멘션 */}
          <Dropdown label="Status"        options={[{value:"ON",label:"ON"},{value:"OFF",label:"OFF"}]} value={fStatus}       onChange={setFStatus}/>
          <Dropdown label="Advertiser App" options={uniq("app")}          value={fApp}          onChange={setFApp}/>
          <Dropdown label="Creative Type"  options={uniq("creativeType")} value={fCreativeType}  onChange={setFCreativeType}/>
          <Dropdown label="OS"             options={uniq("os")}           value={fOS}            onChange={setFOS}/>
          <Dropdown label="Country"        options={uniq("country")}      value={fCountry}       onChange={setFCountry}/>
          {/* 인벤토리 디멘션 */}
          <Dropdown label="Source App"    options={uniq("sourceApp")}    value={fSourceApp}     onChange={setFSourceApp}/>
          <Dropdown label="Ad Format"     options={uniq("adFormat")}     value={fAdFormat}      onChange={setFAdFormat}/>

          <div className="flex items-center gap-1.5 bg-gray-800 border border-gray-600 rounded-lg px-3 py-1.5 flex-1 min-w-40">
            <svg className="w-3.5 h-3.5 text-gray-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
            <input className="bg-transparent text-gray-300 placeholder-gray-600 outline-none flex-1 text-xs"
              placeholder="Filter by campaign name..." value={search} onChange={e=>setSearch(e.target.value)}/>
          </div>

          <ColumnSelector visibleKeys={visibleKeys} setVisibleKeys={setVisibleKeys}/>
        </div>

        {/* 테이블 */}
        <div className="bg-gray-800 border border-gray-700 rounded-xl overflow-x-auto">
          <table className="w-full text-xs whitespace-nowrap">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left px-4 py-2.5 text-gray-400 font-medium sticky left-0 bg-gray-800 z-10">Campaign name</th>
                {visibleCols.map(col=>(
                  <th key={col.key}
                    className="text-right px-3 py-2.5 text-gray-400 font-medium cursor-pointer hover:text-white select-none"
                    onClick={()=>!col.fixed&&handleSort(col.key)}>
                    <span className="flex items-center justify-end gap-1">
                      {col.label}
                      {!col.fixed&&(sortKey===col.key
                        ? <span className="text-blue-400">{sortAsc?"↑":"↓"}</span>
                        : <span className="text-gray-700">↕</span>)}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length===0 && (
                <tr><td colSpan={visibleCols.length+1} className="text-center py-10 text-gray-500">조건에 맞는 캠페인이 없습니다</td></tr>
              )}
              {filtered.map((r,i)=>(
                <tr key={r.id} className="border-b border-gray-700/50 hover:bg-gray-700/30 transition-colors">
                  <td className="px-4 py-2 sticky left-0 bg-gray-900 font-mono text-blue-300 z-10">
                    <span title={r.name}>{r.name.length>36?r.name.slice(0,36)+"…":r.name}</span>
                  </td>
                  {visibleCols.map(col=>{
                    if(col.key==="status") return (
                      <td key={col.key} className="text-right px-3 py-2">
                        <span className={`px-2 py-0.5 rounded text-xs font-medium
                          ${r.status==="ON"?"bg-green-900 text-green-400":"bg-gray-700 text-gray-400"}`}>
                          {r.status}
                        </span>
                      </td>
                    );
                    const v = r[col.key];
                    const isAlert  = col.key==="noFill"&&v>30;
                    const isWin    = col.key==="winRate"&&v>20;
                    const isRoas   = col.key==="d7RoasAd"||col.key==="d7RoasAll";
                    return (
                      <td key={col.key} className={`text-right px-3 py-2
                        ${isAlert?"text-red-400 font-semibold":""}
                        ${isWin&&!isAlert?"text-green-400":""}
                        ${isRoas&&!isAlert&&!isWin?"text-yellow-400":""}
                        ${!isAlert&&!isWin&&!isRoas?"text-gray-300":""}`}>
                        {col.fmt(v)}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t border-gray-600 bg-gray-800/80">
                <td className="px-4 py-2 text-gray-400 font-semibold sticky left-0 bg-gray-800 z-10">합계 / 평균 ({filtered.length}개)</td>
                {visibleCols.map(col=>(
                  <td key={col.key} className="text-right px-3 py-2 text-gray-400 font-semibold">
                    {totOrAvg(col)||""}
                  </td>
                ))}
              </tr>
            </tfoot>
          </table>
        </div>

        {/* 페이지네이션 */}
        <div className="flex items-center justify-between mt-3 text-gray-500 text-xs">
          <span>{filtered.length} campaigns</span>
          <div className="flex items-center gap-2">
            <span>50 / Page</span>
            <button className="w-6 h-6 rounded bg-blue-600 text-white text-xs">1</button>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect, useRef, useCallback, useMemo, Suspense } from "react";
import * as THREE from "three";

/* ═══════════════════════════════════════════════════════════════
   GLOBAL STYLES — Cyberpunk Futuristic Theme
═══════════════════════════════════════════════════════════════ */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&family=Rajdhani:wght@300;400;500;600;700&family=Share+Tech+Mono&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  body {
    font-family: 'Rajdhani', system-ui, sans-serif;
    background: #03050d;
    color: #c8d6f0;
    -webkit-font-smoothing: antialiased;
    background-image:
      radial-gradient(ellipse 1200px 700px at 20% 10%, rgba(0,120,255,.04) 0%, transparent 65%),
      radial-gradient(ellipse 900px 600px at 80% 85%, rgba(0,240,200,.03) 0%, transparent 65%),
      linear-gradient(180deg, #03050d 0%, #040810 100%);
    min-height: 100vh;
  }
  :root {
    --c1: #00f0ff;
    --c2: #0070ff;
    --c3: #7000ff;
    --c4: #00ffa3;
    --c5: #ff003c;
    --bg0: #03050d;
    --bg1: #060b18;
    --bg2: #080d1f;
    --bg3: #0c1228;
    --border: rgba(0,240,255,.1);
    --border2: rgba(0,240,255,.2);
    --text: #c8d6f0;
    --muted: #4a5a7a;
    --card: rgba(6,11,24,.85);
  }
  input, select, textarea, button { font-family: 'Rajdhani', sans-serif; }
  a { text-decoration: none; color: inherit; }
  ::-webkit-scrollbar { width: 4px; height: 4px; }
  ::-webkit-scrollbar-track { background: var(--bg0); }
  ::-webkit-scrollbar-thumb { background: var(--c2); border-radius: 99px; }

  @keyframes fadeUp    { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:none} }
  @keyframes fadeIn    { from{opacity:0} to{opacity:1} }
  @keyframes slideL    { from{opacity:0;transform:translateX(40px)} to{opacity:1;transform:none} }
  @keyframes slideR    { from{opacity:0;transform:translateX(-40px)} to{opacity:1;transform:none} }
  @keyframes spin      { to{transform:rotate(360deg)} }
  @keyframes pulse     { 0%,100%{opacity:1} 50%{opacity:.4} }
  @keyframes scanline  { 0%{transform:translateY(-100%)} 100%{transform:translateY(100vh)} }
  @keyframes flicker   { 0%,98%,100%{opacity:1} 99%{opacity:.7} }
  @keyframes glowPulse { 0%,100%{box-shadow:0 0 20px rgba(0,240,255,.3)} 50%{box-shadow:0 0 50px rgba(0,240,255,.7),0 0 80px rgba(0,112,255,.3)} }
  @keyframes borderAnim{ 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
  @keyframes float     { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-18px)} }
  @keyframes dataFlow  { 0%{opacity:0;transform:translateY(0)} 100%{opacity:.6;transform:translateY(-60px)} }
  @keyframes toastIn   { from{opacity:0;transform:translateX(120%)} to{opacity:1;transform:none} }
  @keyframes toastOut  { from{opacity:1} to{opacity:0;transform:translateX(120%)} }
  @keyframes modalIn   { from{opacity:0;transform:scale(.92) translateY(20px)} to{opacity:1;transform:none} }
  @keyframes neonFlash { 0%,100%{text-shadow:0 0 10px var(--c1),0 0 30px var(--c2)} 50%{text-shadow:0 0 20px var(--c1),0 0 60px var(--c2),0 0 100px var(--c3)} }
  @keyframes gridMove  { 0%{background-position:0 0} 100%{background-position:50px 50px} }
  @keyframes hologram  { 0%,100%{opacity:1;transform:skewX(0)} 92%{opacity:1} 93%{opacity:.7;transform:skewX(2deg)} 95%{opacity:1;transform:skewX(0)} }

  .fade-up  { animation: fadeUp  .6s cubic-bezier(.22,1,.36,1) both }
  .fade-in  { animation: fadeIn  .4s ease both }
  .slide-l  { animation: slideL  .4s cubic-bezier(.22,1,.36,1) both }
  .orb-card {
    background: var(--card);
    backdrop-filter: blur(24px);
    border: 1px solid var(--border);
    transition: border-color .3s, box-shadow .3s, transform .3s;
  }
  .orb-card:hover {
    border-color: rgba(0,240,255,.35);
    box-shadow: 0 0 40px rgba(0,240,255,.08), 0 20px 60px rgba(0,0,0,.6);
    transform: translateY(-6px);
  }
  .neon-btn {
    background: linear-gradient(135deg, rgba(0,240,255,.12), rgba(0,112,255,.1));
    border: 1px solid rgba(0,240,255,.4);
    color: var(--c1);
    border-radius: 6px;
    padding: 10px 24px;
    font-family: 'Orbitron', sans-serif;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: .12em;
    text-transform: uppercase;
    cursor: pointer;
    transition: all .22s;
    position: relative;
    overflow: hidden;
  }
  .neon-btn::before {
    content:'';position:absolute;inset:0;
    background: linear-gradient(135deg, rgba(0,240,255,.22), rgba(0,112,255,.18));
    opacity:0;transition:opacity .22s;
  }
  .neon-btn:hover { box-shadow: 0 0 30px rgba(0,240,255,.4); border-color: rgba(0,240,255,.8); }
  .neon-btn:hover::before { opacity:1; }
  .neon-btn:active { transform: scale(.97); }
  .neon-btn-primary {
    background: linear-gradient(135deg, #0050cc, #0090ff);
    border: 1px solid rgba(0,160,255,.6);
    color: #fff;
    box-shadow: 0 4px 20px rgba(0,100,255,.4);
  }
  .neon-btn-primary:hover { box-shadow: 0 0 40px rgba(0,150,255,.6); }
  .neon-btn-danger {
    background: linear-gradient(135deg, #cc0022, #ff003c);
    border: 1px solid rgba(255,0,60,.6);
    color: #fff;
    box-shadow: 0 4px 20px rgba(255,0,60,.3);
  }
  .neon-btn-danger:hover { box-shadow: 0 0 40px rgba(255,0,60,.5); }
  .neon-btn-success {
    background: linear-gradient(135deg, #006644, #00cc88);
    border: 1px solid rgba(0,255,160,.5);
    color: #fff;
    box-shadow: 0 4px 20px rgba(0,200,130,.3);
  }
  .cyber-input {
    background: rgba(0,240,255,.04);
    border: 1px solid rgba(0,240,255,.2);
    border-radius: 4px;
    padding: 10px 14px;
    color: var(--text);
    font-size: 14px;
    font-family: 'Rajdhani', sans-serif;
    font-weight: 500;
    width: 100%;
    transition: all .2s;
    outline: none;
  }
  .cyber-input:focus { border-color: var(--c1); box-shadow: 0 0 0 2px rgba(0,240,255,.12); }
  .cyber-input::placeholder { color: var(--muted); }
  .orb-text { font-family: 'Orbitron', sans-serif; }
  .mono    { font-family: 'Share Tech Mono', monospace; }
  .neon-text { color: var(--c1); text-shadow: 0 0 10px rgba(0,240,255,.6); }
  .grid-bg {
    background-image: linear-gradient(rgba(0,240,255,.03) 1px, transparent 1px),
                      linear-gradient(90deg, rgba(0,240,255,.03) 1px, transparent 1px);
    background-size: 40px 40px;
    animation: gridMove 12s linear infinite;
  }
  .scanline-overlay {
    position: fixed;
    inset: 0;
    background: repeating-linear-gradient(0deg, transparent 0px, transparent 2px, rgba(0,0,0,.04) 2px, rgba(0,0,0,.04) 4px);
    pointer-events: none;
    z-index: 9998;
  }
  .holo { animation: hologram 8s ease-in-out infinite; }
  .badge-cyber { display:inline-block; font-family:'Orbitron',sans-serif; font-size:8px; font-weight:700; letter-spacing:.1em; text-transform:uppercase; padding:3px 8px; border-radius:3px; }
  .skeleton { background: linear-gradient(90deg, #0a1020 25%, #101830 50%, #0a1020 75%); background-size:200% 100%; animation: borderAnim 1.6s infinite; border-radius:6px; }
  select option { background: #060b18; color: #c8d6f0; }
  @media (max-width:768px) {
    .hide-mob { display:none !important; }
    .col-1-mob { grid-template-columns:1fr !important; }
    .col-2-mob { grid-template-columns:1fr 1fr !important; }
  }
`;

/* ═══ DATA ═══════════════════════════════════════════════════ */
const IMGS = {
  iphone:   ["https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=600&q=80","https://images.unsplash.com/photo-1512054502232-10a0a035d672?w=600&q=80","https://images.unsplash.com/photo-1574755393849-623942496936?w=600&q=80"],
  iphone14: ["https://images.unsplash.com/photo-1663499482523-1c0c1bae4ce1?w=600&q=80","https://images.unsplash.com/photo-1660737059424-8ab00d64b8af?w=600&q=80"],
  samsung:  ["https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600&q=80","https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=600&q=80"],
  pixel:    ["https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&q=80","https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&q=80"],
  oneplus:  ["https://images.unsplash.com/photo-1567581935884-3349723552ca?w=600&q=80","https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&q=80"],
  xm5:      ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80","https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600&q=80"],
  bose:     ["https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&q=80","https://images.unsplash.com/photo-1524678606370-a47ad25cb82a?w=600&q=80"],
  airpods:  ["https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=600&q=80","https://images.unsplash.com/photo-1588423771073-b8903fead714?w=600&q=80"],
  jbl:      ["https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&q=80","https://images.unsplash.com/photo-1545454675-3531b543be5d?w=600&q=80"],
  mac:      ["https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=600&q=80","https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&q=80"],
  macair:   ["https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&q=80","https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=600&q=80"],
  dell:     ["https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600&q=80","https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600&q=80"],
  asus:     ["https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=600&q=80","https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600&q=80"],
  ipad:     ["https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&q=80","https://images.unsplash.com/photo-1561154464-82e9adf32764?w=600&q=80"],
  awatch:   ["https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=600&q=80","https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80"],
  garmin:   ["https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=600&q=80","https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80"],
  tv_sam:   ["https://images.unsplash.com/photo-1593359677879-a4bb92f829e1?w=600&q=80","https://images.unsplash.com/photo-1461151304267-38535e780c79?w=600&q=80"],
  ps5:      ["https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=600&q=80","https://images.unsplash.com/photo-1607853202273-797f1c22a38e?w=600&q=80"],
  xbox:     ["https://images.unsplash.com/photo-1605901309584-818e25960a8f?w=600&q=80","https://images.unsplash.com/photo-1518779578993-ec3579fee39f?w=600&q=80"],
  sonycam:  ["https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&q=80","https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=600&q=80"],
  gopro:    ["https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=600&q=80","https://images.unsplash.com/photo-1553564552-02656fcee0e9?w=600&q=80"],
  drone:    ["https://images.unsplash.com/photo-1527977966376-1c8408f9f108?w=600&q=80","https://images.unsplash.com/photo-1508614999368-9260051292e5?w=600&q=80"],
  monitor:  ["https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&q=80","https://images.unsplash.com/photo-1547082299-de196ea013d6?w=600&q=80"],
};

const PRODUCTS_INIT = [
  { id:1,  name:"iPhone 15 Pro Max",          brand:"apple",    cat:"phones",    price:159900, mrp:179900, rating:4.8, reviews:2341, imgs:IMGS.iphone,    badge:"Hot",         stock:48, specs:{Display:'6.7" Super Retina XDR',Processor:"A17 Pro",RAM:"8GB",Storage:"256GB",Battery:"4422 mAh",Camera:"48MP Triple"}, hi:["Titanium design","USB-C","Action Button"],        desc:"The most powerful iPhone ever with A17 Pro chip and a pro-grade 48MP camera system." },
  { id:2,  name:"iPhone 14 Plus",             brand:"apple",    cat:"phones",    price:84900,  mrp:99900,  rating:4.6, reviews:1203, imgs:IMGS.iphone14,  badge:"Value",        stock:72, specs:{Display:'6.7" Super Retina XDR',Processor:"A15 Bionic",RAM:"6GB",Storage:"128GB",Battery:"4325 mAh",Camera:"12MP Dual"},   hi:["Big display","A15 Bionic","All-day battery"],    desc:"Big screen, big battery, big power. iPhone 14 Plus does it all." },
  { id:3,  name:"Samsung Galaxy S24 Ultra",   brand:"samsung",  cat:"phones",    price:134999, mrp:149999, rating:4.7, reviews:1892, imgs:IMGS.samsung,   badge:"Deal",         stock:35, specs:{Display:'6.8" Dynamic AMOLED 2X',Processor:"Snapdragon 8 Gen 3",RAM:"12GB",Storage:"256GB",Battery:"5000 mAh",Camera:"200MP Quad"}, hi:["Built-in S Pen","Galaxy AI","Titanium"],  desc:"Redefining productivity with Galaxy AI and the legendary S Pen." },
  { id:4,  name:"Google Pixel 8 Pro",         brand:"google",   cat:"phones",    price:106999, mrp:119999, rating:4.7, reviews:1123, imgs:IMGS.pixel,     badge:"AI",           stock:29, specs:{Display:'6.7" LTPO OLED',Processor:"Google Tensor G3",RAM:"12GB",Storage:"256GB",Battery:"5050 mAh",Camera:"50MP Triple"},  hi:["Google AI features","7yr updates","Magic Eraser"],desc:"Google's smartest phone, packed with industry-leading AI." },
  { id:5,  name:"OnePlus 12R",                brand:"oneplus",  cat:"phones",    price:39999,  mrp:44999,  rating:4.6, reviews:987,  imgs:IMGS.oneplus,   badge:"Value",        stock:156,specs:{Display:'6.78" AMOLED 120Hz',Processor:"Snapdragon 8 Gen 2",RAM:"16GB",Storage:"256GB",Battery:"5500 mAh",Charging:"100W"}, hi:["100W charging","5500mAh","Flagship specs"],     desc:"Flagship specs at an honest price — the ultimate value phone." },
  { id:6,  name:"Sony WH-1000XM5",            brand:"sony",     cat:"audio",     price:26990,  mrp:34990,  rating:4.9, reviews:4521, imgs:IMGS.xm5,       badge:"Best Seller",  stock:87, specs:{Driver:"30mm",ANC:"Industry-leading",Battery:"30h",Bluetooth:"5.2",Weight:"250g",Foldable:"Yes"},  hi:["Best-in-class ANC","30hr battery","Multipoint"], desc:"The absolute benchmark for noise-cancelling headphones." },
  { id:7,  name:"Bose QuietComfort 45",       brand:"bose",     cat:"audio",     price:24990,  mrp:32990,  rating:4.7, reviews:2103, imgs:IMGS.bose,      badge:"Popular",      stock:63, specs:{Driver:"40mm",ANC:"Quiet + Aware",Battery:"24h",Bluetooth:"5.1",Weight:"238g",Foldable:"Yes"},  hi:["Bose signature sound","Quiet & Aware","Comfort"], desc:"World-class comfort meets legendary Bose audio." },
  { id:8,  name:"AirPods Pro 2nd Gen",        brand:"apple",    cat:"audio",     price:24900,  mrp:26900,  rating:4.8, reviews:3201, imgs:IMGS.airpods,   badge:"Hot",          stock:210,specs:{ANC:"Adaptive Transparency",Battery:"6h+30h",Chip:"H2",Water:"IP54",Spatial:"Personalized",Case:"MagSafe"},  hi:["H2 ANC","Adaptive mode","MagSafe case"],         desc:"Rebuilt with H2 chip for smarter ANC and richer audio." },
  { id:9,  name:"JBL Charge 5 Speaker",       brand:"jbl",      cat:"audio",     price:13999,  mrp:19999,  rating:4.7, reviews:5234, imgs:IMGS.jbl,       badge:"Rugged",       stock:145,specs:{Output:"40W",Battery:"20h",Water:"IP67",Bluetooth:"5.1",Range:"30m",Feature:"PartyBoost"}, hi:["IP67 waterproof","20hr battery","PartyBoost"],   desc:"Charge your devices and fill the room — JBL Charge 5." },
  { id:10, name:'MacBook Pro 14" M3',          brand:"apple",    cat:"laptops",   price:199900, mrp:219900, rating:4.9, reviews:1204, imgs:IMGS.mac,       badge:"New",          stock:22, specs:{Processor:"Apple M3 Pro",RAM:"18GB",Storage:"512GB SSD",Display:'14.2" Liquid Retina XDR',Battery:"18h",Ports:"3× TB4"},  hi:["M3 Pro chip","Retina XDR","18hr battery"],      desc:"The world's best pro laptop. Blazing fast, all day long." },
  { id:11, name:'MacBook Air 15" M2',          brand:"apple",    cat:"laptops",   price:134900, mrp:149900, rating:4.8, reviews:2109, imgs:IMGS.macair,    badge:"Popular",      stock:41, specs:{Processor:"Apple M2",RAM:"8GB",Storage:"256GB SSD",Display:'15.3" Liquid Retina',Battery:"18h",Weight:"1.51kg"}, hi:["M2 chip","15\" display","Fanless design"],     desc:"The world's thinnest 15-inch laptop — silent, fast, stunning." },
  { id:12, name:"Dell XPS 15 OLED",           brand:"dell",     cat:"laptops",   price:169900, mrp:189900, rating:4.6, reviews:743,  imgs:IMGS.dell,      badge:"Deal",         stock:17, specs:{Processor:"Intel i9-13900H",RAM:"32GB DDR5",Storage:"1TB SSD",Display:'15.6" OLED 3.5K',Battery:"86Whr",GPU:"RTX 4070"}, hi:["OLED display","RTX 4070","Premium build"],      desc:"OLED brilliance meets RTX power — the creator's ultimate weapon." },
  { id:13, name:"ASUS ROG Zephyrus G14",      brand:"asus",     cat:"laptops",   price:149900, mrp:169900, rating:4.8, reviews:612,  imgs:IMGS.asus,      badge:"Gaming",       stock:33, specs:{Processor:"AMD Ryzen 9 7940HS",RAM:"32GB",Storage:"1TB SSD",Display:'14" QHD 165Hz',Battery:"73Whr",GPU:"RTX 4060"}, hi:["RTX 4060","QHD 165Hz","Ultra-slim gaming"],     desc:"Compact powerhouse. Small body, monstrous gaming performance." },
  { id:14, name:"Apple iPad Pro M2 12.9\"",   brand:"apple",    cat:"tablets",   price:112900, mrp:124900, rating:4.8, reviews:876,  imgs:IMGS.ipad,      badge:"New",          stock:58, specs:{Processor:"Apple M2",Display:'12.9" Liquid Retina XDR',RAM:"8GB",Storage:"256GB",Battery:"10541 mAh",Camera:"12MP + 10MP"}, hi:["M2 chip","XDR display","Apple Pencil"],         desc:"Thin, light and staggeringly powerful — the ultimate iPad." },
  { id:15, name:"Apple Watch Series 9",       brand:"apple",    cat:"wearables", price:41900,  mrp:44900,  rating:4.7, reviews:1543, imgs:IMGS.awatch,    badge:"Popular",      stock:94, specs:{Chip:"S9 SiP",Display:"AOD LTPO OLED",Health:"Blood O₂ + ECG",GPS:"L1 + L5",Water:"50m",Battery:"18h"}, hi:["Double Tap gesture","AOD display","Crash Detection"],desc:"The most capable Apple Watch yet — smarter, brighter, faster." },
  { id:16, name:"Garmin Fenix 7 Solar",       brand:"garmin",   cat:"wearables", price:79990,  mrp:89990,  rating:4.8, reviews:421,  imgs:IMGS.garmin,    badge:"Adventure",    stock:19, specs:{Display:"1.3\" MIP",Battery:"22d + Solar",GPS:"Multi-band",Water:"100m",Material:"Titanium",Sports:"60+ modes"}, hi:["Solar charging","22-day battery","Multi-band GPS"],desc:"Legendary GPS multisport smartwatch with solar charging." },
  { id:17, name:'Samsung 65" Neo QLED 4K',    brand:"samsung",  cat:"tvs",       price:129990, mrp:169990, rating:4.8, reviews:654,  imgs:IMGS.tv_sam,    badge:"Best Seller",  stock:12, specs:{Panel:"Neo QLED",Resolution:"4K UHD",Refresh:"120Hz",HDR:"HDR10+",Smart:"Tizen OS 7",Ports:"4× HDMI 2.1"}, hi:["Neo Quantum Dots","Gaming Hub","Object Tracking Sound"],desc:"Neo QLED with Mini LED — quantum-level picture quality." },
  { id:18, name:"PlayStation 5",              brand:"sony",     cat:"gaming",    price:54990,  mrp:59990,  rating:4.9, reviews:5821, imgs:IMGS.ps5,       badge:"🔥 Hot",       stock:8,  specs:{CPU:"AMD Zen 2 8-core",GPU:"AMD RDNA 2 10.3TF",Storage:"825GB NVMe SSD",Display:"4K 120fps",Audio:"Tempest 3D",Controller:"DualSense"}, hi:["4K 120fps","Ultra-fast SSD","DualSense haptics"],desc:"Next-gen gaming. The fastest, most immersive PlayStation ever." },
  { id:19, name:"Xbox Series X",              brand:"microsoft",cat:"gaming",    price:52999,  mrp:59990,  rating:4.8, reviews:3210, imgs:IMGS.xbox,      badge:"Gaming",       stock:21, specs:{CPU:"AMD Zen 2 8-core",GPU:"12 TFLOPS",RAM:"16GB GDDR6",Storage:"1TB NVMe",Resolution:"4K 120fps",Feature:"Quick Resume"}, hi:["4K 120fps","Quick Resume","Game Pass ready"],    desc:"The world's most powerful console. Play thousands in stunning 4K." },
  { id:20, name:"Sony Alpha A7 IV",           brand:"sony",     cat:"cameras",   price:259990, mrp:289990, rating:4.9, reviews:312,  imgs:IMGS.sonycam,   badge:"Pro",          stock:14, specs:{Sensor:"33MP Full-Frame BSI",Video:"4K 60fps 10-bit",AF:"Real-time AI AF",ISO:"50-204800",Stabilization:"5-axis IBIS",Mount:"E-mount"}, hi:["33MP full-frame","4K 60fps 10-bit","AI AF"],  desc:"Full-frame mirrorless mastery — exceptional stills and video." },
  { id:21, name:"DJI Mini 4 Pro Drone",       brand:"dji",      cat:"cameras",   price:89990,  mrp:99990,  rating:4.8, reviews:678,  imgs:IMGS.drone,     badge:"Creator",      stock:31, specs:{Camera:"1/1.3\" CMOS 48MP",Video:"4K 100fps",Weight:"<249g",Range:"20km",Battery:"34min",Obstacle:"4-way sensing"}, hi:["4K 100fps","Under 249g","20km range"],           desc:"Fly further, shoot better — the ultimate compact drone." },
  { id:22, name:'Samsung 32" Odyssey G5',     brand:"samsung",  cat:"tvs",       price:24990,  mrp:32990,  rating:4.7, reviews:892,  imgs:IMGS.monitor,   badge:"Gaming",       stock:44, specs:{Panel:"VA 1000R Curved",Resolution:"QHD 2560×1440",Refresh:"165Hz",Response:"1ms",HDR:"HDR10",Feature:"FreeSync Premium"}, hi:["165Hz refresh","1ms response","1000R curve"],   desc:"Curved QHD gaming monitor with buttery-smooth 165Hz gameplay." },
];

const CATEGORIES = [
  {id:"phones",   name:"Phones",     icon:"📱"},
  {id:"laptops",  name:"Laptops",    icon:"💻"},
  {id:"tablets",  name:"Tablets",    icon:"📲"},
  {id:"audio",    name:"Audio",      icon:"🎧"},
  {id:"cameras",  name:"Cameras",    icon:"📷"},
  {id:"tvs",      name:"TVs",        icon:"📺"},
  {id:"wearables",name:"Wearables",  icon:"⌚"},
  {id:"gaming",   name:"Gaming",     icon:"🎮"},
];

const SAMPLE_ORDERS = [
  { id:"ORD-001", userId:"demo@voltx.in", products:[{id:1,qty:1},{id:6,qty:1}], total:186890, status:"delivered", payment:"paid",   payMethod:"UPI",  date:"2025-04-10", address:"42, MG Road, Bengaluru" },
  { id:"ORD-002", userId:"demo@voltx.in", products:[{id:10,qty:1}],             total:199900, status:"shipped",   payment:"paid",   payMethod:"Card", date:"2025-05-01", address:"42, MG Road, Bengaluru" },
  { id:"ORD-003", userId:"demo@voltx.in", products:[{id:8,qty:2},{id:9,qty:1}], total:63790,  status:"processing",payment:"paid",   payMethod:"EMI",  date:"2025-05-18", address:"42, MG Road, Bengaluru" },
  { id:"ORD-004", userId:"admin@voltx.in",products:[{id:18,qty:1},{id:19,qty:1}],total:107989,status:"delivered", payment:"paid",   payMethod:"UPI",  date:"2025-03-22", address:"12, Linking Rd, Mumbai" },
];

const USERS_INIT = [
  { id:"u1", email:"demo@voltx.in",  password:"demo1234",  name:"Arjun Sharma",    role:"user",  avatar:"AS", joined:"2025-01-15", orders:3 },
  { id:"u2", email:"admin@voltx.in", password:"admin1234", name:"Priya Nair",      role:"admin", avatar:"PN", joined:"2024-11-01", orders:1 },
  { id:"u3", email:"user@voltx.in",  password:"user1234",  name:"Ravi Krishnamurthy", role:"user", avatar:"RK", joined:"2025-02-28", orders:0 },
];

const fmt = n => "₹" + n.toLocaleString("en-IN");
const disc = (p,m) => Math.round(((m-p)/m)*100);

/* ═══ LOCAL STORAGE DB ═══ */
const DB = {
  get: key => { try { return JSON.parse(localStorage.getItem(`voltx_${key}`)||"null"); } catch { return null; } },
  set: (key,val) => { try { localStorage.setItem(`voltx_${key}`, JSON.stringify(val)); } catch {} },
  init: () => {
    if(!DB.get("products"))  DB.set("products",  PRODUCTS_INIT);
    if(!DB.get("users"))     DB.set("users",     USERS_INIT);
    if(!DB.get("orders"))    DB.set("orders",    SAMPLE_ORDERS);
    if(!DB.get("cart"))      DB.set("cart",      []);
    if(!DB.get("wishlist"))  DB.set("wishlist",  []);
  },
};

/* ═══ AUTH ═══ */
const Auth = {
  login: (email, password) => {
    const users = DB.get("users") || [];
    const user = users.find(u => u.email===email && u.password===password);
    if(!user) return { error: "Invalid credentials. Check email and password." };
    DB.set("session", user);
    return { user };
  },
  signup: (name, email, password) => {
    const users = DB.get("users") || [];
    if(users.find(u=>u.email===email)) return { error: "Email already registered." };
    const newUser = { id:`u${Date.now()}`, email, password, name, role:"user", avatar: name.split(" ").map(n=>n[0]).join("").toUpperCase().slice(0,2), joined: new Date().toISOString().split("T")[0], orders:0 };
    users.push(newUser);
    DB.set("users", users);
    DB.set("session", newUser);
    return { user: newUser };
  },
  logout: () => { DB.set("session", null); },
  current: () => DB.get("session"),
  resetPassword: (email) => {
    const users = DB.get("users") || [];
    return users.find(u=>u.email===email) ? { success: true } : { error: "Email not found." };
  },
};

/* ═══ HOOKS ═══ */
function useToast() {
  const [toasts, setToasts] = useState([]);
  const add = useCallback((msg, type="info") => {
    const id = Date.now() + Math.random();
    setToasts(p => [...p, {id, msg, type, out:false}]);
    setTimeout(() => setToasts(p => p.map(t => t.id===id?{...t,out:true}:t)), 3000);
    setTimeout(() => setToasts(p => p.filter(t => t.id!==id)), 3400);
  }, []);
  return { toasts, toast: add };
}

function useScrollReveal() {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if(e.isIntersecting){setVis(true);obs.disconnect();} }, {threshold:0.07});
    if(ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return { ref, vis };
}

/* ═══ TOAST ═══ */
function Toasts({ toasts }) {
  const colors = { success:"#00cc88", error:"#ff003c", warning:"#ffaa00", info:"#00f0ff" };
  const icons  = { success:"✓", error:"✕", warning:"⚠", info:"ℹ" };
  return (
    <div style={{position:"fixed",top:74,right:16,zIndex:9999,display:"flex",flexDirection:"column",gap:8,pointerEvents:"none"}}>
      {toasts.map(t => (
        <div key={t.id} style={{
          background:"rgba(6,11,24,.97)", backdropFilter:"blur(20px)",
          borderLeft:`2px solid ${colors[t.type]}`,
          padding:"12px 18px", borderRadius:6,
          boxShadow:`0 8px 40px rgba(0,0,0,.7), 0 0 0 1px rgba(255,255,255,.04)`,
          display:"flex", alignItems:"center", gap:10, minWidth:260,
          animation: t.out ? "toastOut .3s ease forwards" : "toastIn .35s cubic-bezier(.22,1,.36,1) forwards"
        }}>
          <span style={{width:22,height:22,borderRadius:"50%",background:`${colors[t.type]}18`,border:`1px solid ${colors[t.type]}`,color:colors[t.type],display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:800,flexShrink:0}}>{icons[t.type]}</span>
          <span style={{fontSize:13,fontWeight:600,color:"#e2e8f0",fontFamily:"Rajdhani"}}>{t.msg}</span>
        </div>
      ))}
    </div>
  );
}

/* ═══ SAFE IMG ═══ */
function SafeImg({ src, alt, style, className }) {
  const [err, setErr] = useState(false);
  if(err) return (
    <div style={{...style,background:"linear-gradient(135deg,#060b18,#0c1228)",display:"flex",alignItems:"center",justifyContent:"center"}} className={className}>
      <span style={{fontSize:28,opacity:.2}}>📦</span>
    </div>
  );
  return <img src={src} alt={alt} style={style} className={className} onError={()=>setErr(true)} loading="lazy" />;
}

function Reveal({ children, delay=0, style={} }) {
  const { ref, vis } = useScrollReveal();
  return (
    <div ref={ref} style={{ opacity:vis?1:0, transform:vis?"none":"translateY(28px)", transition:`opacity .65s ease ${delay}ms, transform .65s ease ${delay}ms`, ...style }}>
      {children}
    </div>
  );
}

/* ═══ 3D HERO CANVAS ═══ */
function ThreeHero({ page }) {
  const canvasRef = useRef(null);
  const sceneRef  = useRef(null);
  const frameRef  = useRef(null);

  useEffect(() => {
    if(page !== "home") return;
    const canvas = canvasRef.current;
    if(!canvas) return;

    const W = canvas.offsetWidth, H = canvas.offsetHeight;
    const renderer = new THREE.WebGLRenderer({ canvas, alpha:true, antialias:true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, W/H, 0.1, 100);
    camera.position.set(0, 0, 5);
    sceneRef.current = scene;

    // Particles
    const pCount = 1200;
    const pGeo = new THREE.BufferGeometry();
    const pPos = new Float32Array(pCount * 3);
    const pColors = new Float32Array(pCount * 3);
    for(let i=0; i<pCount; i++) {
      pPos[i*3]   = (Math.random()-0.5)*20;
      pPos[i*3+1] = (Math.random()-0.5)*20;
      pPos[i*3+2] = (Math.random()-0.5)*20;
      const t = Math.random();
      pColors[i*3]   = t > 0.5 ? 0 : 0;
      pColors[i*3+1] = t > 0.5 ? 0.9 : 0.4;
      pColors[i*3+2] = t > 0.5 ? 1.0 : 1.0;
    }
    pGeo.setAttribute("position", new THREE.BufferAttribute(pPos, 3));
    pGeo.setAttribute("color",    new THREE.BufferAttribute(pColors, 3));
    const pMat = new THREE.PointsMaterial({ size:0.04, vertexColors:true, transparent:true, opacity:0.7 });
    const particles = new THREE.Points(pGeo, pMat);
    scene.add(particles);

    // Torus rings
    const ringColors = [0x00f0ff, 0x0070ff, 0x7000ff, 0x00ffa3];
    const rings = [];
    ringColors.forEach((color, i) => {
      const geo = new THREE.TorusGeometry(1.5 + i*0.4, 0.015, 8, 80);
      const mat = new THREE.MeshBasicMaterial({ color, transparent:true, opacity:0.35 - i*0.06 });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.rotation.x = Math.PI * (0.2 + i*0.15);
      mesh.rotation.y = Math.PI * i * 0.25;
      rings.push(mesh);
      scene.add(mesh);
    });

    // Central glowing sphere
    const sGeo  = new THREE.IcosahedronGeometry(0.9, 2);
    const sMat  = new THREE.MeshBasicMaterial({ color:0x0040aa, wireframe:true, transparent:true, opacity:0.25 });
    const sphere = new THREE.Mesh(sGeo, sMat);
    scene.add(sphere);

    // Inner bright sphere
    const siGeo = new THREE.SphereGeometry(0.6, 32, 32);
    const siMat = new THREE.MeshBasicMaterial({ color:0x003388, transparent:true, opacity:0.5 });
    const innerSphere = new THREE.Mesh(siGeo, siMat);
    scene.add(innerSphere);

    // Floating cubes
    const cubeData = [];
    for(let i=0;i<8;i++) {
      const geo = new THREE.BoxGeometry(0.1+Math.random()*0.15, 0.1+Math.random()*0.15, 0.1+Math.random()*0.15);
      const mat = new THREE.MeshBasicMaterial({ color:[0x00f0ff,0x0070ff,0x7000ff,0x00ffa3][i%4], wireframe:true, transparent:true, opacity:0.6 });
      const mesh = new THREE.Mesh(geo, mat);
      const angle = (i/8)*Math.PI*2;
      mesh.position.set(Math.cos(angle)*2.5, (Math.random()-0.5)*2, Math.sin(angle)*2.5);
      cubeData.push({ mesh, speed:0.003+Math.random()*0.003, angle, radius:2.5+Math.random()*0.5 });
      scene.add(mesh);
    }

    // Ambient light
    scene.add(new THREE.AmbientLight(0x112244, 0.5));

    let t = 0;
    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);
      t += 0.008;
      particles.rotation.y += 0.0005;
      particles.rotation.x += 0.0002;
      rings.forEach((r,i) => {
        r.rotation.z += 0.002 * (i%2===0?1:-1);
        r.rotation.x += 0.001 * (i%2===0?1:-1);
      });
      sphere.rotation.y += 0.005;
      sphere.rotation.x += 0.002;
      innerSphere.rotation.y -= 0.003;
      cubeData.forEach(cd => {
        cd.angle += cd.speed;
        cd.mesh.position.x = Math.cos(cd.angle) * cd.radius;
        cd.mesh.position.z = Math.sin(cd.angle) * cd.radius;
        cd.mesh.position.y += Math.sin(t*2 + cd.angle) * 0.003;
        cd.mesh.rotation.x += 0.02;
        cd.mesh.rotation.y += 0.02;
      });
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      const w = canvas.offsetWidth, h = canvas.offsetHeight;
      camera.aspect = w/h; camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(frameRef.current);
      renderer.dispose();
    };
  }, [page]);

  if(page !== "home") return null;
  return (
    <canvas ref={canvasRef} style={{ position:"absolute", inset:0, width:"100%", height:"100%", pointerEvents:"none" }} />
  );
}

/* ═══ NAVBAR ═══ */
function Navbar({ page, setPage, cartCount, wishlistCount, user, onLogout, onCartOpen, onWishlistOpen }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", h, {passive:true});
    return () => window.removeEventListener("scroll", h);
  }, []);

  const nav = k => { setPage(k); window.scrollTo({top:0,behavior:"smooth"}); };
  const links = user?.role==="admin"
    ? [["home","Home"],["products","Shop"],["deals","Deals"],["admin","Admin"],["orders","Orders"]]
    : [["home","Home"],["products","Shop"],["deals","Deals"],["orders","Orders"],["contact","Contact"]];

  return (
    <nav style={{
      position:"fixed", top:0, left:0, right:0, zIndex:1000,
      background: scrolled ? "rgba(3,5,13,.97)" : "rgba(3,5,13,.5)",
      backdropFilter:"blur(28px)",
      borderBottom:`1px solid ${scrolled?"rgba(0,240,255,.12)":"transparent"}`,
      boxShadow: scrolled ? "0 4px 60px rgba(0,0,0,.7)" : "none",
      transition:"all .3s",
    }}>
      <div style={{maxWidth:1400,margin:"0 auto",padding:"0 24px",display:"flex",alignItems:"center",gap:12,height:64}}>
        <button onClick={()=>nav("home")} style={{background:"none",border:"none",cursor:"pointer",display:"flex",alignItems:"center",gap:8,flexShrink:0}}>
          <div style={{width:34,height:34,borderRadius:8,background:"linear-gradient(135deg,#00f0ff,#0070ff)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,fontWeight:900,color:"#fff",boxShadow:"0 0 20px rgba(0,240,255,.5)"}}>⚡</div>
          <span style={{fontFamily:"Orbitron",fontSize:20,fontWeight:900,letterSpacing:"-0.5px"}}>
            <span style={{color:"#00f0ff",textShadow:"0 0 12px rgba(0,240,255,.6)"}}>VOLT</span><span style={{color:"#fff"}}>X</span>
          </span>
        </button>

        <div className="hide-mob" style={{display:"flex",gap:2,marginLeft:8}}>
          {links.map(([k,l]) => (
            <button key={k} onClick={()=>nav(k)} style={{
              background: page===k ? "rgba(0,240,255,.08)" : "transparent",
              color: page===k ? "#00f0ff" : "#6a7fa8",
              border: "none", borderRadius:4,
              padding:"7px 12px", fontSize:12, cursor:"pointer",
              fontFamily:"Orbitron", fontWeight:page===k?600:400,
              letterSpacing:".06em", textTransform:"uppercase",
              transition:"all .18s",
              borderBottom: page===k ? "1px solid rgba(0,240,255,.5)" : "1px solid transparent",
            }}>
              {l}{k==="admin"&&<span style={{marginLeft:5,background:"#ff003c",color:"#fff",fontSize:7,padding:"1px 5px",borderRadius:3,fontWeight:900}}>ADMIN</span>}
            </button>
          ))}
        </div>

        <div style={{flex:1}}/>

        <button onClick={onWishlistOpen} style={{position:"relative",background:"none",border:"1px solid rgba(0,240,255,.08)",borderRadius:6,color:"#4a5a7a",cursor:"pointer",fontSize:16,padding:"8px 10px",transition:"all .2s"}} onMouseEnter={e=>{e.currentTarget.style.color="#ff003c";e.currentTarget.style.borderColor="rgba(255,0,60,.3)";}} onMouseLeave={e=>{e.currentTarget.style.color="#4a5a7a";e.currentTarget.style.borderColor="rgba(0,240,255,.08)";}}>
          {wishlistCount>0?"❤️":"🤍"}
          {wishlistCount>0 && <span style={{position:"absolute",top:3,right:3,width:14,height:14,background:"#ff003c",borderRadius:"50%",fontSize:7,fontWeight:900,color:"#fff",display:"flex",alignItems:"center",justifyContent:"center"}}>{wishlistCount}</span>}
        </button>

        <button onClick={onCartOpen} style={{position:"relative",background:"none",border:"1px solid rgba(0,240,255,.08)",borderRadius:6,color:"#4a5a7a",cursor:"pointer",fontSize:16,padding:"8px 10px",transition:"all .2s"}} onMouseEnter={e=>{e.currentTarget.style.color="#00f0ff";e.currentTarget.style.borderColor="rgba(0,240,255,.3)";}} onMouseLeave={e=>{e.currentTarget.style.color="#4a5a7a";e.currentTarget.style.borderColor="rgba(0,240,255,.08)";}}>
          🛒
          {cartCount>0 && <span style={{position:"absolute",top:3,right:3,width:14,height:14,background:"linear-gradient(135deg,#0070ff,#00f0ff)",borderRadius:"50%",fontSize:7,fontWeight:900,color:"#fff",display:"flex",alignItems:"center",justifyContent:"center"}}>{cartCount}</span>}
        </button>

        {user ? (
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <button onClick={()=>nav("dashboard")} style={{width:34,height:34,borderRadius:"50%",background:"linear-gradient(135deg,#001844,#003388)",border:"1px solid rgba(0,240,255,.3)",color:"#00f0ff",cursor:"pointer",fontFamily:"Orbitron",fontSize:11,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center"}}>{user.avatar}</button>
            <button onClick={onLogout} style={{background:"none",border:"1px solid rgba(255,0,60,.3)",borderRadius:4,color:"#ff003c",cursor:"pointer",fontSize:10,fontFamily:"Orbitron",letterSpacing:".07em",padding:"6px 12px",transition:"all .2s"}} onMouseEnter={e=>e.currentTarget.style.background="rgba(255,0,60,.08)"} onMouseLeave={e=>e.currentTarget.style.background="none"}>LOGOUT</button>
          </div>
        ) : (
          <button onClick={()=>nav("login")} className="neon-btn" style={{padding:"8px 18px",fontSize:10}}>LOGIN</button>
        )}
      </div>
    </nav>
  );
}

/* ═══ AUTH PAGES ═══ */
function AuthPage({ mode, setPage, onLogin, toast }) {
  const [tab, setTab] = useState(mode); // "login" | "signup" | "forgot"
  const [form, setForm] = useState({name:"",email:"",password:"",confirm:""});
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const set = (k,v) => setForm(f=>({...f,[k]:v}));

  const handleLogin = async () => {
    if(!form.email || !form.password) { setErrors({submit:"Please fill all fields."}); return; }
    setLoading(true);
    await new Promise(r=>setTimeout(r,900));
    const res = Auth.login(form.email, form.password);
    setLoading(false);
    if(res.error) { setErrors({submit:res.error}); toast(res.error,"error"); }
    else { toast(`Welcome back, ${res.user.name}! ⚡`,"success"); onLogin(res.user); }
  };

  const handleSignup = async () => {
    const e = {};
    if(!form.name.trim()) e.name = "Name required";
    if(!form.email.includes("@")) e.email = "Valid email required";
    if(form.password.length < 6) e.password = "Minimum 6 characters";
    if(form.password !== form.confirm) e.confirm = "Passwords don't match";
    if(Object.keys(e).length) { setErrors(e); return; }
    setLoading(true);
    await new Promise(r=>setTimeout(r,1000));
    const res = Auth.signup(form.name, form.email, form.password);
    setLoading(false);
    if(res.error) { setErrors({submit:res.error}); toast(res.error,"error"); }
    else { toast(`Account created! Welcome, ${res.user.name}! 🎉`,"success"); onLogin(res.user); }
  };

  const handleForgot = async () => {
    if(!form.email) { setErrors({email:"Email required"}); return; }
    setLoading(true);
    await new Promise(r=>setTimeout(r,800));
    const res = Auth.resetPassword(form.email);
    setLoading(false);
    if(res.error) { setErrors({email:res.error}); toast(res.error,"error"); }
    else { toast("Reset link sent to your email ✓","success"); setTab("login"); }
  };

  return (
    <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",padding:20,position:"relative",overflow:"hidden"}}>
      {/* Background */}
      <div className="grid-bg" style={{position:"fixed",inset:0,zIndex:0}}/>
      <div style={{position:"fixed",inset:0,background:"radial-gradient(ellipse 600px 500px at 50% 50%, rgba(0,112,255,.06) 0%, transparent 60%)",zIndex:0}}/>

      {/* Data particles */}
      {Array(12).fill(0).map((_,i) => (
        <div key={i} style={{
          position:"fixed",
          left:`${5+i*7.5}%`, bottom: 0,
          width:1, height:`${30+Math.random()*60}px`,
          background:"linear-gradient(to top, transparent, rgba(0,240,255,.4))",
          animation:`dataFlow ${2+i*0.3}s linear ${i*0.2}s infinite`,
          zIndex:0,
        }}/>
      ))}

      <div className="fade-in" style={{
        width:"100%", maxWidth:460, position:"relative", zIndex:1,
        background:"rgba(6,11,24,.92)", backdropFilter:"blur(32px)",
        border:"1px solid rgba(0,240,255,.15)",
        borderRadius:12, padding:40,
        boxShadow:"0 0 0 1px rgba(0,240,255,.06), 0 40px 100px rgba(0,0,0,.8), 0 0 80px rgba(0,112,255,.08)",
      }}>
        {/* Logo */}
        <div style={{textAlign:"center",marginBottom:32}}>
          <div style={{display:"inline-flex",alignItems:"center",justifyContent:"center",width:56,height:56,borderRadius:12,background:"linear-gradient(135deg,#00f0ff,#0070ff)",marginBottom:16,boxShadow:"0 0 40px rgba(0,240,255,.5)",animation:"glowPulse 3s ease-in-out infinite"}}>
            <span style={{fontSize:26,color:"#fff"}}>⚡</span>
          </div>
          <h1 style={{fontFamily:"Orbitron",fontSize:22,fontWeight:900,color:"#fff",marginBottom:4,letterSpacing:"-0.5px"}}>
            <span style={{color:"#00f0ff"}}>VOLT</span>X
          </h1>
          <p style={{fontSize:12,color:"var(--muted)",letterSpacing:".1em",textTransform:"uppercase",fontFamily:"Share Tech Mono"}}>// Next-Gen Electronics Store</p>
        </div>

        {/* Tabs */}
        {tab !== "forgot" && (
          <div style={{display:"flex",gap:0,marginBottom:28,border:"1px solid rgba(0,240,255,.15)",borderRadius:6,overflow:"hidden"}}>
            {["login","signup"].map(t => (
              <button key={t} onClick={()=>{setTab(t);setErrors({});}} style={{
                flex:1,padding:"10px",fontSize:11,fontFamily:"Orbitron",letterSpacing:".08em",textTransform:"uppercase",fontWeight:600,
                border:"none",cursor:"pointer",transition:"all .2s",
                background: tab===t ? "linear-gradient(135deg,rgba(0,240,255,.12),rgba(0,112,255,.1))" : "transparent",
                color: tab===t ? "#00f0ff" : "#4a5a7a",
                borderRight: t==="login" ? "1px solid rgba(0,240,255,.15)" : "none",
              }}>{t==="login"?"SIGN IN":"CREATE ACCOUNT"}</button>
            ))}
          </div>
        )}

        {tab==="forgot" && (
          <div style={{marginBottom:24}}>
            <button onClick={()=>setTab("login")} style={{background:"none",border:"none",color:"var(--muted)",cursor:"pointer",fontSize:12,display:"flex",alignItems:"center",gap:6}}>← Back to Sign In</button>
            <h2 style={{fontFamily:"Orbitron",fontSize:16,color:"#fff",margin:"12px 0 4px"}}>RESET PASSWORD</h2>
            <p style={{fontSize:13,color:"var(--muted)"}}>Enter your email to receive a reset link.</p>
          </div>
        )}

        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          {tab==="signup" && (
            <div>
              <input className="cyber-input" placeholder="Full Name" value={form.name} onChange={e=>set("name",e.target.value)} style={{borderColor:errors.name?"rgba(255,0,60,.4)":"rgba(0,240,255,.2)"}}/>
              {errors.name && <p style={{fontSize:11,color:"#ff003c",marginTop:4}}>⚠ {errors.name}</p>}
            </div>
          )}
          <div>
            <input className="cyber-input" placeholder="Email Address" type="email" value={form.email} onChange={e=>set("email",e.target.value)} style={{borderColor:errors.email?"rgba(255,0,60,.4)":"rgba(0,240,255,.2)"}}/>
            {errors.email && <p style={{fontSize:11,color:"#ff003c",marginTop:4}}>⚠ {errors.email}</p>}
          </div>
          {tab !== "forgot" && (
            <div>
              <input className="cyber-input" placeholder="Password" type="password" value={form.password} onChange={e=>set("password",e.target.value)} style={{borderColor:errors.password?"rgba(255,0,60,.4)":"rgba(0,240,255,.2)"}}/>
              {errors.password && <p style={{fontSize:11,color:"#ff003c",marginTop:4}}>⚠ {errors.password}</p>}
            </div>
          )}
          {tab==="signup" && (
            <div>
              <input className="cyber-input" placeholder="Confirm Password" type="password" value={form.confirm} onChange={e=>set("confirm",e.target.value)} style={{borderColor:errors.confirm?"rgba(255,0,60,.4)":"rgba(0,240,255,.2)"}}/>
              {errors.confirm && <p style={{fontSize:11,color:"#ff003c",marginTop:4}}>⚠ {errors.confirm}</p>}
            </div>
          )}

          {errors.submit && (
            <div style={{background:"rgba(255,0,60,.08)",border:"1px solid rgba(255,0,60,.25)",borderRadius:4,padding:"10px 14px",fontSize:13,color:"#ff6680"}}>{errors.submit}</div>
          )}

          <button
            onClick={tab==="login"?handleLogin:tab==="signup"?handleSignup:handleForgot}
            disabled={loading}
            className="neon-btn neon-btn-primary"
            style={{padding:"13px",fontSize:12,letterSpacing:".1em",marginTop:4,display:"flex",alignItems:"center",justifyContent:"center",gap:8}}
          >
            {loading ? <><span style={{width:14,height:14,border:"2px solid rgba(255,255,255,.3)",borderTopColor:"#fff",borderRadius:"50%",animation:"spin .7s linear infinite",display:"inline-block"}}/> PROCESSING...</> : tab==="login"?"⚡ ACCESS GRANTED":tab==="signup"?"CREATE ACCOUNT":"SEND RESET LINK"}
          </button>

          {tab==="login" && (
            <button onClick={()=>setTab("forgot")} style={{background:"none",border:"none",color:"rgba(0,240,255,.6)",cursor:"pointer",fontSize:12,fontFamily:"Orbitron",letterSpacing:".06em"}}>FORGOT PASSWORD?</button>
          )}
        </div>

        <div style={{marginTop:28,paddingTop:20,borderTop:"1px solid rgba(0,240,255,.08)",textAlign:"center"}}>
          <p style={{fontSize:11,color:"var(--muted)",fontFamily:"Share Tech Mono",marginBottom:8}}>// DEMO CREDENTIALS</p>
          {[["User","demo@voltx.in","demo1234"],["Admin","admin@voltx.in","admin1234"]].map(([role,email,pass]) => (
            <button key={role} onClick={()=>setForm(f=>({...f,email,password:pass}))} style={{margin:"0 4px",background:"rgba(0,240,255,.04)",border:"1px solid rgba(0,240,255,.12)",borderRadius:4,padding:"5px 12px",fontSize:10,fontFamily:"Share Tech Mono",color:"rgba(0,240,255,.7)",cursor:"pointer",transition:"all .15s"}} onMouseEnter={e=>e.currentTarget.style.background="rgba(0,240,255,.1)"} onMouseLeave={e=>e.currentTarget.style.background="rgba(0,240,255,.04)"}>
              {role}: {email}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══ PRODUCT CARD ═══ */
function ProductCard({ product, onView, onCart, onBuyNow, wishlist, onWishlist, toast }) {
  const [anim, setAnim] = useState(false);
  if(!product) return (
    <div style={{background:"var(--bg1)",borderRadius:10,overflow:"hidden",border:"1px solid var(--border)"}}>
      <div className="skeleton" style={{height:190}}/><div style={{padding:14}}>
        <div className="skeleton" style={{height:10,marginBottom:8,width:"55%"}}/><div className="skeleton" style={{height:14,marginBottom:8}}/><div className="skeleton" style={{height:18,width:"40%",marginBottom:12}}/><div className="skeleton" style={{height:36}}/>
      </div>
    </div>
  );
  const wished = wishlist?.includes(product.id);
  const d = disc(product.price, product.mrp);
  const stockLow = product.stock < 20;
  const handleCart = e => {
    e.stopPropagation(); setAnim(true);
    onCart(product);
    toast(`${product.name.split(" ").slice(0,3).join(" ")} added to cart`,"success");
    setTimeout(()=>setAnim(false),600);
  };
  return (
    <div className="orb-card" onClick={()=>onView(product)} style={{borderRadius:10,overflow:"hidden",display:"flex",flexDirection:"column",cursor:"pointer"}}>
      <div style={{position:"relative",height:190,background:"linear-gradient(135deg,#04070f,#080d1a)",flexShrink:0,overflow:"hidden"}}>
        <SafeImg src={product.imgs?.[0]} alt={product.name} style={{width:"100%",height:"100%",objectFit:"cover",transition:"transform .5s"}} onMouseEnter={e=>{if(e.target) e.target.style.transform="scale(1.08)";}} onMouseLeave={e=>{if(e.target) e.target.style.transform="scale(1)";}}/>
        <div style={{position:"absolute",inset:0,background:"linear-gradient(to top,rgba(4,7,15,.8),transparent 40%)",pointerEvents:"none"}}/>
        {d>0 && <span style={{position:"absolute",top:10,left:10,background:"rgba(0,200,100,.12)",border:"1px solid rgba(0,200,100,.3)",color:"#00ffa3",fontSize:9,fontWeight:700,padding:"2px 7px",borderRadius:3,fontFamily:"Orbitron",letterSpacing:".08em"}}>{d}% OFF</span>}
        {stockLow && <span style={{position:"absolute",top:10,left:product.mrp>product.price?70:10,background:"rgba(255,60,0,.12)",border:"1px solid rgba(255,60,0,.3)",color:"#ff6030",fontSize:9,fontWeight:700,padding:"2px 7px",borderRadius:3,fontFamily:"Orbitron"}}>{product.stock} LEFT</span>}
        <button onClick={e=>{e.stopPropagation();onWishlist(product.id);toast(wished?"Removed from wishlist":"Saved ❤️",wished?"info":"success");}} style={{position:"absolute",top:8,right:8,width:30,height:30,background:"rgba(0,0,0,.6)",backdropFilter:"blur(10px)",border:`1px solid ${wished?"rgba(255,0,60,.5)":"rgba(255,255,255,.1)"}`,borderRadius:"50%",color:wished?"#ff003c":"#4a5a7a",cursor:"pointer",fontSize:13,display:"flex",alignItems:"center",justifyContent:"center",transition:"all .2s"}}>
          {wished?"❤️":"🤍"}
        </button>
        <div style={{position:"absolute",bottom:8,right:8}}>
          <span style={{color:"#f59e0b",fontSize:11}}>{"★".repeat(Math.floor(product.rating))}</span>
          <span style={{color:"#1e293b",fontSize:11,marginLeft:4,fontFamily:"Orbitron",fontSize:9}}>{product.rating}</span>
        </div>
      </div>
      <div style={{padding:"12px 14px",flex:1,display:"flex",flexDirection:"column"}}>
        <p style={{fontSize:9,color:"var(--muted)",textTransform:"uppercase",fontFamily:"Orbitron",letterSpacing:".1em",margin:"0 0 4px"}}>{product.brand}</p>
        <h3 style={{fontSize:13,fontWeight:600,color:"#dce8f8",margin:"0 0 8px",lineHeight:1.4,flex:1}}>{product.name}</h3>
        <div style={{display:"flex",alignItems:"baseline",gap:8,marginBottom:2}}>
          <span style={{fontSize:17,fontWeight:700,color:"#00f0ff",fontFamily:"Orbitron"}}>{fmt(product.price)}</span>
          {product.mrp>product.price && <span style={{fontSize:11,color:"#1e3355",textDecoration:"line-through"}}>{fmt(product.mrp)}</span>}
        </div>
        <span style={{fontSize:10,color:"#00ffa3",marginBottom:10,fontFamily:"Orbitron"}}>SAVE {fmt(product.mrp-product.price)}</span>
      </div>
      <div style={{padding:"0 12px 12px",display:"flex",gap:6}}>
        <button onClick={handleCart} style={{flex:1,padding:"8px",fontSize:10,fontFamily:"Orbitron",letterSpacing:".06em",fontWeight:700,borderRadius:5,border:`1px solid ${anim?"rgba(0,255,163,.4)":"rgba(0,240,255,.25)"}`,background:anim?"rgba(0,255,163,.1)":"rgba(0,240,255,.06)",color:anim?"#00ffa3":"#00f0ff",cursor:"pointer",transition:"all .2s",transform:anim?"scale(.96)":"scale(1)"}}>
          {anim?"✓ ADDED":"CART"}
        </button>
        <button onClick={e=>{e.stopPropagation();onBuyNow(product);}} className="neon-btn neon-btn-primary" style={{flex:1,padding:"8px",fontSize:10,boxShadow:"none",borderRadius:5}}>BUY NOW</button>
      </div>
    </div>
  );
}

/* ═══ HOME PAGE ═══ */
function HomePage({ setPage, products, onView, onCart, onBuyNow, wishlist, onWishlist, toast }) {
  const [active, setActive] = useState(0);
  const slides = [
    {pid:1, title:"iPHONE 15 PRO MAX", sub:"Titanium. A17 Pro. The most powerful iPhone.", accent:"#00f0ff"},
    {pid:18, title:"PLAYSTATION 5", sub:"Next-gen gaming. Immersive haptics. 4K 120fps.", accent:"#0070ff"},
    {pid:10, title:"MACBOOK PRO M3", sub:"Supercharged for professionals.", accent:"#00ffa3"},
    {pid:6, title:"SONY WH-1000XM5", sub:"Industry-best noise cancellation. 30hr battery.", accent:"#7000ff"},
  ];
  useEffect(()=>{const t=setInterval(()=>setActive(a=>(a+1)%slides.length),5500);return()=>clearInterval(t);},[]);
  const sl = slides[active];
  const heroProduct = products.find(p=>p.id===sl.pid);

  return (
    <div style={{display:"flex",flexDirection:"column",gap:72}}>
      {/* Hero */}
      <div style={{position:"relative",minHeight:560,borderRadius:12,overflow:"hidden",border:"1px solid rgba(0,240,255,.1)",background:"linear-gradient(135deg,#030610 0%,#060b1a 60%,#030610 100%)"}}>
        <div className="grid-bg" style={{position:"absolute",inset:0,opacity:.6}}/>
        <ThreeHero page="home"/>
        <div style={{position:"absolute",inset:0,background:`radial-gradient(ellipse 800px 500px at 70% 50%, ${sl.accent}10 0%, transparent 60%)`,transition:"background 1.2s",pointerEvents:"none"}}/>
        <div style={{position:"relative",zIndex:2,display:"flex",alignItems:"center",minHeight:560,padding:"60px 60px 60px 60px"}}>
          <div style={{flex:1,maxWidth:560}}>
            <div style={{display:"inline-flex",alignItems:"center",gap:6,marginBottom:18,background:`${sl.accent}12`,color:sl.accent,border:`1px solid ${sl.accent}30`,fontSize:9,fontFamily:"Orbitron",fontWeight:700,letterSpacing:".16em",padding:"5px 14px",borderRadius:3}}>
              <span style={{width:5,height:5,borderRadius:"50%",background:sl.accent,animation:"pulse 1.5s ease-in-out infinite"}}/>NEW ARRIVAL
            </div>
            <h1 key={active} className="fade-in" style={{fontFamily:"Orbitron",fontSize:"clamp(24px,4vw,48px)",fontWeight:900,color:"#fff",lineHeight:1.06,letterSpacing:"-1px",marginBottom:12}}>
              {sl.title}
            </h1>
            <p style={{fontSize:15,color:"#4a5a7a",marginBottom:10,maxWidth:420,lineHeight:1.7}}>{sl.sub}</p>
            {heroProduct && <p style={{fontFamily:"Orbitron",fontSize:28,fontWeight:900,color:sl.accent,marginBottom:32,textShadow:`0 0 20px ${sl.accent}60`}}>FROM {fmt(heroProduct.price)}</p>}
            <div style={{display:"flex",gap:12}}>
              <button onClick={()=>setPage("products")} className="neon-btn neon-btn-primary" style={{fontSize:11,padding:"13px 28px",letterSpacing:".1em"}}>SHOP NOW →</button>
              {heroProduct && <button onClick={()=>onView(heroProduct)} className="neon-btn" style={{fontSize:11,padding:"13px 24px",letterSpacing:".1em"}}>VIEW DETAILS</button>}
            </div>
          </div>
        </div>
        <div style={{position:"absolute",bottom:24,left:60,display:"flex",gap:8,zIndex:3}}>
          {slides.map((_,i)=>(
            <button key={i} onClick={()=>setActive(i)} style={{width:i===active?32:7,height:7,borderRadius:4,border:"none",background:i===active?sl.accent:"rgba(255,255,255,.12)",cursor:"pointer",padding:0,transition:"all .35s",boxShadow:i===active?`0 0 12px ${sl.accent}`:"none"}}/>
          ))}
        </div>
      </div>

      {/* Stats */}
      <Reveal>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14}}>
          {[["50K+","Customers","👤"],["120+","Brands","🏷️"],["24/7","Support","⚡"],["2-Year","Warranty","🛡"]].map(([v,l,icon])=>(
            <div key={l} style={{background:"rgba(6,11,24,.8)",border:"1px solid rgba(0,240,255,.08)",borderRadius:10,padding:"20px 22px",display:"flex",alignItems:"center",gap:14}}>
              <span style={{fontSize:22}}>{icon}</span>
              <div>
                <p style={{fontFamily:"Orbitron",fontSize:20,fontWeight:900,color:"#00f0ff",margin:0,lineHeight:1}}>{v}</p>
                <p style={{fontSize:11,color:"var(--muted)",margin:"3px 0 0",letterSpacing:".05em"}}>{l}</p>
              </div>
            </div>
          ))}
        </div>
      </Reveal>

      {/* Categories */}
      <Reveal>
        <p style={{fontFamily:"Orbitron",fontSize:14,fontWeight:600,color:"var(--muted)",letterSpacing:".15em",textTransform:"uppercase",marginBottom:18}}>// SHOP BY CATEGORY</p>
        <div style={{display:"grid",gridTemplateColumns:"repeat(8,1fr)",gap:10}}>
          {CATEGORIES.map(c=>(
            <button key={c.id} onClick={()=>setPage("products")} style={{background:"rgba(6,11,24,.7)",border:"1px solid rgba(0,240,255,.07)",borderRadius:10,padding:"18px 8px",cursor:"pointer",textAlign:"center",display:"flex",flexDirection:"column",alignItems:"center",gap:8,transition:"all .25s",outline:"none"}} onMouseEnter={e=>{e.currentTarget.style.borderColor="rgba(0,240,255,.3)";e.currentTarget.style.background="rgba(0,240,255,.05)";e.currentTarget.style.transform="translateY(-5px)";}} onMouseLeave={e=>{e.currentTarget.style.borderColor="rgba(0,240,255,.07)";e.currentTarget.style.background="rgba(6,11,24,.7)";e.currentTarget.style.transform="";}}>
              <span style={{fontSize:24}}>{c.icon}</span>
              <span style={{fontSize:9,fontFamily:"Orbitron",color:"var(--muted)",letterSpacing:".07em"}}>{c.name}</span>
            </button>
          ))}
        </div>
      </Reveal>

      {/* Featured */}
      <Reveal delay={60}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20}}>
          <p style={{fontFamily:"Orbitron",fontSize:14,fontWeight:600,color:"var(--muted)",letterSpacing:".15em"}}>// FEATURED PRODUCTS</p>
          <button onClick={()=>setPage("products")} style={{background:"none",border:"none",color:"rgba(0,240,255,.6)",fontFamily:"Orbitron",fontSize:9,cursor:"pointer",letterSpacing:".1em"}}>VIEW ALL →</button>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:16}}>
          {products.slice(0,8).map((p,i)=>(
            <div key={p.id} className="fade-up" style={{animationDelay:`${i*55}ms`}}>
              <ProductCard product={p} onView={onView} onCart={onCart} onBuyNow={onBuyNow} wishlist={wishlist} onWishlist={onWishlist} toast={toast}/>
            </div>
          ))}
        </div>
      </Reveal>
    </div>
  );
}

/* ═══ PRODUCTS PAGE ═══ */
function ProductsPage({ products, onView, onCart, onBuyNow, wishlist, onWishlist, toast }) {
  const [filters, setFilters] = useState({cat:"all",brand:"all",maxPrice:300000,sort:"popular",q:""});
  const set = (k,v) => setFilters(f=>({...f,[k]:v}));
  const brands = useMemo(()=>[...new Set(products.map(p=>p.brand))],[products]);

  let list = products
    .filter(p=>filters.cat==="all"||p.cat===filters.cat)
    .filter(p=>filters.brand==="all"||p.brand===filters.brand)
    .filter(p=>p.price<=filters.maxPrice)
    .filter(p=>!filters.q||p.name.toLowerCase().includes(filters.q.toLowerCase())||p.brand.toLowerCase().includes(filters.q.toLowerCase()));
  if(filters.sort==="price-asc")  list=[...list].sort((a,b)=>a.price-b.price);
  if(filters.sort==="price-desc") list=[...list].sort((a,b)=>b.price-a.price);
  if(filters.sort==="rating")     list=[...list].sort((a,b)=>b.rating-a.rating);

  const SB = ({active,onClick,children}) => (
    <button onClick={onClick} style={{display:"block",width:"100%",textAlign:"left",padding:"7px 10px",borderRadius:4,border:"none",background:active?"rgba(0,240,255,.1)":"transparent",color:active?"#00f0ff":"var(--muted)",fontWeight:active?700:400,fontSize:12,cursor:"pointer",marginBottom:2,transition:"all .15s",fontFamily:"Rajdhani",letterSpacing:".03em"}}>{children}</button>
  );

  return (
    <div style={{display:"flex",gap:24}}>
      {/* Sidebar */}
      <div style={{width:210,flexShrink:0,position:"sticky",top:78}}>
        <div style={{background:"rgba(6,11,24,.85)",border:"1px solid rgba(0,240,255,.1)",borderRadius:10,padding:18}}>
          <p style={{fontFamily:"Orbitron",fontSize:10,color:"#00f0ff",letterSpacing:".12em",marginBottom:16}}>// FILTERS</p>
          <p style={{fontSize:9,fontFamily:"Orbitron",color:"var(--muted)",letterSpacing:".1em",margin:"0 0 8px"}}>CATEGORY</p>
          <SB active={filters.cat==="all"} onClick={()=>set("cat","all")}>All Products</SB>
          {CATEGORIES.map(c=><SB key={c.id} active={filters.cat===c.id} onClick={()=>set("cat",c.id)}>{c.icon} {c.name}</SB>)}
          <div style={{borderTop:"1px solid rgba(0,240,255,.06)",margin:"14px 0"}}/>
          <p style={{fontSize:9,fontFamily:"Orbitron",color:"var(--muted)",letterSpacing:".1em",margin:"0 0 8px"}}>BRAND</p>
          <SB active={filters.brand==="all"} onClick={()=>set("brand","all")}>All Brands</SB>
          {brands.map(b=><SB key={b} active={filters.brand===b} onClick={()=>set("brand",b)}>{b}</SB>)}
          <div style={{borderTop:"1px solid rgba(0,240,255,.06)",margin:"14px 0"}}/>
          <p style={{fontSize:9,fontFamily:"Orbitron",color:"var(--muted)",letterSpacing:".1em",margin:"0 0 10px"}}>MAX: <span style={{color:"#00f0ff"}}>{fmt(filters.maxPrice)}</span></p>
          <input type="range" min={5000} max={300000} step={5000} value={filters.maxPrice} onChange={e=>set("maxPrice",+e.target.value)} style={{width:"100%",accentColor:"#00f0ff"}}/>
          <button onClick={()=>setFilters({cat:"all",brand:"all",maxPrice:300000,sort:"popular",q:""})} style={{marginTop:14,width:"100%",background:"rgba(255,0,60,.06)",border:"1px solid rgba(255,0,60,.2)",color:"#ff003c",borderRadius:4,padding:"7px",fontSize:10,fontFamily:"Orbitron",cursor:"pointer",letterSpacing:".07em"}}>RESET FILTERS</button>
        </div>
      </div>
      <div style={{flex:1}}>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:18}}>
          <input className="cyber-input" placeholder="Search products..." value={filters.q} onChange={e=>set("q",e.target.value)} style={{flex:1,height:38}}/>
          <select value={filters.sort} onChange={e=>set("sort",e.target.value)} className="cyber-input" style={{width:180,height:38}}>
            <option value="popular">Popularity</option>
            <option value="price-asc">Price: Low → High</option>
            <option value="price-desc">Price: High → Low</option>
            <option value="rating">Top Rated</option>
          </select>
          <span style={{fontSize:11,color:"var(--muted)",fontFamily:"Orbitron",whiteSpace:"nowrap"}}>{list.length} RESULTS</span>
        </div>
        {list.length === 0 ? (
          <div style={{textAlign:"center",padding:"80px 0"}}>
            <p style={{fontSize:40,opacity:.2,marginBottom:12}}>🔍</p>
            <p style={{fontFamily:"Orbitron",fontSize:14,color:"var(--muted)"}}>NO PRODUCTS FOUND</p>
          </div>
        ) : (
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:16}}>
            {list.map((p,i)=>(
              <div key={p.id} className="fade-up" style={{animationDelay:`${i*30}ms`}}>
                <ProductCard product={p} onView={onView} onCart={onCart} onBuyNow={onBuyNow} wishlist={wishlist} onWishlist={onWishlist} toast={toast}/>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══ PRODUCT DETAIL ═══ */
function ProductDetail({ product, onBack, onCart, onBuyNow, wishlist, onWishlist, products, onView, toast }) {
  const [activeImg, setActiveImg] = useState(0);
  const [cartDone, setCartDone] = useState(false);
  const related = products.filter(p=>p.cat===product.cat&&p.id!==product.id).slice(0,4);
  const wished = wishlist?.includes(product.id);

  return (
    <div className="fade-in">
      <button onClick={onBack} style={{background:"rgba(0,240,255,.05)",border:"1px solid rgba(0,240,255,.15)",color:"#00f0ff",cursor:"pointer",fontSize:10,fontFamily:"Orbitron",letterSpacing:".08em",marginBottom:28,display:"flex",alignItems:"center",gap:8,padding:"9px 16px",borderRadius:4}}>← BACK</button>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:48,marginBottom:52}}>
        <div>
          <div style={{background:"linear-gradient(135deg,#040710,#080d1a)",borderRadius:12,overflow:"hidden",height:420,marginBottom:12,border:"1px solid rgba(0,240,255,.12)",position:"relative"}}>
            <SafeImg src={product.imgs?.[activeImg]} alt={product.name} style={{width:"100%",height:"100%",objectFit:"cover"}}/>
          </div>
          <div style={{display:"flex",gap:8}}>
            {product.imgs?.map((img,i)=>(
              <button key={i} onClick={()=>setActiveImg(i)} style={{width:80,height:80,borderRadius:8,overflow:"hidden",cursor:"pointer",border:`2px solid ${activeImg===i?"#00f0ff":"rgba(0,240,255,.1)"}`,background:"#040710",padding:0,outline:"none",boxShadow:activeImg===i?"0 0 16px rgba(0,240,255,.3)":"none",transition:"all .2s"}}>
                <SafeImg src={img} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>
              </button>
            ))}
          </div>
        </div>
        <div>
          <p style={{fontSize:9,color:"var(--muted)",textTransform:"uppercase",fontFamily:"Orbitron",letterSpacing:".14em",marginBottom:6}}>{product.brand}</p>
          <h1 style={{fontFamily:"Orbitron",fontSize:28,fontWeight:900,color:"#fff",margin:"0 0 12px",lineHeight:1.1}}>{product.name}</h1>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:16}}>
            <span style={{color:"#f59e0b",fontSize:13}}>{"★".repeat(Math.floor(product.rating))}</span>
            <span style={{fontSize:12,color:"var(--muted)",fontFamily:"Share Tech Mono"}}>{product.rating} ({product.reviews.toLocaleString()} reviews)</span>
          </div>
          <p style={{fontSize:14,color:"#5a7090",lineHeight:1.8,marginBottom:24}}>{product.desc}</p>
          <div style={{background:"rgba(0,240,255,.04)",border:"1px solid rgba(0,240,255,.12)",borderRadius:10,padding:20,marginBottom:22}}>
            <div style={{display:"flex",alignItems:"baseline",gap:12,marginBottom:10}}>
              <span style={{fontFamily:"Orbitron",fontSize:36,fontWeight:900,color:"#fff"}}>{fmt(product.price)}</span>
              <span style={{fontSize:16,color:"#1a2a44",textDecoration:"line-through"}}>{fmt(product.mrp)}</span>
            </div>
            <span style={{background:"rgba(0,255,163,.08)",color:"#00ffa3",border:"1px solid rgba(0,255,163,.2)",padding:"4px 12px",borderRadius:20,fontSize:12,fontFamily:"Orbitron",fontWeight:700}}>SAVE {fmt(product.mrp-product.price)} ({disc(product.price,product.mrp)}%)</span>
          </div>
          <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:22}}>
            {product.hi?.map(h=>(
              <span key={h} style={{background:"rgba(0,240,255,.06)",color:"#00f0ff",border:"1px solid rgba(0,240,255,.18)",padding:"6px 12px",borderRadius:4,fontSize:12,fontFamily:"Orbitron",fontSize:10,letterSpacing:".06em"}}>✓ {h}</span>
            ))}
          </div>
          <div style={{display:"flex",gap:10,marginBottom:10}}>
            <button onClick={()=>{setCartDone(true);onCart(product);toast("Added to cart","success");setTimeout(()=>setCartDone(false),2500);}} style={{flex:1,padding:"14px",fontSize:11,fontFamily:"Orbitron",letterSpacing:".08em",fontWeight:700,borderRadius:6,border:`1.5px solid ${cartDone?"rgba(0,255,163,.4)":"rgba(0,240,255,.3)"}`,background:cartDone?"rgba(0,255,163,.08)":"rgba(0,240,255,.06)",color:cartDone?"#00ffa3":"#00f0ff",cursor:"pointer",transition:"all .3s"}}>
              {cartDone?"✓ ADDED":"ADD TO CART"}
            </button>
            <button onClick={()=>onBuyNow(product)} className="neon-btn neon-btn-primary" style={{flex:1,padding:"14px",fontSize:11}}>⚡ BUY NOW</button>
          </div>
          <button onClick={()=>{onWishlist(product.id);toast(wished?"Removed":"Saved to wishlist ❤️",wished?"info":"success");}} style={{width:"100%",padding:"12px",fontSize:10,fontFamily:"Orbitron",letterSpacing:".08em",fontWeight:700,borderRadius:6,border:`1px solid ${wished?"rgba(255,0,60,.3)":"rgba(255,255,255,.06)"}`,background:wished?"rgba(255,0,60,.08)":"rgba(255,255,255,.02)",color:wished?"#ff003c":"var(--muted)",cursor:"pointer",transition:"all .2s"}}>
            {wished?"❤️ WISHLISTED":"🤍 ADD TO WISHLIST"}
          </button>
        </div>
      </div>
      {/* Specs */}
      <div style={{background:"rgba(6,11,24,.85)",border:"1px solid rgba(0,240,255,.1)",borderRadius:10,padding:28,marginBottom:48}}>
        <p style={{fontFamily:"Orbitron",fontSize:12,fontWeight:600,color:"#00f0ff",letterSpacing:".12em",marginBottom:18}}>// SPECIFICATIONS</p>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:1,background:"rgba(0,240,255,.04)",borderRadius:6,overflow:"hidden"}}>
          {Object.entries(product.specs||{}).map(([key,val],i)=>(
            <div key={key} style={{background:"rgba(6,11,24,.9)",padding:"11px 16px",display:"flex",justifyContent:"space-between",alignItems:"center",borderBottom:`1px solid rgba(0,240,255,.04)`}}>
              <span style={{fontSize:11,color:"var(--muted)",fontFamily:"Share Tech Mono"}}>{key}</span>
              <span style={{fontSize:12,color:"#c8d6f0",fontWeight:600}}>{val}</span>
            </div>
          ))}
        </div>
      </div>
      {/* Related */}
      {related.length>0 && (
        <div>
          <p style={{fontFamily:"Orbitron",fontSize:12,fontWeight:600,color:"var(--muted)",letterSpacing:".15em",marginBottom:16}}>// YOU MAY ALSO LIKE</p>
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:16}}>
            {related.map(p=><ProductCard key={p.id} product={p} onView={onView} onCart={onCart} onBuyNow={onBuyNow} wishlist={wishlist} onWishlist={onWishlist} toast={toast}/>)}
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══ CONTACT CONFIG ═══ */
const CONTACT_CONFIG = {
  whatsapp:    "919876543210",
  whatsappMsg: "Hi VoltX! I need help with my order / product query.",
  phone:       "1800-000-8888",
  phone2:      "+91 98765 43210",
  email:       "support@voltx.in",
  email2:      "sales@voltx.in",
  locations: [
    { city:"Bengaluru", address:"#42, 2nd Floor, MG Road, Bengaluru – 560001",          maps:"https://maps.google.com/?q=MG+Road+Bengaluru",              hours:"Mon–Sun: 10am–9pm" },
    { city:"Mumbai",    address:"Shop 12, Linking Road, Bandra West, Mumbai – 400050",   maps:"https://maps.google.com/?q=Linking+Road+Bandra+Mumbai",     hours:"Mon–Sun: 10am–9pm" },
    { city:"Delhi",     address:"G-14, Connaught Place, New Delhi – 110001",             maps:"https://maps.google.com/?q=Connaught+Place+New+Delhi",      hours:"Mon–Sun: 10am–9pm" },
    { city:"Hyderabad", address:"3-4-189, Himayatnagar, Hyderabad – 500029",             maps:"https://maps.google.com/?q=Himayatnagar+Hyderabad",         hours:"Mon–Sun: 10am–9pm" },
  ],
};

/* ═══ FLOATING WHATSAPP BUTTON ═══ */
function FloatingWhatsApp() {
  const [open, setOpen] = useState(false);
  const waBase = `https://wa.me/${CONTACT_CONFIG.whatsapp}?text=`;
  const topics = [
    ["📦 Track my order",   "Hi VoltX! I need help tracking my order."],
    ["↩️ Return / Refund",   "Hi VoltX! I want to initiate a return."],
    ["🛡 Warranty claim",   "Hi VoltX! I need to raise a warranty claim."],
    ["📱 Product enquiry",  "Hi VoltX! I have a product question."],
  ];
  return (
    <div style={{position:"fixed",bottom:28,right:28,zIndex:800,display:"flex",flexDirection:"column",alignItems:"flex-end",gap:12}}>
      {open && (
        <div className="fade-in" style={{background:"#fff",borderRadius:16,boxShadow:"0 20px 60px rgba(0,0,0,.3)",border:"1px solid rgba(0,0,0,.08)",width:290,overflow:"hidden"}}>
          <div style={{background:"linear-gradient(135deg,#075e54,#128c3e)",padding:"16px 18px",display:"flex",alignItems:"center",gap:12}}>
            <div style={{width:40,height:40,borderRadius:"50%",background:"rgba(255,255,255,.2)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>💬</div>
            <div style={{flex:1}}><p style={{color:"#fff",fontWeight:800,fontSize:14,margin:0}}>VoltX Support</p><p style={{color:"rgba(255,255,255,.75)",fontSize:11,margin:0}}>● Online · ~3 min reply</p></div>
            <button onClick={()=>setOpen(false)} style={{background:"none",border:"none",color:"rgba(255,255,255,.8)",cursor:"pointer",fontSize:20,lineHeight:1}}>×</button>
          </div>
          <div style={{padding:16}}>
            <div style={{background:"#f0f4f8",borderRadius:12,borderTopLeftRadius:4,padding:"10px 14px",marginBottom:12}}>
              <p style={{fontSize:13,color:"#374151",margin:0,lineHeight:1.6}}>👋 Hi! Welcome to <strong>VoltX</strong>. How can we help?</p>
            </div>
            {topics.map(([label,msg])=>(
              <a key={label} href={waBase+encodeURIComponent(msg)} target="_blank" rel="noreferrer" style={{display:"block",textDecoration:"none",marginBottom:7}}>
                <button style={{width:"100%",background:"#f8fafc",border:"1px solid #e5e7eb",borderRadius:8,padding:"9px 12px",fontSize:12,fontWeight:600,color:"#111827",cursor:"pointer",textAlign:"left",transition:"background .15s"}} onMouseEnter={e=>e.currentTarget.style.background="#e8f5e9"} onMouseLeave={e=>e.currentTarget.style.background="#f8fafc"}>{label}</button>
              </a>
            ))}
            <a href={waBase+encodeURIComponent(CONTACT_CONFIG.whatsappMsg)} target="_blank" rel="noreferrer" style={{textDecoration:"none",display:"block",marginTop:8}}>
              <button style={{width:"100%",background:"linear-gradient(135deg,#128c3e,#25d366)",color:"#fff",border:"none",borderRadius:10,padding:"12px",fontSize:13,fontWeight:800,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>💬 Open WhatsApp Chat</button>
            </a>
          </div>
        </div>
      )}
      <button onClick={()=>setOpen(o=>!o)} style={{width:58,height:58,background:"linear-gradient(135deg,#128c3e,#25d366)",borderRadius:"50%",border:"none",cursor:"pointer",fontSize:26,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 6px 24px rgba(37,211,102,.55)",transition:"transform .2s"}} onMouseEnter={e=>e.currentTarget.style.transform="scale(1.1)"} onMouseLeave={e=>e.currentTarget.style.transform=""}>
        {open?"✕":"💬"}
      </button>
    </div>
  );
}

/* ═══ DEALS PAGE — FIXED (no staggered animations = no hang) ═══ */
function DealsPage({ products, onView, onCart, onBuyNow, wishlist, onWishlist, toast }) {
  const [secs, setSecs] = useState(43200);
  const [activeTab, setActiveTab] = useState("all");
  const [page, setPage] = useState(0);
  const PAGE_SIZE = 8;

  useEffect(()=>{const t=setInterval(()=>setSecs(s=>Math.max(0,s-1)),1000);return()=>clearInterval(t);},[]);
  const h=String(Math.floor(secs/3600)).padStart(2,"0");
  const m=String(Math.floor((secs%3600)/60)).padStart(2,"0");
  const s=String(secs%60).padStart(2,"0");

  // Categorise deals — memoised so filtering is instant
  const { flash, hot, value, all } = useMemo(()=>{
    const withDisc = products.filter(p=>p.mrp>p.price);
    return {
      flash: withDisc.filter(p=>disc(p.price,p.mrp)>=20),
      hot:   withDisc.filter(p=>disc(p.price,p.mrp)>=10 && disc(p.price,p.mrp)<20),
      value: withDisc.filter(p=>disc(p.price,p.mrp)>=5  && disc(p.price,p.mrp)<10),
      all:   withDisc,
    };
  },[products]);

  const tabMap = { all, flash, hot, value };
  const current = tabMap[activeTab] || all;
  const totalPages = Math.ceil(current.length / PAGE_SIZE);
  const visible = current.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);

  const switchTab = (t) => { setActiveTab(t); setPage(0); };

  const tabs = [
    { id:"all",   label:"All Deals",    count:all.length,   color:"#00f0ff" },
    { id:"flash", label:"💥 Flash",     count:flash.length, color:"#ff003c" },
    { id:"hot",   label:"🔥 Hot",       count:hot.length,   color:"#ffaa00" },
    { id:"value", label:"💰 Value",     count:value.length, color:"#00ffa3" },
  ];

  return (
    <div className="fade-in" style={{display:"flex",flexDirection:"column",gap:32}}>
      {/* Hero banner */}
      <div style={{borderRadius:12,padding:"40px 48px",background:"linear-gradient(135deg,#080008,#140010,#080008)",border:"1px solid rgba(112,0,255,.2)",position:"relative",overflow:"hidden",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:20}}>
        <div style={{position:"absolute",inset:0,backgroundImage:"radial-gradient(ellipse at 20% 50%, rgba(112,0,255,.1) 0%, transparent 55%)",pointerEvents:"none"}}/>
        <div style={{position:"relative",zIndex:1}}>
          <p style={{fontFamily:"Orbitron",fontSize:9,color:"#aa40ff",letterSpacing:".2em",margin:"0 0 10px"}}>// LIMITED TIME OFFERS</p>
          <h1 style={{fontFamily:"Orbitron",fontSize:34,fontWeight:900,color:"#fff",margin:"0 0 8px"}}>⚡ DEALS OF THE DAY</h1>
          <p style={{fontSize:14,color:"#4a3060",margin:0}}>{all.length} products on sale right now</p>
        </div>
        <div style={{textAlign:"right",position:"relative",zIndex:1,flexShrink:0}}>
          <p style={{fontSize:10,color:"#aa40ff",margin:"0 0 8px",fontFamily:"Orbitron",letterSpacing:".1em"}}>ENDS IN</p>
          <div style={{fontFamily:"Orbitron",fontSize:26,fontWeight:900,letterSpacing:".15em",color:"#c060ff",background:"rgba(0,0,0,.55)",padding:"10px 20px",borderRadius:6,border:"1px solid rgba(112,0,255,.3)",minWidth:160,textAlign:"center"}}>{h}:{m}:{s}</div>
          <p style={{fontSize:9,color:"var(--muted)",margin:"6px 0 0",fontFamily:"Share Tech Mono",textAlign:"center"}}>HRS : MIN : SEC</p>
        </div>
      </div>

      {/* Tabs */}
      <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
        {tabs.map(t=>(
          <button key={t.id} onClick={()=>switchTab(t.id)} style={{padding:"9px 20px",borderRadius:20,fontSize:10,fontFamily:"Orbitron",fontWeight:700,letterSpacing:".07em",border:`1px solid ${activeTab===t.id?t.color+"88":t.color+"22"}`,background:activeTab===t.id?t.color+"14":"transparent",color:activeTab===t.id?t.color:"var(--muted)",cursor:"pointer",transition:"all .2s",display:"flex",alignItems:"center",gap:8}}>
            {t.label}
            <span style={{background:t.color+"22",color:t.color,borderRadius:10,padding:"1px 8px",fontSize:9}}>{t.count}</span>
          </button>
        ))}
      </div>

      {/* Product grid — NO staggered animation delay to prevent lag */}
      {visible.length === 0 ? (
        <div style={{textAlign:"center",padding:"80px 0",border:"1px solid rgba(0,240,255,.07)",borderRadius:10}}>
          <p style={{fontSize:40,opacity:.2,marginBottom:12}}>🏷️</p>
          <p style={{fontFamily:"Orbitron",fontSize:13,color:"var(--muted)"}}>NO DEALS IN THIS CATEGORY</p>
        </div>
      ) : (
        <>
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:16}}>
            {visible.map(p=>(
              <div key={p.id}>
                <ProductCard product={p} onView={onView} onCart={onCart} onBuyNow={onBuyNow} wishlist={wishlist} onWishlist={onWishlist} toast={toast}/>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8,paddingTop:8}}>
              <button onClick={()=>setPage(p=>Math.max(0,p-1))} disabled={page===0} style={{background:"rgba(0,240,255,.06)",border:"1px solid rgba(0,240,255,.2)",borderRadius:6,color:page===0?"var(--muted)":"#00f0ff",cursor:page===0?"default":"pointer",padding:"8px 16px",fontSize:10,fontFamily:"Orbitron",fontWeight:700,letterSpacing:".06em",opacity:page===0?.4:1}}>← PREV</button>
              {Array.from({length:totalPages}).map((_,i)=>(
                <button key={i} onClick={()=>setPage(i)} style={{width:34,height:34,borderRadius:6,border:`1px solid ${page===i?"rgba(0,240,255,.5)":"rgba(0,240,255,.15)"}`,background:page===i?"rgba(0,240,255,.14)":"transparent",color:page===i?"#00f0ff":"var(--muted)",cursor:"pointer",fontSize:11,fontFamily:"Orbitron",fontWeight:700,transition:"all .18s"}}>{i+1}</button>
              ))}
              <button onClick={()=>setPage(p=>Math.min(totalPages-1,p+1))} disabled={page===totalPages-1} style={{background:"rgba(0,240,255,.06)",border:"1px solid rgba(0,240,255,.2)",borderRadius:6,color:page===totalPages-1?"var(--muted)":"#00f0ff",cursor:page===totalPages-1?"default":"pointer",padding:"8px 16px",fontSize:10,fontFamily:"Orbitron",fontWeight:700,letterSpacing:".06em",opacity:page===totalPages-1?.4:1}}>NEXT →</button>
            </div>
          )}
          <p style={{textAlign:"center",fontSize:11,color:"var(--muted)",fontFamily:"Share Tech Mono"}}>Showing {page*PAGE_SIZE+1}–{Math.min((page+1)*PAGE_SIZE, current.length)} of {current.length} deals</p>
        </>
      )}
    </div>
  );
}

/* ═══ CART MODAL ═══ */
function CartModal({ cart, onClose, onRemove, onUpdateQty, onClear, toast, user, setPage }) {
  const total = cart.reduce((s,i)=>s+i.product.price*i.qty, 0);
  const savings = cart.reduce((s,i)=>s+(i.product.mrp-i.product.price)*i.qty, 0);
  const [step, setStep] = useState("cart"); // cart | checkout | done
  const [processing, setProcessing] = useState(false);
  const [payMethod, setPayMethod] = useState("upi");

  const placeOrder = async () => {
    setProcessing(true);
    await new Promise(r=>setTimeout(r,1800));
    const orders = DB.get("orders") || [];
    const newOrder = {
      id: `ORD-${Date.now().toString().slice(-6)}`,
      userId: user?.email || "guest",
      products: cart.map(i=>({id:i.product.id,qty:i.qty})),
      total, status:"processing", payment:"paid", payMethod,
      date: new Date().toISOString().split("T")[0],
      address: "Your saved address",
    };
    orders.push(newOrder);
    DB.set("orders", orders);
    setProcessing(false); setStep("done");
    toast("Order placed successfully! 🎉","success");
    setTimeout(()=>{onClear();onClose();setPage("orders");},2500);
  };

  return (
    <div onClick={onClose} style={{position:"fixed",inset:0,zIndex:2000,background:"rgba(0,0,0,.8)",backdropFilter:"blur(10px)",display:"flex",alignItems:"flex-start",justifyContent:"flex-end"}}>
      <div onClick={e=>e.stopPropagation()} className="slide-l" style={{width:420,height:"100vh",background:"#060b18",borderLeft:"1px solid rgba(0,240,255,.15)",display:"flex",flexDirection:"column",overflow:"hidden",boxShadow:"-20px 0 80px rgba(0,0,0,.7)"}}>
        <div style={{padding:"20px 22px 16px",borderBottom:"1px solid rgba(0,240,255,.08)",display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0}}>
          <div>
            <h2 style={{fontFamily:"Orbitron",fontSize:16,fontWeight:800,color:"#fff",margin:0}}>🛒 CART {step==="checkout"&&"// CHECKOUT"}{step==="done"&&"// ORDER PLACED"}</h2>
            <p style={{fontSize:11,color:"var(--muted)",margin:"3px 0 0",fontFamily:"Share Tech Mono"}}>{cart.reduce((s,i)=>s+i.qty,0)} items</p>
          </div>
          <button onClick={onClose} style={{width:32,height:32,background:"rgba(255,255,255,.04)",border:"1px solid rgba(255,255,255,.06)",borderRadius:"50%",color:"var(--muted)",fontSize:18,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>×</button>
        </div>
        <div style={{flex:1,overflowY:"auto",padding:"14px 22px"}}>
          {step==="done" ? (
            <div style={{textAlign:"center",padding:"60px 0"}}>
              <div style={{fontSize:60,marginBottom:16}}>🎉</div>
              <h3 style={{fontFamily:"Orbitron",fontSize:20,color:"#00ffa3",marginBottom:8}}>ORDER PLACED!</h3>
              <p style={{color:"var(--muted)",fontSize:13}}>Redirecting to your orders...</p>
            </div>
          ) : step==="checkout" ? (
            <div>
              <p style={{fontFamily:"Orbitron",fontSize:10,color:"#00f0ff",letterSpacing:".12em",marginBottom:16}}>// PAYMENT METHOD</p>
              {[["upi","📱 UPI / PhonePe / GPay","Instant · Zero charges"],["card","💳 Credit / Debit Card","All major cards"],["emi","🏦 No-Cost EMI","0% up to 12 months"],["cod","📦 Cash on Delivery","Pay on arrival"]].map(([v,l,sub])=>(
                <div key={v} onClick={()=>setPayMethod(v)} style={{display:"flex",gap:12,padding:14,borderRadius:8,border:`1.5px solid ${payMethod===v?"rgba(0,240,255,.4)":"rgba(0,240,255,.08)"}`,background:payMethod===v?"rgba(0,240,255,.06)":"transparent",cursor:"pointer",marginBottom:10,transition:"all .2s"}}>
                  <div style={{width:20,height:20,borderRadius:"50%",border:`2px solid ${payMethod===v?"#00f0ff":"rgba(255,255,255,.2)"}`,background:payMethod===v?"#00f0ff":"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                    {payMethod===v && <div style={{width:7,height:7,borderRadius:"50%",background:"#060b18"}}/>}
                  </div>
                  <div><p style={{fontSize:13,fontWeight:600,color:"#e2e8f0",margin:0}}>{l}</p><p style={{fontSize:11,color:"var(--muted)",margin:0}}>{sub}</p></div>
                </div>
              ))}
            </div>
          ) : cart.length===0 ? (
            <div style={{textAlign:"center",padding:"60px 0"}}>
              <p style={{fontSize:40,opacity:.2,marginBottom:12}}>🛒</p>
              <p style={{fontFamily:"Orbitron",fontSize:12,color:"var(--muted)"}}>CART EMPTY</p>
            </div>
          ) : cart.map(item=>(
            <div key={item.product.id} style={{display:"flex",gap:12,padding:"12px 0",borderBottom:"1px solid rgba(0,240,255,.05)"}}>
              <div style={{width:68,height:68,borderRadius:8,overflow:"hidden",flexShrink:0}}><SafeImg src={item.product.imgs?.[0]} alt={item.product.name} style={{width:"100%",height:"100%",objectFit:"cover"}}/></div>
              <div style={{flex:1,minWidth:0}}>
                <p style={{fontSize:12,fontWeight:600,color:"#dce8f8",margin:"0 0 2px",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{item.product.name}</p>
                <p style={{fontFamily:"Orbitron",fontSize:13,fontWeight:800,color:"#00f0ff",margin:"0 0 8px"}}>{fmt(item.product.price*item.qty)}</p>
                <div style={{display:"flex",alignItems:"center",gap:6}}>
                  <button onClick={()=>onUpdateQty(item.product.id,item.qty-1)} style={{width:24,height:24,borderRadius:4,background:"rgba(0,240,255,.08)",border:"1px solid rgba(0,240,255,.2)",color:"#00f0ff",cursor:"pointer",fontSize:14,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700}}>−</button>
                  <span style={{color:"#fff",fontWeight:700,minWidth:16,textAlign:"center",fontFamily:"Orbitron",fontSize:12}}>{item.qty}</span>
                  <button onClick={()=>onUpdateQty(item.product.id,item.qty+1)} style={{width:24,height:24,borderRadius:4,background:"rgba(0,240,255,.08)",border:"1px solid rgba(0,240,255,.2)",color:"#00f0ff",cursor:"pointer",fontSize:14,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700}}>+</button>
                  <button onClick={()=>onRemove(item.product.id)} style={{marginLeft:"auto",background:"rgba(255,0,60,.06)",border:"1px solid rgba(255,0,60,.2)",borderRadius:4,color:"#ff003c",cursor:"pointer",fontSize:10,padding:"3px 7px"}}>✕</button>
                </div>
              </div>
            </div>
          ))}
        </div>
        {cart.length>0 && step!=="done" && (
          <div style={{padding:"16px 22px 24px",borderTop:"1px solid rgba(0,240,255,.06)",flexShrink:0}}>
            {[["Subtotal",fmt(total)],["Savings",`−${fmt(savings)}`],["Shipping","Free ⚡"]].map(([l,v])=>(
              <div key={l} style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
                <span style={{fontSize:12,color:"var(--muted)"}}>{l}</span>
                <span style={{fontSize:12,fontWeight:600,color:l==="Savings"?"#00ffa3":"#c8d6f0"}}>{v}</span>
              </div>
            ))}
            <div style={{display:"flex",justifyContent:"space-between",borderTop:"1px solid rgba(0,240,255,.1)",paddingTop:12,marginTop:6,marginBottom:16}}>
              <span style={{fontFamily:"Orbitron",fontSize:13,fontWeight:800,color:"#fff"}}>TOTAL</span>
              <span style={{fontFamily:"Orbitron",fontSize:20,fontWeight:900,color:"#00f0ff"}}>{fmt(total)}</span>
            </div>
            {step==="cart" && <button onClick={()=>setStep("checkout")} className="neon-btn neon-btn-primary" style={{width:"100%",padding:"14px",fontSize:12}}>PROCEED TO CHECKOUT →</button>}
            {step==="checkout" && (
              <div style={{display:"flex",gap:8}}>
                <button onClick={()=>setStep("cart")} className="neon-btn" style={{flex:1,padding:"14px",fontSize:10}}>← BACK</button>
                <button onClick={placeOrder} disabled={processing} className="neon-btn neon-btn-primary" style={{flex:2,padding:"14px",fontSize:11,display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
                  {processing?<><span style={{width:14,height:14,border:"2px solid rgba(255,255,255,.3)",borderTopColor:"#fff",borderRadius:"50%",animation:"spin .7s linear infinite",display:"inline-block"}}/>PROCESSING...</>:`⚡ PAY ${fmt(total)}`}
                </button>
              </div>
            )}
            <button onClick={onClear} style={{width:"100%",marginTop:8,background:"transparent",border:"none",color:"var(--muted)",fontSize:11,cursor:"pointer",padding:"6px"}}>Clear cart</button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══ ORDERS PAGE ═══ */
function OrdersPage({ user }) {
  const [orders, setOrders] = useState([]);
  useEffect(()=>{
    const all = DB.get("orders") || [];
    setOrders(user?.role==="admin" ? all : all.filter(o=>o.userId===user?.email));
  },[user]);

  const statusColor = {processing:"#ffaa00",shipped:"#0070ff",delivered:"#00ffa3",cancelled:"#ff003c"};
  const PRODUCTS_MAP = useMemo(()=>{const m={};(DB.get("products")||[]).forEach(p=>m[p.id]=p);return m;},[]);

  return (
    <div className="fade-in" style={{display:"flex",flexDirection:"column",gap:24}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div>
          <p style={{fontFamily:"Orbitron",fontSize:11,color:"var(--muted)",letterSpacing:".15em",margin:"0 0 4px"}}>// ORDER HISTORY</p>
          <h1 style={{fontFamily:"Orbitron",fontSize:24,fontWeight:900,color:"#fff",margin:0}}>{orders.length} ORDERS</h1>
        </div>
      </div>
      {orders.length===0 ? (
        <div style={{textAlign:"center",padding:"80px 0",border:"1px solid rgba(0,240,255,.07)",borderRadius:10}}>
          <p style={{fontSize:40,opacity:.2,marginBottom:12}}>📦</p>
          <p style={{fontFamily:"Orbitron",fontSize:12,color:"var(--muted)"}}>NO ORDERS YET</p>
        </div>
      ) : orders.map(order=>(
        <div key={order.id} style={{background:"rgba(6,11,24,.85)",border:"1px solid rgba(0,240,255,.1)",borderRadius:10,padding:22}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}>
            <div style={{display:"flex",alignItems:"center",gap:16}}>
              <span style={{fontFamily:"Share Tech Mono",fontSize:12,color:"#00f0ff"}}>{order.id}</span>
              <span style={{fontSize:11,fontFamily:"Share Tech Mono",color:"var(--muted)"}}>{order.date}</span>
              <span style={{background:`${statusColor[order.status]}14`,color:statusColor[order.status],border:`1px solid ${statusColor[order.status]}30`,padding:"2px 10px",borderRadius:3,fontSize:9,fontFamily:"Orbitron",fontWeight:700,letterSpacing:".1em",textTransform:"uppercase"}}>{order.status}</span>
              {user?.role==="admin" && <span style={{fontSize:10,color:"var(--muted)",fontFamily:"Share Tech Mono"}}>{order.userId}</span>}
            </div>
            <span style={{fontFamily:"Orbitron",fontSize:16,fontWeight:900,color:"#00f0ff"}}>{fmt(order.total)}</span>
          </div>
          <div style={{display:"flex",gap:12,flexWrap:"wrap",marginBottom:14}}>
            {order.products?.map(item=>{
              const p = PRODUCTS_MAP[item.id];
              if(!p) return null;
              return (
                <div key={item.id} style={{display:"flex",gap:8,alignItems:"center",background:"rgba(0,240,255,.04)",border:"1px solid rgba(0,240,255,.06)",borderRadius:8,padding:"8px 12px"}}>
                  <div style={{width:42,height:42,borderRadius:6,overflow:"hidden",flexShrink:0}}><SafeImg src={p.imgs?.[0]} alt={p.name} style={{width:"100%",height:"100%",objectFit:"cover"}}/></div>
                  <div>
                    <p style={{fontSize:12,fontWeight:600,color:"#c8d6f0",margin:"0 0 2px"}}>{p.name}</p>
                    <p style={{fontSize:10,fontFamily:"Share Tech Mono",color:"var(--muted)",margin:0}}>Qty: {item.qty} · {fmt(p.price*item.qty)}</p>
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{display:"flex",gap:16,fontSize:11,color:"var(--muted)",fontFamily:"Share Tech Mono"}}>
            <span>Payment: <span style={{color:"#00ffa3"}}>{order.payMethod} ({order.payment})</span></span>
            <span>Address: {order.address}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ═══ DASHBOARD (User) ═══ */
function DashboardPage({ user, setPage, cart, products }) {
  const orders = (DB.get("orders")||[]).filter(o=>o.userId===user?.email);
  const wishlistIds = DB.get("wishlist") || [];
  const wishlisted = products.filter(p=>wishlistIds.includes(p.id));

  return (
    <div className="fade-in" style={{display:"flex",flexDirection:"column",gap:32}}>
      <div style={{display:"flex",gap:20,alignItems:"center",background:"rgba(6,11,24,.85)",border:"1px solid rgba(0,240,255,.12)",borderRadius:12,padding:28}}>
        <div style={{width:70,height:70,borderRadius:"50%",background:"linear-gradient(135deg,#001844,#003388)",border:"2px solid rgba(0,240,255,.3)",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"Orbitron",fontSize:24,fontWeight:900,color:"#00f0ff",boxShadow:"0 0 30px rgba(0,240,255,.2)",flexShrink:0}}>{user?.avatar}</div>
        <div style={{flex:1}}>
          <p style={{fontFamily:"Orbitron",fontSize:9,color:"var(--muted)",letterSpacing:".15em",margin:"0 0 4px"}}>// WELCOME BACK</p>
          <h2 style={{fontFamily:"Orbitron",fontSize:22,fontWeight:900,color:"#fff",margin:"0 0 4px"}}>{user?.name}</h2>
          <p style={{fontSize:12,color:"var(--muted)",fontFamily:"Share Tech Mono"}}>{user?.email} · Member since {user?.joined}</p>
        </div>
        <span style={{background:user?.role==="admin"?"rgba(255,0,60,.1)":"rgba(0,240,255,.08)",color:user?.role==="admin"?"#ff003c":"#00f0ff",border:`1px solid ${user?.role==="admin"?"rgba(255,0,60,.3)":"rgba(0,240,255,.2)"}`,padding:"6px 16px",borderRadius:4,fontSize:10,fontFamily:"Orbitron",fontWeight:700,letterSpacing:".1em"}}>{(user?.role||"user").toUpperCase()}</span>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14}}>
        {[[orders.length,"Orders","📦","#00f0ff"],[cart.reduce((s,i)=>s+i.qty,0),"Cart Items","🛒","#0070ff"],[wishlisted.length,"Wishlisted","❤️","#ff003c"],[fmt(orders.reduce((s,o)=>s+o.total,0)),"Total Spent","💰","#00ffa3"]].map(([v,l,icon,c])=>(
          <div key={l} style={{background:"rgba(6,11,24,.85)",border:`1px solid ${c}18`,borderRadius:10,padding:"20px",textAlign:"center"}}>
            <div style={{fontSize:24,marginBottom:8}}>{icon}</div>
            <p style={{fontFamily:"Orbitron",fontSize:20,fontWeight:900,color:c,margin:0,lineHeight:1}}>{v}</p>
            <p style={{fontSize:11,color:"var(--muted)",margin:"4px 0 0"}}>{l}</p>
          </div>
        ))}
      </div>
      <div style={{display:"flex",gap:12}}>
        <button onClick={()=>setPage("orders")} className="neon-btn neon-btn-primary" style={{padding:"12px 24px",fontSize:11}}>VIEW MY ORDERS</button>
        <button onClick={()=>setPage("products")} className="neon-btn" style={{padding:"12px 24px",fontSize:11}}>CONTINUE SHOPPING →</button>
      </div>
    </div>
  );
}

/* ═══ ADMIN PANEL ═══ */
function AdminPage({ toast }) {
  const [tab, setTab] = useState("overview");
  const [products, setProducts] = useState(DB.get("products") || PRODUCTS_INIT);
  const [users] = useState(DB.get("users") || USERS_INIT);
  const [orders, setOrders] = useState(DB.get("orders") || SAMPLE_ORDERS);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [newProd, setNewProd] = useState({ name:"", brand:"", cat:"phones", price:"", mrp:"", stock:"", badge:"", desc:"", imgs:["https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=600&q=80"] });

  const saveProduct = () => {
    if(!newProd.name||!newProd.price) { toast("Name and price required","error"); return; }
    const updated = editProduct
      ? products.map(p=>p.id===editProduct.id ? {...p,...newProd,price:+newProd.price,mrp:+newProd.mrp,stock:+newProd.stock} : p)
      : [...products, {...newProd, id:Date.now(), price:+newProd.price, mrp:+newProd.mrp||+newProd.price, stock:+newProd.stock||100, rating:4.5, reviews:0, specs:{}, hi:[]}];
    setProducts(updated); DB.set("products", updated);
    setShowAddProduct(false); setEditProduct(null);
    setNewProd({name:"",brand:"",cat:"phones",price:"",mrp:"",stock:"",badge:"",desc:"",imgs:["https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=600&q=80"]});
    toast(editProduct?"Product updated!":"Product added!","success");
  };

  const deleteProduct = (id) => {
    const updated = products.filter(p=>p.id!==id);
    setProducts(updated); DB.set("products", updated);
    toast("Product deleted","warning");
  };

  const updateOrderStatus = (orderId, status) => {
    const updated = orders.map(o=>o.id===orderId?{...o,status}:o);
    setOrders(updated); DB.set("orders", updated);
    toast(`Order ${orderId} → ${status}`,"success");
  };

  const revenue = orders.filter(o=>o.payment==="paid").reduce((s,o)=>s+o.total,0);
  const tabs = ["overview","products","orders","users"];
  const statusColor = {processing:"#ffaa00",shipped:"#0070ff",delivered:"#00ffa3",cancelled:"#ff003c"};

  return (
    <div className="fade-in">
      <div style={{display:"flex",alignItems:"center",gap:16,marginBottom:28}}>
        <div style={{width:42,height:42,borderRadius:8,background:"linear-gradient(135deg,#cc0022,#ff003c)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,boxShadow:"0 0 20px rgba(255,0,60,.4)"}}>⚡</div>
        <div>
          <p style={{fontFamily:"Orbitron",fontSize:9,color:"var(--muted)",letterSpacing:".15em",margin:"0 0 2px"}}>// ADMIN CONTROL CENTER</p>
          <h1 style={{fontFamily:"Orbitron",fontSize:22,fontWeight:900,color:"#fff",margin:0}}>VOLTX ADMIN PANEL</h1>
        </div>
      </div>

      {/* Tabs */}
      <div style={{display:"flex",gap:2,marginBottom:24,background:"rgba(6,11,24,.8)",border:"1px solid rgba(0,240,255,.1)",borderRadius:6,padding:4,width:"fit-content"}}>
        {tabs.map(t=>(
          <button key={t} onClick={()=>setTab(t)} style={{padding:"8px 20px",fontSize:10,fontFamily:"Orbitron",letterSpacing:".1em",textTransform:"uppercase",fontWeight:600,border:"none",borderRadius:4,cursor:"pointer",transition:"all .2s",background:tab===t?"rgba(0,240,255,.12)":"transparent",color:tab===t?"#00f0ff":"var(--muted)"}}>
            {t}{t==="orders"&&<span style={{marginLeft:5,background:"#ff003c",color:"#fff",fontSize:7,padding:"1px 4px",borderRadius:2}}>{orders.length}</span>}
          </button>
        ))}
      </div>

      {/* Overview */}
      {tab==="overview" && (
        <div style={{display:"flex",flexDirection:"column",gap:20}}>
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14}}>
            {[[fmt(revenue),"Total Revenue","💰","#00ffa3"],[products.length,"Products","📦","#00f0ff"],[orders.length,"Orders","🛒","#0070ff"],[users.length,"Users","👤","#7000ff"]].map(([v,l,icon,c])=>(
              <div key={l} style={{background:"rgba(6,11,24,.85)",border:`1px solid ${c}18`,borderRadius:10,padding:"22px 20px",display:"flex",alignItems:"center",gap:16}}>
                <div style={{width:46,height:46,borderRadius:10,background:`${c}12`,border:`1px solid ${c}20`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}}>{icon}</div>
                <div>
                  <p style={{fontFamily:"Orbitron",fontSize:20,fontWeight:900,color:c,margin:0,lineHeight:1}}>{v}</p>
                  <p style={{fontSize:11,color:"var(--muted)",margin:"3px 0 0"}}>{l}</p>
                </div>
              </div>
            ))}
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
            <div style={{background:"rgba(6,11,24,.85)",border:"1px solid rgba(0,240,255,.1)",borderRadius:10,padding:22}}>
              <p style={{fontFamily:"Orbitron",fontSize:10,color:"#00f0ff",letterSpacing:".12em",marginBottom:16}}>// LOW STOCK ALERT</p>
              {products.filter(p=>p.stock<25).map(p=>(
                <div key={p.id} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"8px 0",borderBottom:"1px solid rgba(0,240,255,.04)"}}>
                  <span style={{fontSize:12,color:"#c8d6f0",fontWeight:600}}>{p.name.split(" ").slice(0,3).join(" ")}</span>
                  <span style={{fontFamily:"Orbitron",fontSize:11,color:p.stock<10?"#ff003c":"#ffaa00",fontWeight:700}}>{p.stock} left</span>
                </div>
              ))}
            </div>
            <div style={{background:"rgba(6,11,24,.85)",border:"1px solid rgba(0,240,255,.1)",borderRadius:10,padding:22}}>
              <p style={{fontFamily:"Orbitron",fontSize:10,color:"#00f0ff",letterSpacing:".12em",marginBottom:16}}>// RECENT ORDERS</p>
              {orders.slice(-5).reverse().map(o=>(
                <div key={o.id} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"8px 0",borderBottom:"1px solid rgba(0,240,255,.04)"}}>
                  <span style={{fontFamily:"Share Tech Mono",fontSize:11,color:"#00f0ff"}}>{o.id}</span>
                  <span style={{background:`${statusColor[o.status]}14`,color:statusColor[o.status],border:`1px solid ${statusColor[o.status]}30`,padding:"1px 7px",borderRadius:3,fontSize:8,fontFamily:"Orbitron",fontWeight:700}}>{o.status.toUpperCase()}</span>
                  <span style={{fontFamily:"Orbitron",fontSize:11,color:"#00ffa3"}}>{fmt(o.total)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Products Tab */}
      {tab==="products" && (
        <div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}>
            <span style={{fontFamily:"Orbitron",fontSize:11,color:"var(--muted)"}}>{products.length} PRODUCTS IN CATALOG</span>
            <button onClick={()=>{setShowAddProduct(true);setEditProduct(null);}} className="neon-btn neon-btn-primary" style={{fontSize:10,padding:"9px 20px"}}>+ ADD PRODUCT</button>
          </div>
          {/* Add/Edit Form */}
          {showAddProduct && (
            <div style={{background:"rgba(6,11,24,.95)",border:"1px solid rgba(0,240,255,.2)",borderRadius:10,padding:24,marginBottom:20,animation:"fadeIn .3s ease"}}>
              <p style={{fontFamily:"Orbitron",fontSize:11,color:"#00f0ff",letterSpacing:".12em",marginBottom:18}}>{editProduct?"// EDIT PRODUCT":"// ADD NEW PRODUCT"}</p>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12,marginBottom:12}}>
                {[["name","Product Name"],["brand","Brand"],["badge","Badge"]].map(([k,ph])=>(
                  <input key={k} className="cyber-input" placeholder={ph} value={newProd[k]} onChange={e=>setNewProd(p=>({...p,[k]:e.target.value}))}/>
                ))}
                {[["price","Price (₹)"],["mrp","MRP (₹)"],["stock","Stock"]].map(([k,ph])=>(
                  <input key={k} className="cyber-input" placeholder={ph} type="number" value={newProd[k]} onChange={e=>setNewProd(p=>({...p,[k]:e.target.value}))}/>
                ))}
                <select className="cyber-input" value={newProd.cat} onChange={e=>setNewProd(p=>({...p,cat:e.target.value}))}>
                  {CATEGORIES.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <input className="cyber-input" placeholder="Description" value={newProd.desc} onChange={e=>setNewProd(p=>({...p,desc:e.target.value}))} style={{marginBottom:12}}/>
              <input className="cyber-input" placeholder="Image URL" value={newProd.imgs?.[0]||""} onChange={e=>setNewProd(p=>({...p,imgs:[e.target.value]}))} style={{marginBottom:16}}/>
              <div style={{display:"flex",gap:10}}>
                <button onClick={saveProduct} className="neon-btn neon-btn-success" style={{fontSize:10,padding:"10px 24px"}}>SAVE PRODUCT</button>
                <button onClick={()=>{setShowAddProduct(false);setEditProduct(null);}} className="neon-btn" style={{fontSize:10,padding:"10px 20px"}}>CANCEL</button>
              </div>
            </div>
          )}
          <div style={{display:"grid",gridTemplateColumns:"1fr",gap:0,background:"rgba(6,11,24,.85)",border:"1px solid rgba(0,240,255,.1)",borderRadius:10,overflow:"hidden"}}>
            <div style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr 1fr 1fr 120px",gap:0,padding:"10px 18px",background:"rgba(0,240,255,.05)",borderBottom:"1px solid rgba(0,240,255,.08)"}}>
              {["PRODUCT","CATEGORY","PRICE","STOCK","RATING","ACTIONS"].map(h=>(
                <span key={h} style={{fontFamily:"Orbitron",fontSize:9,color:"var(--muted)",letterSpacing:".1em"}}>{h}</span>
              ))}
            </div>
            {products.map((p,i)=>(
              <div key={p.id} style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr 1fr 1fr 120px",gap:0,padding:"12px 18px",borderBottom:"1px solid rgba(0,240,255,.04)",background:i%2===0?"transparent":"rgba(0,240,255,.015)",alignItems:"center"}}>
                <div style={{display:"flex",alignItems:"center",gap:10}}>
                  <div style={{width:38,height:38,borderRadius:6,overflow:"hidden",flexShrink:0}}><SafeImg src={p.imgs?.[0]} alt={p.name} style={{width:"100%",height:"100%",objectFit:"cover"}}/></div>
                  <div><p style={{fontSize:12,fontWeight:600,color:"#c8d6f0",margin:0}}>{p.name}</p><p style={{fontSize:10,color:"var(--muted)",margin:0}}>{p.brand}</p></div>
                </div>
                <span style={{fontSize:11,color:"var(--muted)",textTransform:"capitalize"}}>{p.cat}</span>
                <span style={{fontFamily:"Orbitron",fontSize:11,color:"#00f0ff"}}>{fmt(p.price)}</span>
                <span style={{fontFamily:"Orbitron",fontSize:11,color:p.stock<10?"#ff003c":p.stock<25?"#ffaa00":"#00ffa3"}}>{p.stock}</span>
                <span style={{fontSize:11,color:"#f59e0b"}}>{"★".repeat(Math.floor(p.rating))} {p.rating}</span>
                <div style={{display:"flex",gap:6}}>
                  <button onClick={()=>{setEditProduct(p);setNewProd({...p,price:String(p.price),mrp:String(p.mrp),stock:String(p.stock)});setShowAddProduct(true);}} style={{background:"rgba(0,240,255,.06)",border:"1px solid rgba(0,240,255,.2)",color:"#00f0ff",borderRadius:4,padding:"4px 9px",fontSize:10,cursor:"pointer",fontFamily:"Orbitron"}}>EDIT</button>
                  <button onClick={()=>deleteProduct(p.id)} style={{background:"rgba(255,0,60,.06)",border:"1px solid rgba(255,0,60,.2)",color:"#ff003c",borderRadius:4,padding:"4px 9px",fontSize:10,cursor:"pointer",fontFamily:"Orbitron"}}>DEL</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Orders Tab */}
      {tab==="orders" && (
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          <p style={{fontFamily:"Orbitron",fontSize:10,color:"var(--muted)",letterSpacing:".12em",marginBottom:4}}>{orders.length} TOTAL ORDERS</p>
          {orders.map(order=>(
            <div key={order.id} style={{background:"rgba(6,11,24,.85)",border:"1px solid rgba(0,240,255,.08)",borderRadius:10,padding:18,display:"flex",alignItems:"center",gap:16,flexWrap:"wrap"}}>
              <span style={{fontFamily:"Share Tech Mono",fontSize:12,color:"#00f0ff",minWidth:110}}>{order.id}</span>
              <span style={{fontSize:12,color:"var(--muted)",fontFamily:"Share Tech Mono",flex:1}}>{order.userId} · {order.date}</span>
              <span style={{fontFamily:"Orbitron",fontSize:13,fontWeight:900,color:"#fff"}}>{fmt(order.total)}</span>
              <select value={order.status} onChange={e=>updateOrderStatus(order.id,e.target.value)} style={{background:"rgba(6,11,24,.9)",border:`1px solid ${statusColor[order.status]}30`,borderRadius:4,padding:"5px 10px",color:statusColor[order.status],fontSize:10,fontFamily:"Orbitron",cursor:"pointer",fontWeight:700}}>
                {["processing","shipped","delivered","cancelled"].map(s=><option key={s} value={s}>{s.toUpperCase()}</option>)}
              </select>
            </div>
          ))}
        </div>
      )}

      {/* Users Tab */}
      {tab==="users" && (
        <div style={{background:"rgba(6,11,24,.85)",border:"1px solid rgba(0,240,255,.1)",borderRadius:10,overflow:"hidden"}}>
          <div style={{display:"grid",gridTemplateColumns:"50px 1fr 1fr 1fr 1fr",gap:0,padding:"10px 18px",background:"rgba(0,240,255,.05)",borderBottom:"1px solid rgba(0,240,255,.08)"}}>
            {["#","NAME","EMAIL","ROLE","JOINED"].map(h=>(
              <span key={h} style={{fontFamily:"Orbitron",fontSize:9,color:"var(--muted)",letterSpacing:".1em"}}>{h}</span>
            ))}
          </div>
          {users.map((u,i)=>(
            <div key={u.id} style={{display:"grid",gridTemplateColumns:"50px 1fr 1fr 1fr 1fr",padding:"14px 18px",borderBottom:"1px solid rgba(0,240,255,.04)",alignItems:"center",background:i%2===0?"transparent":"rgba(0,240,255,.015)"}}>
              <div style={{width:32,height:32,borderRadius:"50%",background:"linear-gradient(135deg,#001844,#003388)",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"Orbitron",fontSize:10,fontWeight:700,color:"#00f0ff",border:"1px solid rgba(0,240,255,.2)"}}>{u.avatar}</div>
              <span style={{fontSize:13,fontWeight:600,color:"#c8d6f0"}}>{u.name}</span>
              <span style={{fontSize:11,color:"var(--muted)",fontFamily:"Share Tech Mono"}}>{u.email}</span>
              <span style={{background:u.role==="admin"?"rgba(255,0,60,.1)":"rgba(0,240,255,.08)",color:u.role==="admin"?"#ff003c":"#00f0ff",border:`1px solid ${u.role==="admin"?"rgba(255,0,60,.3)":"rgba(0,240,255,.2)"}`,padding:"2px 10px",borderRadius:3,fontSize:8,fontFamily:"Orbitron",fontWeight:700,width:"fit-content"}}>{u.role.toUpperCase()}</span>
              <span style={{fontSize:11,fontFamily:"Share Tech Mono",color:"var(--muted)"}}>{u.joined}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ═══ CONTACT PAGE — FULLY WORKING ═══ */
function ContactPage({ toast }) {
  const [form, setForm] = useState({name:"",email:"",phone:"",type:"support",msg:""});
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [activeLoc, setActiveLoc] = useState(0);
  const set = (k,v) => setForm(f=>({...f,[k]:v}));

  const submit = async () => {
    if(!form.name.trim()||!form.email.trim()||!form.msg.trim()){toast("Please fill Name, Email and Message","error");return;}
    if(!form.email.includes("@")){toast("Enter a valid email address","error");return;}
    setSending(true); await new Promise(r=>setTimeout(r,1400));
    setSending(false); setSent(true);
    toast("Message transmitted! We'll reply within 2 hours ✓","success");
  };

  const waUrl = (msg) => `https://wa.me/${CONTACT_CONFIG.whatsapp}?text=${encodeURIComponent(msg||CONTACT_CONFIG.whatsappMsg)}`;
  const loc = CONTACT_CONFIG.locations[activeLoc];

  return (
    <div className="fade-in" style={{display:"flex",flexDirection:"column",gap:40}}>
      {/* Header */}
      <div style={{textAlign:"center"}}>
        <p style={{fontFamily:"Orbitron",fontSize:10,color:"var(--muted)",letterSpacing:".2em",margin:"0 0 8px"}}>// 24/7 SUPPORT</p>
        <h1 style={{fontFamily:"Orbitron",fontSize:34,fontWeight:900,color:"#fff",margin:"0 0 10px"}}>
          GET IN <span style={{color:"#00f0ff",textShadow:"0 0 20px rgba(0,240,255,.5)"}}>TOUCH</span>
        </h1>
        <p style={{fontSize:14,color:"#4a5a7a",maxWidth:480,margin:"0 auto"}}>WhatsApp, call, email or visit a store — we respond fast, every day.</p>
      </div>

      {/* Quick contact cards */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12}}>
        {[
          {icon:"💬",label:"WHATSAPP",     val:"Chat Now →",          sub:"~3 min response",  color:"#25d366", action:()=>window.open(waUrl(CONTACT_CONFIG.whatsappMsg),"_blank")},
          {icon:"📞",label:"TOLL FREE",    val:CONTACT_CONFIG.phone,  sub:"8am–10pm daily",   color:"#00ffa3", action:()=>window.open("tel:"+CONTACT_CONFIG.phone.replace(/-/g,""))},
          {icon:"✉️",label:"EMAIL",        val:CONTACT_CONFIG.email,  sub:"Reply in 2 hours", color:"#00f0ff", action:()=>window.open("mailto:"+CONTACT_CONFIG.email)},
          {icon:"📍",label:"STORES",       val:"4 Locations",          sub:"Across India",     color:"#f59e0b", action:()=>document.getElementById("voltx-stores")?.scrollIntoView({behavior:"smooth"})},
        ].map(c=>(
          <button key={c.label} onClick={c.action} style={{background:"rgba(6,11,24,.9)",border:`1px solid ${c.color}22`,borderRadius:12,padding:"20px 16px",cursor:"pointer",textAlign:"left",transition:"all .22s",width:"100%",outline:"none"}} onMouseEnter={e=>{e.currentTarget.style.borderColor=c.color+"55";e.currentTarget.style.transform="translateY(-4px)";e.currentTarget.style.boxShadow=`0 12px 40px ${c.color}12`;}} onMouseLeave={e=>{e.currentTarget.style.borderColor=c.color+"22";e.currentTarget.style.transform="";e.currentTarget.style.boxShadow="";}}>
            <div style={{fontSize:26,marginBottom:12}}>{c.icon}</div>
            <p style={{fontFamily:"Orbitron",fontSize:8,color:c.color,letterSpacing:".15em",margin:"0 0 5px"}}>{c.label}</p>
            <p style={{fontSize:13,fontWeight:700,color:"#dce8f8",margin:"0 0 3px"}}>{c.val}</p>
            <p style={{fontSize:11,color:"var(--muted)",margin:0}}>{c.sub}</p>
          </button>
        ))}
      </div>

      {/* WhatsApp + Form */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:24}}>
        {/* Left: WhatsApp info + quick topics */}
        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          <div style={{background:"rgba(6,11,24,.9)",border:"1px solid rgba(37,211,102,.2)",borderRadius:12,padding:24}}>
            <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:16}}>
              <div style={{width:48,height:48,borderRadius:12,background:"linear-gradient(135deg,#128c3e,#25d366)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0,boxShadow:"0 0 20px rgba(37,211,102,.35)"}}>💬</div>
              <div><p style={{fontFamily:"Orbitron",fontSize:12,fontWeight:800,color:"#25d366",margin:0}}>WHATSAPP SUPPORT</p><p style={{fontSize:11,color:"var(--muted)",margin:0}}>Fastest way to get help</p></div>
            </div>
            <p style={{fontSize:13,color:"#3a6050",marginBottom:16,lineHeight:1.65}}>Chat with us directly for order updates, returns, warranty or product queries. Our team typically replies within 3 minutes.</p>
            <div style={{display:"flex",gap:10,marginBottom:16}}>
              <a href={waUrl(CONTACT_CONFIG.whatsappMsg)} target="_blank" rel="noreferrer" style={{flex:2,textDecoration:"none"}}>
                <button style={{width:"100%",background:"linear-gradient(135deg,#128c3e,#25d366)",color:"#fff",border:"none",borderRadius:8,padding:"12px",fontSize:11,fontFamily:"Orbitron",fontWeight:700,cursor:"pointer",letterSpacing:".07em",display:"flex",alignItems:"center",justifyContent:"center",gap:7}}>💬 CHAT ON WHATSAPP</button>
              </a>
              <a href={"tel:"+CONTACT_CONFIG.phone2.replace(/\s/g,"")} style={{flex:1,textDecoration:"none"}}>
                <button style={{width:"100%",background:"rgba(0,255,163,.06)",border:"1px solid rgba(0,255,163,.25)",color:"#00ffa3",borderRadius:8,padding:"12px",fontSize:10,fontFamily:"Orbitron",fontWeight:700,cursor:"pointer",letterSpacing:".07em"}}>📞 CALL</button>
              </a>
            </div>
            <p style={{fontFamily:"Share Tech Mono",fontSize:10,color:"rgba(37,211,102,.5)",textAlign:"center",margin:0}}>+{CONTACT_CONFIG.whatsapp.slice(0,2)} {CONTACT_CONFIG.whatsapp.slice(2,7)} {CONTACT_CONFIG.whatsapp.slice(7)}</p>
          </div>
          {/* Quick topics */}
          <div style={{background:"rgba(6,11,24,.9)",border:"1px solid rgba(0,240,255,.1)",borderRadius:12,padding:20}}>
            <p style={{fontFamily:"Orbitron",fontSize:9,color:"#00f0ff",letterSpacing:".14em",margin:"0 0 14px"}}>// QUICK HELP TOPICS</p>
            {[["📦","Track Order","Hi VoltX! Help me track my order."],["↩️","Return/Refund","Hi VoltX! I want to return a product."],["🛡","Warranty","Hi VoltX! I need warranty support."],["💳","Payment Issue","Hi VoltX! I have a payment query."]].map(([icon,label,msg])=>(
              <a key={label} href={waUrl(msg)} target="_blank" rel="noreferrer" style={{textDecoration:"none",display:"block"}}>
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"11px 0",borderBottom:"1px solid rgba(0,240,255,.04)",cursor:"pointer",transition:"all .18s"}} onMouseEnter={e=>e.currentTarget.querySelector("span").style.opacity="1"} onMouseLeave={e=>e.currentTarget.querySelector("span").style.opacity="0"}>
                  <div style={{display:"flex",gap:10,alignItems:"center"}}>
                    <span style={{fontSize:18}}>{icon}</span>
                    <span style={{fontSize:13,fontWeight:600,color:"#c8d6f0"}}>{label}</span>
                  </div>
                  <span style={{fontSize:10,color:"#25d366",fontFamily:"Orbitron",opacity:0,transition:"opacity .18s"}}>WA →</span>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Right: Contact Form */}
        <div style={{background:"rgba(6,11,24,.9)",border:"1px solid rgba(0,240,255,.12)",borderRadius:12,padding:28}}>
          {sent?(
            <div style={{textAlign:"center",padding:"40px 0"}}>
              <div style={{fontSize:60,marginBottom:14}}>✅</div>
              <h3 style={{fontFamily:"Orbitron",fontSize:18,color:"#00ffa3",marginBottom:8}}>MESSAGE SENT!</h3>
              <p style={{color:"var(--muted)",fontSize:13,marginBottom:20}}>We'll reply to <strong style={{color:"#00f0ff"}}>{form.email}</strong> within 2 hours.</p>
              <div style={{display:"flex",gap:10,justifyContent:"center"}}>
                <button className="neon-btn neon-btn-primary" onClick={()=>{setSent(false);setForm({name:"",email:"",phone:"",type:"support",msg:""}); }} style={{fontSize:10}}>SEND ANOTHER</button>
                <a href={waUrl()} target="_blank" rel="noreferrer" style={{textDecoration:"none"}}><button style={{background:"linear-gradient(135deg,#128c3e,#25d366)",color:"#fff",border:"none",borderRadius:6,padding:"10px 16px",fontSize:10,fontFamily:"Orbitron",fontWeight:700,cursor:"pointer",letterSpacing:".07em"}}>💬 WHATSAPP US</button></a>
              </div>
            </div>
          ):(
            <div style={{display:"flex",flexDirection:"column",gap:12}}>
              <p style={{fontFamily:"Orbitron",fontSize:9,color:"#00f0ff",letterSpacing:".14em",marginBottom:4}}>// SEND A MESSAGE</p>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                <input className="cyber-input" placeholder="Full Name *" value={form.name} onChange={e=>set("name",e.target.value)}/>
                <input className="cyber-input" placeholder="Phone Number" value={form.phone} onChange={e=>set("phone",e.target.value)}/>
              </div>
              <input className="cyber-input" placeholder="Email Address *" type="email" value={form.email} onChange={e=>set("email",e.target.value)}/>
              <select className="cyber-input" value={form.type} onChange={e=>set("type",e.target.value)}>
                <option value="support">🔧 Technical Support</option>
                <option value="order">📦 Order Query</option>
                <option value="warranty">🛡 Warranty Claim</option>
                <option value="return">↩️ Return / Refund</option>
                <option value="bulk">🏢 Bulk / Business Order</option>
                <option value="other">💬 Other</option>
              </select>
              <textarea className="cyber-input" placeholder="Describe your query in detail *" rows={4} value={form.msg} onChange={e=>set("msg",e.target.value)} style={{resize:"vertical"}}/>
              <div style={{display:"flex",gap:10}}>
                <button onClick={submit} disabled={sending} className="neon-btn neon-btn-primary" style={{flex:2,padding:"13px",fontSize:11,display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
                  {sending?<><span style={{width:14,height:14,border:"2px solid rgba(255,255,255,.3)",borderTopColor:"#fff",borderRadius:"50%",animation:"spin .7s linear infinite",display:"inline-block"}}/>SENDING...</>:"📤 SEND MESSAGE"}
                </button>
                <a href={waUrl(form.msg||CONTACT_CONFIG.whatsappMsg)} target="_blank" rel="noreferrer" style={{flex:1,textDecoration:"none"}}>
                  <button style={{width:"100%",height:"100%",background:"rgba(37,211,102,.08)",border:"1px solid rgba(37,211,102,.25)",color:"#25d366",borderRadius:6,fontSize:10,fontFamily:"Orbitron",fontWeight:700,cursor:"pointer",letterSpacing:".07em"}}>💬 WA</button>
                </a>
              </div>
              <p style={{fontSize:10,color:"var(--muted)",textAlign:"center",fontFamily:"Share Tech Mono",margin:0}}>🔒 Your data is secure. We never spam.</p>
            </div>
          )}
        </div>
      </div>

      {/* Store Locator */}
      <div id="voltx-stores">
        <p style={{fontFamily:"Orbitron",fontSize:10,color:"var(--muted)",letterSpacing:".15em",margin:"0 0 16px"}}>// OUR STORES</p>
        <div style={{display:"flex",gap:8,marginBottom:18,flexWrap:"wrap"}}>
          {CONTACT_CONFIG.locations.map((l,i)=>(
            <button key={i} onClick={()=>setActiveLoc(i)} style={{padding:"7px 18px",borderRadius:20,fontSize:10,fontFamily:"Orbitron",fontWeight:700,border:`1px solid ${activeLoc===i?"rgba(0,240,255,.5)":"rgba(0,240,255,.12)"}`,background:activeLoc===i?"rgba(0,240,255,.1)":"transparent",color:activeLoc===i?"#00f0ff":"var(--muted)",cursor:"pointer",transition:"all .2s"}}>{l.city}</button>
          ))}
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20}}>
          <div style={{background:"rgba(6,11,24,.9)",border:"1px solid rgba(0,240,255,.14)",borderRadius:12,overflow:"hidden"}}>
            {/* Map embed */}
            <div style={{height:220,position:"relative",overflow:"hidden"}}>
              <iframe title={loc.city} src={`https://www.google.com/maps/embed/v1/search?q=${encodeURIComponent(loc.address)}&key=AIzaSyD-9tSrke72PouQMnMX-a7eZSW0jkFMBWY`} width="100%" height="100%" style={{border:0,filter:"invert(.88) hue-rotate(200deg)"}} loading="lazy"/>
              <div style={{position:"absolute",inset:0,pointerEvents:"none",border:"none"}}/>
            </div>
            <div style={{padding:"16px 18px"}}>
              <p style={{fontFamily:"Orbitron",fontSize:13,fontWeight:700,color:"#dce8f8",margin:"0 0 8px"}}>{loc.city} Store</p>
              {[["📍",loc.address],["⏰",loc.hours],["📞",CONTACT_CONFIG.phone]].map(([icon,val])=>(
                <p key={icon} style={{fontSize:12,color:"var(--muted)",margin:"0 0 5px",display:"flex",gap:8}}><span style={{flexShrink:0}}>{icon}</span>{val}</p>
              ))}
              <div style={{display:"flex",gap:8,marginTop:12}}>
                <a href={loc.maps} target="_blank" rel="noreferrer" style={{flex:1,textDecoration:"none"}}><button className="neon-btn" style={{width:"100%",padding:"8px",fontSize:9,letterSpacing:".07em"}}>🗺️ DIRECTIONS</button></a>
                <a href={waUrl(`Hi! I'd like to visit your ${loc.city} store.`)} target="_blank" rel="noreferrer" style={{flex:1,textDecoration:"none"}}><button style={{width:"100%",background:"rgba(37,211,102,.06)",border:"1px solid rgba(37,211,102,.25)",color:"#25d366",borderRadius:6,padding:"8px",fontSize:9,fontFamily:"Orbitron",fontWeight:700,cursor:"pointer",letterSpacing:".06em"}}>💬 WHATSAPP</button></a>
              </div>
            </div>
          </div>
          {/* All stores list */}
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            {CONTACT_CONFIG.locations.map((l,i)=>(
              <div key={i} onClick={()=>setActiveLoc(i)} style={{background:activeLoc===i?"rgba(0,240,255,.06)":"rgba(6,11,24,.8)",border:`1px solid ${activeLoc===i?"rgba(0,240,255,.3)":"rgba(0,240,255,.08)"}`,borderRadius:10,padding:"14px 16px",cursor:"pointer",transition:"all .2s"}}>
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:4}}>
                  <p style={{fontFamily:"Orbitron",fontSize:11,fontWeight:700,color:activeLoc===i?"#00f0ff":"#c8d6f0",margin:0}}>{l.city}</p>
                  <a href={l.maps} target="_blank" rel="noreferrer" onClick={e=>e.stopPropagation()} style={{fontSize:9,fontFamily:"Orbitron",color:"rgba(0,240,255,.5)",textDecoration:"none"}}>MAPS ↗</a>
                </div>
                <p style={{fontSize:11,color:"var(--muted)",margin:"0 0 4px"}}>{l.address}</p>
                <p style={{fontSize:10,color:"#4a5a7a",fontFamily:"Share Tech Mono",margin:0}}>{l.hours}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Support Hours */}
      <div>
        <p style={{fontFamily:"Orbitron",fontSize:10,color:"var(--muted)",letterSpacing:".15em",margin:"0 0 14px"}}>// SUPPORT HOURS</p>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10}}>
          {[["💬","WhatsApp","24 / 7","#25d366"],["📞","Phone","8am–10pm","#00ffa3"],["✉️","Email","8am–10pm","#00f0ff"],["🏬","Stores","10am–9pm","#f59e0b"]].map(([icon,ch,hrs,c])=>(
            <div key={ch} style={{background:"rgba(6,11,24,.8)",border:`1px solid ${c}15`,borderRadius:8,padding:"14px 16px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
              <div style={{display:"flex",alignItems:"center",gap:8}}><span style={{fontSize:16}}>{icon}</span><span style={{fontSize:11,color:"var(--muted)",fontFamily:"Orbitron",fontSize:9,letterSpacing:".06em"}}>{ch}</span></div>
              <span style={{fontSize:11,color:c,fontWeight:700,fontFamily:"Share Tech Mono"}}>{hrs}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══ BUY NOW MODAL ═══ */
function BuyNowModal({ product, onClose, onSuccess, user }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({name:user?.name||"",phone:"",email:user?.email||"",address:"",city:"",pin:"",pay:"upi"});
  const [processing, setProcessing] = useState(false);
  const set = (k,v) => setForm(f=>({...f,[k]:v}));

  const placeOrder = async () => {
    setProcessing(true);
    await new Promise(r=>setTimeout(r,1800));
    const orders = DB.get("orders") || [];
    orders.push({
      id:`ORD-${Date.now().toString().slice(-6)}`,
      userId: user?.email || form.email,
      products:[{id:product.id,qty:1}],
      total:product.price, status:"processing",
      payment:"paid", payMethod:form.pay,
      date:new Date().toISOString().split("T")[0],
      address:`${form.address}, ${form.city} ${form.pin}`,
    });
    DB.set("orders", orders);
    setProcessing(false); setStep(3);
    setTimeout(()=>{onSuccess();onClose();}, 2500);
  };

  const iS = {marginBottom:10};
  return (
    <div onClick={onClose} style={{position:"fixed",inset:0,zIndex:2000,background:"rgba(0,0,0,.85)",backdropFilter:"blur(12px)",display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
      <div onClick={e=>e.stopPropagation()} style={{
        background:"linear-gradient(145deg,#060b18,#08101e)",
        border:"1px solid rgba(0,240,255,.2)",borderRadius:12,
        width:520,maxWidth:"100%",maxHeight:"92vh",overflowY:"auto",padding:32,
        animation:"modalIn .42s cubic-bezier(.22,1,.36,1)",
        boxShadow:"0 0 0 1px rgba(0,240,255,.06), 0 40px 100px rgba(0,0,0,.9), 0 0 80px rgba(0,112,255,.1)",
      }}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:24}}>
          <h2 style={{fontFamily:"Orbitron",fontSize:17,fontWeight:800,color:"#fff",margin:0}}>{step===3?"✅ ORDER CONFIRMED":"⚡ INSTANT CHECKOUT"}</h2>
          <button onClick={onClose} style={{width:32,height:32,background:"rgba(255,255,255,.04)",border:"1px solid rgba(255,255,255,.07)",borderRadius:"50%",color:"var(--muted)",cursor:"pointer",fontSize:18}}>×</button>
        </div>
        {/* Product summary */}
        {step<3 && (
          <div style={{display:"flex",gap:12,background:"rgba(0,240,255,.04)",borderRadius:8,padding:14,marginBottom:22,border:"1px solid rgba(0,240,255,.1)"}}>
            <div style={{width:60,height:60,borderRadius:8,overflow:"hidden",flexShrink:0}}><SafeImg src={product.imgs[0]} alt={product.name} style={{width:"100%",height:"100%",objectFit:"cover"}}/></div>
            <div>
              <p style={{fontSize:13,fontWeight:600,color:"#dce8f8",margin:"0 0 4px"}}>{product.name}</p>
              <p style={{fontFamily:"Orbitron",fontSize:18,fontWeight:900,color:"#00f0ff",margin:0}}>{fmt(product.price)}</p>
            </div>
          </div>
        )}
        {/* Step indicators */}
        {step<3 && (
          <div style={{display:"flex",gap:0,alignItems:"center",marginBottom:24}}>
            {[1,2].map((s,i)=>(
              <div key={s} style={{display:"flex",alignItems:"center",flex:i<1?1:"auto"}}>
                <div style={{width:30,height:30,borderRadius:"50%",background:step>=s?"linear-gradient(135deg,#00f0ff,#0070ff)":"rgba(0,240,255,.1)",border:`1px solid ${step>=s?"#00f0ff":"rgba(0,240,255,.15)"}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontFamily:"Orbitron",fontWeight:800,color:step>=s?"#060b18":"var(--muted)",flexShrink:0,transition:"all .4s"}}>{step>s?"✓":s}</div>
                {i<1 && <div style={{flex:1,height:1,background:step>s?"rgba(0,240,255,.4)":"rgba(0,240,255,.1)",margin:"0 8px"}}/>}
              </div>
            ))}
          </div>
        )}

        {step===1 && (
          <div>
            <p style={{fontFamily:"Orbitron",fontSize:9,color:"#00f0ff",letterSpacing:".12em",marginBottom:14}}>// DELIVERY DETAILS</p>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
              <input className="cyber-input" placeholder="Full Name" value={form.name} onChange={e=>set("name",e.target.value)}/>
              <input className="cyber-input" placeholder="Phone" value={form.phone} onChange={e=>set("phone",e.target.value)}/>
            </div>
            <input className="cyber-input" placeholder="Email" value={form.email} onChange={e=>set("email",e.target.value)} style={iS}/>
            <textarea className="cyber-input" placeholder="Delivery Address" value={form.address} onChange={e=>set("address",e.target.value)} rows={2} style={{...iS,resize:"vertical"}}/>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
              <input className="cyber-input" placeholder="City" value={form.city} onChange={e=>set("city",e.target.value)}/>
              <input className="cyber-input" placeholder="PIN Code" value={form.pin} onChange={e=>set("pin",e.target.value)}/>
            </div>
            <button onClick={()=>setStep(2)} className="neon-btn neon-btn-primary" style={{width:"100%",padding:"14px",fontSize:11,marginTop:18}}>CONTINUE →</button>
          </div>
        )}
        {step===2 && (
          <div>
            <p style={{fontFamily:"Orbitron",fontSize:9,color:"#00f0ff",letterSpacing:".12em",marginBottom:14}}>// PAYMENT METHOD</p>
            {[["upi","📱 UPI / PhonePe / GPay","Instant"],["card","💳 Card","Visa / Mastercard"],["emi","🏦 No-Cost EMI","0% interest"],["cod","📦 Cash on Delivery","Pay on arrival"]].map(([v,l,s])=>(
              <div key={v} onClick={()=>set("pay",v)} style={{display:"flex",gap:12,padding:12,borderRadius:8,border:`1.5px solid ${form.pay===v?"rgba(0,240,255,.4)":"rgba(0,240,255,.07)"}`,background:form.pay===v?"rgba(0,240,255,.05)":"transparent",cursor:"pointer",marginBottom:8,transition:"all .2s"}}>
                <div style={{width:18,height:18,borderRadius:"50%",border:`2px solid ${form.pay===v?"#00f0ff":"rgba(255,255,255,.2)"}`,background:form.pay===v?"#00f0ff":"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:1}}>
                  {form.pay===v && <div style={{width:6,height:6,borderRadius:"50%",background:"#060b18"}}/>}
                </div>
                <div><p style={{fontSize:13,fontWeight:600,color:"#dce8f8",margin:0}}>{l}</p><p style={{fontSize:11,color:"var(--muted)",margin:0}}>{s}</p></div>
              </div>
            ))}
            <div style={{display:"flex",gap:10,marginTop:18}}>
              <button onClick={()=>setStep(1)} className="neon-btn" style={{flex:1,padding:"13px",fontSize:10}}>← BACK</button>
              <button onClick={placeOrder} disabled={processing} className="neon-btn neon-btn-primary" style={{flex:2,padding:"13px",fontSize:11,display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
                {processing?<><span style={{width:14,height:14,border:"2px solid rgba(255,255,255,.3)",borderTopColor:"#fff",borderRadius:"50%",animation:"spin .7s linear infinite",display:"inline-block"}}/>PROCESSING...</>:`⚡ PAY ${fmt(product.price)}`}
              </button>
            </div>
          </div>
        )}
        {step===3 && (
          <div style={{textAlign:"center",padding:"20px 0"}}>
            <div style={{fontSize:64,marginBottom:16}}>🎉</div>
            <h3 style={{fontFamily:"Orbitron",fontSize:22,fontWeight:900,color:"#00ffa3",marginBottom:10}}>ORDER PLACED!</h3>
            <p style={{color:"var(--muted)",fontSize:13}}>{product.name} will arrive in 2–3 business days.</p>
            <div style={{background:"rgba(0,255,163,.06)",border:"1px solid rgba(0,255,163,.2)",borderRadius:8,padding:"12px 18px",marginTop:16}}>
              <p style={{color:"#00ffa3",fontFamily:"Orbitron",fontSize:11}}>📦 ORDER #{Date.now().toString().slice(-7)} CONFIRMED</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══ WISHLIST MODAL ═══ */
function WishlistModal({ wishlist, onClose, onView, onRemove, onCart, toast, products }) {
  const items = products.filter(p => wishlist.includes(p.id));
  return (
    <div onClick={onClose} style={{position:"fixed",inset:0,zIndex:2000,background:"rgba(0,0,0,.8)",backdropFilter:"blur(10px)",display:"flex",alignItems:"flex-start",justifyContent:"flex-end"}}>
      <div onClick={e=>e.stopPropagation()} className="slide-l" style={{width:400,height:"100vh",background:"#060b18",borderLeft:"1px solid rgba(255,0,60,.15)",display:"flex",flexDirection:"column",overflow:"hidden",boxShadow:"-20px 0 80px rgba(0,0,0,.7)"}}>
        <div style={{padding:"20px 22px 16px",borderBottom:"1px solid rgba(255,0,60,.08)",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div>
            <h2 style={{fontFamily:"Orbitron",fontSize:16,fontWeight:800,color:"#fff",margin:0}}>❤️ WISHLIST</h2>
            <p style={{fontSize:11,color:"var(--muted)",margin:"3px 0 0",fontFamily:"Share Tech Mono"}}>{items.length} saved items</p>
          </div>
          <button onClick={onClose} style={{width:32,height:32,background:"rgba(255,255,255,.04)",border:"1px solid rgba(255,255,255,.06)",borderRadius:"50%",color:"var(--muted)",fontSize:18,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>×</button>
        </div>
        <div style={{flex:1,overflowY:"auto",padding:"14px 22px"}}>
          {items.length===0 ? (
            <div style={{textAlign:"center",padding:"60px 0"}}>
              <p style={{fontSize:40,opacity:.2,marginBottom:12}}>🤍</p>
              <p style={{fontFamily:"Orbitron",fontSize:12,color:"var(--muted)"}}>NO SAVED ITEMS</p>
            </div>
          ) : items.map(p=>(
            <div key={p.id} style={{display:"flex",gap:12,padding:"12px 0",borderBottom:"1px solid rgba(255,0,60,.06)"}}>
              <div style={{width:68,height:68,borderRadius:8,overflow:"hidden",flexShrink:0,cursor:"pointer"}} onClick={()=>{onView(p);onClose();}}>
                <SafeImg src={p.imgs?.[0]} alt={p.name} style={{width:"100%",height:"100%",objectFit:"cover"}}/>
              </div>
              <div style={{flex:1,minWidth:0}}>
                <p style={{fontSize:12,fontWeight:600,color:"#dce8f8",margin:"0 0 2px",cursor:"pointer",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}} onClick={()=>{onView(p);onClose();}}>{p.name}</p>
                <p style={{fontFamily:"Orbitron",fontSize:13,fontWeight:800,color:"#00f0ff",marginBottom:8}}>{fmt(p.price)}</p>
                <div style={{display:"flex",gap:6}}>
                  <button onClick={()=>{onCart(p);toast("Added to cart","success");}} style={{flex:1,padding:"6px",fontSize:9,fontFamily:"Orbitron",borderRadius:4,border:"1px solid rgba(0,240,255,.25)",background:"rgba(0,240,255,.06)",color:"#00f0ff",cursor:"pointer",letterSpacing:".06em"}}>+ CART</button>
                  <button onClick={()=>onRemove(p.id)} style={{padding:"6px 8px",fontSize:10,borderRadius:4,border:"1px solid rgba(255,0,60,.2)",background:"rgba(255,0,60,.06)",color:"#ff003c",cursor:"pointer"}}>✕</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══ FOOTER ═══ */
function Footer({ setPage }) {
  return (
    <footer style={{background:"#020408",borderTop:"1px solid rgba(0,240,255,.07)",padding:"48px 0 24px",marginTop:80}}>
      <div style={{maxWidth:1400,margin:"0 auto",padding:"0 24px"}}>
        <div style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr 1fr",gap:48,marginBottom:40}}>
          <div>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14}}>
              <div style={{width:30,height:30,borderRadius:7,background:"linear-gradient(135deg,#00f0ff,#0070ff)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,color:"#fff"}}>⚡</div>
              <span style={{fontFamily:"Orbitron",fontSize:18,fontWeight:900}}><span style={{color:"#00f0ff"}}>VOLT</span><span style={{color:"#fff"}}>X</span></span>
            </div>
            <p style={{fontSize:13,color:"#2a3a5a",maxWidth:280,lineHeight:1.7}}>India's most trusted next-gen electronics store. Authorised reseller for 120+ premium brands.</p>
          </div>
          {[{title:"SHOP",links:["Smartphones","Laptops","Audio","Gaming","Cameras"]},{title:"SUPPORT",links:["Track Order","Returns","Warranty","Service Centres","FAQ"]},{title:"COMPANY",links:["About VoltX","Careers","Press","Blog","Contact"]}].map(col=>(
            <div key={col.title}>
              <p style={{fontFamily:"Orbitron",fontSize:9,fontWeight:700,color:"var(--muted)",marginBottom:16,letterSpacing:".15em"}}>{col.title}</p>
              {col.links.map(l=>(
                <p key={l} style={{fontSize:12,margin:"0 0 10px",cursor:"pointer",color:"#2a3a5a",transition:"color .15s"}} onMouseEnter={e=>e.currentTarget.style.color="#00f0ff"} onMouseLeave={e=>e.currentTarget.style.color="#2a3a5a"}>{l}</p>
              ))}
            </div>
          ))}
        </div>
        <div style={{borderTop:"1px solid rgba(0,240,255,.06)",paddingTop:22,display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:10}}>
          <p style={{fontSize:12,color:"#1a2a44",fontFamily:"Share Tech Mono"}}>© 2025 VOLTX Electronics Pvt. Ltd.</p>
          <p style={{fontSize:12,color:"#1a2a44",fontFamily:"Share Tech Mono"}}>Made with ❤️ in India 🇮🇳</p>
        </div>
      </div>
    </footer>
  );
}

/* ═══════════════════════════════════════════════════════════
   APP ROOT
═══════════════════════════════════════════════════════════ */
export default function App() {
  // Inject styles
  useEffect(() => {
    const el = document.createElement("style");
    el.textContent = STYLES;
    document.head.appendChild(el);
    return () => el.remove();
  }, []);

  // Initialize DB
  useEffect(() => { DB.init(); }, []);

  const [user, setUser]           = useState(() => Auth.current());
  const [page, setPage]           = useState("home");
  const [products, setProducts]   = useState(() => DB.get("products") || PRODUCTS_INIT);
  const [cart, setCart]           = useState(() => DB.get("cart") || []);
  const [wishlist, setWishlist]   = useState(() => DB.get("wishlist") || []);
  const [selected, setSelected]   = useState(null);
  const [cartOpen, setCartOpen]   = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [buyNowProduct, setBuyNow] = useState(null);
  const { toasts, toast }         = useToast();

  // Keep DB in sync
  useEffect(() => { DB.set("cart", cart); }, [cart]);
  useEffect(() => { DB.set("wishlist", wishlist); }, [wishlist]);

  const navigate = p => { setPage(p); window.scrollTo({top:0,behavior:"smooth"}); };

  const handleLogin = (u) => { setUser(u); navigate(u.role==="admin"?"admin":"home"); };
  const handleLogout = () => { Auth.logout(); setUser(null); navigate("home"); toast("Logged out","info"); };

  const handleView = (product) => { setSelected(product); navigate("product"); };

  const handleCart = (product) => {
    setCart(c => {
      const ex = c.find(i=>i.product.id===product.id);
      if(ex) return c.map(i=>i.product.id===product.id?{...i,qty:i.qty+1}:i);
      return [...c,{product,qty:1}];
    });
  };

  const handleWishlist = (id) => {
    setWishlist(prev => prev.includes(id) ? prev.filter(x=>x!==id) : [...prev,id]);
  };

  const updateQty = (id, qty) => {
    if(qty<=0) setCart(c=>c.filter(i=>i.product.id!==id));
    else setCart(c=>c.map(i=>i.product.id===id?{...i,qty}:i));
  };

  const cartCount = cart.reduce((s,i)=>s+i.qty,0);

  // Refresh products from DB when admin panel is open
  useEffect(() => {
    if(page==="admin" || page==="products" || page==="home") {
      const p = DB.get("products");
      if(p) setProducts(p);
    }
  }, [page]);

  const sharedProps = { products, onView:handleView, onCart:handleCart, onBuyNow:setBuyNow, wishlist, onWishlist:handleWishlist, toast };

  const renderPage = () => {
    if(!user && (page==="admin"||page==="orders"||page==="dashboard")) {
      return <AuthPage mode="login" setPage={navigate} onLogin={handleLogin} toast={toast}/>;
    }
    if(user?.role!=="admin" && page==="admin") {
      toast("Admin access required","error"); navigate("home"); return null;
    }
    if(page==="login" || page==="signup") return <AuthPage mode={page} setPage={navigate} onLogin={handleLogin} toast={toast}/>;
    if(page==="product" && selected) return <ProductDetail product={selected} onBack={()=>navigate("products")} products={products} onView={handleView} onCart={handleCart} onBuyNow={setBuyNow} wishlist={wishlist} onWishlist={handleWishlist} toast={toast}/>;
    switch(page) {
      case "home":      return <HomePage      setPage={navigate} {...sharedProps}/>;
      case "products":  return <ProductsPage  {...sharedProps}/>;
      case "deals":     return <DealsPage     {...sharedProps}/>;
      case "orders":    return <OrdersPage    user={user}/>;
      case "dashboard": return <DashboardPage user={user} setPage={navigate} cart={cart} products={products}/>;
      case "admin":     return <AdminPage     toast={toast}/>;
      case "contact":   return <ContactPage   toast={toast}/>;
      default:          return <HomePage      setPage={navigate} {...sharedProps}/>;
    }
  };

  const isAuthPage = page==="login" || page==="signup";

  return (
    <div style={{minHeight:"100vh"}}>
      <div className="scanline-overlay"/>
      <Toasts toasts={toasts}/>
      <FloatingWhatsApp/>
      {cartOpen && <CartModal cart={cart} onClose={()=>setCartOpen(false)} onRemove={id=>setCart(c=>c.filter(i=>i.product.id!==id))} onUpdateQty={updateQty} onClear={()=>setCart([])} toast={toast} user={user} setPage={navigate}/>}
      {wishlistOpen && <WishlistModal wishlist={wishlist} onClose={()=>setWishlistOpen(false)} onView={handleView} onRemove={handleWishlist} onCart={handleCart} toast={toast} products={products}/>}
      {buyNowProduct && <BuyNowModal product={buyNowProduct} onClose={()=>setBuyNow(null)} onSuccess={()=>{setBuyNow(null);toast("Order placed! 🎉","success");}} user={user}/>}
      {!isAuthPage && (
        <Navbar page={page} setPage={navigate} cartCount={cartCount} wishlistCount={wishlist.length} user={user} onLogout={handleLogout} onCartOpen={()=>setCartOpen(true)} onWishlistOpen={()=>setWishlistOpen(true)}/>
      )}
      {isAuthPage ? (
        renderPage()
      ) : (
        <>
          <main style={{maxWidth:1400,margin:"0 auto",padding:"82px 24px 40px",minHeight:"80vh"}}>
            {renderPage()}
          </main>
          <Footer setPage={navigate}/>
        </>
      )}
    </div>
  );
}
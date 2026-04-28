import { useState, useEffect, useRef, useCallback } from "react";

/* ═══════════════════════════════════════════════════════════════════
   GLOBAL STYLES
═══════════════════════════════════════════════════════════════════ */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Outfit:wght@300;400;500;600;700;800;900&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  body {
    font-family: 'Space Grotesk', system-ui, sans-serif;
    background: #04060f;
    color: #e2e8f0;
    -webkit-font-smoothing: antialiased;
    background-image:
      radial-gradient(ellipse 900px 600px at 15% 10%, rgba(99,102,241,.07) 0%, transparent 70%),
      radial-gradient(ellipse 700px 500px at 85% 80%, rgba(139,92,246,.05) 0%, transparent 70%);
  }
  input, select, textarea, button { font-family: inherit; }
  a { text-decoration: none; color: inherit; }
  ::-webkit-scrollbar { width: 5px; height: 5px; }
  ::-webkit-scrollbar-track { background: #080c1a; }
  ::-webkit-scrollbar-thumb { background: linear-gradient(#6366f1,#8b5cf6); border-radius: 99px; }

  @keyframes fadeUp    { from{opacity:0;transform:translateY(36px);} to{opacity:1;transform:translateY(0);} }
  @keyframes fadeIn    { from{opacity:0;} to{opacity:1;} }
  @keyframes slideDown { from{opacity:0;transform:translateY(-16px);} to{opacity:1;transform:translateY(0);} }
  @keyframes slideLeft { from{opacity:0;transform:translateX(32px);} to{opacity:1;transform:translateX(0);} }
  @keyframes float     { 0%,100%{transform:translateY(0) rotate(-1deg);} 50%{transform:translateY(-22px) rotate(1.5deg);} }
  @keyframes floatSlow { 0%,100%{transform:translateY(0);} 50%{transform:translateY(-10px);} }
  @keyframes pulse     { 0%,100%{transform:scale(1);} 50%{transform:scale(1.06);} }
  @keyframes spin      { to{transform:rotate(360deg);} }
  @keyframes shimmer   { 0%{background-position:200% 0;} 100%{background-position:-200% 0;} }
  @keyframes toastIn   { from{opacity:0;transform:translateX(110%) scale(.9);} to{opacity:1;transform:translateX(0) scale(1);} }
  @keyframes toastOut  { from{opacity:1;transform:translateX(0);} to{opacity:0;transform:translateX(110%);} }
  @keyframes orbitA    { 0%{transform:rotate(0deg) translateX(105px) rotate(0deg);} 100%{transform:rotate(360deg) translateX(105px) rotate(-360deg);} }
  @keyframes orbitB    { 0%{transform:rotate(130deg) translateX(80px) rotate(-130deg);} 100%{transform:rotate(490deg) translateX(80px) rotate(-490deg);} }
  @keyframes orbitC    { 0%{transform:rotate(250deg) translateX(58px) rotate(-250deg);} 100%{transform:rotate(610deg) translateX(58px) rotate(-610deg);} }
  @keyframes heartPop  { 0%{transform:scale(1);} 40%{transform:scale(1.5);} 70%{transform:scale(.85);} 100%{transform:scale(1);} }
  @keyframes cartBounce{ 0%{transform:scale(1);} 30%{transform:scale(1.4);} 70%{transform:scale(.88);} 100%{transform:scale(1);} }
  @keyframes modalIn   { from{opacity:0;transform:scale(.93) translateY(24px);} to{opacity:1;transform:scale(1) translateY(0);} }
  @keyframes drawBorder{ 0%{stroke-dashoffset:400;} 100%{stroke-dashoffset:0;} }
  @keyframes glowShift { 0%,100%{box-shadow:0 0 30px rgba(99,102,241,.3),0 0 60px rgba(99,102,241,.1);} 50%{box-shadow:0 0 50px rgba(139,92,246,.5),0 0 100px rgba(139,92,246,.15);} }
  @keyframes borderFlow{ 0%{background-position:0% 50%;} 50%{background-position:100% 50%;} 100%{background-position:0% 50%;} }
  @keyframes particleUp{ 0%{opacity:1;transform:translateY(0) scale(1);} 100%{opacity:0;transform:translateY(-80px) scale(0);} }

  .fade-up  { animation: fadeUp   .65s cubic-bezier(.22,1,.36,1) both; }
  .fade-in  { animation: fadeIn   .4s ease both; }
  .slide-d  { animation: slideDown .38s cubic-bezier(.22,1,.36,1) both; }
  .slide-l  { animation: slideLeft .4s cubic-bezier(.22,1,.36,1) both; }

  .card-hover { transition: transform .3s cubic-bezier(.22,1,.36,1), box-shadow .3s ease; }
  .card-hover:hover { transform: translateY(-10px); box-shadow: 0 24px 60px rgba(0,0,0,.5) !important; }

  .img-zoom { overflow: hidden; }
  .img-zoom img { transition: transform .55s cubic-bezier(.22,1,.36,1); }
  .img-zoom:hover img { transform: scale(1.08); }

  .btn-primary {
    background: linear-gradient(135deg, #6366f1, #8b5cf6);
    color: #fff; border: none; border-radius: 14px;
    padding: 12px 28px; font-weight: 700; font-size: 14px;
    cursor: pointer; position: relative; overflow: hidden;
    transition: all .25s cubic-bezier(.22,1,.36,1);
    box-shadow: 0 6px 24px rgba(99,102,241,.45);
  }
  .btn-primary::after { content:''; position:absolute; inset:0; background:linear-gradient(135deg,#818cf8,#a78bfa); opacity:0; transition:opacity .22s; }
  .btn-primary > * { position:relative; z-index:1; }
  .btn-primary:hover::after { opacity:1; }
  .btn-primary:hover { transform:translateY(-3px); box-shadow:0 12px 36px rgba(99,102,241,.6); }
  .btn-primary:active { transform:scale(.97); }

  .btn-danger {
    background: linear-gradient(135deg, #dc2626, #f97316);
    color:#fff; border:none; border-radius:14px; padding:12px 28px;
    font-weight:700; font-size:14px; cursor:pointer;
    transition:all .25s; box-shadow:0 6px 24px rgba(220,38,38,.4);
  }
  .btn-danger:hover { transform:translateY(-3px); box-shadow:0 12px 36px rgba(220,38,38,.55); }
  .btn-danger:active { transform:scale(.97); }

  .btn-outline {
    background:transparent; color:#818cf8;
    border:1.5px solid rgba(129,140,248,.45); border-radius:14px;
    padding:11px 24px; font-weight:700; font-size:14px;
    cursor:pointer; transition:all .22s;
  }
  .btn-outline:hover { background:rgba(99,102,241,.1); border-color:rgba(129,140,248,.8); transform:translateY(-1px); }

  .btn-ghost {
    background:rgba(255,255,255,.06); color:#e2e8f0;
    border:1px solid rgba(255,255,255,.13); border-radius:14px;
    padding:11px 22px; font-weight:600; font-size:14px;
    cursor:pointer; transition:all .22s; backdrop-filter:blur(12px);
  }
  .btn-ghost:hover { background:rgba(255,255,255,.12); border-color:rgba(255,255,255,.22); }

  .glass {
    background: rgba(10,12,24,.78);
    backdrop-filter: blur(28px); -webkit-backdrop-filter: blur(28px);
    border: 1px solid rgba(255,255,255,.07);
  }
  .glass-card {
    background: rgba(13,16,30,.82);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(99,102,241,.14);
    transition: border-color .3s, box-shadow .3s;
  }
  .glass-card:hover { border-color: rgba(99,102,241,.38); box-shadow: 0 0 40px rgba(99,102,241,.1); }

  .skeleton {
    background: linear-gradient(90deg, #111827 25%, #1d2547 50%, #111827 75%);
    background-size: 200% 100%; animation: shimmer 1.7s infinite; border-radius: 10px;
  }

  .badge { display:inline-block; font-size:9px; font-weight:800; letter-spacing:.09em; text-transform:uppercase; padding:3px 9px; border-radius:6px; }
  .stars { color:#f59e0b; font-size:13px; }
  input:focus, select:focus, textarea:focus { outline:none; border-color:#6366f1 !important; box-shadow:0 0 0 3px rgba(99,102,241,.2); }
  .scrollbar-hide::-webkit-scrollbar { display:none; }
  .scrollbar-hide { -ms-overflow-style:none; scrollbar-width:none; }
  .syne { font-family:'Outfit',sans-serif; }
  .neon { text-shadow: 0 0 20px rgba(129,140,248,.8), 0 0 60px rgba(99,102,241,.4); }

  @media (max-width:768px) {
    .hide-mobile  { display:none !important; }
    .cat-grid     { grid-template-columns:repeat(4,1fr) !important; }
    .product-grid { grid-template-columns:repeat(2,1fr) !important; }
    .deal-grid    { grid-template-columns:1fr !important; }
    .sidebar      { display:none; }
    .contact-grid { grid-template-columns:1fr !important; }
    .stats-grid   { grid-template-columns:repeat(2,1fr) !important; }
    .footer-grid  { grid-template-columns:1fr 1fr !important; }
    .hero-wrap    { flex-direction:column !important; }
    .detail-grid  { grid-template-columns:1fr !important; }
    .brand-grid   { grid-template-columns:repeat(3,1fr) !important; }
  }
`;

/* ═══════════════════════════════════════════════════════════════════
   DATA — 40+ PRODUCTS
═══════════════════════════════════════════════════════════════════ */
const IMGS = {
  iphone:   ["https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=600&q=80","https://images.unsplash.com/photo-1512054502232-10a0a035d672?w=600&q=80","https://images.unsplash.com/photo-1574755393849-623942496936?w=600&q=80"],
  iphone14: ["https://images.unsplash.com/photo-1663499482523-1c0c1bae4ce1?w=600&q=80","https://images.unsplash.com/photo-1660737059424-8ab00d64b8af?w=600&q=80","https://images.unsplash.com/photo-1574755393849-623942496936?w=600&q=80"],
  samsung:  ["https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600&q=80","https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=600&q=80","https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600&q=80"],
  pixel:    ["https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&q=80","https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&q=80","https://images.unsplash.com/photo-1567581935884-3349723552ca?w=600&q=80"],
  oneplus:  ["https://images.unsplash.com/photo-1567581935884-3349723552ca?w=600&q=80","https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&q=80","https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80"],
  xperia:   ["https://images.unsplash.com/photo-1523206489230-c012c64b2b48?w=600&q=80","https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600&q=80","https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=600&q=80"],
  xm5:      ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80","https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600&q=80","https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&q=80"],
  bose:     ["https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&q=80","https://images.unsplash.com/photo-1524678606370-a47ad25cb82a?w=600&q=80","https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?w=600&q=80"],
  airpods:  ["https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=600&q=80","https://images.unsplash.com/photo-1588423771073-b8903fead714?w=600&q=80","https://images.unsplash.com/photo-1598331668826-20cecc596b86?w=600&q=80"],
  jbl:      ["https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&q=80","https://images.unsplash.com/photo-1545454675-3531b543be5d?w=600&q=80","https://images.unsplash.com/photo-1589003077984-894e133dabab?w=600&q=80"],
  sennheis: ["https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&q=80","https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600&q=80","https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80"],
  mac:      ["https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=600&q=80","https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&q=80","https://images.unsplash.com/photo-1542393545-10f5cde2c810?w=600&q=80"],
  macair:   ["https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&q=80","https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=600&q=80","https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&q=80"],
  dell:     ["https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600&q=80","https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600&q=80","https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=600&q=80"],
  asus:     ["https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=600&q=80","https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600&q=80","https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600&q=80"],
  lenovo:   ["https://images.unsplash.com/photo-1593642634367-d91a135587b5?w=600&q=80","https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=600&q=80","https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600&q=80"],
  ipad:     ["https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&q=80","https://images.unsplash.com/photo-1561154464-82e9adf32764?w=600&q=80","https://images.unsplash.com/photo-1589739900266-43b2843f4c12?w=600&q=80"],
  samsung_tab:["https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&q=80","https://images.unsplash.com/photo-1561154464-82e9adf32764?w=600&q=80","https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&q=80"],
  awatch:   ["https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=600&q=80","https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80","https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=600&q=80"],
  swatch:   ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80","https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=600&q=80","https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=600&q=80"],
  garmin:   ["https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=600&q=80","https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80","https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=600&q=80"],
  tv_sam:   ["https://images.unsplash.com/photo-1593359677879-a4bb92f829e1?w=600&q=80","https://images.unsplash.com/photo-1461151304267-38535e780c79?w=600&q=80","https://images.unsplash.com/photo-1509281373149-e957c6296406?w=600&q=80"],
  tv_lg:    ["https://images.unsplash.com/photo-1509281373149-e957c6296406?w=600&q=80","https://images.unsplash.com/photo-1461151304267-38535e780c79?w=600&q=80","https://images.unsplash.com/photo-1593359677879-a4bb92f829e1?w=600&q=80"],
  monitor:  ["https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&q=80","https://images.unsplash.com/photo-1547082299-de196ea013d6?w=600&q=80","https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=600&q=80"],
  ps5:      ["https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=600&q=80","https://images.unsplash.com/photo-1607853202273-797f1c22a38e?w=600&q=80","https://images.unsplash.com/photo-1622297845775-5ff3fef71d13?w=600&q=80"],
  xbox:     ["https://images.unsplash.com/photo-1605901309584-818e25960a8f?w=600&q=80","https://images.unsplash.com/photo-1518779578993-ec3579fee39f?w=600&q=80","https://images.unsplash.com/photo-1593118247619-e2d6f056869e?w=600&q=80"],
  sonycam:  ["https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&q=80","https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=600&q=80","https://images.unsplash.com/photo-1495121553079-4c61bcce1894?w=600&q=80"],
  gopro:    ["https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=600&q=80","https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&q=80","https://images.unsplash.com/photo-1553564552-02656fcee0e9?w=600&q=80",],
  drone:    ["https://images.unsplash.com/photo-1527977966376-1c8408f9f108?w=600&q=80","https://images.unsplash.com/photo-1508614999368-9260051292e5?w=600&q=80","https://images.unsplash.com/photo-1521405924405-ed50eeef0a2c?w=600&q=80"],
  nikon:    ["https://images.unsplash.com/photo-1495121553079-4c61bcce1894?w=600&q=80","https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=600&q=80","https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&q=80"],
};

const PRODUCTS = [
  // PHONES
  { id:1,  name:"iPhone 15 Pro Max",          brand:"apple",    cat:"phones",    price:159900, mrp:179900, rating:4.8, reviews:2341, imgs:IMGS.iphone,    badge:"Hot",         specs:{Display:'6.7" Super Retina XDR',Processor:"A17 Pro",RAM:"8GB",Storage:"256GB",Battery:"4422 mAh",Camera:"48MP Triple"},    hi:["Titanium design","USB-C","Action Button"],       desc:"The most powerful iPhone ever with A17 Pro chip and a pro-grade 48MP camera system." },
  { id:2,  name:"iPhone 14 Plus",             brand:"apple",    cat:"phones",    price:84900,  mrp:99900,  rating:4.6, reviews:1203, imgs:IMGS.iphone14,  badge:"Value",       specs:{Display:'6.7" Super Retina XDR',Processor:"A15 Bionic",RAM:"6GB",Storage:"128GB",Battery:"4325 mAh",Camera:"12MP Dual"},   hi:["Big display","A15 Bionic","All-day battery"],    desc:"Big screen, big battery, big power. iPhone 14 Plus does it all." },
  { id:3,  name:"Samsung Galaxy S24 Ultra",   brand:"samsung",  cat:"phones",    price:134999, mrp:149999, rating:4.7, reviews:1892, imgs:IMGS.samsung,   badge:"Deal",        specs:{Display:'6.8" Dynamic AMOLED 2X',Processor:"Snapdragon 8 Gen 3",RAM:"12GB",Storage:"256GB",Battery:"5000 mAh",Camera:"200MP Quad"}, hi:["Built-in S Pen","Galaxy AI","Titanium"], desc:"Redefining productivity with Galaxy AI and the legendary S Pen." },
  { id:4,  name:"Samsung Galaxy A54 5G",      brand:"samsung",  cat:"phones",    price:34999,  mrp:42999,  rating:4.5, reviews:3421, imgs:IMGS.samsung,   badge:"Popular",     specs:{Display:'6.4" Super AMOLED',Processor:"Exynos 1380",RAM:"8GB",Storage:"128GB",Battery:"5000 mAh",Camera:"50MP Triple"},    hi:["50MP OIS camera","5000mAh","5G ready"],         desc:"Premium experience at a mid-range price. The Galaxy A54 5G." },
  { id:5,  name:"Google Pixel 8 Pro",         brand:"google",   cat:"phones",    price:106999, mrp:119999, rating:4.7, reviews:1123, imgs:IMGS.pixel,     badge:"AI",          specs:{Display:'6.7" LTPO OLED',Processor:"Google Tensor G3",RAM:"12GB",Storage:"256GB",Battery:"5050 mAh",Camera:"50MP Triple"},  hi:["Google AI features","7yr updates","Magic Eraser"],desc:"Google's smartest phone, packed with industry-leading AI." },
  { id:6,  name:"OnePlus 12R",                brand:"oneplus",  cat:"phones",    price:39999,  mrp:44999,  rating:4.6, reviews:987,  imgs:IMGS.oneplus,   badge:"Value",       specs:{Display:'6.78" AMOLED 120Hz',Processor:"Snapdragon 8 Gen 2",RAM:"16GB",Storage:"256GB",Battery:"5500 mAh",Charging:"100W"}, hi:["100W charging","5500mAh","Hasselblad colors"],  desc:"Flagship specs at an honest price — the ultimate value phone." },
  { id:7,  name:"Sony Xperia 1 V",            brand:"sony",     cat:"phones",    price:119999, mrp:134999, rating:4.5, reviews:423,  imgs:IMGS.xperia,    badge:"Creator",     specs:{Display:'6.5" 4K OLED 120Hz',Processor:"Snapdragon 8 Gen 2",RAM:"12GB",Storage:"256GB",Battery:"5000 mAh",Camera:"12MP Triple+Zeiss"}, hi:["4K OLED","Zeiss optics","Hi-Res Audio"],  desc:"A camera-first phone built in collaboration with Zeiss optics." },

  // AUDIO
  { id:8,  name:"Sony WH-1000XM5",            brand:"sony",     cat:"audio",     price:26990,  mrp:34990,  rating:4.9, reviews:4521, imgs:IMGS.xm5,       badge:"Best Seller", specs:{Driver:"30mm",ANC:"Industry-leading",Battery:"30h",Bluetooth:"5.2",Weight:"250g",Foldable:"Yes"},            hi:["Best-in-class ANC","30hr battery","Multipoint"], desc:"The absolute benchmark for noise-cancelling headphones." },
  { id:9,  name:"Bose QuietComfort 45",       brand:"bose",     cat:"audio",     price:24990,  mrp:32990,  rating:4.7, reviews:2103, imgs:IMGS.bose,      badge:"Popular",     specs:{Driver:"40mm",ANC:"Quiet + Aware",Battery:"24h",Bluetooth:"5.1",Weight:"238g",Foldable:"Yes"},             hi:["Bose signature sound","Quiet & Aware","Comfort"], desc:"World-class comfort meets legendary Bose audio." },
  { id:10, name:"AirPods Pro 2nd Gen",        brand:"apple",    cat:"audio",     price:24900,  mrp:26900,  rating:4.8, reviews:3201, imgs:IMGS.airpods,   badge:"Hot",         specs:{ANC:"Adaptive Transparency",Battery:"6h+30h",Chip:"H2",Water:"IP54",Spatial:"Personalized",Case:"MagSafe"},  hi:["H2 ANC","Adaptive mode","MagSafe case"],         desc:"Rebuilt with H2 chip for smarter ANC and richer audio." },
  { id:11, name:"JBL Charge 5 Speaker",       brand:"jbl",      cat:"audio",     price:13999,  mrp:19999,  rating:4.7, reviews:5234, imgs:IMGS.jbl,       badge:"Rugged",      specs:{Output:"40W",Battery:"20h",Water:"IP67",Bluetooth:"5.1",Range:"30m",Feature:"PartyBoost"},                  hi:["IP67 waterproof","20hr battery","PartyBoost"],   desc:"Charge your devices and fill the room — JBL Charge 5." },
  { id:12, name:"Sennheiser Momentum 4",      brand:"sennheiser",cat:"audio",    price:29990,  mrp:39990,  rating:4.8, reviews:876,  imgs:IMGS.sennheis,  badge:"New",         specs:{Driver:"42mm",ANC:"Adaptive ANC",Battery:"60h",Bluetooth:"5.2",Weight:"293g",Foldable:"Yes"},            hi:["60hr battery","Adaptive ANC","Hi-Res Audio"],    desc:"60 hours of audio bliss with Sennheiser's finest ANC headphone." },

  // LAPTOPS
  { id:13, name:'MacBook Pro 14" M3',          brand:"apple",    cat:"laptops",   price:199900, mrp:219900, rating:4.9, reviews:1204, imgs:IMGS.mac,       badge:"New",         specs:{Processor:"Apple M3 Pro",RAM:"18GB",Storage:"512GB SSD",Display:'14.2" Liquid Retina XDR',Battery:"18h",Ports:"3× TB4"}, hi:["M3 Pro chip","Retina XDR","18hr battery"],      desc:"The world's best pro laptop. Blazing fast, all day long." },
  { id:14, name:'MacBook Air 15" M2',          brand:"apple",    cat:"laptops",   price:134900, mrp:149900, rating:4.8, reviews:2109, imgs:IMGS.macair,    badge:"Popular",     specs:{Processor:"Apple M2",RAM:"8GB",Storage:"256GB SSD",Display:'15.3" Liquid Retina',Battery:"18h",Weight:"1.51kg"}, hi:["M2 chip","15\" display","Fanless design"],     desc:"The world's thinnest 15-inch laptop — silent, fast, stunning." },
  { id:15, name:"Dell XPS 15 OLED",           brand:"dell",     cat:"laptops",   price:169900, mrp:189900, rating:4.6, reviews:743,  imgs:IMGS.dell,      badge:"Deal",        specs:{Processor:"Intel i9-13900H",RAM:"32GB DDR5",Storage:"1TB SSD",Display:'15.6" OLED 3.5K',Battery:"86Whr",GPU:"RTX 4070"}, hi:["OLED display","RTX 4070","Premium build"],      desc:"OLED brilliance meets RTX power — the creator's ultimate weapon." },
  { id:16, name:"ASUS ROG Zephyrus G14",      brand:"asus",     cat:"laptops",   price:149900, mrp:169900, rating:4.8, reviews:612,  imgs:IMGS.asus,      badge:"Gaming",      specs:{Processor:"AMD Ryzen 9 7940HS",RAM:"32GB",Storage:"1TB SSD",Display:'14" QHD 165Hz',Battery:"73Whr",GPU:"RTX 4060"}, hi:["RTX 4060","QHD 165Hz","Ultra-slim gaming"],     desc:"Compact powerhouse. Small body, monstrous gaming performance." },
  { id:17, name:"Lenovo ThinkPad X1 Carbon", brand:"lenovo",   cat:"laptops",   price:129900, mrp:149900, rating:4.7, reviews:534,  imgs:IMGS.lenovo,    badge:"Business",    specs:{Processor:"Intel Core i7-1365U",RAM:"16GB",Storage:"512GB SSD",Display:'14" IPS 2.8K',Battery:"15h",Weight:"1.12kg"}, hi:["Ultra-light 1.12kg","Business grade","15hr battery"], desc:"The legendary ThinkPad. Trusted by professionals worldwide." },

  // TABLETS
  { id:18, name:"Apple iPad Pro M2 12.9\"",   brand:"apple",    cat:"tablets",   price:112900, mrp:124900, rating:4.8, reviews:876,  imgs:IMGS.ipad,      badge:"New",         specs:{Processor:"Apple M2",Display:'12.9" Liquid Retina XDR',RAM:"8GB",Storage:"256GB",Battery:"10541 mAh",Camera:"12MP + 10MP"}, hi:["M2 chip","XDR display","Apple Pencil"],         desc:"Thin, light and staggeringly powerful — the ultimate iPad." },
  { id:19, name:"Samsung Galaxy Tab S9 Ultra",brand:"samsung",  cat:"tablets",   price:109999, mrp:124999, rating:4.7, reviews:654,  imgs:IMGS.samsung_tab,badge:"Deal",       specs:{Display:'14.6" Dynamic AMOLED 2X',Processor:"Snapdragon 8 Gen 2",RAM:"12GB",Storage:"256GB",Battery:"11200 mAh",SPen:"Included"}, hi:["14.6\" display","S Pen included","DeX mode"],  desc:"The ultimate productivity tablet with S Pen and DeX support." },
  { id:20, name:"Apple iPad Air M1",          brand:"apple",    cat:"tablets",   price:59900,  mrp:69900,  rating:4.7, reviews:1432, imgs:IMGS.ipad,      badge:"Value",       specs:{Processor:"Apple M1",Display:'10.9" Liquid Retina',RAM:"8GB",Storage:"64GB",Battery:"7606 mAh",Camera:"12MP"},           hi:["M1 performance","Touch ID","USB-C"],             desc:"Serious performance in an incredibly thin and light design." },

  // SMARTWATCHES
  { id:21, name:"Apple Watch Series 9",       brand:"apple",    cat:"wearables", price:41900,  mrp:44900,  rating:4.7, reviews:1543, imgs:IMGS.awatch,    badge:"Popular",     specs:{Chip:"S9 SiP",Display:"AOD LTPO OLED",Health:"Blood O₂ + ECG",GPS:"L1 + L5",Water:"50m",Battery:"18h"},            hi:["Double Tap gesture","AOD display","Crash Detection"], desc:"The most capable Apple Watch yet — smarter, brighter, faster." },
  { id:22, name:"Apple Watch Ultra 2",        brand:"apple",    cat:"wearables", price:89900,  mrp:99900,  rating:4.9, reviews:743,  imgs:IMGS.awatch,    badge:"Flagship",    specs:{Chip:"S9 SiP",Display:"49mm AOD Retina",Health:"ECG + Blood O₂",GPS:"L1+L5+S1",Water:"100m",Battery:"60h"},       hi:["60hr battery","Titanium case","100m depth"],     desc:"Built for the extremes. Dual-frequency GPS and titanium toughness." },
  { id:23, name:"Samsung Galaxy Watch 6",     brand:"samsung",  cat:"wearables", price:29999,  mrp:35999,  rating:4.6, reviews:987,  imgs:IMGS.swatch,    badge:"New",         specs:{Display:"1.5\" Super AMOLED",Processor:"Exynos W930",RAM:"2GB",Storage:"16GB",Battery:"425mAh 40hr",Health:"BioActive Sensor"}, hi:["BioActive sensor","Body composition","Advanced sleep"],desc:"Advanced health tracking meets premium design." },
  { id:24, name:"Garmin Fenix 7 Solar",       brand:"garmin",   cat:"wearables", price:79990,  mrp:89990,  rating:4.8, reviews:421,  imgs:IMGS.garmin,    badge:"Adventure",   specs:{Display:"1.3\" MIP",Battery:"22d + Solar",GPS:"Multi-band",Water:"100m",Material:"Titanium",Sports:"60+ modes"},    hi:["Solar charging","22-day battery","Multi-band GPS"], desc:"Legendary GPS multisport smartwatch with solar charging capability." },

  // TVs & MONITORS
  { id:25, name:'Samsung 65" Neo QLED 4K',    brand:"samsung",  cat:"tvs",       price:129990, mrp:169990, rating:4.8, reviews:654,  imgs:IMGS.tv_sam,    badge:"Best Seller", specs:{Panel:"Neo QLED",Resolution:"4K UHD",Refresh:"120Hz",HDR:"HDR10+",Smart:"Tizen OS 7",Ports:"4× HDMI 2.1"},      hi:["Neo Quantum Dots","Gaming Hub","Object Tracking Sound"], desc:"Neo QLED with Mini LED — quantum-level picture quality." },
  { id:26, name:'LG C3 65" OLED evo',         brand:"lg",       cat:"tvs",       price:159990, mrp:199990, rating:4.9, reviews:1023, imgs:IMGS.tv_lg,     badge:"Editor's Pick",specs:{Panel:"OLED evo",Resolution:"4K UHD",Refresh:"120Hz",HDR:"Dolby Vision IQ",Smart:"webOS 23",Ports:"4× HDMI 2.1"},    hi:["OLED evo panel","Dolby Vision IQ","α9 Gen 6 AI"], desc:"The gold standard in TV — OLED evo with perfect blacks." },
  { id:27, name:'Samsung 32" Odyssey G5 QHD', brand:"samsung",  cat:"tvs",       price:24990,  mrp:32990,  rating:4.7, reviews:892,  imgs:IMGS.monitor,   badge:"Gaming",      specs:{Panel:"VA 1000R Curved",Resolution:"QHD 2560×1440",Refresh:"165Hz",Response:"1ms",HDR:"HDR10",Feature:"FreeSync Premium"}, hi:["165Hz refresh","1ms response","1000R curve"],   desc:"Curved QHD gaming monitor with buttery-smooth 165Hz gameplay." },

  // GAMING
  { id:28, name:"PlayStation 5",              brand:"sony",     cat:"gaming",    price:54990,  mrp:59990,  rating:4.9, reviews:5821, imgs:IMGS.ps5,       badge:"🔥 Hot",      specs:{CPU:"AMD Zen 2 8-core",GPU:"AMD RDNA 2 10.3TF",Storage:"825GB NVMe SSD",Display:"4K 120fps",Audio:"Tempest 3D",Controller:"DualSense"}, hi:["4K 120fps","Ultra-fast SSD","DualSense haptics"], desc:"Next-gen gaming. The fastest, most immersive PlayStation ever." },
  { id:29, name:"Xbox Series X",              brand:"microsoft",cat:"gaming",    price:52999,  mrp:59990,  rating:4.8, reviews:3210, imgs:IMGS.xbox,      badge:"Gaming",      specs:{CPU:"AMD Zen 2 8-core",GPU:"12 TFLOPS",RAM:"16GB GDDR6",Storage:"1TB NVMe",Resolution:"4K 120fps",Feature:"Quick Resume"}, hi:["4K 120fps","Quick Resume","Game Pass ready"],    desc:"The world's most powerful console. Play thousands in stunning 4K." },

  // CAMERAS
  { id:30, name:"Sony Alpha ZV-E10",          brand:"sony",     cat:"cameras",   price:62990,  mrp:74990,  rating:4.6, reviews:432,  imgs:IMGS.sonycam,   badge:"Creator",     specs:{Sensor:"24.2MP APS-C",Video:"4K 30fps",AF:"Real-time Eye AF",Display:'3" Vari-angle',ISO:"100-32000",Lens:"16-50mm kit"}, hi:["Vari-angle display","Eye AF","4K video"],        desc:"The ultimate vlogging camera — compact, powerful, creator-ready." },
  { id:31, name:"Sony Alpha A7 IV",           brand:"sony",     cat:"cameras",   price:259990, mrp:289990, rating:4.9, reviews:312,  imgs:IMGS.sonycam,   badge:"Pro",         specs:{Sensor:"33MP Full-Frame BSI",Video:"4K 60fps 10-bit",AF:"Real-time AI AF",ISO:"50-204800",Stabilization:"5-axis IBIS",Mount:"E-mount"}, hi:["33MP full-frame","4K 60fps 10-bit","AI AF"],  desc:"Full-frame mirrorless mastery — exceptional stills and video." },
  { id:32, name:"Nikon Z6 III",               brand:"nikon",    cat:"cameras",   price:239990, mrp:269990, rating:4.8, reviews:187,  imgs:IMGS.nikon,     badge:"New",         specs:{Sensor:"24.5MP BSI CMOS",Video:"6K ProRes RAW",AF:"Subject Detection AF",ISO:"100-64000",Stabilization:"6-stop IBIS",Display:"Tilting TFT"}, hi:["6K ProRes RAW","Subject Detection","6-stop IBIS"], desc:"Nikon's most versatile Z-series camera for photo and video." },
  { id:33, name:"GoPro Hero 12 Black",        brand:"gopro",    cat:"cameras",   price:34999,  mrp:39999,  rating:4.7, reviews:1023, imgs:IMGS.gopro,     badge:"Adventure",   specs:{Video:"5.3K/60fps",Stabilization:"HyperSmooth 6.0",Battery:"30% longer",Water:"10m depth",Audio:"Wind reduction",Display:"Front + Rear"}, hi:["5.3K/60fps","HyperSmooth 6.0","10m waterproof"], desc:"The most powerful GoPro ever — go anywhere, capture everything." },
  { id:34, name:"DJI Mini 4 Pro Drone",       brand:"dji",      cat:"cameras",   price:89990,  mrp:99990,  rating:4.8, reviews:678,  imgs:IMGS.drone,     badge:"Creator",     specs:{Camera:"1/1.3\" CMOS 48MP",Video:"4K 100fps",Weight:"<249g",Range:"20km",Battery:"34min",Obstacle:"4-way sensing"},       hi:["4K 100fps","Under 249g","20km range"],           desc:"Fly further, shoot better — the ultimate compact drone." },
];

const CATEGORIES = [
  {id:"phones",   name:"Phones",     icon:"📱", color:"#6366f1"},
  {id:"laptops",  name:"Laptops",    icon:"💻", color:"#8b5cf6"},
  {id:"tablets",  name:"Tablets",    icon:"📲", color:"#06b6d4"},
  {id:"audio",    name:"Audio",      icon:"🎧", color:"#f59e0b"},
  {id:"cameras",  name:"Cameras",    icon:"📷", color:"#ec4899"},
  {id:"tvs",      name:"TVs & Monitors",icon:"📺",color:"#10b981"},
  {id:"wearables",name:"Wearables",  icon:"⌚", color:"#a855f7"},
  {id:"gaming",   name:"Gaming",     icon:"🎮", color:"#ef4444"},
];

const BRANDS = [
  {id:"apple",    name:"Apple",       logo:"🍎", tagline:"Think Different"},
  {id:"samsung",  name:"Samsung",     logo:"🌀", tagline:"Do What You Can't"},
  {id:"sony",     name:"Sony",        logo:"🎵", tagline:"Be Moved"},
  {id:"bose",     name:"Bose",        logo:"🔊", tagline:"Better Sound"},
  {id:"oneplus",  name:"OnePlus",     logo:"🔴", tagline:"Never Settle"},
  {id:"dell",     name:"Dell",        logo:"💻", tagline:"Power to Do More"},
  {id:"asus",     name:"Asus",        logo:"🛡️",  tagline:"Incredible Machines"},
  {id:"google",   name:"Google",      logo:"🔵", tagline:"Made by Google"},
  {id:"lenovo",   name:"Lenovo",      logo:"🖥️",  tagline:"Smarter Technology"},
  {id:"jbl",      name:"JBL",         logo:"🎶", tagline:"Feel the Music"},
  {id:"sennheiser",name:"Sennheiser", logo:"🎧", tagline:"Crafted for Sound"},
  {id:"garmin",   name:"Garmin",      logo:"🗺️",  tagline:"Beat Yesterday"},
  {id:"lg",       name:"LG",          logo:"🔲", tagline:"Life's Good"},
  {id:"nikon",    name:"Nikon",       logo:"📷", tagline:"At the Heart of the Image"},
  {id:"gopro",    name:"GoPro",       logo:"🎬", tagline:"Be a Hero"},
  {id:"dji",      name:"DJI",         logo:"🚁", tagline:"Sky's the Limit"},
  {id:"microsoft",name:"Microsoft",   logo:"🟦", tagline:"Empowering Every Person"},
];

const DEALS = [
  {id:1, productId:25, extraOff:10000, endsIn:7200},
  {id:2, productId:8,  extraOff:2500,  endsIn:14400},
  {id:3, productId:6,  extraOff:3000,  endsIn:3600},
  {id:4, productId:15, extraOff:8000,  endsIn:21600},
];

const BADGE_COLORS = {
  "Hot":"#ef4444","Deal":"#6366f1","Best Seller":"#f59e0b","New":"#10b981","Value":"#8b5cf6",
  "Popular":"#f97316","25% Off":"#ef4444","Creator":"#06b6d4","AI":"#10b981","Gaming":"#ef4444",
  "Adventure":"#f97316","Pro":"#6366f1","🔥 Hot":"#ef4444","Rugged":"#64748b","Business":"#3b82f6",
  "Flagship":"#a855f7","Editor's Pick":"#f59e0b",
};

const fmt  = n => "₹" + n.toLocaleString("en-IN");
const disc = (p, m) => Math.round(((m - p) / m) * 100);

/* ═══ HOOKS ═══ */
function useCountdown(sec) {
  const [left, setLeft] = useState(sec);
  useEffect(() => { const t = setInterval(() => setLeft(s => Math.max(0, s - 1)), 1000); return () => clearInterval(t); }, []);
  return [String(Math.floor(left/3600)).padStart(2,"0"),String(Math.floor((left%3600)/60)).padStart(2,"0"),String(left%60).padStart(2,"0")].join(":");
}

function useScrollReveal() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, {threshold:0.08});
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return { ref, visible };
}

function useToast() {
  const [toasts, setToasts] = useState([]);
  const add = useCallback((msg, type = "success") => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, {id, msg, type, out:false}]);
    setTimeout(() => setToasts(prev => prev.map(t => t.id===id ? {...t,out:true} : t)), 2800);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id!==id)), 3200);
  }, []);
  return { toasts, toast: add };
}

/* ═══ TOAST ═══ */
function ToastContainer({ toasts }) {
  const colors = {success:"#10b981",error:"#ef4444",info:"#6366f1",warning:"#f59e0b"};
  const icons  = {success:"✓",error:"✕",info:"ℹ",warning:"⚠"};
  return (
    <div style={{position:"fixed",top:80,right:18,zIndex:9999,display:"flex",flexDirection:"column",gap:10,pointerEvents:"none"}}>
      {toasts.map(t => (
        <div key={t.id} style={{
          background:"rgba(8,10,22,.96)", backdropFilter:"blur(24px)",
          borderLeft:`3px solid ${colors[t.type]}`, padding:"14px 20px", borderRadius:14,
          boxShadow:`0 16px 48px rgba(0,0,0,.6), 0 0 0 1px rgba(255,255,255,.05)`,
          display:"flex", alignItems:"center", gap:12, minWidth:270,
          animation: t.out ? "toastOut .3s ease forwards" : "toastIn .4s cubic-bezier(.22,1,.36,1) forwards"
        }}>
          <span style={{width:24,height:24,borderRadius:"50%",background:colors[t.type]+"22",border:`1.5px solid ${colors[t.type]}`,color:colors[t.type],display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:800,flexShrink:0}}>{icons[t.type]}</span>
          <span style={{fontSize:13,fontWeight:600,color:"#e2e8f0"}}>{t.msg}</span>
        </div>
      ))}
    </div>
  );
}

/* ═══ SAFE IMAGE ═══ */
function SafeImg({ src, alt, style, className }) {
  const [err, setErr] = useState(false);
  if (err) return (
    <div style={{...style,background:"linear-gradient(135deg,#111827,#1e2749)",display:"flex",alignItems:"center",justifyContent:"center"}} className={className}>
      <span style={{fontSize:32,opacity:.3}}>📦</span>
    </div>
  );
  return <img src={src} alt={alt} style={style} className={className} onError={() => setErr(true)} loading="lazy" />;
}

function Stars({ rating }) {
  return (
    <span className="stars">
      {"★".repeat(Math.floor(rating))}{"☆".repeat(5-Math.floor(rating))}
      <span style={{color:"#334155",marginLeft:5,fontSize:12}}>{rating}</span>
    </span>
  );
}

function Reveal({ children, delay=0, style={} }) {
  const {ref, visible} = useScrollReveal();
  return (
    <div ref={ref} style={{
      opacity:visible?1:0, transform:visible?"none":"translateY(34px)",
      transition:`opacity .68s cubic-bezier(.22,1,.36,1) ${delay}ms, transform .68s cubic-bezier(.22,1,.36,1) ${delay}ms`,
      ...style
    }}>{children}</div>
  );
}

function SectionTitle({ children, accent="#6366f1" }) {
  return (
    <h2 className="syne" style={{fontSize:24,fontWeight:800,color:"#f1f5f9",margin:"0 0 24px",display:"flex",alignItems:"center",gap:14}}>
      <span style={{width:4,height:28,background:`linear-gradient(135deg,${accent},${accent}99)`,borderRadius:2,display:"inline-block",flexShrink:0}}/>
      {children}
    </h2>
  );
}

/* ═══ CART MODAL ═══ */
function CartModal({ cart, onClose, onRemove, onUpdateQty, onClear, toast }) {
  const total = cart.reduce((s, i) => s + i.product.price * i.qty, 0);
  const [done, setDone] = useState(false);
  const [processing, setProcessing] = useState(false);

  const checkout = async () => {
    setProcessing(true);
    await new Promise(r => setTimeout(r, 1800));
    setProcessing(false); setDone(true);
    toast("Order placed successfully! 🎉", "success");
    setTimeout(() => { onClear(); onClose(); }, 2500);
  };

  return (
    <div onClick={onClose} style={{position:"fixed",inset:0,zIndex:2000,background:"rgba(0,0,0,.75)",backdropFilter:"blur(8px)",display:"flex",alignItems:"flex-start",justifyContent:"flex-end"}}>
      <div onClick={e=>e.stopPropagation()} className="slide-l" style={{width:430,height:"100vh",background:"#080c1a",borderLeft:"1px solid rgba(99,102,241,.2)",display:"flex",flexDirection:"column",overflow:"hidden",boxShadow:"-12px 0 80px rgba(0,0,0,.6)"}}>
        <div style={{padding:"22px 24px 18px",borderBottom:"1px solid rgba(255,255,255,.06)",display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0}}>
          <div>
            <h2 className="syne" style={{fontSize:20,fontWeight:800,color:"#fff",margin:0}}>🛒 Shopping Cart</h2>
            <p style={{fontSize:12,color:"#475569",margin:"3px 0 0"}}>{cart.reduce((s,i)=>s+i.qty,0)} item{cart.reduce((s,i)=>s+i.qty,0)!==1?"s":""}</p>
          </div>
          <button onClick={onClose} style={{width:36,height:36,background:"rgba(255,255,255,.05)",border:"1px solid rgba(255,255,255,.08)",borderRadius:"50%",color:"#94a3b8",fontSize:18,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>×</button>
        </div>

        <div style={{flex:1,overflowY:"auto",padding:"16px 24px"}}>
          {done ? (
            <div style={{textAlign:"center",padding:"60px 0"}}>
              <div style={{fontSize:64,marginBottom:16,animation:"pulse 1s ease 2"}}>🎉</div>
              <h3 className="syne" style={{fontSize:22,color:"#fff",marginBottom:8}}>Order Placed!</h3>
              <p style={{color:"#64748b",fontSize:14}}>You'll receive a confirmation email shortly.</p>
            </div>
          ) : cart.length===0 ? (
            <div style={{textAlign:"center",padding:"60px 0"}}>
              <div style={{fontSize:52,marginBottom:14,opacity:.3}}>🛒</div>
              <p style={{color:"#475569",fontSize:15,fontWeight:600}}>Your cart is empty</p>
            </div>
          ) : cart.map(item => (
            <div key={item.product.id} style={{display:"flex",gap:14,padding:"14px 0",borderBottom:"1px solid rgba(255,255,255,.05)"}}>
              <div style={{width:76,height:76,borderRadius:14,overflow:"hidden",flexShrink:0,background:"#111827"}}>
                <SafeImg src={item.product.imgs?.[0]} alt={item.product.name} style={{width:"100%",height:"100%",objectFit:"cover"}}/>
              </div>
              <div style={{flex:1,minWidth:0}}>
                <p style={{fontSize:13,fontWeight:700,color:"#e2e8f0",margin:"0 0 2px",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{item.product.name}</p>
                <p style={{fontSize:12,color:"#475569",margin:"0 0 8px",textTransform:"capitalize"}}>{item.product.brand}</p>
                <p className="syne" style={{fontSize:16,fontWeight:800,color:"#818cf8"}}>{fmt(item.product.price * item.qty)}</p>
              </div>
              <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:8}}>
                <button onClick={()=>onRemove(item.product.id)} style={{background:"rgba(239,68,68,.1)",border:"1px solid rgba(239,68,68,.2)",borderRadius:8,color:"#f87171",cursor:"pointer",fontSize:11,fontWeight:700,padding:"4px 9px"}}>✕</button>
                <div style={{display:"flex",alignItems:"center",gap:6}}>
                  <button onClick={()=>onUpdateQty(item.product.id,item.qty-1)} style={{width:26,height:26,borderRadius:7,background:"rgba(99,102,241,.15)",border:"1px solid rgba(99,102,241,.3)",color:"#818cf8",cursor:"pointer",fontSize:16,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700}}>−</button>
                  <span style={{color:"#fff",fontWeight:700,minWidth:18,textAlign:"center",fontSize:13}}>{item.qty}</span>
                  <button onClick={()=>onUpdateQty(item.product.id,item.qty+1)} style={{width:26,height:26,borderRadius:7,background:"rgba(99,102,241,.15)",border:"1px solid rgba(99,102,241,.3)",color:"#818cf8",cursor:"pointer",fontSize:16,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700}}>+</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {!done && cart.length>0 && (
          <div style={{padding:"18px 24px 28px",borderTop:"1px solid rgba(255,255,255,.06)",flexShrink:0}}>
            {[["Subtotal",fmt(total)],["Shipping","Free 🚀"],["Savings",`−${fmt(cart.reduce((s,i)=>s+(i.product.mrp-i.product.price)*i.qty,0))}`]].map(([l,v])=>(
              <div key={l} style={{display:"flex",justifyContent:"space-between",marginBottom:10}}>
                <span style={{fontSize:13,color:"#64748b"}}>{l}</span>
                <span style={{fontSize:13,fontWeight:600,color:l==="Savings"?"#10b981":"#e2e8f0"}}>{v}</span>
              </div>
            ))}
            <div style={{display:"flex",justifyContent:"space-between",borderTop:"1px solid rgba(99,102,241,.2)",paddingTop:14,marginTop:6,marginBottom:18}}>
              <span className="syne" style={{fontSize:16,fontWeight:800,color:"#fff"}}>Total</span>
              <span className="syne" style={{fontSize:22,fontWeight:900,color:"#818cf8"}}>{fmt(total)}</span>
            </div>
            <button onClick={checkout} disabled={processing} className="btn-primary" style={{width:"100%",padding:"16px",fontSize:15,borderRadius:16,display:"flex",alignItems:"center",justifyContent:"center",gap:10}}>
              {processing
                ? <><span style={{width:18,height:18,border:"2px solid rgba(255,255,255,.3)",borderTopColor:"#fff",borderRadius:"50%",animation:"spin .7s linear infinite",display:"inline-block"}}/><span>Processing…</span></>
                : <span>⚡ Checkout — {fmt(total)}</span>}
            </button>
            <button onClick={onClear} style={{width:"100%",marginTop:10,background:"transparent",border:"none",color:"#475569",fontSize:13,cursor:"pointer",padding:"8px"}}>Clear all items</button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══ BUY NOW MODAL ═══ */
function BuyNowModal({ product, onClose, onSuccess }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({name:"",phone:"",email:"",address:"",city:"",pin:"",payment:"upi"});
  const [processing, setProcessing] = useState(false);
  const set = (k,v) => setForm(f=>({...f,[k]:v}));
  const iS = { width:"100%", background:"rgba(99,102,241,.07)", border:"1px solid rgba(99,102,241,.22)", borderRadius:12, padding:"12px 16px", fontSize:14, color:"#e2e8f0", marginBottom:12 };

  const placeOrder = async () => {
    setProcessing(true);
    await new Promise(r=>setTimeout(r,1800));
    setProcessing(false); setStep(3);
    setTimeout(()=>{onSuccess();onClose();}, 2500);
  };

  return (
    <div onClick={onClose} style={{position:"fixed",inset:0,zIndex:2000,background:"rgba(0,0,0,.82)",backdropFilter:"blur(12px)",display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
      <div onClick={e=>e.stopPropagation()} style={{
        background:"linear-gradient(145deg,#080c1a,#0f1428)",
        border:"1px solid rgba(99,102,241,.3)",
        borderRadius:24, width:540, maxWidth:"100%", maxHeight:"92vh",
        overflowY:"auto", padding:32,
        animation:"modalIn .48s cubic-bezier(.22,1,.36,1)",
        boxShadow:"0 32px 100px rgba(0,0,0,.8), 0 0 80px rgba(99,102,241,.15)"
      }}>
        {/* Header */}
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:24}}>
          <h2 className="syne" style={{fontSize:22,fontWeight:800,color:"#fff",margin:0}}>
            {step===1?"📦 Delivery Details":step===2?"💳 Payment":"✅ Order Confirmed!"}
          </h2>
          <button onClick={onClose} style={{width:36,height:36,background:"rgba(255,255,255,.06)",border:"1px solid rgba(255,255,255,.1)",borderRadius:"50%",color:"#94a3b8",cursor:"pointer",fontSize:18}}>×</button>
        </div>
        {/* Product summary */}
        <div style={{display:"flex",gap:14,background:"rgba(99,102,241,.08)",borderRadius:16,padding:14,marginBottom:24,border:"1px solid rgba(99,102,241,.18)"}}>
          <div style={{width:68,height:68,borderRadius:12,overflow:"hidden",flexShrink:0}}>
            <SafeImg src={product.imgs[0]} alt={product.name} style={{width:"100%",height:"100%",objectFit:"cover"}}/>
          </div>
          <div>
            <p style={{fontSize:14,fontWeight:700,color:"#e2e8f0",marginBottom:4}}>{product.name}</p>
            <p className="syne" style={{fontSize:20,fontWeight:900,color:"#818cf8",marginBottom:2}}>{fmt(product.price)}</p>
            <p style={{fontSize:11,color:"#10b981",fontWeight:600}}>Free delivery · 2-year warranty included</p>
          </div>
        </div>
        {/* Steps */}
        <div style={{display:"flex",alignItems:"center",gap:0,marginBottom:28}}>
          {[1,2,3].map((s,i)=>(
            <div key={s} style={{display:"flex",alignItems:"center",flex:s<3?1:"auto"}}>
              <div style={{width:34,height:34,borderRadius:"50%",background:step>=s?"linear-gradient(135deg,#6366f1,#8b5cf6)":"rgba(99,102,241,.12)",border:`2px solid ${step>=s?"#6366f1":"rgba(99,102,241,.18)"}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:800,color:step>=s?"#fff":"#4b5563",flexShrink:0,transition:"all .4s"}}>
                {step>s?"✓":s}
              </div>
              {s<3 && <div style={{flex:1,height:2,background:step>s?"linear-gradient(90deg,#6366f1,#8b5cf6)":"rgba(99,102,241,.12)",margin:"0 6px",borderRadius:1,transition:"all .6s"}}/>}
            </div>
          ))}
        </div>

        {step===1 && (
          <div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:0}}>
              <input placeholder="Full Name" value={form.name} onChange={e=>set("name",e.target.value)} style={{...iS,marginBottom:12}}/>
              <input placeholder="Phone Number" value={form.phone} onChange={e=>set("phone",e.target.value)} style={{...iS,marginBottom:12}}/>
            </div>
            <input placeholder="Email Address" value={form.email} onChange={e=>set("email",e.target.value)} style={iS}/>
            <textarea placeholder="Full Delivery Address" value={form.address} onChange={e=>set("address",e.target.value)} rows={3} style={{...iS,resize:"vertical"}}/>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
              <input placeholder="City" value={form.city} onChange={e=>set("city",e.target.value)} style={{...iS,marginBottom:0}}/>
              <input placeholder="PIN Code" value={form.pin} onChange={e=>set("pin",e.target.value)} style={{...iS,marginBottom:0}}/>
            </div>
            <button className="btn-primary" style={{width:"100%",padding:"15px",fontSize:15,marginTop:20,borderRadius:16}} onClick={()=>setStep(2)}>
              Continue to Payment →
            </button>
          </div>
        )}

        {step===2 && (
          <div>
            <p style={{fontSize:13,color:"#64748b",marginBottom:16}}>Choose how you'd like to pay:</p>
            {[["upi","📱 UPI / PhonePe / GPay","Instant · Zero charges"],["card","💳 Credit / Debit Card","Visa, Mastercard, RuPay"],["emi","🏦 No-Cost EMI","0% interest up to 12 months"],["cod","📦 Cash on Delivery","Pay when you receive"]].map(([v,l,s])=>(
              <div key={v} onClick={()=>set("payment",v)} style={{display:"flex",alignItems:"center",gap:14,padding:16,borderRadius:14,border:`2px solid ${form.payment===v?"#6366f1":"rgba(99,102,241,.14)"}`,background:form.payment===v?"rgba(99,102,241,.1)":"transparent",cursor:"pointer",marginBottom:10,transition:"all .22s"}}>
                <div style={{width:22,height:22,borderRadius:"50%",border:`2px solid ${form.payment===v?"#6366f1":"rgba(255,255,255,.2)"}`,background:form.payment===v?"#6366f1":"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                  {form.payment===v && <div style={{width:8,height:8,borderRadius:"50%",background:"#fff"}}/>}
                </div>
                <div>
                  <p style={{fontSize:14,fontWeight:700,color:"#e2e8f0",margin:0}}>{l}</p>
                  <p style={{fontSize:11,color:"#475569",margin:0}}>{s}</p>
                </div>
              </div>
            ))}
            <div style={{display:"flex",gap:10,marginTop:20}}>
              <button className="btn-outline" style={{flex:1,padding:"15px"}} onClick={()=>setStep(1)}>← Back</button>
              <button className="btn-primary" style={{flex:2,padding:"15px",fontSize:15,display:"flex",alignItems:"center",justifyContent:"center",gap:8}} onClick={placeOrder} disabled={processing}>
                {processing
                  ? <><span style={{width:18,height:18,border:"2px solid rgba(255,255,255,.3)",borderTopColor:"#fff",borderRadius:"50%",animation:"spin .7s linear infinite",display:"inline-block"}}/><span>Processing…</span></>
                  : <span>⚡ Pay {fmt(product.price)}</span>}
              </button>
            </div>
          </div>
        )}

        {step===3 && (
          <div style={{textAlign:"center",padding:"20px 0"}}>
            <div style={{fontSize:72,marginBottom:16,animation:"pulse 1s ease 3"}}>🎉</div>
            <h3 className="syne" style={{fontSize:26,fontWeight:900,color:"#10b981",marginBottom:10}}>Order Confirmed!</h3>
            <p style={{color:"#64748b",marginBottom:18,fontSize:14}}>Your <strong style={{color:"#818cf8"}}>{product.name}</strong> will arrive in 2–3 business days.</p>
            <div style={{background:"rgba(16,185,129,.08)",border:"1px solid rgba(16,185,129,.22)",borderRadius:14,padding:"12px 20px"}}>
              <p style={{color:"#10b981",fontWeight:700,fontSize:13}}>📦 Order #VX{Date.now().toString().slice(-7)} confirmed</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══ WISHLIST MODAL ═══ */
function WishlistModal({ wishlist, onClose, onView, onRemove, onCart, toast }) {
  const products = PRODUCTS.filter(p => wishlist.includes(p.id));
  return (
    <div onClick={onClose} style={{position:"fixed",inset:0,zIndex:2000,background:"rgba(0,0,0,.75)",backdropFilter:"blur(8px)",display:"flex",alignItems:"flex-start",justifyContent:"flex-end"}}>
      <div onClick={e=>e.stopPropagation()} className="slide-l" style={{width:420,height:"100vh",background:"#080c1a",borderLeft:"1px solid rgba(236,72,153,.2)",display:"flex",flexDirection:"column",overflow:"hidden",boxShadow:"-12px 0 80px rgba(0,0,0,.6)"}}>
        <div style={{padding:"22px 24px 18px",borderBottom:"1px solid rgba(255,255,255,.06)",display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0}}>
          <div>
            <h2 className="syne" style={{fontSize:20,fontWeight:800,color:"#fff",margin:0}}>❤️ Wishlist</h2>
            <p style={{fontSize:12,color:"#475569",margin:"3px 0 0"}}>{products.length} saved item{products.length!==1?"s":""}</p>
          </div>
          <button onClick={onClose} style={{width:36,height:36,background:"rgba(255,255,255,.05)",border:"1px solid rgba(255,255,255,.08)",borderRadius:"50%",color:"#94a3b8",fontSize:18,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>×</button>
        </div>
        <div style={{flex:1,overflowY:"auto",padding:"16px 24px"}}>
          {products.length===0 ? (
            <div style={{textAlign:"center",padding:"60px 0"}}>
              <div style={{fontSize:52,marginBottom:14,opacity:.3}}>🤍</div>
              <p style={{color:"#475569",fontSize:15,fontWeight:600}}>No saved items yet</p>
              <p style={{color:"#334155",fontSize:13,marginTop:6}}>Click the heart on any product to save it here.</p>
            </div>
          ) : products.map(p=>(
            <div key={p.id} style={{display:"flex",gap:14,padding:"14px 0",borderBottom:"1px solid rgba(255,255,255,.05)"}}>
              <div style={{width:76,height:76,borderRadius:14,overflow:"hidden",flexShrink:0,background:"#111827",cursor:"pointer"}} onClick={()=>{onView(p);onClose();}}>
                <SafeImg src={p.imgs?.[0]} alt={p.name} style={{width:"100%",height:"100%",objectFit:"cover"}}/>
              </div>
              <div style={{flex:1,minWidth:0}}>
                <p style={{fontSize:13,fontWeight:700,color:"#e2e8f0",margin:"0 0 2px",cursor:"pointer",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}} onClick={()=>{onView(p);onClose();}}>{p.name}</p>
                <p style={{fontSize:12,color:"#475569",margin:"0 0 6px",textTransform:"capitalize"}}>{p.brand}</p>
                <p className="syne" style={{fontSize:16,fontWeight:800,color:"#818cf8",marginBottom:8}}>{fmt(p.price)}</p>
                <div style={{display:"flex",gap:8}}>
                  <button onClick={()=>{onCart(p);toast(`${p.name.split(" ").slice(0,3).join(" ")} added to cart!`,"success");}} style={{flex:1,padding:"7px 10px",fontSize:11,fontWeight:700,borderRadius:9,border:"1px solid rgba(99,102,241,.3)",background:"rgba(99,102,241,.1)",color:"#818cf8",cursor:"pointer"}}>🛒 Add to Cart</button>
                  <button onClick={()=>onRemove(p.id)} style={{padding:"7px 10px",fontSize:11,fontWeight:700,borderRadius:9,border:"1px solid rgba(239,68,68,.2)",background:"rgba(239,68,68,.08)",color:"#f87171",cursor:"pointer"}}>✕</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══ NAVBAR ═══ */
function Navbar({ page, setPage, cartCount, wishlistCount, compareCount, onSearch, onCartOpen, onWishlistOpen }) {
  const [scrolled, setScrolled] = useState(false);
  const [q, setQ] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", h, {passive:true});
    return () => window.removeEventListener("scroll", h);
  }, []);

  const nav = k => { setPage(k); setMobileOpen(false); window.scrollTo({top:0,behavior:"smooth"}); };
  const links = [["home","Home"],["category","Shop"],["deals","🔥 Deals"],["brands","Brands"],["compare","Compare"],["contact","Contact"]];

  return (
    <nav style={{
      position:"fixed",top:0,left:0,right:0,zIndex:1000,
      background:scrolled?"rgba(4,6,15,.96)":"rgba(4,6,15,.5)",
      backdropFilter:"blur(28px)", transition:"all .35s ease",
      borderBottom:scrolled?"1px solid rgba(99,102,241,.15)":"1px solid transparent",
      boxShadow:scrolled?"0 4px 50px rgba(0,0,0,.5)":"none",
    }}>
      <div style={{maxWidth:1400,margin:"0 auto",padding:"0 24px",display:"flex",alignItems:"center",gap:14,height:66}}>
        <button onClick={()=>nav("home")} style={{background:"none",border:"none",cursor:"pointer",display:"flex",alignItems:"center",gap:9,flexShrink:0}}>
          <div style={{width:36,height:36,borderRadius:11,background:"linear-gradient(135deg,#6366f1,#8b5cf6)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,fontWeight:900,color:"#fff",boxShadow:"0 4px 20px rgba(99,102,241,.55)"}}>⚡</div>
          <span className="syne" style={{fontSize:22,fontWeight:900,letterSpacing:"-1px"}}>
            <span style={{color:"#818cf8"}}>Volt</span><span style={{color:"#fff"}}>X</span>
          </span>
        </button>

        <div className="hide-mobile" style={{display:"flex",gap:2,marginLeft:6}}>
          {links.map(([k,l])=>(
            <button key={k} onClick={()=>nav(k)} style={{background:page===k?"rgba(99,102,241,.15)":"transparent",color:page===k?"#818cf8":"#94a3b8",border:"none",borderRadius:10,padding:"7px 13px",fontSize:13,cursor:"pointer",fontWeight:page===k?700:500,transition:"all .18s",position:"relative"}}>
              {l}
              {k==="compare" && compareCount>0 && <span style={{position:"absolute",top:3,right:3,width:15,height:15,background:"#6366f1",borderRadius:"50%",fontSize:8,fontWeight:900,color:"#fff",display:"flex",alignItems:"center",justifyContent:"center"}}>{compareCount}</span>}
            </button>
          ))}
        </div>

        <div style={{flex:1,position:"relative",maxWidth:400}}>
          <span style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",color:"#4b5563",fontSize:14,pointerEvents:"none"}}>🔍</span>
          <input value={q} onChange={e=>{setQ(e.target.value);onSearch(e.target.value);}} onKeyDown={e=>e.key==="Enter"&&nav("category")} placeholder="Search products, brands…"
            style={{width:"100%",background:"rgba(99,102,241,.07)",border:"1px solid rgba(99,102,241,.16)",borderRadius:12,padding:"9px 36px 9px 36px",fontSize:13,color:"#e2e8f0",outline:"none",transition:"all .2s"}}/>
          {q && <button onClick={()=>{setQ("");onSearch("");}} style={{position:"absolute",right:10,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",color:"#4b5563",cursor:"pointer",fontSize:16}}>×</button>}
        </div>

        <button onClick={()=>nav("compare")} style={{position:"relative",background:"none",border:"none",color:"#94a3b8",cursor:"pointer",fontSize:20,padding:"7px 10px",transition:"color .2s"}} onMouseEnter={e=>e.currentTarget.style.color="#818cf8"} onMouseLeave={e=>e.currentTarget.style.color="#94a3b8"}>
          ⚖️
          {compareCount>0 && <span style={{position:"absolute",top:4,right:4,width:15,height:15,background:"#6366f1",borderRadius:"50%",fontSize:8,fontWeight:900,color:"#fff",display:"flex",alignItems:"center",justifyContent:"center"}}>{compareCount}</span>}
        </button>

        <button onClick={onWishlistOpen} style={{position:"relative",background:"none",border:"none",color:"#94a3b8",cursor:"pointer",fontSize:20,padding:"7px 10px",transition:"color .2s"}} onMouseEnter={e=>e.currentTarget.style.color="#ec4899"} onMouseLeave={e=>e.currentTarget.style.color="#94a3b8"}>
          {wishlistCount>0?"❤️":"🤍"}
          {wishlistCount>0 && <span style={{position:"absolute",top:4,right:4,width:15,height:15,background:"#ec4899",borderRadius:"50%",fontSize:8,fontWeight:900,color:"#fff",display:"flex",alignItems:"center",justifyContent:"center"}}>{wishlistCount}</span>}
        </button>

        <button onClick={onCartOpen} style={{position:"relative",background:"none",border:"none",color:"#94a3b8",cursor:"pointer",fontSize:20,padding:"7px 10px",transition:"color .2s"}} onMouseEnter={e=>e.currentTarget.style.color="#818cf8"} onMouseLeave={e=>e.currentTarget.style.color="#94a3b8"}>
          🛒
          {cartCount>0 && <span style={{position:"absolute",top:4,right:4,width:17,height:17,background:"linear-gradient(135deg,#ef4444,#f97316)",borderRadius:"50%",fontSize:9,fontWeight:900,color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",animation:"cartBounce .4s ease"}}>{cartCount}</span>}
        </button>

        <button onClick={()=>setMobileOpen(!mobileOpen)} style={{background:"none",border:"none",color:"#fff",fontSize:22,cursor:"pointer",display:"none"}} className="hide-desktop">☰</button>
      </div>
      {mobileOpen && (
        <div className="slide-d glass" style={{borderTop:"1px solid rgba(99,102,241,.15)",padding:"14px 22px"}}>
          {links.map(([k,l])=>(
            <button key={k} onClick={()=>nav(k)} style={{display:"block",width:"100%",textAlign:"left",padding:"11px 12px",background:"none",border:"none",color:page===k?"#818cf8":"#94a3b8",fontSize:14,fontWeight:page===k?700:500,cursor:"pointer",borderRadius:9}}>{l}</button>
          ))}
        </div>
      )}
    </nav>
  );
}

/* ═══ PRODUCT CARD ═══ */
function ProductCard({ product, onView, onCompare, onCart, onBuyNow, wishlist, onWishlist, compareList, toast, loading }) {
  const [addAnim, setAddAnim] = useState(false);
  const [heartAnim, setHeartAnim] = useState(false);

  if (loading) return (
    <div style={{background:"#0d1428",borderRadius:20,overflow:"hidden",border:"1px solid rgba(99,102,241,.1)"}}>
      <div className="skeleton" style={{height:200}}/>
      <div style={{padding:16}}>
        <div className="skeleton" style={{height:10,marginBottom:8,width:"60%"}}/>
        <div className="skeleton" style={{height:14,marginBottom:10}}/>
        <div className="skeleton" style={{height:20,width:"50%",marginBottom:12}}/>
        <div className="skeleton" style={{height:38}}/>
      </div>
    </div>
  );
  if (!product) return null;

  const inCmp = (compareList||[]).includes(product.id);
  const wished = (wishlist||[]).includes(product.id);
  const d = disc(product.price, product.mrp);

  const handleCart = e => {
    e.stopPropagation();
    setAddAnim(true);
    onCart(product);
    toast(`${product.name.split(" ").slice(0,3).join(" ")} added to cart 🛒`, "success");
    setTimeout(()=>setAddAnim(false), 600);
  };

  const handleHeart = e => {
    e.stopPropagation();
    setHeartAnim(true);
    onWishlist(product.id);
    toast(wished ? "Removed from wishlist" : "Saved to wishlist ❤️", wished?"info":"success");
    setTimeout(()=>setHeartAnim(false), 500);
  };

  return (
    <div className="card-hover glass-card" onClick={()=>onView(product)} style={{borderRadius:20,overflow:"hidden",display:"flex",flexDirection:"column",cursor:"pointer"}}>
      <div className="img-zoom" style={{position:"relative",height:200,background:"linear-gradient(135deg,#0a0e1e,#111730)",flexShrink:0}}>
        <SafeImg src={product.imgs?.[0]} alt={product.name} style={{width:"100%",height:"100%",objectFit:"cover"}}/>
        <div style={{position:"absolute",bottom:0,left:0,right:0,height:70,background:"linear-gradient(to top, rgba(8,12,26,.85), transparent)",pointerEvents:"none"}}/>
        {product.badge && <span className="badge" style={{position:"absolute",top:11,left:11,background:BADGE_COLORS[product.badge]||"#475569"}}>{product.badge}</span>}
        {d>0 && <span style={{position:"absolute",top:11,right:44,background:"rgba(16,185,129,.15)",border:"1px solid rgba(16,185,129,.3)",color:"#4ade80",fontSize:10,fontWeight:800,padding:"2px 7px",borderRadius:6}}>{d}%</span>}
        <button onClick={handleHeart} style={{position:"absolute",top:10,right:10,width:32,height:32,background:"rgba(0,0,0,.55)",backdropFilter:"blur(10px)",border:`1.5px solid ${wished?"rgba(236,72,153,.5)":"rgba(255,255,255,.12)"}`,borderRadius:"50%",color:wished?"#f472b6":"#94a3b8",cursor:"pointer",fontSize:15,display:"flex",alignItems:"center",justifyContent:"center",transition:"all .22s",animation:heartAnim?"heartPop .4s ease":"none"}}>
          {wished?"❤️":"🤍"}
        </button>
        <div style={{position:"absolute",bottom:10,right:10,background:"rgba(0,0,0,.6)",backdropFilter:"blur(8px)",borderRadius:7,padding:"2px 8px"}}>
          <Stars rating={product.rating}/>
        </div>
      </div>

      <div style={{padding:"14px 16px",flex:1,display:"flex",flexDirection:"column"}}>
        <p style={{fontSize:10,color:"#5b6baa",textTransform:"uppercase",fontWeight:700,letterSpacing:".08em",margin:"0 0 5px"}}>{product.brand}</p>
        <h3 className="syne" style={{fontSize:14,fontWeight:700,color:"#e2e8f0",margin:"0 0 8px",lineHeight:1.4,flex:1}}>{product.name}</h3>
        <div style={{display:"flex",alignItems:"baseline",gap:8,marginBottom:4}}>
          <span className="syne" style={{fontSize:18,fontWeight:800,color:"#818cf8"}}>{fmt(product.price)}</span>
          <span style={{fontSize:12,color:"#2d3a55",textDecoration:"line-through"}}>{fmt(product.mrp)}</span>
        </div>
        <span style={{fontSize:11,fontWeight:700,color:"#10b981",marginBottom:12}}>Save {fmt(product.mrp-product.price)}</span>
      </div>

      <div style={{padding:"0 14px 14px",display:"flex",gap:7}}>
        <button onClick={handleCart} className="btn-primary" style={{flex:1,padding:"9px 8px",fontSize:12,borderRadius:11,boxShadow:"none",transform:addAnim?"scale(.93)":"scale(1)",transition:"transform .15s",display:"flex",alignItems:"center",justifyContent:"center",gap:5}}>
          <span>{addAnim?"✓":"🛒"}</span><span>{addAnim?"Added":"Cart"}</span>
        </button>
        <button onClick={e=>{e.stopPropagation();onBuyNow(product);}} className="btn-danger" style={{flex:1,padding:"9px 8px",fontSize:12,borderRadius:11,boxShadow:"none"}}>⚡ Buy</button>
        <button onClick={e=>{e.stopPropagation();onCompare(product.id);toast(inCmp?"Removed from compare":"Added to compare ⚖️","info");}} style={{width:34,height:34,background:inCmp?"rgba(99,102,241,.2)":"rgba(255,255,255,.04)",border:`1px solid ${inCmp?"rgba(99,102,241,.5)":"rgba(255,255,255,.07)"}`,borderRadius:10,color:inCmp?"#818cf8":"#475569",cursor:"pointer",fontSize:14,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,transition:"all .2s"}}>⚖️</button>
      </div>
    </div>
  );
}

/* ═══ HERO BANNER ═══ */
function HeroBanner({ setPage, onCart, toast }) {
  const [active, setActive] = useState(0);
  const slides = [
    {title:"iPhone 15 Pro Max",sub:"Titanium. So strong. So light. So Pro.",price:"From ₹1,59,900",badge:"New Arrival",accent:"#818cf8",accent2:"#a78bfa",img:IMGS.iphone[0],pid:1},
    {title:"PlayStation 5",sub:"Play has no limits. Enter the next generation.",price:"From ₹54,990",badge:"Next-Gen Gaming",accent:"#60a5fa",accent2:"#3b82f6",img:IMGS.ps5[0],pid:28},
    {title:"MacBook Pro M3",sub:"Supercharged for professionals everywhere.",price:"From ₹1,99,900",badge:"Editor's Pick",accent:"#34d399",accent2:"#10b981",img:IMGS.mac[0],pid:13},
    {title:"Sony WH-1000XM5",sub:"The benchmark for noise cancellation.",price:"From ₹26,990",badge:"Best Seller",accent:"#f472b6",accent2:"#ec4899",img:IMGS.xm5[0],pid:8},
  ];
  useEffect(()=>{const t=setInterval(()=>setActive(a=>(a+1)%slides.length),5500);return()=>clearInterval(t);},[]);
  const s = slides[active];
  const product = PRODUCTS.find(p=>p.id===s.pid);

  return (
    <div style={{
      borderRadius:28,overflow:"hidden",position:"relative",minHeight:460,
      display:"flex",alignItems:"center",
      background:`linear-gradient(135deg,#04060f 0%,#0a0c1e 50%,#060810 100%)`,
      border:"1px solid rgba(99,102,241,.15)",
      boxShadow:`0 0 120px rgba(99,102,241,.08), 0 30px 100px rgba(0,0,0,.7)`,
    }}>
      {/* Animated radial bg */}
      <div style={{position:"absolute",inset:0,background:`radial-gradient(ellipse 700px 500px at 72% 50%, ${s.accent}18 0%, transparent 65%),radial-gradient(ellipse 400px 300px at 20% 80%, ${s.accent2}10 0%, transparent 60%)`,transition:"background 1.2s ease",pointerEvents:"none"}}/>
      {/* Grid */}
      <div style={{position:"absolute",inset:0,backgroundImage:`linear-gradient(${s.accent}07 1px, transparent 1px),linear-gradient(90deg,${s.accent}07 1px, transparent 1px)`,backgroundSize:"52px 52px",pointerEvents:"none"}}/>
      {/* Glow blob */}
      <div style={{position:"absolute",right:"26%",top:"15%",width:280,height:280,borderRadius:"50%",background:`radial-gradient(circle,${s.accent}16,transparent 70%)`,filter:"blur(40px)",animation:"floatSlow 5s ease-in-out infinite",pointerEvents:"none"}}/>

      <div className="hero-wrap" style={{display:"flex",alignItems:"center",position:"relative",zIndex:2,minHeight:460,width:"100%"}}>
        <div style={{flex:1,padding:"56px 60px"}}>
          <div style={{display:"inline-flex",alignItems:"center",gap:7,background:`${s.accent}14`,color:s.accent,border:`1px solid ${s.accent}30`,fontSize:10,fontWeight:800,letterSpacing:".12em",textTransform:"uppercase",padding:"6px 14px",borderRadius:20,marginBottom:20}}>
            <span style={{width:6,height:6,borderRadius:"50%",background:s.accent,animation:"pulse 1.5s ease-in-out infinite"}}/>
            {s.badge}
          </div>
          <h1 className="syne" style={{fontSize:"clamp(30px,4.5vw,56px)",fontWeight:900,color:"#fff",margin:"0 0 12px",lineHeight:1.06,letterSpacing:"-1.5px"}}>
            {s.title}
          </h1>
          <p style={{fontSize:16,color:"#64748b",margin:"0 0 10px",maxWidth:440,lineHeight:1.6}}>{s.sub}</p>
          <p className="syne neon" style={{fontSize:28,fontWeight:900,color:s.accent,margin:"0 0 36px"}}>{s.price}</p>
          <div style={{display:"flex",gap:14,flexWrap:"wrap"}}>
            <button onClick={()=>setPage("category")} className="btn-primary" style={{background:`linear-gradient(135deg,${s.accent},${s.accent2})`,boxShadow:`0 8px 28px ${s.accent}50`,fontSize:15,padding:"14px 32px"}}>
              Shop Now →
            </button>
            <button onClick={()=>{if(product){onCart(product);toast(`${product.name.split(" ").slice(0,3).join(" ")} added to cart! ⚡`,"success");}}} className="btn-ghost" style={{fontSize:15,padding:"14px 28px"}}>⚡ Quick Add</button>
          </div>
        </div>
        <div className="hide-mobile" style={{width:420,height:420,flexShrink:0,position:"relative",display:"flex",alignItems:"center",justifyContent:"center"}}>
          {[["orbitA","10px",s.accent,"5.5s"],["orbitB","7px",s.accent+"cc","4.2s"],["orbitC","5px",s.accent+"88","5s"]].map(([anim,sz,c,dur],i)=>(
            <div key={i} style={{position:"absolute",width:sz,height:sz,borderRadius:"50%",background:c,animation:`${anim} ${dur} linear infinite`,boxShadow:`0 0 14px ${c}`}}/>
          ))}
          {[210,165,128].map((d,i)=>(
            <div key={i} style={{position:"absolute",width:d,height:d,borderRadius:"50%",border:`1px solid ${s.accent}${["22","17","0e"][i]}`,pointerEvents:"none"}}/>
          ))}
          <div key={active} style={{width:245,height:245,borderRadius:34,overflow:"hidden",animation:"fadeIn .5s ease both, float 4.8s ease-in-out 0.5s infinite",boxShadow:`0 40px 110px rgba(0,0,0,.7),0 0 90px ${s.accent}30`,position:"relative",zIndex:2,border:`1px solid ${s.accent}28`}}>
            <SafeImg src={s.img} alt={s.title} style={{width:"100%",height:"100%",objectFit:"cover"}}/>
            <div style={{position:"absolute",inset:0,background:`linear-gradient(135deg,${s.accent}18,transparent)`}}/>
          </div>
        </div>
      </div>
      <div style={{position:"absolute",bottom:24,left:60,display:"flex",gap:8}}>
        {slides.map((_,i)=>(
          <button key={i} onClick={()=>setActive(i)} style={{width:i===active?34:8,height:8,borderRadius:4,border:"none",background:i===active?s.accent:"rgba(255,255,255,.14)",cursor:"pointer",padding:0,transition:"all .38s cubic-bezier(.22,1,.36,1)",boxShadow:i===active?`0 0 14px ${s.accent}`:"none"}}/>
        ))}
      </div>
    </div>
  );
}

/* ═══ FLASH CARD ═══ */
function FlashCard({ deal, product, dealPrice, onView, onCart, onBuyNow, toast }) {
  const timer = useCountdown(deal.endsIn);
  return (
    <div className="card-hover glass-card" onClick={()=>onView(product)} style={{borderRadius:20,overflow:"hidden",cursor:"pointer",border:"1px solid rgba(239,68,68,.2)"}}>
      <div className="img-zoom" style={{height:190,overflow:"hidden",background:"linear-gradient(135deg,#150608,#280a0a)",position:"relative"}}>
        <SafeImg src={product.imgs[0]} alt={product.name} style={{width:"100%",height:"100%",objectFit:"cover"}}/>
        <div style={{position:"absolute",inset:0,background:"linear-gradient(to top,rgba(8,10,20,.65),transparent)"}}/>
        <div style={{position:"absolute",top:12,left:12,background:"linear-gradient(135deg,#dc2626,#f97316)",color:"#fff",padding:"5px 13px",borderRadius:20,fontSize:11,fontWeight:800,boxShadow:"0 4px 16px rgba(220,38,38,.5)"}}>
          Extra {fmt(deal.extraOff)} Off
        </div>
      </div>
      <div style={{padding:"16px 18px"}}>
        <p className="syne" style={{fontSize:14,fontWeight:700,color:"#e2e8f0",marginBottom:8}}>{product.name}</p>
        <div style={{display:"flex",alignItems:"baseline",gap:8,marginBottom:12}}>
          <span className="syne" style={{fontSize:20,fontWeight:900,color:"#f87171"}}>{fmt(dealPrice)}</span>
          <span style={{fontSize:12,color:"#2d3a55",textDecoration:"line-through"}}>{fmt(product.mrp)}</span>
          <span style={{fontSize:11,fontWeight:800,color:"#4ade80"}}>{disc(dealPrice,product.mrp)}% off</span>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14}}>
          <span style={{fontSize:11,color:"#4b5563"}}>Ends in:</span>
          <span style={{background:"#040608",color:"#fbbf24",padding:"3px 12px",borderRadius:7,fontSize:12,fontWeight:800,fontFamily:"monospace",letterSpacing:".1em",border:"1px solid rgba(251,191,36,.2)",animation:"pulse 1.5s ease-in-out infinite"}}>{timer}</span>
        </div>
        <div style={{display:"flex",gap:8}}>
          <button onClick={e=>{e.stopPropagation();onCart(product);toast&&toast("Added to cart 🛒","success");}} style={{flex:1,padding:"9px",fontSize:12,fontWeight:700,borderRadius:11,border:"1px solid rgba(99,102,241,.3)",background:"rgba(99,102,241,.1)",color:"#818cf8",cursor:"pointer"}}>🛒 Cart</button>
          <button onClick={e=>{e.stopPropagation();onBuyNow(product);}} className="btn-danger" style={{flex:1,padding:"9px",fontSize:12,borderRadius:11,boxShadow:"none"}}>⚡ Buy Now</button>
        </div>
      </div>
    </div>
  );
}

/* ═══ HOME PAGE ═══ */
function HomePage({ setPage, onView, compareList, onCompare, onCart, onBuyNow, wishlist, onWishlist, toast }) {
  const [loading, setLoading] = useState(true);
  useEffect(()=>{const t=setTimeout(()=>setLoading(false),900);return()=>clearTimeout(t);},[]);
  const sharedCard = {onView,onCompare,onCart,onBuyNow,wishlist,onWishlist,compareList,toast};

  return (
    <div style={{display:"flex",flexDirection:"column",gap:64}}>
      <HeroBanner setPage={setPage} onCart={onCart} toast={toast}/>

      {/* Stats */}
      <Reveal>
        <div className="stats-grid" style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14}}>
          {[["50K+","Happy Customers","👥","#6366f1"],["120+","Premium Brands","🏷️","#8b5cf6"],["24/7","Customer Support","🕐","#10b981"],["2-Year","Warranty","🛡️","#f59e0b"]].map(([v,l,icon,c])=>(
            <div key={l} className="glass-card" style={{borderRadius:18,padding:"22px",display:"flex",alignItems:"center",gap:16}}>
              <div style={{width:48,height:48,borderRadius:14,background:`${c}16`,border:`1px solid ${c}28`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}}>{icon}</div>
              <div>
                <p className="syne" style={{fontSize:24,fontWeight:900,color:"#f1f5f9",margin:0,lineHeight:1}}>{v}</p>
                <p style={{fontSize:12,color:"#475569",margin:"4px 0 0"}}>{l}</p>
              </div>
            </div>
          ))}
        </div>
      </Reveal>

      {/* Categories */}
      <Reveal delay={80}>
        <SectionTitle accent="#6366f1">Shop by Category</SectionTitle>
        <div className="cat-grid" style={{display:"grid",gridTemplateColumns:"repeat(8,1fr)",gap:12}}>
          {CATEGORIES.map(cat=>(
            <button key={cat.id} onClick={()=>setPage("category")} style={{background:"rgba(255,255,255,.025)",border:"1px solid rgba(255,255,255,.06)",borderRadius:18,padding:"20px 8px",cursor:"pointer",textAlign:"center",display:"flex",flexDirection:"column",alignItems:"center",gap:10,transition:"all .28s cubic-bezier(.22,1,.36,1)",outline:"none"}}
              onMouseEnter={e=>{e.currentTarget.style.background=cat.color+"13";e.currentTarget.style.borderColor=cat.color+"44";e.currentTarget.style.transform="translateY(-6px)";e.currentTarget.style.boxShadow=`0 14px 36px ${cat.color}22`;}}
              onMouseLeave={e=>{e.currentTarget.style.background="rgba(255,255,255,.025)";e.currentTarget.style.borderColor="rgba(255,255,255,.06)";e.currentTarget.style.transform="";e.currentTarget.style.boxShadow="";}}>
              <span style={{fontSize:28}}>{cat.icon}</span>
              <span style={{fontSize:10,fontWeight:600,color:"#64748b",lineHeight:1.3}}>{cat.name}</span>
            </button>
          ))}
        </div>
      </Reveal>

      {/* Flash Deals */}
      <Reveal delay={100}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:24}}>
          <SectionTitle accent="#ef4444">⚡ Flash Deals</SectionTitle>
          <button onClick={()=>setPage("deals")} style={{background:"none",border:"none",color:"#6366f1",fontWeight:700,cursor:"pointer",fontSize:13}}>View All →</button>
        </div>
        <div className="deal-grid" style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:18}}>
          {DEALS.map(deal=>{
            const p = PRODUCTS.find(x=>x.id===deal.productId);
            return <FlashCard key={deal.id} deal={deal} product={p} dealPrice={p.price-deal.extraOff} onView={onView} onCart={onCart} onBuyNow={onBuyNow} toast={toast}/>;
          })}
        </div>
      </Reveal>

      {/* Featured */}
      <Reveal delay={120}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:24}}>
          <SectionTitle accent="#8b5cf6">🌟 Featured Products</SectionTitle>
          <button onClick={()=>setPage("category")} style={{background:"none",border:"none",color:"#6366f1",fontWeight:700,cursor:"pointer",fontSize:13}}>Browse All →</button>
        </div>
        <div className="product-grid" style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:18}}>
          {(loading?Array(8).fill(null):PRODUCTS.slice(0,8)).map((p,i)=>(
            <div key={i} className="fade-up" style={{animationDelay:`${i*55}ms`}}>
              <ProductCard product={p} loading={!p} {...sharedCard}/>
            </div>
          ))}
        </div>
      </Reveal>

      {/* Phones showcase */}
      <Reveal delay={80}>
        <SectionTitle accent="#6366f1">📱 Top Smartphones</SectionTitle>
        <div className="product-grid" style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:18}}>
          {PRODUCTS.filter(p=>p.cat==="phones").map((p,i)=>(
            <div key={p.id} className="fade-up" style={{animationDelay:`${i*50}ms`}}>
              <ProductCard product={p} {...sharedCard}/>
            </div>
          ))}
        </div>
      </Reveal>

      {/* Audio */}
      <Reveal delay={60}>
        <SectionTitle accent="#f59e0b">🎧 Premium Audio</SectionTitle>
        <div className="product-grid" style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:18}}>
          {PRODUCTS.filter(p=>p.cat==="audio").map((p,i)=>(
            <div key={p.id} className="fade-up" style={{animationDelay:`${i*50}ms`}}>
              <ProductCard product={p} {...sharedCard}/>
            </div>
          ))}
        </div>
      </Reveal>

      {/* Wearables */}
      <Reveal delay={60}>
        <SectionTitle accent="#a855f7">⌚ Smartwatches</SectionTitle>
        <div className="product-grid" style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:18}}>
          {PRODUCTS.filter(p=>p.cat==="wearables").map((p,i)=>(
            <div key={p.id} className="fade-up" style={{animationDelay:`${i*50}ms`}}>
              <ProductCard product={p} {...sharedCard}/>
            </div>
          ))}
        </div>
      </Reveal>

      {/* Gaming */}
      <Reveal delay={60}>
        <SectionTitle accent="#ef4444">🎮 Gaming Corner</SectionTitle>
        <div className="product-grid" style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:18}}>
          {PRODUCTS.filter(p=>p.cat==="gaming").map((p,i)=>(
            <div key={p.id} className="fade-up" style={{animationDelay:`${i*50}ms`}}>
              <ProductCard product={p} {...sharedCard}/>
            </div>
          ))}
        </div>
      </Reveal>

      {/* Cameras */}
      <Reveal delay={60}>
        <SectionTitle accent="#ec4899">📷 Cameras & Drones</SectionTitle>
        <div className="product-grid" style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:18}}>
          {PRODUCTS.filter(p=>p.cat==="cameras").slice(0,4).map((p,i)=>(
            <div key={p.id} className="fade-up" style={{animationDelay:`${i*50}ms`}}>
              <ProductCard product={p} {...sharedCard}/>
            </div>
          ))}
        </div>
      </Reveal>

      {/* Brands */}
      <Reveal delay={80}>
        <SectionTitle accent="#f59e0b">🏆 Top Brands</SectionTitle>
        <div className="scrollbar-hide" style={{display:"flex",gap:14,overflowX:"auto",paddingBottom:4}}>
          {BRANDS.map(b=>(
            <button key={b.id} onClick={()=>setPage("brands")} style={{flexShrink:0,background:"rgba(255,255,255,.025)",border:"1px solid rgba(255,255,255,.07)",borderRadius:16,padding:"16px 22px",display:"flex",alignItems:"center",gap:12,cursor:"pointer",transition:"all .25s",minWidth:160,outline:"none"}}
              onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-4px)";e.currentTarget.style.borderColor="rgba(99,102,241,.4)";e.currentTarget.style.background="rgba(99,102,241,.07)";}}
              onMouseLeave={e=>{e.currentTarget.style.transform="";e.currentTarget.style.borderColor="rgba(255,255,255,.07)";e.currentTarget.style.background="rgba(255,255,255,.025)";}}>
              <span style={{fontSize:24}}>{b.logo}</span>
              <div style={{textAlign:"left"}}>
                <p className="syne" style={{fontSize:14,fontWeight:700,color:"#e2e8f0",margin:0}}>{b.name}</p>
                <p style={{fontSize:10,color:"#2d3a55",margin:0}}>{PRODUCTS.filter(p=>p.brand===b.id).length} products</p>
              </div>
            </button>
          ))}
        </div>
      </Reveal>

      {/* Trust banner */}
      <Reveal>
        <div style={{borderRadius:24,padding:"44px 56px",position:"relative",overflow:"hidden",background:"linear-gradient(135deg,#060a1e 0%,#0e1838 50%,#060a1e 100%)",border:"1px solid rgba(99,102,241,.2)",display:"flex",alignItems:"center",justifyContent:"space-between",gap:24,flexWrap:"wrap",boxShadow:"0 0 80px rgba(99,102,241,.08)"}}>
          <div style={{position:"absolute",inset:0,backgroundImage:"radial-gradient(ellipse 60% 80% at 80% 50%, rgba(99,102,241,.1) 0%, transparent 60%)",pointerEvents:"none"}}/>
          <div style={{position:"relative",zIndex:1}}>
            <p style={{fontSize:10,color:"#818cf8",fontWeight:800,textTransform:"uppercase",letterSpacing:".12em",margin:"0 0 10px"}}>VoltX Protection Plan</p>
            <h3 className="syne" style={{fontSize:28,fontWeight:900,color:"#fff",margin:"0 0 8px"}}>2-Year Warranty on Every Purchase</h3>
            <p style={{fontSize:14,color:"#475569",margin:0}}>Free repair, replacement & 24/7 support — India's most trusted warranty.</p>
          </div>
          <button className="btn-primary" style={{flexShrink:0,position:"relative",zIndex:1,padding:"15px 36px",fontSize:15}}>Learn More →</button>
        </div>
      </Reveal>
    </div>
  );
}

/* ═══ CATEGORY PAGE ═══ */
function CategoryPage({ onView, compareList, onCompare, onCart, onBuyNow, wishlist, onWishlist, searchQuery, toast }) {
  const [filters, setFilters] = useState({cat:"all",brand:"all",maxPrice:300000,minRating:0,sort:"popular"});
  const set = (k,v) => setFilters(f=>({...f,[k]:v}));
  const F = filters;

  let list = PRODUCTS
    .filter(p=>F.cat==="all"||p.cat===F.cat)
    .filter(p=>F.brand==="all"||p.brand===F.brand)
    .filter(p=>p.price<=F.maxPrice)
    .filter(p=>p.rating>=F.minRating)
    .filter(p=>!searchQuery||p.name.toLowerCase().includes(searchQuery.toLowerCase())||p.brand.toLowerCase().includes(searchQuery.toLowerCase()));

  if(F.sort==="price-asc")  list=[...list].sort((a,b)=>a.price-b.price);
  if(F.sort==="price-desc") list=[...list].sort((a,b)=>b.price-a.price);
  if(F.sort==="rating")     list=[...list].sort((a,b)=>b.rating-a.rating);
  if(F.sort==="discount")   list=[...list].sort((a,b)=>disc(b.price,b.mrp)-disc(a.price,a.mrp));

  const SB = ({active,onClick,children})=>(
    <button onClick={onClick} style={{display:"block",width:"100%",textAlign:"left",padding:"8px 10px",borderRadius:9,border:"none",background:active?"rgba(99,102,241,.14)":"transparent",color:active?"#818cf8":"#64748b",fontWeight:active?700:500,fontSize:13,cursor:"pointer",marginBottom:3,transition:"all .15s"}}>{children}</button>
  );

  return (
    <div style={{display:"flex",gap:28,alignItems:"flex-start"}}>
      <div className="sidebar" style={{width:228,flexShrink:0,position:"sticky",top:80}}>
        <div className="glass-card" style={{borderRadius:18,padding:20}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:18}}>
            <h3 className="syne" style={{fontSize:15,fontWeight:800,color:"#f1f5f9",margin:0}}>🎛️ Filters</h3>
            <button onClick={()=>setFilters({cat:"all",brand:"all",maxPrice:300000,minRating:0,sort:"popular"})} style={{fontSize:11,color:"#f87171",fontWeight:700,background:"none",border:"none",cursor:"pointer"}}>Reset</button>
          </div>
          <p style={{fontSize:10,fontWeight:700,color:"#2d3a55",textTransform:"uppercase",letterSpacing:".07em",margin:"0 0 8px"}}>Category</p>
          <SB active={F.cat==="all"} onClick={()=>set("cat","all")}>🛍️ All Products</SB>
          {CATEGORIES.map(c=><SB key={c.id} active={F.cat===c.id} onClick={()=>set("cat",c.id)}>{c.icon} {c.name}</SB>)}
          <div style={{borderTop:"1px solid rgba(255,255,255,.05)",margin:"14px 0"}}/>
          <p style={{fontSize:10,fontWeight:700,color:"#2d3a55",textTransform:"uppercase",letterSpacing:".07em",margin:"0 0 8px"}}>Brand</p>
          <SB active={F.brand==="all"} onClick={()=>set("brand","all")}>All Brands</SB>
          {BRANDS.slice(0,10).map(b=><SB key={b.id} active={F.brand===b.id} onClick={()=>set("brand",b.id)}>{b.logo} {b.name}</SB>)}
          <div style={{borderTop:"1px solid rgba(255,255,255,.05)",margin:"14px 0"}}/>
          <p style={{fontSize:10,fontWeight:700,color:"#2d3a55",textTransform:"uppercase",letterSpacing:".07em",margin:"0 0 10px"}}>Max Price: <span style={{color:"#818cf8",fontWeight:800}}>{fmt(F.maxPrice)}</span></p>
          <input type="range" min={5000} max={300000} step={5000} value={F.maxPrice} onChange={e=>set("maxPrice",+e.target.value)} style={{width:"100%",accentColor:"#6366f1"}}/>
          <div style={{borderTop:"1px solid rgba(255,255,255,.05)",margin:"14px 0"}}/>
          <p style={{fontSize:10,fontWeight:700,color:"#2d3a55",textTransform:"uppercase",letterSpacing:".07em",margin:"0 0 8px"}}>Min Rating</p>
          {[[0,"All Ratings"],[4,"4★ & above"],[4.5,"4.5★ & above"],[4.8,"4.8★ & above"]].map(([r,l])=>(
            <SB key={r} active={F.minRating===r} onClick={()=>set("minRating",r)}>{l}</SB>
          ))}
        </div>
      </div>
      <div style={{flex:1}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:18,background:"rgba(255,255,255,.025)",borderRadius:12,padding:"12px 18px",border:"1px solid rgba(255,255,255,.06)"}}>
          <p style={{fontSize:14,color:"#475569",margin:0}}><strong style={{color:"#e2e8f0"}}>{list.length}</strong> products {searchQuery&&<span>for "<strong style={{color:"#818cf8"}}>{searchQuery}</strong>"</span>}</p>
          <select value={F.sort} onChange={e=>set("sort",e.target.value)} style={{border:"1px solid rgba(99,102,241,.22)",borderRadius:9,padding:"7px 14px",fontSize:13,color:"#e2e8f0",background:"#0d1428",cursor:"pointer"}}>
            <option value="popular">Popularity</option>
            <option value="price-asc">Price: Low → High</option>
            <option value="price-desc">Price: High → Low</option>
            <option value="rating">Top Rated</option>
            <option value="discount">Best Discount</option>
          </select>
        </div>
        {list.length===0 ? (
          <div style={{textAlign:"center",padding:"80px 0"}}>
            <p style={{fontSize:50,marginBottom:14,opacity:.3}}>🔍</p>
            <p className="syne" style={{fontSize:18,fontWeight:700,color:"#334155",marginBottom:8}}>No products found</p>
            <p style={{fontSize:14,color:"#1e293b"}}>Try adjusting your filters</p>
          </div>
        ) : (
          <div className="product-grid" style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:18}}>
            {list.map((p,i)=>(
              <div key={p.id} className="fade-up" style={{animationDelay:`${i*35}ms`}}>
                <ProductCard product={p} onView={onView} onCompare={onCompare} onCart={onCart} onBuyNow={onBuyNow} wishlist={wishlist} onWishlist={onWishlist} compareList={compareList} toast={toast}/>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══ PRODUCT DETAIL ═══ */
function ProductDetail({ product, onBack, onCompare, onCart, onBuyNow, wishlist, onWishlist, compareList, toast }) {
  const [activeImg, setActiveImg] = useState(0);
  const [cartDone, setCartDone] = useState(false);
  const related = PRODUCTS.filter(p=>p.cat===product.cat&&p.id!==product.id).slice(0,4);
  const inCmp = compareList.includes(product.id);
  const wished = wishlist.includes(product.id);

  const handleCart = () => {
    setCartDone(true); onCart(product);
    toast("Added to cart 🛒","success");
    setTimeout(()=>setCartDone(false),2500);
  };

  return (
    <div className="fade-in">
      <button onClick={onBack} style={{background:"rgba(99,102,241,.07)",border:"1px solid rgba(99,102,241,.2)",color:"#818cf8",cursor:"pointer",fontSize:13,fontWeight:700,marginBottom:28,display:"flex",alignItems:"center",gap:8,padding:"9px 18px",borderRadius:11,transition:"all .2s"}} onMouseEnter={e=>e.currentTarget.style.background="rgba(99,102,241,.14)"} onMouseLeave={e=>e.currentTarget.style.background="rgba(99,102,241,.07)"}>← Back</button>
      <div className="detail-grid" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:48,marginBottom:56}}>
        <div>
          <div className="img-zoom" style={{background:"linear-gradient(135deg,#080c1a,#0f1428)",borderRadius:24,overflow:"hidden",height:430,marginBottom:14,border:"1px solid rgba(99,102,241,.18)",position:"relative"}}>
            <SafeImg src={product.imgs[activeImg]} alt={product.name} style={{width:"100%",height:"100%",objectFit:"cover"}}/>
            {product.badge && <span className="badge" style={{position:"absolute",top:16,left:16,background:BADGE_COLORS[product.badge]||"#475569"}}>{product.badge}</span>}
          </div>
          <div style={{display:"flex",gap:10}}>
            {product.imgs.map((img,i)=>(
              <button key={i} onClick={()=>setActiveImg(i)} style={{width:86,height:86,borderRadius:14,overflow:"hidden",cursor:"pointer",border:`2px solid ${activeImg===i?"#6366f1":"rgba(99,102,241,.15)"}`,background:"#080c1a",transition:"border-color .2s",padding:0,outline:"none",boxShadow:activeImg===i?"0 0 0 3px rgba(99,102,241,.22)":"none"}}>
                <SafeImg src={img} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>
              </button>
            ))}
          </div>
        </div>
        <div>
          <p style={{fontSize:10,color:"#3d4f7c",textTransform:"uppercase",fontWeight:800,letterSpacing:".12em",marginBottom:6}}>{product.brand}</p>
          <h1 className="syne" style={{fontSize:32,fontWeight:900,color:"#f1f5f9",margin:"0 0 14px",lineHeight:1.1}}>{product.name}</h1>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:18}}>
            <Stars rating={product.rating}/>
            <span style={{fontSize:13,color:"#334155"}}>({product.reviews.toLocaleString()} verified reviews)</span>
          </div>
          <p style={{fontSize:15,color:"#475569",lineHeight:1.8,marginBottom:24}}>{product.desc}</p>
          <div style={{background:"linear-gradient(135deg,rgba(99,102,241,.07),rgba(139,92,246,.04))",borderRadius:18,padding:22,marginBottom:24,border:"1px solid rgba(99,102,241,.16)"}}>
            <div style={{display:"flex",alignItems:"baseline",gap:14,marginBottom:10}}>
              <span className="syne" style={{fontSize:40,fontWeight:900,color:"#f1f5f9"}}>{fmt(product.price)}</span>
              <span style={{fontSize:18,color:"#2d3a55",textDecoration:"line-through"}}>{fmt(product.mrp)}</span>
            </div>
            <span style={{background:"rgba(74,222,128,.1)",color:"#4ade80",border:"1px solid rgba(74,222,128,.22)",padding:"5px 14px",borderRadius:20,fontSize:13,fontWeight:700}}>
              Save {fmt(product.mrp-product.price)} ({disc(product.price,product.mrp)}%)
            </span>
          </div>
          <div style={{marginBottom:24}}>
            {product.hi.map(h=>(
              <span key={h} style={{display:"inline-block",background:"rgba(99,102,241,.08)",color:"#818cf8",border:"1px solid rgba(99,102,241,.2)",padding:"7px 14px",borderRadius:20,fontSize:13,fontWeight:600,margin:"0 8px 8px 0"}}>✓ {h}</span>
            ))}
          </div>
          <div style={{display:"flex",gap:12,marginBottom:12}}>
            <button onClick={handleCart} style={{flex:1,padding:"16px",fontSize:15,fontWeight:700,borderRadius:16,border:`1.5px solid ${cartDone?"rgba(16,185,129,.4)":"rgba(99,102,241,.35)"}`,background:cartDone?"rgba(16,185,129,.1)":"rgba(99,102,241,.08)",color:cartDone?"#4ade80":"#818cf8",cursor:"pointer",transition:"all .35s",display:"flex",alignItems:"center",justifyContent:"center",gap:10}}>
              {cartDone?"✓ Added to Cart!":"🛒 Add to Cart"}
            </button>
            <button onClick={()=>onBuyNow(product)} className="btn-danger" style={{flex:1,padding:"16px",fontSize:15}}>⚡ Buy Now</button>
          </div>
          <div style={{display:"flex",gap:10,marginBottom:20}}>
            <button onClick={()=>{onCompare(product.id);toast(inCmp?"Removed from compare":"Added to compare ⚖️","info");}} style={{flex:1,background:inCmp?"rgba(99,102,241,.1)":"transparent",color:inCmp?"#818cf8":"#64748b",border:`1px solid ${inCmp?"rgba(99,102,241,.4)":"rgba(255,255,255,.07)"}`,borderRadius:12,padding:"12px",fontSize:14,fontWeight:700,cursor:"pointer",transition:"all .2s"}}>
              {inCmp?"✓ In Comparison":"+ Add to Compare"}
            </button>
            <button onClick={()=>{onWishlist(product.id);toast(wished?"Removed from wishlist":"Saved to wishlist ❤️",wished?"info":"success");}} style={{flex:1,background:wished?"rgba(236,72,153,.1)":"transparent",color:wished?"#f472b6":"#64748b",border:`1px solid ${wished?"rgba(236,72,153,.4)":"rgba(255,255,255,.07)"}`,borderRadius:12,padding:"12px",fontSize:14,fontWeight:700,cursor:"pointer",transition:"all .2s"}}>
              {wished?"❤️ Wishlisted":"🤍 Add to Wishlist"}
            </button>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10}}>
            {[["🚚","Free Delivery","₹499+"],["↩️","10-Day Returns","Hassle-free"],["🛡️","2-Year Warranty","Included"]].map(([icon,t,s])=>(
              <div key={t} style={{background:"rgba(255,255,255,.025)",borderRadius:12,padding:"13px 8px",textAlign:"center",border:"1px solid rgba(255,255,255,.05)"}}>
                <div style={{fontSize:20,marginBottom:5}}>{icon}</div>
                <p style={{fontSize:11,fontWeight:700,color:"#94a3b8",margin:"0 0 2px"}}>{t}</p>
                <p style={{fontSize:10,color:"#334155",margin:0}}>{s}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="glass-card" style={{borderRadius:22,padding:32,marginBottom:52}}>
        <h2 className="syne" style={{fontSize:22,fontWeight:800,color:"#f1f5f9",marginBottom:22}}>📋 Full Specifications</h2>
        <table style={{width:"100%",borderCollapse:"collapse"}}>
          <tbody>
            {Object.entries(product.specs).map(([key,val],i)=>(
              <tr key={key} style={{background:i%2===0?"rgba(99,102,241,.04)":"transparent"}}>
                <td style={{padding:"13px 20px",fontSize:14,fontWeight:700,color:"#475569",width:"30%",borderBottom:"1px solid rgba(255,255,255,.04)"}}>{key}</td>
                <td style={{padding:"13px 20px",fontSize:14,color:"#cbd5e1",borderBottom:"1px solid rgba(255,255,255,.04)",fontWeight:500}}>{val}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {related.length>0 && (
        <div>
          <SectionTitle accent="#8b5cf6">You May Also Like</SectionTitle>
          <div className="product-grid" style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:18}}>
            {related.map(p=><ProductCard key={p.id} product={p} onView={onView=>onView(p)} onCompare={onCompare} onCart={onCart} onBuyNow={onBuyNow} wishlist={wishlist} onWishlist={onWishlist} compareList={compareList} toast={toast}/>)}
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══ DEALS PAGE ═══ */
function DealsPage({ onView, onCompare, onCart, onBuyNow, wishlist, onWishlist, compareList, toast }) {
  const mainTimer = useCountdown(86400);
  return (
    <div className="fade-in" style={{display:"flex",flexDirection:"column",gap:48}}>
      <div style={{borderRadius:24,padding:"44px 56px",position:"relative",overflow:"hidden",background:"linear-gradient(135deg,#1a0305,#2d0808,#1a0305)",border:"1px solid rgba(239,68,68,.18)",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div style={{position:"absolute",inset:0,backgroundImage:"radial-gradient(ellipse at 15% 50%, rgba(239,68,68,.12) 0%, transparent 55%)",pointerEvents:"none"}}/>
        <div style={{position:"relative",zIndex:1}}>
          <p style={{fontSize:10,color:"#fca5a5",fontWeight:800,textTransform:"uppercase",letterSpacing:".12em",margin:"0 0 10px"}}>Limited Time Only</p>
          <h1 className="syne" style={{fontSize:40,fontWeight:900,color:"#fff",margin:"0 0 6px"}}>⚡ Today's Best Deals</h1>
          <p style={{fontSize:16,color:"#7f1d1d",margin:0}}>Grab them before they're gone!</p>
        </div>
        <div style={{textAlign:"right",position:"relative",zIndex:1}}>
          <p style={{fontSize:12,color:"#fca5a5",margin:"0 0 8px",fontWeight:600}}>Sale ends in</p>
          <span style={{background:"rgba(0,0,0,.55)",backdropFilter:"blur(10px)",color:"#fbbf24",padding:"12px 24px",borderRadius:14,fontSize:24,fontWeight:900,fontFamily:"monospace",letterSpacing:".1em",display:"inline-block",border:"1px solid rgba(251,191,36,.2)",animation:"pulse 1.5s ease-in-out infinite"}}>{mainTimer}</span>
        </div>
      </div>
      <div>
        <SectionTitle accent="#ef4444">🔥 Flash Deals</SectionTitle>
        <div className="deal-grid" style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:22}}>
          {DEALS.map(deal=>{
            const p=PRODUCTS.find(x=>x.id===deal.productId);
            return <FlashCard key={deal.id} deal={deal} product={p} dealPrice={p.price-deal.extraOff} onView={onView} onCart={onCart} onBuyNow={onBuyNow} toast={toast}/>;
          })}
        </div>
      </div>
      <div>
        <SectionTitle accent="#f59e0b">🏷️ More Offers</SectionTitle>
        <div className="product-grid" style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:18}}>
          {PRODUCTS.filter(p=>disc(p.price,p.mrp)>=8).map(p=>(
            <ProductCard key={p.id} product={p} onView={onView} onCompare={onCompare} onCart={onCart} onBuyNow={onBuyNow} wishlist={wishlist} onWishlist={onWishlist} compareList={compareList} toast={toast}/>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══ BRANDS PAGE ═══ */
function BrandsPage({ onView, onCompare, onCart, onBuyNow, wishlist, onWishlist, compareList, toast }) {
  const [active, setActive] = useState(null);
  const bp = active ? PRODUCTS.filter(p=>p.brand===active) : [];
  return (
    <div className="fade-in">
      <h1 className="syne" style={{fontSize:32,fontWeight:900,color:"#f1f5f9",marginBottom:8}}>Top Brands</h1>
      <p style={{color:"#475569",marginBottom:32}}>Authorised reseller for India's most trusted electronics brands.</p>
      <div className="brand-grid" style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:16,marginBottom:active?48:0}}>
        {BRANDS.map(b=>{
          const cnt=PRODUCTS.filter(p=>p.brand===b.id).length;
          const isActive=active===b.id;
          return (
            <div key={b.id} onClick={()=>setActive(isActive?null:b.id)} className="card-hover glass-card" style={{borderRadius:22,padding:"32px 16px",textAlign:"center",cursor:"pointer",border:`${isActive?"2px":"1px"} solid ${isActive?"rgba(99,102,241,.5)":"rgba(99,102,241,.14)"}`,background:isActive?"rgba(99,102,241,.1)":"rgba(13,16,30,.82)",boxShadow:isActive?"0 8px 48px rgba(99,102,241,.2)":"none"}}>
              <div style={{fontSize:46,marginBottom:14}}>{b.logo}</div>
              <p className="syne" style={{fontSize:17,fontWeight:800,color:"#f1f5f9",marginBottom:4}}>{b.name}</p>
              <p style={{fontSize:11,color:"#475569",marginBottom:12}}>{b.tagline}</p>
              <span style={{background:isActive?"rgba(99,102,241,.22)":"rgba(255,255,255,.05)",color:isActive?"#818cf8":"#64748b",fontSize:11,fontWeight:700,padding:"4px 14px",borderRadius:20}}>{cnt} products</span>
            </div>
          );
        })}
      </div>
      {active && bp.length>0 && (
        <div className="fade-in">
          <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:22}}>
            <span style={{fontSize:30}}>{BRANDS.find(b=>b.id===active)?.logo}</span>
            <h2 className="syne" style={{fontSize:22,fontWeight:800,color:"#f1f5f9"}}>{BRANDS.find(b=>b.id===active)?.name} Products</h2>
          </div>
          <div className="product-grid" style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:18}}>
            {bp.map(p=><ProductCard key={p.id} product={p} onView={onView} onCompare={onCompare} onCart={onCart} onBuyNow={onBuyNow} wishlist={wishlist} onWishlist={onWishlist} compareList={compareList} toast={toast}/>)}
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══ COMPARE PAGE ═══ */
function ComparePage({ compareList, onView, onRemove }) {
  const products = PRODUCTS.filter(p=>compareList.includes(p.id));
  if(products.length<2) return (
    <div className="fade-in" style={{textAlign:"center",padding:"90px 0"}}>
      <div style={{fontSize:64,marginBottom:16,opacity:.3}}>⚖️</div>
      <h2 className="syne" style={{fontSize:28,fontWeight:800,color:"#f1f5f9",marginBottom:10}}>Compare Products</h2>
      <p style={{color:"#334155",fontSize:15}}>Add at least 2 products using the ⚖️ button on any product card.</p>
    </div>
  );
  const allKeys = Array.from(new Set(products.flatMap(p=>Object.keys(p.specs))));
  const rows = [["Rating",p=>`${p.rating}★ (${p.reviews.toLocaleString()})`],["Discount",p=>`${disc(p.price,p.mrp)}% off`],...allKeys.map(k=>[k,p=>p.specs[k]||"—"])];
  return (
    <div className="fade-in">
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:30}}>
        <h1 className="syne" style={{fontSize:28,fontWeight:900,color:"#f1f5f9"}}>Side-by-Side Comparison</h1>
        <span style={{fontSize:13,color:"#475569"}}>{products.length} products</span>
      </div>
      <div style={{overflowX:"auto"}}>
        <table style={{width:"100%",borderCollapse:"collapse",background:"rgba(255,255,255,.02)",borderRadius:22,overflow:"hidden",border:"1px solid rgba(99,102,241,.15)"}}>
          <thead>
            <tr style={{background:"rgba(99,102,241,.06)",position:"sticky",top:66,zIndex:10}}>
              <th style={{padding:"20px",textAlign:"left",fontSize:12,fontWeight:700,color:"#334155",textTransform:"uppercase",width:"22%",borderBottom:"1px solid rgba(99,102,241,.1)"}}>Feature</th>
              {products.map(p=>(
                <th key={p.id} style={{padding:"20px",borderBottom:"1px solid rgba(99,102,241,.1)",verticalAlign:"top"}}>
                  <div style={{height:130,borderRadius:14,overflow:"hidden",marginBottom:10,background:"#080c1a"}}>
                    <SafeImg src={p.imgs[0]} alt={p.name} style={{width:"100%",height:"100%",objectFit:"cover"}}/>
                  </div>
                  <p className="syne" style={{fontSize:13,fontWeight:800,color:"#f1f5f9",margin:"0 0 4px"}}>{p.name}</p>
                  <p className="syne" style={{fontSize:18,fontWeight:900,color:"#818cf8",margin:"0 0 10px"}}>{fmt(p.price)}</p>
                  <div style={{display:"flex",gap:6}}>
                    <button onClick={()=>onView(p)} style={{flex:1,background:"rgba(99,102,241,.14)",color:"#818cf8",border:"1px solid rgba(99,102,241,.28)",borderRadius:10,padding:"8px",fontSize:12,fontWeight:700,cursor:"pointer"}}>View</button>
                    <button onClick={()=>onRemove(p.id)} style={{background:"rgba(239,68,68,.1)",color:"#f87171",border:"1px solid rgba(239,68,68,.2)",borderRadius:10,padding:"8px 10px",fontSize:11,cursor:"pointer"}}>✕</button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map(([label,fn],i)=>(
              <tr key={label} style={{background:i%2===0?"rgba(99,102,241,.03)":"transparent"}}>
                <td style={{padding:"13px 20px",fontSize:13,fontWeight:700,color:"#475569",borderBottom:"1px solid rgba(255,255,255,.04)"}}>{label}</td>
                {products.map(p=>(
                  <td key={p.id} style={{padding:"13px 20px",fontSize:14,color:"#cbd5e1",textAlign:"center",borderBottom:"1px solid rgba(255,255,255,.04)",fontWeight:500}}>{fn(p)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ═══ CONTACT PAGE ═══ */
function ContactPage({ toast }) {
  const [form, setForm] = useState({ name:"", email:"", phone:"", type:"support", message:"" });
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.name.trim())   e.name    = "Name is required";
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = "Valid email required";
    if (!form.message.trim()) e.message = "Message is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async () => {
    if (!validate()) { toast("Please fix the errors", "error"); return; }
    setSending(true);
    // In production: integrate emailjs-com
    // emailjs.send("serviceID","templateID",{from_name:form.name,from_email:form.email,...})
    await new Promise(r => setTimeout(r, 1600));
    setSending(false);
    setSent(true);
    toast("Message sent successfully! 📬", "success");
  };

  const channels = [
    { icon:"📞", label:"Toll-Free Helpline", value:"1800-VOLTX-IN", sub:"Mon–Sun, 8am–10pm", href:"tel:+918001234567",    bg:"#3e5044", tc:"#068535",border:"#bbf7d0" },
    { icon:"✉️", label:"Email Support",      value:"support@voltx.in", sub:"Response within 2 hours", href:"mailto:support@voltx.in", bg:"#879bb6", tc:"#1d4ed8", border:"#dde8f5" },
    { icon:"💬", label:"WhatsApp Chat",       value:"Chat Now",       sub:"Avg. response: 3 min",  href:"https://wa.me/919876543210?text=Hi%20VoltX%2C%20I%20need%20help", bg:"#b5fad7", tc:"#023f2e", border:"#edf3f0" },
    { icon:"🔧", label:"Service Centre",      value:"Walk-in Support", sub:"All major cities",     href:"#stores",            bg:"#faf3a1", tc:"#a16207", border:"#eeece5" },
  ];

  const stores = [
    { name:"VoltX Bengaluru",  addr:"42, MG Road, Bengaluru — 560001",                      ph:"080-4567-8901", hours:"10am–9pm daily", emoji:"🏙️", map:"https://maps.google.com/?q=MG+Road+Bengaluru" },
    { name:"VoltX Mumbai",     addr:"12, Linking Rd, Bandra West, Mumbai — 400050",          ph:"022-4567-8901", hours:"11am–9pm daily", emoji:"🌆", map:"https://maps.google.com/?q=Linking+Road+Bandra+Mumbai" },
    { name:"VoltX New Delhi",  addr:"Block A, Connaught Place, New Delhi — 110001",          ph:"011-4567-8901", hours:"10am–9pm daily", emoji:"🏛️", map:"https://maps.google.com/?q=Connaught+Place+New+Delhi" },
    { name:"VoltX Hyderabad",  addr:"Road No. 12, Banjara Hills, Hyderabad — 500034",        ph:"040-4567-8901", hours:"10am–9pm daily", emoji:"🌇", map:"https://maps.google.com/?q=Banjara+Hills+Hyderabad" },
  ];

  const inp = (field, placeholder, type="text", area=false) => (
    <div>
      {area
        ? <textarea rows={4} placeholder={placeholder} value={form[field]} onChange={e=>setForm(f=>({...f,[field]:e.target.value}))}
            style={{ width:"100%", border:`1px solid ${errors[field]?"#fca5a5":"#292a2b"}`, borderRadius:12, padding:"12px 16px", fontSize:14, resize:"vertical", background: errors[field]?"#c9c8c8":"#f8f4f4" }} />
        : <input type={type} placeholder={placeholder} value={form[field]} onChange={e=>setForm(f=>({...f,[field]:e.target.value}))}
            style={{ width:"100%", border:`1px solid ${errors[field]?"#fca5a5":"#e5e7eb"}`, borderRadius:12, padding:"12px 16px", fontSize:14, background: errors[field]?"#fff5f5":"#fff" }} />
      }
      {errors[field] && <p style={{ color:"#ef4444", fontSize:11, marginTop:4, fontWeight:600 }}>⚠ {errors[field]}</p>}
    </div>
  );

  return (
    <div className="fade-in" style={{ display:"flex", flexDirection:"column", gap:40 }}>
      <div>
        <h1 style={{ fontSize:32, fontWeight:900, color:"#e3e8ee", marginBottom:6 }}>Contact & Support</h1>
        <p style={{ color:"#9ca3af" }}>We're here to help — reach us anytime, anywhere.</p>
      </div>

      {/* Channel cards */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14 }}>
        {channels.map(ch => (
          <a key={ch.label} href={ch.href} target={ch.href.startsWith("http")?"_blank":"_self"} style={{ textDecoration:"none", display:"block" }}>
            <div className="card-hover" style={{ background:ch.bg, border:`1px solid ${ch.border}`, borderRadius:18, padding:"22px 18px", height:"100%", transition:"all .2s" }}>
              <div style={{ fontSize:30, marginBottom:12 }}>{ch.icon}</div>
              <p style={{ fontSize:10, fontWeight:800, color:ch.tc, textTransform:"uppercase", letterSpacing:".07em", margin:"0 0 6px" }}>{ch.label}</p>
              <p style={{ fontSize:15, fontWeight:800, color:"#050505", margin:"0 0 4px" }}>{ch.value}</p>
              <p style={{ fontSize:11, color:"#6b7280", margin:0 }}>{ch.sub}</p>
            </div>
          </a>
        ))}
      </div>

      <div className="contact-grid" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:28 }}>
        {/* Form */}
        <div style={{ background:"#0f0f0f", borderRadius:24, border:"1px solid #c1c2c5", padding:32, boxShadow:"0 4px 24px rgba(0,0,0,.05)" }}>
          <h2 style={{ fontSize:20, fontWeight:800, color:"#f5f5f8", marginBottom:22 }}>📬 Send Us a Message</h2>
          {sent ? (
            <div style={{ textAlign:"center", padding:"40px 0" }}>
              <div style={{ fontSize:64, marginBottom:16, animation:"pulse 1.5s ease-in-out 2" }}>✅</div>
              <p style={{ fontSize:22, fontWeight:900, color:"#f1f1f1", marginBottom:8 }}>Message Sent!</p>
              <p style={{ color:"#eff2f8", marginBottom:24 }}>We'll get back to you within 2 business hours.</p>
              <button className="btn-primary" onClick={() => { setSent(false); setForm({name:"",email:"",phone:"",type:"support",message:""}); }}>Send Another</button>
            </div>
          ) : (
            <div style={{ display:"flex", flexDirection:"column",padding:"12px 16px", gap:15,color:"#000" }}>
              {inp("name",    "Your Full Name")}
              {inp("email",   "Email Address", "email")}
              {inp("phone",   "Phone Number",  "tel")}
              <select value={form.type} onChange={e=>setForm(f=>({...f,type:e.target.value}))}
            style={{ border:"1px solid #e6f8e7", borderRadius:12, padding:"12px 16px", fontSize:14, cursor:"pointer",background:"#fff",color:"#000" }}>
                <option value="support">Technical Support</option>
                <option value="order">Order Query</option>
                <option value="warranty">Warranty Claim</option>
                <option value="return">Return / Refund</option>
                <option value="other">Other</option>
              </select>
              {inp("message", "Describe your issue or query…", "text", true)}
              <button onClick={submit} disabled={sending} className="btn-primary" style={{ padding:"15px", fontSize:15, display:"flex", alignItems:"center", justifyContent:"center", gap:8, opacity: sending?0.8:1 }}>
                {sending ? <><span style={{ width:16, height:16, border:"2px solid rgba(255,255,255,.4)", borderTopColor:"#c0bbbb", borderRadius:"50%", animation:"spin .7s linear infinite", display:"inline-block" }} /> Sending…</> : <>📤 Submit Message</>}
              </button>
              <p style={{ fontSize:11, color:"#eef2f7", textAlign:"center" }}>🔒 Your data is secure. Powered by EmailJS.</p>
            </div>
          )}
        </div>

        {/* Store locator */}
        <div id="stores" style={{ background:"#161616", borderRadius:24, border:"1px solid #f3ecec", padding:32, boxShadow:"0 4px 24px rgba(0,0,0,.05)" }}>
          <h2 style={{ fontSize:20, fontWeight:800, color:"#e6e7eb", marginBottom:22 }}>🗺️ Store Locator</h2>
          <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
            {stores.map(s => (
              <div key={s.name} style={{ display:"flex", gap:14, padding:"16px", borderRadius:16, background:"#f8fafc", border:"1px solid #e5e7eb", alignItems:"flex-start", transition:"all .2s" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor="#3b82f6"; e.currentTarget.style.background="#eff6ff"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor="#717375"; e.currentTarget.style.background="#f8fafc"; }}
              >
                <div style={{ width:46, height:46, borderRadius:14, background:"#b9cae0", display:"flex", alignItems:"center", justifyContent:"center", fontSize:24, flexShrink:0 }}>{s.emoji}</div>
                <div style={{ flex:1, minWidth:0 }}>
                  <p style={{ fontSize:14, fontWeight:800, color:"#111827", margin:"0 0 3px" }}>{s.name}</p>
                  <a href={s.map} target="_blank" rel="noreferrer" onClick={e=>e.stopPropagation()} style={{ fontSize:11, color:"#6b7280", display:"flex", alignItems:"center", gap:4, margin:"0 0 6px", textDecoration:"none" }} onMouseEnter={e=>e.currentTarget.style.color="#2563eb"} onMouseLeave={e=>e.currentTarget.style.color="#6b7280"}>
                    📍 {s.addr} ↗
                  </a>
                  <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
                    <a href={`tel:${s.ph.replace(/-/g,"")}`} style={{ fontSize:11, color:"#2563eb", fontWeight:700, textDecoration:"none" }}>📞 {s.ph}</a>
                    <span style={{ fontSize:11, color:"#16a34a", fontWeight:600 }}>🕐 {s.hours}</span>
                  </div>
                </div>
                <a href={s.map} target="_blank" rel="noreferrer" style={{ textDecoration:"none", flexShrink:0 }}>
                  <button className="btn-primary" style={{ padding:"7px 14px", fontSize:11, boxShadow:"none" }}>Maps ↗</button>
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Google Map embed */}
      <div style={{ borderRadius:24, overflow:"hidden", border:"1px solid #e5e7eb", boxShadow:"0 4px 24px rgba(0,0,0,.06)", height:340 }}>
        <iframe
          title="VoltX Store Locations"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3887.985280748293!2d77.59455!3d12.97194!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae1670c9b44e6d%3A0xf8dfc3e8517e4fe0!2sMG%20Road%2C%20Bengaluru!5e0!3m2!1sen!2sin!4v1620000000000!5m2!1sen!2sin"
          width="100%" height="100%" style={{ border:0 }} allowFullScreen loading="lazy"
        />
      </div>

      {/* WhatsApp floating button + chat popup */}
      <div style={{ position:"fixed", bottom:24, right:24, zIndex:500, display:"flex", flexDirection:"column", alignItems:"flex-end", gap:12 }}>
        {chatOpen && (
          <div className="slide-r" style={{ background:"#fff", borderRadius:20, boxShadow:"0 20px 60px rgba(0,0,0,.18)", border:"1px solid #e5e7eb", width:300, overflow:"hidden" }}>
            <div style={{ background:"#25d366", padding:"16px 18px", display:"flex", alignItems:"center", gap:12 }}>
              <div style={{ width:40, height:40, borderRadius:"50%", background:"rgba(255,255,255,.25)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20 }}>💬</div>
              <div>
                <p style={{ color:"#fff", fontWeight:800, fontSize:14, margin:0 }}>VoltX Support</p>
                <p style={{ color:"rgba(255,255,255,.8)", fontSize:11, margin:0 }}>● Online now · Replies instantly</p>
              </div>
              <button onClick={() => setChatOpen(false)} style={{ marginLeft:"auto", background:"none", border:"none", color:"rgba(255,255,255,.8)", cursor:"pointer", fontSize:20 }}>×</button>
            </div>
            <div style={{ padding:18 }}>
              <div style={{ background:"#f0f4f8", borderRadius:14, borderTopLeftRadius:4, padding:"12px 16px", marginBottom:16 }}>
                <p style={{ fontSize:13, color:"#374151", margin:0, lineHeight:1.6 }}>👋 Hi! Welcome to <strong>VoltX</strong>. How can we help you today?</p>
              </div>
              <a href="https://wa.me/919876543210?text=Hi%20VoltX%20Support%2C%20I%20need%20help" target="_blank" rel="noreferrer" style={{ textDecoration:"none", display:"block" }}>
                <button style={{ width:"100%", background:"#25d366", color:"#fff", border:"none", borderRadius:14, padding:"13px", fontSize:14, fontWeight:800, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
                  💬 Continue on WhatsApp
                </button>
              </a>
            </div>
          </div>
        )}
        <button onClick={() => setChatOpen(!chatOpen)} style={{ width:58, height:58, background:"#25d366", borderRadius:"50%", border:"none", cursor:"pointer", fontSize:26, display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 6px 24px rgba(37,211,102,.5)", transition:"all .2s", animation: chatOpen?"":"pulse 2s ease-in-out infinite" }}
          onMouseEnter={e => { e.currentTarget.style.transform="scale(1.1)"; e.currentTarget.style.boxShadow="0 8px 30px rgba(37,211,102,.6)"; }}
          onMouseLeave={e => { e.currentTarget.style.transform=""; e.currentTarget.style.boxShadow="0 6px 24px rgba(37,211,102,.5)"; }}
        >
          {chatOpen ? "✕" : "💬"}
        </button>
      </div>
    </div>
  );
}
/* ═══ COMPARE BAR ═══ */
function CompareBar({ compareList, setPage, onClear, onRemoveOne }) {
  if(compareList.length===0) return null;
  const products = PRODUCTS.filter(p=>compareList.includes(p.id));
  return (
    <div style={{position:"fixed",bottom:0,left:0,right:0,zIndex:400,background:"rgba(4,6,15,.97)",backdropFilter:"blur(28px)",borderTop:"1px solid rgba(99,102,241,.22)",padding:"12px 28px",display:"flex",alignItems:"center",gap:16,boxShadow:"0 -4px 50px rgba(99,102,241,.12)"}}>
      <span style={{color:"#4b5563",fontSize:13,flexShrink:0}}>⚖️ Compare ({compareList.length}/3):</span>
      <div style={{display:"flex",gap:10,flex:1,overflowX:"auto"}}>
        {products.map(p=>(
          <div key={p.id} style={{display:"flex",alignItems:"center",gap:8,background:"rgba(99,102,241,.1)",border:"1px solid rgba(99,102,241,.24)",borderRadius:11,padding:"6px 10px 6px 6px",flexShrink:0}}>
            <div style={{width:32,height:32,borderRadius:8,overflow:"hidden",flexShrink:0}}><SafeImg src={p.imgs[0]} alt={p.name} style={{width:"100%",height:"100%",objectFit:"cover"}}/></div>
            <span style={{color:"#e2e8f0",fontSize:12,fontWeight:600,maxWidth:120,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{p.name}</span>
            <button onClick={()=>onRemoveOne(p.id)} style={{background:"none",border:"none",color:"#475569",cursor:"pointer",fontSize:14}}>×</button>
          </div>
        ))}
      </div>
      {compareList.length>=2 && <button onClick={()=>setPage("compare")} className="btn-primary" style={{flexShrink:0,padding:"9px 20px",fontSize:13}}>Compare Now →</button>}
      <button onClick={onClear} style={{background:"transparent",color:"#475569",border:"none",fontSize:20,cursor:"pointer",flexShrink:0}}>×</button>
    </div>
  );
}

/* ═══ FOOTER ═══ */
function Footer({ setPage }) {
  return (
    <footer style={{background:"#020408",color:"#475569",padding:"60px 0 28px",marginTop:80,borderTop:"1px solid rgba(99,102,241,.1)"}}>
      <div style={{maxWidth:1400,margin:"0 auto",padding:"0 24px"}}>
        <div className="footer-grid" style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr 1fr",gap:48,marginBottom:48}}>
          <div>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:16}}>
              <div style={{width:34,height:34,borderRadius:10,background:"linear-gradient(135deg,#6366f1,#8b5cf6)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:17,color:"#fff"}}>⚡</div>
              <span className="syne" style={{fontSize:22,fontWeight:900,letterSpacing:"-1px"}}><span style={{color:"#818cf8"}}>Volt</span><span style={{color:"#e2e8f0"}}>X</span></span>
            </div>
            <p style={{fontSize:14,lineHeight:1.75,color:"#334155",marginBottom:22,maxWidth:300}}>India's most trusted electronics destination. Authorised reseller of Apple, Samsung, Sony, Dell and 120+ premium brands.</p>
            <div style={{display:"flex",gap:10}}>
              {["📘","📸","🐦","▶️"].map(ic=>(
                <button key={ic} style={{width:38,height:38,background:"rgba(99,102,241,.06)",border:"1px solid rgba(99,102,241,.15)",borderRadius:11,display:"flex",alignItems:"center",justifyContent:"center",fontSize:15,cursor:"pointer",transition:"all .2s"}}
                  onMouseEnter={e=>{e.currentTarget.style.background="rgba(99,102,241,.16)";e.currentTarget.style.borderColor="rgba(99,102,241,.4)";}}
                  onMouseLeave={e=>{e.currentTarget.style.background="rgba(99,102,241,.06)";e.currentTarget.style.borderColor="rgba(99,102,241,.15)";}}>
                  {ic}
                </button>
              ))}
            </div>
          </div>
          {[{title:"Shop",links:["Smartphones","Laptops","Audio","Smart TVs","Cameras","Gaming","Wearables"]},{title:"Support",links:["Track Order","Return Policy","Warranty","Service Centres","EMI Options"]},{title:"Company",links:["About VoltX","Careers","Press Room","Blog","Affiliates"]}].map(col=>(
            <div key={col.title}>
              <p className="syne" style={{fontSize:13,fontWeight:700,color:"#94a3b8",marginBottom:18,textTransform:"uppercase",letterSpacing:".08em"}}>{col.title}</p>
              {col.links.map(l=>(
                <p key={l} style={{fontSize:13,margin:"0 0 12px",cursor:"pointer",transition:"color .15s"}}
                  onMouseEnter={e=>e.currentTarget.style.color="#818cf8"}
                  onMouseLeave={e=>e.currentTarget.style.color="#475569"}>{l}</p>
              ))}
            </div>
          ))}
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:20,padding:"24px 0",borderTop:"1px solid rgba(99,102,241,.08)",borderBottom:"1px solid rgba(99,102,241,.08)",marginBottom:24}}>
          {[["🚚","Free Delivery","₹499+"],["↩️","Easy Returns","10-day policy"],["🛡️","2-Year Warranty","All products"],["💳","Secure Payment","100% safe"]].map(([icon,t,s])=>(
            <div key={t} style={{display:"flex",alignItems:"center",gap:12}}>
              <span style={{fontSize:20}}>{icon}</span>
              <div><p className="syne" style={{fontSize:12,fontWeight:700,color:"#e2e8f0",margin:0}}>{t}</p><p style={{fontSize:11,color:"#334155",margin:0}}>{s}</p></div>
            </div>
          ))}
        </div>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:12}}>
          <p style={{fontSize:13,color:"#1e293b",margin:0}}>© 2025 VoltX Electronics Pvt. Ltd. All rights reserved.</p>
          <p style={{fontSize:13,color:"#1e293b",margin:0}}>Made with ❤️ in India 🇮🇳</p>
        </div>
      </div>
    </footer>
  );
}

/* ═══ APP ROOT ═══ */
export default function App() {
  const [page, setPage]           = useState("home");
  const [selected, setSelected]   = useState(null);
  const [compareList, setCompare] = useState([]);
  const [cart, setCart]           = useState([]);
  const [wishlist, setWishlist]   = useState([]);
  const [cartOpen, setCartOpen]   = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [buyNowProduct, setBuyNow] = useState(null);
  const [searchQuery, setSearch]  = useState("");
  const { toasts, toast }         = useToast();

  useEffect(() => {
    const el = document.createElement("style");
    el.textContent = STYLES;
    document.head.appendChild(el);
    return () => el.remove();
  }, []);

  const navigate = p => { setPage(p); window.scrollTo({top:0,behavior:"smooth"}); };

  const handleView = product => { setSelected(product); navigate("product"); };

  const handleCompare = id => {
    setCompare(prev =>
      prev.includes(id) ? prev.filter(x=>x!==id)
      : prev.length<3 ? [...prev,id]
      : (toast("Max 3 products for comparison","warning"), prev)
    );
  };

  const handleCart = product => {
    setCart(c => {
      const ex = c.find(i=>i.product.id===product.id);
      if(ex) return c.map(i=>i.product.id===product.id?{...i,qty:i.qty+1}:i);
      return [...c,{product,qty:1}];
    });
  };

  const handleWishlist = id => {
    setWishlist(prev => prev.includes(id)?prev.filter(x=>x!==id):[...prev,id]);
  };

  const updateQty = (id, qty) => {
    if(qty<=0) setCart(c=>c.filter(i=>i.product.id!==id));
    else setCart(c=>c.map(i=>i.product.id===id?{...i,qty}:i));
  };

  const cartCount = cart.reduce((s,i)=>s+i.qty,0);

  const sharedProps = {
    onView:handleView, onCompare:handleCompare, onCart:handleCart,
    onBuyNow:setBuyNow, wishlist, onWishlist:handleWishlist,
    compareList, toast,
  };

  const renderPage = () => {
    if(page==="product"&&selected) return <ProductDetail product={selected} onBack={()=>navigate("category")} {...sharedProps}/>;
    switch(page) {
      case "home":     return <HomePage     setPage={navigate} {...sharedProps}/>;
      case "category": return <CategoryPage setPage={navigate} searchQuery={searchQuery} {...sharedProps}/>;
      case "deals":    return <DealsPage    setPage={navigate} {...sharedProps}/>;
      case "brands":   return <BrandsPage   setPage={navigate} {...sharedProps}/>;
      case "compare":  return <ComparePage  compareList={compareList} onView={handleView} onRemove={handleCompare}/>;
      case "contact":  return <ContactPage  toast={toast}/>;
      default:         return <HomePage     setPage={navigate} {...sharedProps}/>;
    }
  };

  return (
    <div style={{minHeight:"100vh"}}>
      <ToastContainer toasts={toasts}/>
      {cartOpen && <CartModal cart={cart} onClose={()=>setCartOpen(false)} onRemove={id=>setCart(c=>c.filter(i=>i.product.id!==id))} onUpdateQty={updateQty} onClear={()=>setCart([])} toast={toast}/>}
      {wishlistOpen && <WishlistModal wishlist={wishlist} onClose={()=>setWishlistOpen(false)} onView={handleView} onRemove={handleWishlist} onCart={handleCart} toast={toast}/>}
      {buyNowProduct && <BuyNowModal product={buyNowProduct} onClose={()=>setBuyNow(null)} onSuccess={()=>{setBuyNow(null);toast("Order placed! 🎉","success");}}/>}
      <Navbar page={page} setPage={navigate} cartCount={cartCount} wishlistCount={wishlist.length} compareCount={compareList.length} onSearch={setSearch} onCartOpen={()=>setCartOpen(true)} onWishlistOpen={()=>setWishlistOpen(true)}/>
      <main style={{maxWidth:1400,margin:"0 auto",padding:"90px 24px 40px",paddingBottom:compareList.length>0?110:40,minHeight:"80vh"}}>
        {renderPage()}
      </main>
      <Footer setPage={navigate}/>
      <CompareBar compareList={compareList} setPage={navigate} onClear={()=>setCompare([])} onRemoveOne={handleCompare}/>
    </div>
  );
}
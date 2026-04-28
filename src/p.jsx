import { useState, useEffect, useRef, useCallback } from "react";

/* ═══════════════════════════════════════════════════════════════
   GLOBAL STYLES
═══════════════════════════════════════════════════════════════ */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:wght@300;400;500;600;700&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  body { font-family: 'DM Sans', system-ui, sans-serif; background: #050810; -webkit-font-smoothing: antialiased; }
  input, select, textarea, button { font-family: inherit; }
  a { text-decoration: none; color: inherit; }
  ::-webkit-scrollbar { width: 5px; height: 5px; }
  ::-webkit-scrollbar-track { background: #0d1117; }
  ::-webkit-scrollbar-thumb { background: #2a3147; border-radius: 99px; }

  @keyframes fadeUp    { from{opacity:0;transform:translateY(32px);} to{opacity:1;transform:translateY(0);} }
  @keyframes fadeIn    { from{opacity:0;} to{opacity:1;} }
  @keyframes slideDown { from{opacity:0;transform:translateY(-14px);} to{opacity:1;transform:translateY(0);} }
  @keyframes slideRight{ from{opacity:0;transform:translateX(24px);} to{opacity:1;transform:translateX(0);} }
  @keyframes float     { 0%,100%{transform:translateY(0) rotate(-1deg);} 50%{transform:translateY(-20px) rotate(1deg);} }
  @keyframes floatSlow { 0%,100%{transform:translateY(0);} 50%{transform:translateY(-12px);} }
  @keyframes pulse     { 0%,100%{transform:scale(1);} 50%{transform:scale(1.05);} }
  @keyframes spin      { to{transform:rotate(360deg);} }
  @keyframes shimmer   { 0%{background-position:200% 0;} 100%{background-position:-200% 0;} }
  @keyframes toastIn   { from{opacity:0;transform:translateX(110%);} to{opacity:1;transform:translateX(0);} }
  @keyframes toastOut  { from{opacity:1;transform:translateX(0);} to{opacity:0;transform:translateX(110%);} }
  @keyframes orbitA    { 0%{transform:rotate(0deg) translateX(100px) rotate(0deg);} 100%{transform:rotate(360deg) translateX(100px) rotate(-360deg);} }
  @keyframes orbitB    { 0%{transform:rotate(120deg) translateX(75px) rotate(-120deg);} 100%{transform:rotate(480deg) translateX(75px) rotate(-480deg);} }
  @keyframes orbitC    { 0%{transform:rotate(240deg) translateX(55px) rotate(-240deg);} 100%{transform:rotate(600deg) translateX(55px) rotate(-600deg);} }
  @keyframes gradMove  { 0%{background-position:0% 50%;} 50%{background-position:100% 50%;} 100%{background-position:0% 50%;} }
  @keyframes glowPulse { 0%,100%{box-shadow:0 0 20px rgba(99,179,255,.3);} 50%{box-shadow:0 0 40px rgba(99,179,255,.6);} }
  @keyframes borderGlow{ 0%,100%{border-color:rgba(99,179,255,.3);} 50%{border-color:rgba(99,179,255,.7);} }
  @keyframes scanLine  { 0%{top:-100%;} 100%{top:200%;} }
  @keyframes zoomIn    { from{opacity:0;transform:scale(.92);} to{opacity:1;transform:scale(1);} }
  @keyframes cartBounce{ 0%{transform:scale(1);} 30%{transform:scale(1.35);} 60%{transform:scale(.9);} 100%{transform:scale(1);} }
  @keyframes ripple    { 0%{transform:scale(0);opacity:.4;} 100%{transform:scale(4);opacity:0;} }

  .fade-up    { animation: fadeUp    .6s cubic-bezier(.22,1,.36,1) both; }
  .fade-in    { animation: fadeIn    .4s ease both; }
  .zoom-in    { animation: zoomIn    .5s cubic-bezier(.22,1,.36,1) both; }
  .slide-d    { animation: slideDown .38s ease both; }
  .slide-r    { animation: slideRight .4s ease both; }

  .card-hover { transition: transform .28s cubic-bezier(.22,1,.36,1), box-shadow .28s ease; cursor:pointer; }
  .card-hover:hover { transform: translateY(-8px); }

  .img-zoom img, .img-zoom .img-wrap { transition: transform .5s cubic-bezier(.22,1,.36,1); }
  .img-zoom:hover img, .img-zoom:hover .img-wrap { transform: scale(1.07); }

  .btn-primary {
    background: linear-gradient(135deg, #3b7ff5, #6366f1);
    color: #fff; border: none; border-radius: 12px; padding: 12px 28px;
    font-weight: 700; font-size: 14px; cursor: pointer;
    transition: all .22s; position: relative; overflow: hidden;
    box-shadow: 0 4px 20px rgba(99,102,241,.4);
  }
  .btn-primary::before { content:''; position:absolute; inset:0; background:linear-gradient(135deg,#5b9ffd,#818cf8); opacity:0; transition:opacity .2s; }
  .btn-primary:hover::before { opacity:1; }
  .btn-primary:hover { transform:translateY(-2px); box-shadow:0 8px 28px rgba(99,102,241,.55); }
  .btn-primary:active { transform:translateY(0) scale(.98); }
  .btn-primary span { position:relative; z-index:1; }

  .btn-danger {
    background: linear-gradient(135deg, #e53e3e, #fc5f5f);
    color: #fff; border: none; border-radius: 12px; padding: 12px 28px;
    font-weight: 700; font-size: 14px; cursor: pointer;
    transition: all .22s; box-shadow: 0 4px 20px rgba(229,62,62,.35);
  }
  .btn-danger:hover { transform:translateY(-2px); box-shadow:0 8px 28px rgba(229,62,62,.5); }
  .btn-danger:active { transform:scale(.98); }

  .btn-outline {
    background: transparent; color: #7eb5ff;
    border: 1.5px solid rgba(126,181,255,.4); border-radius: 12px; padding: 11px 24px;
    font-weight: 700; font-size: 14px; cursor: pointer; transition: all .22s;
  }
  .btn-outline:hover { background:rgba(126,181,255,.08); border-color:rgba(126,181,255,.7); transform:translateY(-1px); }

  .btn-ghost {
    background: rgba(255,255,255,.07); color: #e2e8f0;
    border: 1px solid rgba(255,255,255,.12); border-radius: 12px; padding: 11px 22px;
    font-weight: 600; font-size: 14px; cursor: pointer; transition: all .22s;
    backdrop-filter: blur(10px);
  }
  .btn-ghost:hover { background: rgba(255,255,255,.12); border-color:rgba(255,255,255,.22); }

  .glass {
    background: rgba(12,16,28,.75); backdrop-filter: blur(24px);
    border: 1px solid rgba(255,255,255,.08);
  }
  .glass-light {
    background: rgba(255,255,255,.04); backdrop-filter: blur(16px);
    border: 1px solid rgba(255,255,255,.07);
  }

  .skeleton {
    background: linear-gradient(90deg, #111827 25%, #1a2236 50%, #111827 75%);
    background-size: 200% 100%; animation: shimmer 1.6s infinite; border-radius: 8px;
  }

  .badge {
    display: inline-block; font-size: 9px; font-weight: 800;
    letter-spacing: .08em; text-transform: uppercase; padding: 3px 8px;
    border-radius: 5px; color: #fff;
  }
  .stars { color: #f6c90e; font-size: 13px; }

  input:focus, select:focus, textarea:focus {
    outline: none; border-color: #3b7ff5 !important;
    box-shadow: 0 0 0 3px rgba(59,127,245,.18);
  }

  .neon-border { animation: borderGlow 2.5s ease-in-out infinite; }
  .glow-pulse  { animation: glowPulse 2.5s ease-in-out infinite; }

  .scrollbar-hide::-webkit-scrollbar { display: none; }
  .scrollbar-hide { -ms-overflow-style:none; scrollbar-width:none; }

  .product-card-bg {
    background: linear-gradient(145deg, #0d1428, #111827);
    border: 1px solid rgba(255,255,255,.06);
  }
  .product-card-bg:hover { border-color: rgba(99,179,255,.25); }

  .page-bg {
    background: #050810;
    background-image:
      radial-gradient(ellipse 80vw 60vh at 30% 0%, rgba(30,64,175,.12) 0%, transparent 60%),
      radial-gradient(ellipse 60vw 40vh at 80% 80%, rgba(99,102,241,.08) 0%, transparent 50%);
  }

  @media (max-width: 768px) {
    .hide-mobile   { display: none !important; }
    .cat-grid      { grid-template-columns: repeat(4,1fr) !important; }
    .product-grid  { grid-template-columns: repeat(2,1fr) !important; }
    .deal-grid     { grid-template-columns: 1fr !important; }
    .sidebar       { display: none; }
    .contact-grid  { grid-template-columns: 1fr !important; }
    .stats-grid    { grid-template-columns: repeat(2,1fr) !important; }
    .footer-grid   { grid-template-columns: 1fr 1fr !important; }
    .hero-mobile   { flex-direction: column !important; }
  }
`;

/* ═══════════════════════════════════════════════════════════════
   DATA
═══════════════════════════════════════════════════════════════ */
const IMGS = {
  iphone:  ["https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=600&q=80","https://images.unsplash.com/photo-1512054502232-10a0a035d672?w=600&q=80","https://images.unsplash.com/photo-1574755393849-623942496936?w=600&q=80"],
  samsung: ["https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600&q=80","https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=600&q=80","https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600&q=80"],
  head:    ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80","https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600&q=80","https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&q=80"],
  mac:     ["https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=600&q=80","https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&q=80","https://images.unsplash.com/photo-1542393545-10f5cde2c810?w=600&q=80"],
  op:      ["https://images.unsplash.com/photo-1567581935884-3349723552ca?w=600&q=80","https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&q=80","https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80"],
  tv:      ["https://images.unsplash.com/photo-1593359677879-a4bb92f829e1?w=600&q=80","https://images.unsplash.com/photo-1461151304267-38535e780c79?w=600&q=80","https://images.unsplash.com/photo-1509281373149-e957c6296406?w=600&q=80"],
  bose:    ["https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&q=80","https://images.unsplash.com/photo-1524678606370-a47ad25cb82a?w=600&q=80","https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?w=600&q=80"],
  dell:    ["https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600&q=80","https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600&q=80","https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=600&q=80"],
  ipad:    ["https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&q=80","https://images.unsplash.com/photo-1561154464-82e9adf32764?w=600&q=80","https://images.unsplash.com/photo-1589739900266-43b2843f4c12?w=600&q=80"],
  air:     ["https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=600&q=80","https://images.unsplash.com/photo-1588423771073-b8903fead714?w=600&q=80","https://images.unsplash.com/photo-1598331668826-20cecc596b86?w=600&q=80"],
  watch:   ["https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=600&q=80","https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80","https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=600&q=80"],
  cam:     ["https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&q=80","https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=600&q=80","https://images.unsplash.com/photo-1495121553079-4c61bcce1894?w=600&q=80"],
  pixel:   ["https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&q=80","https://images.unsplash.com/photo-1567581935884-3349723552ca?w=600&q=80","https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600&q=80"],
  asus:    ["https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=600&q=80","https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600&q=80","https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600&q=80"],
  ps5:     ["https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=600&q=80","https://images.unsplash.com/photo-1617096200347-cb04ae810b1d?w=600&q=80","https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=600&q=80"],
  kindle:  ["https://images.unsplash.com/photo-1592431913823-7af6b323da9b?w=600&q=80","https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&q=80","https://images.unsplash.com/photo-1589739900266-43b2843f4c12?w=600&q=80"],
  router:  ["https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=600&q=80","https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&q=80","https://images.unsplash.com/photo-1562408590-e32931084e23?w=600&q=80"],
  gopro:   ["https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&q=80","https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=600&q=80","https://images.unsplash.com/photo-1495121553079-4c61bcce1894?w=600&q=80"],
  ssd:     ["https://images.unsplash.com/photo-1531492746076-161ca9bcad58?w=600&q=80","https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80","https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&q=80"],
  drone:   ["https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=600&q=80","https://images.unsplash.com/photo-1527977966376-1c8408f9f108?w=600&q=80","https://images.unsplash.com/photo-1508444845599-5c89863b1c44?w=600&q=80"],
};

const PRODUCTS = [
  { id:1,  name:"iPhone 15 Pro Max",        brand:"apple",   cat:"phones",       price:159900, mrp:179900, rating:4.8, reviews:2341, imgs:IMGS.iphone, badge:"Hot",         specs:{Display:'6.7" Super Retina XDR',Processor:"A17 Pro",RAM:"8GB",Storage:"256GB",Battery:"4422 mAh",Camera:"48MP Triple"},   hi:["Titanium design","USB-C","Action Button"], desc:"The most powerful iPhone ever, with the A17 Pro chip and a pro-grade 48MP camera system." },
  { id:2,  name:"Samsung Galaxy S24 Ultra", brand:"samsung", cat:"phones",       price:134999, mrp:149999, rating:4.7, reviews:1892, imgs:IMGS.samsung,badge:"Deal",        specs:{Display:'6.8" Dynamic AMOLED',Processor:"Snapdragon 8 Gen 3",RAM:"12GB",Storage:"256GB",Battery:"5000 mAh",Camera:"200MP Quad"}, hi:["Built-in S Pen","Galaxy AI","Titanium"], desc:"Redefined productivity with AI at its core and the legendary S Pen experience." },
  { id:3,  name:"Sony WH-1000XM5",          brand:"sony",    cat:"audio",        price:26990,  mrp:34990,  rating:4.9, reviews:4521, imgs:IMGS.head,   badge:"Best Seller", specs:{Driver:"30mm",ANC:"Industry-leading",Battery:"30 hours",Bluetooth:"5.2",Weight:"250g",Foldable:"Yes"},  hi:["Best ANC","30hr battery","Multipoint"], desc:"The benchmark for noise-cancelling. Nothing comes close." },
  { id:4,  name:'MacBook Pro 14" M3',        brand:"apple",   cat:"laptops",      price:199900, mrp:219900, rating:4.9, reviews:1204, imgs:IMGS.mac,    badge:"New",         specs:{Processor:"Apple M3 Pro",RAM:"18GB",Storage:"512GB SSD",Display:'14.2" Liquid Retina',Battery:"18 hours",Ports:"3× Thunderbolt 4"}, hi:["M3 Pro chip","Retina XDR","18hr battery"], desc:"The world's best pro laptop. Blazing fast, all day long." },
  { id:5,  name:"OnePlus 12R",              brand:"oneplus", cat:"phones",       price:39999,  mrp:44999,  rating:4.6, reviews:987,  imgs:IMGS.op,     badge:"Value",       specs:{Display:'6.78" AMOLED 120Hz',Processor:"Snapdragon 8 Gen 2",RAM:"16GB",Storage:"256GB",Battery:"5500 mAh",Charging:"100W"}, hi:["100W charging","5500mAh","Hasselblad"], desc:"Flagship specs at an honest price. The ultimate performance mid-ranger." },
  { id:6,  name:'Samsung 65" QLED 4K',      brand:"samsung", cat:"tvs",          price:89990,  mrp:119990, rating:4.7, reviews:654,  imgs:IMGS.tv,     badge:"25% Off",     specs:{Panel:"QLED",Resolution:"4K Ultra HD",Refresh:"120Hz",HDR:"HDR10+",Smart:"Tizen OS",Ports:"4× HDMI 2.1"}, hi:["Quantum Dot","Gaming Hub","AI Upscaling"], desc:"Cinematic colours with AI-enhanced picture — the ultimate living room centrepiece." },
  { id:7,  name:"Bose QuietComfort 45",     brand:"bose",    cat:"audio",        price:24990,  mrp:32990,  rating:4.7, reviews:2103, imgs:IMGS.bose,   badge:"Popular",     specs:{Driver:"40mm TriPort",ANC:"Quiet + Aware",Battery:"24 hours",Bluetooth:"5.1",Weight:"238g",Foldable:"Yes"}, hi:["Bose signature","Quiet & Aware","All-day comfort"], desc:"World-class comfort meets legendary Bose sound." },
  { id:8,  name:"Dell XPS 15 OLED",         brand:"dell",    cat:"laptops",      price:169900, mrp:189900, rating:4.6, reviews:743,  imgs:IMGS.dell,   badge:"Deal",        specs:{Processor:"Intel i9-13900H",RAM:"32GB DDR5",Storage:"1TB SSD",Display:'15.6" OLED 3.5K',Battery:"86Whr",GPU:"RTX 4070"}, hi:["OLED display","RTX 4070","Premium build"], desc:"The creator's weapon of choice — OLED brilliance, RTX power." },
  { id:9,  name:"Apple iPad Pro M2",        brand:"apple",   cat:"tablets",      price:112900, mrp:124900, rating:4.8, reviews:876,  imgs:IMGS.ipad,   badge:"New",         specs:{Processor:"Apple M2",Display:'12.9" Liquid Retina',RAM:"8GB",Storage:"256GB",Battery:"10541 mAh",Camera:"12MP + 10MP"}, hi:["M2 chip","XDR display","Apple Pencil"], desc:"Thin, light and staggeringly powerful — the ultimate portable computer." },
  { id:10, name:"AirPods Pro 2nd Gen",      brand:"apple",   cat:"audio",        price:24900,  mrp:26900,  rating:4.8, reviews:3201, imgs:IMGS.air,    badge:"Hot",         specs:{ANC:"Adaptive Transparency",Battery:"6hr + 30hr",Chip:"H2",Water:"IP54",Spatial:"Personalized",Case:"MagSafe"}, hi:["H2 chip ANC","Adaptive mode","MagSafe"], desc:"H2 chip delivers richer audio and smarter noise cancellation." },
  { id:11, name:"Apple Watch Series 9",     brand:"apple",   cat:"wearables",    price:41900,  mrp:44900,  rating:4.7, reviews:1543, imgs:IMGS.watch,  badge:"Popular",     specs:{Chip:"S9 SiP",Display:"Always-On LTPO OLED",Health:"Blood O₂ + ECG",GPS:"L1 + L5",Water:"50m",Battery:"18 hours"}, hi:["Double Tap","Brighter display","Crash Detection"], desc:"More powerful. More personalised. The most capable Apple Watch ever." },
  { id:12, name:"Sony Alpha ZV-E10",        brand:"sony",    cat:"cameras",      price:62990,  mrp:74990,  rating:4.6, reviews:432,  imgs:IMGS.cam,    badge:"Creator",     specs:{Sensor:"24.2MP APS-C",Video:"4K 30fps",AF:"Real-time Eye AF",Display:'3" Vari-angle',ISO:"100-32000",Lens:"16-50mm kit"}, hi:["Vari-angle","Eye AF","4K video"], desc:"The ultimate vlogging camera — compact, powerful, creator-focused." },
  { id:13, name:"Google Pixel 8 Pro",       brand:"google",  cat:"phones",       price:106999, mrp:119999, rating:4.7, reviews:1123, imgs:IMGS.pixel,  badge:"AI",          specs:{Display:'6.7" LTPO OLED',Processor:"Google Tensor G3",RAM:"12GB",Storage:"256GB",Battery:"5050 mAh",Camera:"50MP Triple"}, hi:["Google AI features","7yr updates","Best Photos app"], desc:"Google's most intelligent phone yet, packed with advanced AI features." },
  { id:14, name:"ASUS ROG Zephyrus G14",    brand:"asus",    cat:"laptops",      price:149900, mrp:169900, rating:4.8, reviews:612,  imgs:IMGS.asus,   badge:"Gaming",      specs:{Processor:"AMD Ryzen 9 7940HS",RAM:"32GB",Storage:"1TB SSD",Display:'14" QHD 165Hz',Battery:"73Whr",GPU:"RTX 4060"}, hi:["RTX 4060","QHD 165Hz","Ultra-thin gaming"], desc:"The most powerful compact gaming laptop. Small body, monster performance." },
  { id:15, name:"Sony PlayStation 5",       brand:"sony",    cat:"gaming",       price:54990,  mrp:59990,  rating:4.9, reviews:5821, imgs:IMGS.ps5,    badge:"Hot",         specs:{CPU:"AMD Zen 2 8-core",GPU:"AMD RDNA 2 10.3TF",Storage:"825GB NVMe SSD",Display:"4K 120fps",Audio:"Tempest 3D",Controller:"DualSense"}, hi:["4K 120fps","Ultra-fast SSD","3D Audio"], desc:"Next-gen gaming. The fastest, most powerful PlayStation ever made." },
  { id:16, name:"Kindle Paperwhite 2023",   brand:"amazon",  cat:"tablets",      price:14999,  mrp:19999,  rating:4.8, reviews:8923, imgs:IMGS.kindle, badge:"Best Seller", specs:{Display:'6.8" 300 PPI e-ink',Storage:"16GB",Battery:"10 weeks",Backlight:"Adjustable warm",Water:"IPX8",Connectivity:"Wi-Fi 5"}, hi:["300 PPI display","10-week battery","Waterproof"], desc:"The best Kindle ever — glare-free display and weeks of battery life." },
  { id:17, name:"Asus ROG Router AX11000",  brand:"asus",    cat:"accessories",  price:22999,  mrp:29999,  rating:4.7, reviews:521,  imgs:IMGS.router, badge:"Gaming",      specs:{Speed:"AX11000 Tri-band",Ports:"4× Gigabit LAN",Coverage:"5000 sqft",Processor:"Quad-core 1.8GHz",RAM:"2GB DDR4",Security:"WPA3"}, hi:["AX11000 Wi-Fi 6","Game acceleration","Armour security"], desc:"Dominate your network. Blazing fast Wi-Fi 6 for the ultimate gaming setup." },
  { id:18, name:"DJI Mini 4 Pro Drone",     brand:"dji",     cat:"cameras",      price:74990,  mrp:84990,  rating:4.8, reviews:743,  imgs:IMGS.drone,  badge:"New",         specs:{Video:"4K/60fps HDR",Sensor:"1/1.3\" CMOS",Weight:"249g",Range:"20km",Battery:"34 min",Obstacle:"Omnidirectional"}, hi:["4K/60fps HDR","Omnidirectional avoid","249g ultralight"], desc:"The lightest drone with omnidirectional obstacle sensing and 4K/60fps." },
  { id:19, name:"Samsung 980 Pro 2TB SSD",  brand:"samsung", cat:"accessories",  price:12999,  mrp:17999,  rating:4.9, reviews:3421, imgs:IMGS.ssd,    badge:"Deal",        specs:{Interface:"NVMe PCIe 4.0",Read:"7000 MB/s",Write:"6500 MB/s",Capacity:"2TB",Form:"M.2 2280",Endurance:"1200 TBW"}, hi:["7000 MB/s read","PCIe 4.0","2TB capacity"], desc:"Unleash next-level computing with blazing-fast NVMe speeds." },
  { id:20, name:"GoPro Hero 12 Black",      brand:"gopro",   cat:"cameras",      price:34999,  mrp:39999,  rating:4.7, reviews:1023, imgs:IMGS.gopro,  badge:"Adventure",   specs:{Video:"5.3K/60fps",Stabilization:"HyperSmooth 6.0",Battery:"30% longer",Water:"10m depth",Audio:"Wind noise reduction",Display:"Front + Rear"}, hi:["5.3K/60fps","HyperSmooth 6.0","10m waterproof"], desc:"The most powerful GoPro ever — go anywhere, capture everything." },
];

const CATEGORIES = [
  {id:"phones",     name:"Phones",     icon:"📱", color:"#3b82f6"},
  {id:"laptops",    name:"Laptops",    icon:"💻", color:"#8b5cf6"},
  {id:"tablets",    name:"Tablets",    icon:"📲", color:"#10b981"},
  {id:"audio",      name:"Audio",      icon:"🎧", color:"#f59e0b"},
  {id:"cameras",    name:"Cameras",    icon:"📷", color:"#ec4899"},
  {id:"tvs",        name:"TVs",        icon:"📺", color:"#0ea5e9"},
  {id:"wearables",  name:"Wearables",  icon:"⌚", color:"#6366f1"},
  {id:"gaming",     name:"Gaming",     icon:"🎮", color:"#ef4444"},
  {id:"accessories",name:"Accessories",icon:"⌨️", color:"#64748b"},
];

const BRANDS = [
  {id:"apple",   name:"Apple",   logo:"🍎", tagline:"Think Different"},
  {id:"samsung", name:"Samsung", logo:"🌀", tagline:"Do What You Can't"},
  {id:"sony",    name:"Sony",    logo:"🎵", tagline:"Be Moved"},
  {id:"bose",    name:"Bose",    logo:"🔊", tagline:"Better Sound"},
  {id:"oneplus", name:"OnePlus", logo:"🔴", tagline:"Never Settle"},
  {id:"dell",    name:"Dell",    logo:"💻", tagline:"Power to Do More"},
  {id:"asus",    name:"Asus",    logo:"🛡️",  tagline:"Incredible Machines"},
  {id:"google",  name:"Google",  logo:"🔵", tagline:"Be More With Google"},
  {id:"dji",     name:"DJI",     logo:"🚁", tagline:"The Sky Is Not The Limit"},
  {id:"gopro",   name:"GoPro",   logo:"📷", tagline:"Be A Hero"},
];

const DEALS = [
  {id:1, productId:6, extraOff:5000, endsIn:7200},
  {id:2, productId:3, extraOff:2000, endsIn:14400},
  {id:3, productId:5, extraOff:3000, endsIn:3600},
];

const BADGE_COLORS = {
  "Hot":"#e53e3e","Deal":"#2563eb","Best Seller":"#d97706","New":"#059669",
  "Value":"#7c3aed","Popular":"#ea580c","25% Off":"#e53e3e","Creator":"#0891b2",
  "AI":"#6366f1","Gaming":"#16a34a","Adventure":"#b45309","Best Seller":"#d97706",
};

const fmt  = n => "₹" + n.toLocaleString("en-IN");
const disc = (p, m) => Math.round(((m - p) / m) * 100);

/* ═══════════════════════════════════════════════════════════════
   HOOKS
═══════════════════════════════════════════════════════════════ */
function useCountdown(sec) {
  const [left, setLeft] = useState(sec);
  useEffect(() => {
    const t = setInterval(() => setLeft(s => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, []);
  return [
    String(Math.floor(left / 3600)).padStart(2,"0"),
    String(Math.floor((left % 3600) / 60)).padStart(2,"0"),
    String(left % 60).padStart(2,"0"),
  ].join(":");
}

function useScrollReveal() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setVisible(true); obs.disconnect(); }
    }, { threshold: 0.1 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return { ref, visible };
}

/* ═══════════════════════════════════════════════════════════════
   TOAST SYSTEM
═══════════════════════════════════════════════════════════════ */
function useToast() {
  const [toasts, setToasts] = useState([]);
  const add = useCallback((msg, type = "success") => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, msg, type, out: false }]);
    setTimeout(() => setToasts(prev => prev.map(t => t.id === id ? {...t, out:true} : t)), 2800);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3200);
  }, []);
  return { toasts, toast: add };
}

function ToastContainer({ toasts }) {
  const colors  = { success:"#22c55e", error:"#ef4444", info:"#3b82f6", warning:"#f59e0b" };
  const icons   = { success:"✓", error:"✕", info:"ℹ", warning:"⚠" };
  return (
    <div style={{ position:"fixed", top:82, right:18, zIndex:9999, display:"flex", flexDirection:"column", gap:10, pointerEvents:"none" }}>
      {toasts.map(t => (
        <div key={t.id} style={{
          background:"rgba(10,14,26,.96)", backdropFilter:"blur(20px)",
          borderLeft:`3px solid ${colors[t.type]}`, padding:"13px 20px",
          borderRadius:14, boxShadow:`0 12px 40px rgba(0,0,0,.5), 0 0 0 1px rgba(255,255,255,.06)`,
          display:"flex", alignItems:"center", gap:12, minWidth:260,
          animation: t.out ? "toastOut .3s ease forwards" : "toastIn .38s cubic-bezier(.22,1,.36,1) forwards"
        }}>
          <span style={{ width:22, height:22, borderRadius:"50%", background:colors[t.type] + "22", border:`1px solid ${colors[t.type]}`, color:colors[t.type], display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:800, flexShrink:0 }}>{icons[t.type]}</span>
          <span style={{ fontSize:13, fontWeight:600, color:"#e2e8f0" }}>{t.msg}</span>
        </div>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   CART MODAL
═══════════════════════════════════════════════════════════════ */
function CartModal({ cart, onClose, onRemove, onClear, toast }) {
  const total = cart.reduce((s,p) => s + p.price, 0);
  const [checkedOut, setCheckedOut] = useState(false);
  const [processing, setProcessing] = useState(false);

  const handleCheckout = async () => {
    setProcessing(true);
    await new Promise(r => setTimeout(r, 1800));
    setProcessing(false);
    setCheckedOut(true);
    toast("Order placed successfully! 🎉", "success");
    setTimeout(() => { onClear(); onClose(); }, 2500);
  };

  return (
    <div onClick={onClose} style={{
      position:"fixed", inset:0, zIndex:2000,
      background:"rgba(0,0,0,.7)", backdropFilter:"blur(6px)",
      display:"flex", alignItems:"flex-start", justifyContent:"flex-end",
    }}>
      <div onClick={e => e.stopPropagation()} className="slide-r" style={{
        width:420, height:"100vh", background:"#0a0e1a",
        borderLeft:"1px solid rgba(255,255,255,.08)", display:"flex", flexDirection:"column",
        overflow:"hidden",
      }}>
        {/* Header */}
        <div style={{ padding:"22px 24px 18px", borderBottom:"1px solid rgba(255,255,255,.07)", display:"flex", alignItems:"center", justifyContent:"space-between", flexShrink:0 }}>
          <div>
            <h2 style={{ fontFamily:"'Syne',sans-serif", fontSize:20, fontWeight:800, color:"#fff", margin:0 }}>Shopping Cart</h2>
            <p style={{ fontSize:12, color:"#64748b", margin:"3px 0 0" }}>{cart.length} item{cart.length !== 1 ? "s" : ""}</p>
          </div>
          <button onClick={onClose} style={{ width:36, height:36, background:"rgba(255,255,255,.06)", border:"1px solid rgba(255,255,255,.08)", borderRadius:"50%", color:"#94a3b8", fontSize:18, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>×</button>
        </div>

        {/* Items */}
        <div style={{ flex:1, overflowY:"auto", padding:"16px 24px" }}>
          {checkedOut ? (
            <div style={{ textAlign:"center", padding:"60px 0" }}>
              <div style={{ fontSize:60, marginBottom:16, animation:"pulse 1s ease 2" }}>🎉</div>
              <h3 style={{ fontFamily:"'Syne',sans-serif", fontSize:22, color:"#fff", marginBottom:8 }}>Order Placed!</h3>
              <p style={{ color:"#64748b", fontSize:14 }}>Closing in a moment…</p>
            </div>
          ) : cart.length === 0 ? (
            <div style={{ textAlign:"center", padding:"60px 0" }}>
              <div style={{ fontSize:52, marginBottom:14, opacity:.4 }}>🛒</div>
              <p style={{ color:"#475569", fontSize:15, fontWeight:600 }}>Your cart is empty</p>
            </div>
          ) : cart.map((item, i) => (
            <div key={`${item.id}-${i}`} style={{ display:"flex", gap:14, padding:"14px 0", borderBottom:"1px solid rgba(255,255,255,.05)" }}>
              <div style={{ width:72, height:72, borderRadius:12, overflow:"hidden", flexShrink:0, background:"#111827" }}>
                <img src={item.imgs?.[0]} alt={item.name} style={{ width:"100%", height:"100%", objectFit:"cover" }} onError={e => { e.target.style.display = "none"; }} />
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <p style={{ fontSize:13, fontWeight:700, color:"#e2e8f0", margin:"0 0 3px", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{item.name}</p>
                <p style={{ fontSize:12, color:"#64748b", margin:"0 0 6px", textTransform:"capitalize" }}>{item.brand}</p>
                <p style={{ fontSize:16, fontWeight:800, color:"#7eb5ff" }}>{fmt(item.price)}</p>
              </div>
              <button onClick={() => onRemove(i)} style={{ background:"rgba(239,68,68,.1)", border:"1px solid rgba(239,68,68,.2)", borderRadius:8, color:"#f87171", cursor:"pointer", fontSize:12, fontWeight:700, padding:"6px 10px", flexShrink:0, height:"fit-content", alignSelf:"center" }}>✕</button>
            </div>
          ))}
        </div>

        {/* Footer */}
        {!checkedOut && cart.length > 0 && (
          <div style={{ padding:"18px 24px 24px", borderTop:"1px solid rgba(255,255,255,.07)", flexShrink:0 }}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:16 }}>
              <span style={{ fontSize:14, color:"#94a3b8" }}>Total ({cart.length} items)</span>
              <span style={{ fontSize:22, fontWeight:900, color:"#7eb5ff", fontFamily:"'Syne',sans-serif" }}>{fmt(total)}</span>
            </div>
            <button onClick={handleCheckout} disabled={processing} className="btn-primary" style={{ width:"100%", padding:"16px", fontSize:15, display:"flex", alignItems:"center", justifyContent:"center", gap:10 }}>
              {processing ? (
                <><span style={{ width:16, height:16, border:"2px solid rgba(255,255,255,.3)", borderTopColor:"#fff", borderRadius:"50%", animation:"spin .7s linear infinite", display:"inline-block" }} /><span>Processing…</span></>
              ) : <span>⚡ Checkout — {fmt(total)}</span>}
            </button>
            <button onClick={onClear} style={{ width:"100%", marginTop:10, background:"transparent", border:"none", color:"#64748b", fontSize:13, cursor:"pointer", padding:"8px" }}>Clear all items</button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SHARED ATOMS
═══════════════════════════════════════════════════════════════ */
function SafeImg({ src, alt, style, className }) {
  const [err, setErr] = useState(false);
  if (err) return (
    <div style={{...style, background:"#111827", display:"flex", alignItems:"center", justifyContent:"center"}} className={className}>
      <span style={{ fontSize:28, opacity:.4 }}>📦</span>
    </div>
  );
  return <img src={src} alt={alt} style={style} className={className} onError={() => setErr(true)} loading="lazy" />;
}

function Stars({ rating }) {
  return (
    <span className="stars">
      {"★".repeat(Math.floor(rating))}{"☆".repeat(5 - Math.floor(rating))}
      <span style={{ color:"#475569", marginLeft:5, fontSize:12 }}>{rating}</span>
    </span>
  );
}

function Reveal({ children, delay = 0, style = {} }) {
  const { ref, visible } = useScrollReveal();
  return (
    <div ref={ref} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "none" : "translateY(30px)",
      transition: `opacity .6s cubic-bezier(.22,1,.36,1) ${delay}ms, transform .6s cubic-bezier(.22,1,.36,1) ${delay}ms`,
      ...style
    }}>
      {children}
    </div>
  );
}

function SectionTitle({ children, accent = "#3b7ff5" }) {
  return (
    <h2 style={{
      fontFamily:"'Syne',sans-serif", fontSize:24, fontWeight:800, color:"#f1f5f9",
      margin:"0 0 24px", display:"flex", alignItems:"center", gap:14
    }}>
      <span style={{ width:4, height:26, background:`linear-gradient(135deg,${accent},${accent}99)`, borderRadius:2, display:"inline-block", flexShrink:0 }} />
      {children}
    </h2>
  );
}

/* ═══════════════════════════════════════════════════════════════
   NAVBAR
═══════════════════════════════════════════════════════════════ */
function Navbar({ page, setPage, cart, compareCount, onSearch, onCartOpen }) {
  const [scrolled, setScrolled] = useState(false);
  const [q, setQ] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  const nav = k => { setPage(k); setMobileOpen(false); window.scrollTo({ top:0, behavior:"smooth" }); };
  const links = [["home","Home"],["category","Shop"],["deals","🔥 Deals"],["brands","Brands"],["compare","Compare"],["contact","Contact"]];

  return (
    <nav style={{
      position:"fixed", top:0, left:0, right:0, zIndex:1000,
      background: scrolled ? "rgba(5,8,16,.95)" : "transparent",
      backdropFilter: scrolled ? "blur(24px)" : "none",
      borderBottom: scrolled ? "1px solid rgba(255,255,255,.06)" : "none",
      transition:"all .35s cubic-bezier(.22,1,.36,1)",
    }}>
      <div style={{ maxWidth:1380, margin:"0 auto", padding:"0 24px", display:"flex", alignItems:"center", gap:14, height:66 }}>
        {/* Logo */}
        <button onClick={() => nav("home")} style={{ background:"none", border:"none", cursor:"pointer", display:"flex", alignItems:"center", gap:8, flexShrink:0 }}>
          <div style={{
            width:34, height:34, borderRadius:10,
            background:"linear-gradient(135deg, #3b7ff5, #8b5cf6)",
            display:"flex", alignItems:"center", justifyContent:"center",
            fontSize:17, color:"#fff", fontWeight:900,
            boxShadow:"0 4px 16px rgba(59,127,245,.45)"
          }}>⚡</div>
          <span style={{ fontFamily:"'Syne',sans-serif", fontSize:21, fontWeight:900, letterSpacing:"-1px" }}>
            <span style={{ color:"#7eb5ff" }}>Volt</span><span style={{ color:"#fff" }}>X</span>
          </span>
        </button>

        {/* Nav links */}
        <div className="hide-mobile" style={{ display:"flex", gap:2, marginLeft:6 }}>
          {links.map(([k,l]) => (
            <button key={k} onClick={() => nav(k)} style={{
              background: page===k ? "rgba(59,127,245,.14)" : "transparent",
              color: page===k ? "#7eb5ff" : "#94a3b8",
              border: "none", borderRadius:9, padding:"7px 13px", fontSize:13,
              cursor:"pointer", fontWeight: page===k ? 700 : 500,
              transition:"all .18s", position:"relative",
            }}>
              {l}
              {k==="compare" && compareCount>0 && (
                <span style={{ position:"absolute", top:3, right:3, width:15, height:15, background:"#3b7ff5", borderRadius:"50%", fontSize:8, fontWeight:900, color:"#fff", display:"flex", alignItems:"center", justifyContent:"center" }}>{compareCount}</span>
              )}
            </button>
          ))}
        </div>

        {/* Search */}
        <div style={{ flex:1, position:"relative", maxWidth:420 }}>
          <span style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", color:"#4b5563", fontSize:14, pointerEvents:"none" }}>🔍</span>
          <input
            value={q}
            onChange={e => { setQ(e.target.value); onSearch(e.target.value); }}
            onKeyDown={e => e.key === "Enter" && nav("category")}
            placeholder="Search phones, laptops, audio…"
            style={{
              width:"100%", background:"rgba(255,255,255,.04)",
              border:"1px solid rgba(255,255,255,.07)", borderRadius:11,
              padding:"9px 36px 9px 36px", fontSize:13, color:"#e2e8f0",
              outline:"none", transition:"border-color .2s",
            }}
          />
          {q && <button onClick={() => { setQ(""); onSearch(""); }} style={{ position:"absolute", right:10, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", color:"#4b5563", cursor:"pointer", fontSize:16 }}>×</button>}
        </div>

        {/* Icons */}
        <button onClick={() => nav("compare")} style={{ position:"relative", background:"none", border:"none", color:"#94a3b8", cursor:"pointer", fontSize:19, padding:"7px 10px", transition:"color .2s" }}
          onMouseEnter={e=>e.currentTarget.style.color="#7eb5ff"}
          onMouseLeave={e=>e.currentTarget.style.color="#94a3b8"}>
          ⚖️
          {compareCount > 0 && <span style={{ position:"absolute", top:4, right:4, width:15, height:15, background:"#3b7ff5", borderRadius:"50%", fontSize:8, fontWeight:900, color:"#fff", display:"flex", alignItems:"center", justifyContent:"center" }}>{compareCount}</span>}
        </button>

        <button onClick={onCartOpen} style={{ position:"relative", background:"none", border:"none", color:"#94a3b8", cursor:"pointer", fontSize:19, padding:"7px 10px", transition:"all .2s" }}
          onMouseEnter={e=>e.currentTarget.style.color="#7eb5ff"}
          onMouseLeave={e=>e.currentTarget.style.color="#94a3b8"}>
          🛒
          {cart.length > 0 && (
            <span style={{
              position:"absolute", top:4, right:4, width:18, height:18,
              background:"linear-gradient(135deg,#e53e3e,#fc5f5f)",
              borderRadius:"50%", fontSize:9, fontWeight:900, color:"#fff",
              display:"flex", alignItems:"center", justifyContent:"center",
              animation: "cartBounce .4s ease",
              boxShadow:"0 2px 8px rgba(229,62,62,.5)"
            }}>{cart.length}</span>
          )}
        </button>

        {/* Mobile */}
        <button onClick={() => setMobileOpen(!mobileOpen)} style={{ background:"none", border:"none", color:"#fff", fontSize:22, cursor:"pointer", display:"none" }} className="hide-desktop">☰</button>
      </div>

      {mobileOpen && (
        <div className="slide-d glass" style={{ borderTop:"1px solid rgba(255,255,255,.06)", padding:"14px 22px" }}>
          {links.map(([k,l]) => (
            <button key={k} onClick={() => nav(k)} style={{ display:"block", width:"100%", textAlign:"left", padding:"11px 12px", background:"none", border:"none", color: page===k?"#7eb5ff":"#94a3b8", fontSize:14, fontWeight: page===k?700:500, cursor:"pointer", borderRadius:9 }}>{l}</button>
          ))}
        </div>
      )}
    </nav>
  );
}

/* ═══════════════════════════════════════════════════════════════
   PRODUCT CARD
═══════════════════════════════════════════════════════════════ */
function ProductCard({ product, onView, onCompare, onCart, compareList, toast, loading }) {
  const [wished, setWished] = useState(false);
  const [addAnim, setAddAnim] = useState(false);

  if (loading) {
    return (
      <div style={{ background:"#0d1428", borderRadius:18, overflow:"hidden", border:"1px solid rgba(255,255,255,.05)" }}>
        <div className="skeleton" style={{ height:190 }} />
        <div style={{ padding:16 }}>
          <div className="skeleton" style={{ height:10, marginBottom:8, width:"60%" }} />
          <div className="skeleton" style={{ height:14, marginBottom:10, width:"85%" }} />
          <div className="skeleton" style={{ height:12, marginBottom:12 }} />
          <div className="skeleton" style={{ height:18, width:"50%" }} />
        </div>
      </div>
    );
  }

  if (!product) return null;

  const inCmp = (compareList || []).includes(product.id);
  const d = disc(product.price, product.mrp);

  const handleCart = e => {
    e.stopPropagation();
    setAddAnim(true);
    onCart(product);
    toast(`${product.name.split(" ").slice(0,3).join(" ")} added to cart 🛒`, "success");
    setTimeout(() => setAddAnim(false), 600);
  };

  const handleCompare = e => {
    e.stopPropagation();
    onCompare(product.id);
    toast(inCmp ? "Removed from compare" : "Added to compare ⚖️", "info");
  };

  return (
    <div
      className="card-hover product-card-bg"
      onClick={() => onView(product)}
      style={{ borderRadius:18, overflow:"hidden", display:"flex", flexDirection:"column", transition:"all .28s cubic-bezier(.22,1,.36,1)" }}
    >
      {/* Image */}
      <div className="img-zoom" style={{ position:"relative", height:196, overflow:"hidden", background:"#0a0f1e", flexShrink:0 }}>
        <SafeImg src={product.imgs?.[0]} alt={product.name} style={{ width:"100%", height:"100%", objectFit:"cover" }} />
        {/* Overlay gradient */}
        <div style={{ position:"absolute", bottom:0, left:0, right:0, height:60, background:"linear-gradient(to top, rgba(10,15,30,.8), transparent)", pointerEvents:"none" }} />
        {/* Badge */}
        {product.badge && (
          <span className="badge" style={{ position:"absolute", top:10, left:10, background:BADGE_COLORS[product.badge]||"#475569" }}>{product.badge}</span>
        )}
        {/* Discount chip */}
        {d > 0 && (
          <span style={{ position:"absolute", top:10, right:10, background:"rgba(34,197,94,.15)", border:"1px solid rgba(34,197,94,.3)", color:"#4ade80", fontSize:11, fontWeight:800, padding:"3px 8px", borderRadius:6 }}>{d}% off</span>
        )}
        {/* Wishlist */}
        <button onClick={e => { e.stopPropagation(); setWished(!wished); }} style={{
          position:"absolute", bottom:10, right:10, width:30, height:30,
          background:"rgba(0,0,0,.5)", backdropFilter:"blur(8px)",
          border:"1px solid rgba(255,255,255,.1)", borderRadius:"50%",
          color: wished ? "#f87171" : "#94a3b8", cursor:"pointer", fontSize:14,
          display:"flex", alignItems:"center", justifyContent:"center",
          transition:"all .2s",
        }}>{wished ? "❤️" : "🤍"}</button>
      </div>

      {/* Info */}
      <div style={{ padding:"14px 16px", flex:1, display:"flex", flexDirection:"column" }}>
        <p style={{ fontSize:10, color:"#4b6694", textTransform:"uppercase", fontWeight:700, letterSpacing:".08em", margin:"0 0 4px" }}>{product.brand}</p>
        <h3 style={{ fontFamily:"'Syne',sans-serif", fontSize:14, fontWeight:700, color:"#e2e8f0", margin:"0 0 8px", lineHeight:1.4, flex:1 }}>{product.name}</h3>
        <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:10 }}>
          <Stars rating={product.rating} />
          <span style={{ fontSize:10, color:"#334155" }}>({product.reviews.toLocaleString()})</span>
        </div>
        <div style={{ display:"flex", alignItems:"baseline", gap:8, marginBottom:14 }}>
          <span style={{ fontFamily:"'Syne',sans-serif", fontSize:18, fontWeight:800, color:"#7eb5ff" }}>{fmt(product.price)}</span>
          <span style={{ fontSize:12, color:"#334155", textDecoration:"line-through" }}>{fmt(product.mrp)}</span>
        </div>

        {/* Buttons */}
        <div style={{ display:"flex", gap:8 }}>
          <button
            onClick={handleCart}
            className="btn-primary"
            style={{
              flex:1, padding:"9px 8px", fontSize:12,
              borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center", gap:6,
              transform: addAnim ? "scale(.94)" : "scale(1)",
              transition:"transform .15s",
            }}
          >
            <span>🛒</span><span>Add to Cart</span>
          </button>
          <button
            onClick={handleCompare}
            style={{
              width:36, height:36, background: inCmp ? "rgba(59,127,245,.2)" : "rgba(255,255,255,.04)",
              border: `1px solid ${inCmp ? "rgba(59,127,245,.5)" : "rgba(255,255,255,.07)"}`,
              borderRadius:10, color: inCmp ? "#7eb5ff" : "#64748b",
              cursor:"pointer", fontSize:14, display:"flex", alignItems:"center", justifyContent:"center",
              transition:"all .2s", flexShrink:0,
            }}
            title="Compare"
          >⚖️</button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   HERO BANNER
═══════════════════════════════════════════════════════════════ */
function HeroBanner({ setPage, onCart, toast }) {
  const [active, setActive] = useState(0);
  const slides = [
    { title:"iPhone 15 Pro Max", sub:"Titanium. So strong. So light. So Pro.", price:"From ₹1,59,900", badge:"New Arrival", accent:"#63b3ff", accent2:"#8b5cf6", img:IMGS.iphone[0], product: PRODUCTS[0] },
    { title:"Samsung S24 Ultra", sub:"Galaxy AI is here. Your future starts now.", price:"From ₹1,34,999", badge:"Galaxy AI", accent:"#a78bfa", accent2:"#ec4899", img:IMGS.samsung[0], product: PRODUCTS[1] },
    { title:"MacBook Pro M3", sub:"Supercharged for pros. Unmatched performance.", price:"From ₹1,99,900", badge:"Editor's Pick", accent:"#34d399", accent2:"#3b82f6", img:IMGS.mac[0], product: PRODUCTS[3] },
    { title:"PlayStation 5", sub:"Play has no limits. Enter the next generation.", price:"From ₹54,990", badge:"Next-Gen", accent:"#f87171", accent2:"#fb923c", img:IMGS.ps5[0], product: PRODUCTS[14] },
  ];

  useEffect(() => {
    const t = setInterval(() => setActive(a => (a+1) % slides.length), 5500);
    return () => clearInterval(t);
  }, []);

  const s = slides[active];

  const handleBuyNow = e => {
    e.stopPropagation();
    onCart(s.product);
    toast(`${s.product.name.split(" ").slice(0,3).join(" ")} added to cart! ⚡`, "success");
  };

  return (
    <div style={{
      borderRadius:28, overflow:"hidden", position:"relative", minHeight:460,
      display:"flex", alignItems:"center",
      background:`radial-gradient(ellipse 80% 80% at 70% 50%, ${s.accent}18 0%, transparent 60%), radial-gradient(ellipse 60% 60% at 20% 80%, ${s.accent2}10 0%, transparent 50%), linear-gradient(135deg, #050810, #0a0e1a)`,
      transition:"background .8s ease",
      border:"1px solid rgba(255,255,255,.06)",
    }}>
      {/* Animated grid */}
      <div style={{
        position:"absolute", inset:0,
        backgroundImage:`linear-gradient(${s.accent}06 1px, transparent 1px), linear-gradient(90deg, ${s.accent}06 1px, transparent 1px)`,
        backgroundSize:"48px 48px",
        pointerEvents:"none",
      }} />

      {/* Glow blob */}
      <div style={{
        position:"absolute", right:"28%", top:"20%",
        width:300, height:300, borderRadius:"50%",
        background:`radial-gradient(circle, ${s.accent}18, transparent 70%)`,
        pointerEvents:"none",
        animation:"floatSlow 5s ease-in-out infinite",
      }} />

      {/* Content */}
      <div style={{ flex:1, padding:"56px 60px", position:"relative", zIndex:2 }}>
        <span style={{
          display:"inline-block", marginBottom:18,
          background:`${s.accent}14`, color:s.accent,
          border:`1px solid ${s.accent}30`, fontSize:10, fontWeight:800,
          letterSpacing:".12em", textTransform:"uppercase", padding:"5px 15px", borderRadius:20,
        }}>{s.badge}</span>
        <h1 style={{
          fontFamily:"'Syne',sans-serif", fontSize:"clamp(30px,4.5vw,54px)",
          fontWeight:900, color:"#fff", margin:"0 0 12px", lineHeight:1.08,
          letterSpacing:"-1.5px",
        }}>{s.title}</h1>
        <p style={{ fontSize:16, color:"#64748b", margin:"0 0 10px", maxWidth:440 }}>{s.sub}</p>
        <p style={{
          fontFamily:"'Syne',sans-serif", fontSize:26, fontWeight:900, color:s.accent,
          margin:"0 0 36px",
          textShadow:`0 0 40px ${s.accent}60`,
        }}>{s.price}</p>
        <div style={{ display:"flex", gap:14, flexWrap:"wrap" }}>
          <button onClick={() => setPage("category")} className="btn-primary" style={{
            background:`linear-gradient(135deg, ${s.accent}, ${s.accent2})`,
            boxShadow:`0 6px 24px ${s.accent}45`,
          }}><span>Shop Now →</span></button>
          <button onClick={handleBuyNow} className="btn-ghost">⚡ Buy Now</button>
        </div>
      </div>

      {/* Floating product */}
      <div className="hide-mobile" style={{ width:400, height:400, flexShrink:0, position:"relative", display:"flex", alignItems:"center", justifyContent:"center" }}>
        {[["orbitA", "9px", "9px", s.accent, "6s"],["orbitB","6px","6px",s.accent+"bb","4.5s"],["orbitC","5px","5px",s.accent+"77","5s"]].map(([anim,w,h,c,dur],i) => (
          <div key={i} style={{ position:"absolute", width:w, height:h, borderRadius:"50%", background:c, animation:`${anim} ${dur} linear infinite`, boxShadow:`0 0 12px ${c}` }} />
        ))}
        {[200,155,120].map((d,i) => (
          <div key={i} style={{ position:"absolute", width:d, height:d, borderRadius:"50%", border:`1px solid ${s.accent}${["22","16","0f"][i]}`, pointerEvents:"none" }} />
        ))}
        <div key={active} style={{
          width:230, height:230, borderRadius:30, overflow:"hidden",
          animation:"zoomIn .6s cubic-bezier(.22,1,.36,1) both, float 4.5s ease-in-out 1s infinite",
          boxShadow:`0 40px 100px rgba(0,0,0,.6), 0 0 80px ${s.accent}30`,
          position:"relative", zIndex:2, border:`1px solid ${s.accent}25`,
        }}>
          <SafeImg src={s.img} alt={s.title} style={{ width:"100%", height:"100%", objectFit:"cover" }} />
          <div style={{ position:"absolute", inset:0, background:`linear-gradient(135deg, ${s.accent}15, transparent)` }} />
        </div>
      </div>

      {/* Slide dots */}
      <div style={{ position:"absolute", bottom:24, left:60, display:"flex", gap:8 }}>
        {slides.map((_,i) => (
          <button key={i} onClick={() => setActive(i)} style={{
            width: i===active ? 32 : 8, height:8, borderRadius:4, border:"none",
            background: i===active ? s.accent : "rgba(255,255,255,.15)",
            cursor:"pointer", padding:0, transition:"all .35s cubic-bezier(.22,1,.36,1)",
            boxShadow: i===active ? `0 0 12px ${s.accent}` : "none",
          }} />
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   FLASH CARD
═══════════════════════════════════════════════════════════════ */
function FlashCard({ deal, product, dealPrice, onView }) {
  const timer = useCountdown(deal.endsIn);
  return (
    <div className="card-hover img-zoom" onClick={() => onView(product)} style={{
      background:"linear-gradient(145deg, #0d1428, #111827)",
      borderRadius:20, border:"1px solid rgba(239,68,68,.2)", overflow:"hidden",
    }}>
      <div style={{ height:180, overflow:"hidden", background:"#0a0e1a", position:"relative" }}>
        <SafeImg src={product.imgs[0]} alt={product.name} style={{ width:"100%", height:"100%", objectFit:"cover" }} />
        <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top, rgba(10,14,26,.6), transparent)" }} />
      </div>
      <div style={{ padding:"16px 18px" }}>
        <p style={{ fontSize:13, fontWeight:700, color:"#e2e8f0", margin:"0 0 8px" }}>{product.name}</p>
        <div style={{ display:"flex", alignItems:"baseline", gap:8, marginBottom:12 }}>
          <span style={{ fontFamily:"'Syne',sans-serif", fontSize:18, fontWeight:800, color:"#f87171" }}>{fmt(dealPrice)}</span>
          <span style={{ fontSize:12, color:"#334155", textDecoration:"line-through" }}>{fmt(product.mrp)}</span>
          <span style={{ fontSize:11, fontWeight:800, color:"#4ade80" }}>{disc(dealPrice,product.mrp)}% off</span>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <span style={{ fontSize:11, color:"#475569" }}>Ends in:</span>
          <span style={{
            background:"#0a0e1a", color:"#fbbf24", padding:"3px 10px",
            borderRadius:7, fontSize:12, fontWeight:800, fontFamily:"monospace",
            letterSpacing:".1em", border:"1px solid rgba(251,191,36,.2)",
          }}>{timer}</span>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   HOME PAGE
═══════════════════════════════════════════════════════════════ */
function HomePage({ setPage, onView, compareList, onCompare, onCart, toast }) {
  const [loading, setLoading] = useState(true);
  useEffect(() => { const t = setTimeout(() => setLoading(false), 900); return () => clearTimeout(t); }, []);

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:64 }}>
      <HeroBanner setPage={setPage} onCart={onCart} toast={toast} />

      {/* Stats */}
      <Reveal>
        <div className="stats-grid" style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14 }}>
          {[
            ["50K+","Happy Customers","👥","#3b7ff5"],
            ["100+","Premium Brands","🏷️","#8b5cf6"],
            ["24/7","Customer Support","🕐","#10b981"],
            ["2-Year","Warranty Coverage","🛡️","#f59e0b"],
          ].map(([v,l,icon,c]) => (
            <div key={l} style={{
              background:`radial-gradient(ellipse 150% 150% at 0% 0%, ${c}10, transparent 60%), rgba(255,255,255,.03)`,
              borderRadius:18, border:`1px solid ${c}20`, padding:"22px",
              display:"flex", alignItems:"center", gap:16,
              transition:"transform .25s", cursor:"default",
            }}
              onMouseEnter={e=>e.currentTarget.style.transform="translateY(-4px)"}
              onMouseLeave={e=>e.currentTarget.style.transform=""}
            >
              <div style={{ width:46, height:46, borderRadius:14, background:`${c}16`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, flexShrink:0 }}>{icon}</div>
              <div>
                <p style={{ fontFamily:"'Syne',sans-serif", fontSize:22, fontWeight:900, color:"#f1f5f9", margin:0, lineHeight:1 }}>{v}</p>
                <p style={{ fontSize:12, color:"#475569", margin:"4px 0 0" }}>{l}</p>
              </div>
            </div>
          ))}
        </div>
      </Reveal>

      {/* Categories */}
      <Reveal delay={80}>
        <SectionTitle accent="#3b7ff5">Shop by Category</SectionTitle>
        <div className="cat-grid" style={{ display:"grid", gridTemplateColumns:"repeat(9,1fr)", gap:12 }}>
          {CATEGORIES.map((cat, i) => (
            <button key={cat.id} onClick={() => setPage("category")}
              style={{
                background:"rgba(255,255,255,.025)", border:`1px solid rgba(255,255,255,.06)`,
                borderRadius:16, padding:"18px 8px", cursor:"pointer", textAlign:"center",
                display:"flex", flexDirection:"column", alignItems:"center", gap:8,
                transition:"all .25s cubic-bezier(.22,1,.36,1)", outline:"none",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = cat.color + "12";
                e.currentTarget.style.borderColor = cat.color + "40";
                e.currentTarget.style.transform = "translateY(-5px)";
                e.currentTarget.style.boxShadow = `0 12px 32px ${cat.color}20`;
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = "rgba(255,255,255,.025)";
                e.currentTarget.style.borderColor = "rgba(255,255,255,.06)";
                e.currentTarget.style.transform = "";
                e.currentTarget.style.boxShadow = "";
              }}
            >
              <span style={{ fontSize:26 }}>{cat.icon}</span>
              <span style={{ fontSize:10, fontWeight:600, color:"#64748b", lineHeight:1.3 }}>{cat.name}</span>
            </button>
          ))}
        </div>
      </Reveal>

      {/* Flash Deals */}
      <Reveal delay={100}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:24 }}>
          <SectionTitle accent="#ef4444">⚡ Flash Deals</SectionTitle>
          <button onClick={() => setPage("deals")} style={{ background:"none", border:"none", color:"#3b7ff5", fontWeight:700, cursor:"pointer", fontSize:13, transition:"opacity .2s" }}
            onMouseEnter={e=>e.currentTarget.style.opacity=".7"}
            onMouseLeave={e=>e.currentTarget.style.opacity="1"}>View All →</button>
        </div>
        <div className="deal-grid" style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:18 }}>
          {DEALS.map(deal => {
            const p = PRODUCTS.find(x => x.id === deal.productId);
            const dp = p.price - deal.extraOff;
            return <FlashCard key={deal.id} deal={deal} product={p} dealPrice={dp} onView={onView} />;
          })}
        </div>
      </Reveal>

      {/* Featured Products */}
      <Reveal delay={120}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:24 }}>
          <SectionTitle accent="#8b5cf6">🌟 Featured Products</SectionTitle>
          <button onClick={() => setPage("category")} style={{ background:"none", border:"none", color:"#3b7ff5", fontWeight:700, cursor:"pointer", fontSize:13 }}>Browse All →</button>
        </div>
        <div className="product-grid" style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:18 }}>
          {(loading ? Array(8).fill(null) : PRODUCTS.slice(0,8)).map((p, i) => (
            <div key={i} className="fade-up" style={{ animationDelay:`${i*55}ms` }}>
              <ProductCard product={p} onView={onView} onCompare={onCompare} onCart={onCart} compareList={compareList} toast={toast} loading={!p} />
            </div>
          ))}
        </div>
      </Reveal>

      {/* New Arrivals */}
      <Reveal delay={100}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:24 }}>
          <SectionTitle accent="#10b981">🆕 New Arrivals</SectionTitle>
        </div>
        <div className="product-grid" style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:18 }}>
          {PRODUCTS.slice(12,16).map((p, i) => (
            <div key={p.id} className="fade-up" style={{ animationDelay:`${i*55}ms` }}>
              <ProductCard product={p} onView={onView} onCompare={onCompare} onCart={onCart} compareList={compareList} toast={toast} />
            </div>
          ))}
        </div>
      </Reveal>

      {/* Brands */}
      <Reveal delay={80}>
        <SectionTitle accent="#f59e0b">Top Brands</SectionTitle>
        <div className="scrollbar-hide" style={{ display:"flex", gap:14, overflowX:"auto", paddingBottom:4 }}>
          {BRANDS.map(b => (
            <button key={b.id} onClick={() => setPage("brands")} style={{
              flexShrink:0, background:"rgba(255,255,255,.03)",
              border:"1px solid rgba(255,255,255,.07)", borderRadius:16,
              padding:"16px 22px", display:"flex", alignItems:"center", gap:12,
              cursor:"pointer", transition:"all .25s", minWidth:155, outline:"none",
            }}
              onMouseEnter={e => { e.currentTarget.style.transform="translateY(-4px)"; e.currentTarget.style.borderColor="rgba(59,127,245,.4)"; e.currentTarget.style.background="rgba(59,127,245,.07)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform=""; e.currentTarget.style.borderColor="rgba(255,255,255,.07)"; e.currentTarget.style.background="rgba(255,255,255,.03)"; }}
            >
              <span style={{ fontSize:24 }}>{b.logo}</span>
              <div style={{ textAlign:"left" }}>
                <p style={{ fontFamily:"'Syne',sans-serif", fontSize:14, fontWeight:700, color:"#e2e8f0", margin:0 }}>{b.name}</p>
                <p style={{ fontSize:10, color:"#334155", margin:0 }}>{PRODUCTS.filter(p=>p.brand===b.id).length} products</p>
              </div>
            </button>
          ))}
        </div>
      </Reveal>

      {/* Trust banner */}
      <Reveal>
        <div style={{
          borderRadius:24, padding:"44px 56px", position:"relative", overflow:"hidden",
          background:"linear-gradient(135deg, #0a0e1a 0%, #0f1e40 50%, #0a0e1a 100%)",
          border:"1px solid rgba(59,127,245,.15)",
          display:"flex", alignItems:"center", justifyContent:"space-between", gap:24, flexWrap:"wrap",
        }}>
          <div style={{ position:"absolute", inset:0, backgroundImage:"radial-gradient(ellipse 60% 80% at 80% 50%, rgba(59,127,245,.1) 0%, transparent 60%)", pointerEvents:"none" }} />
          <div style={{ position:"relative", zIndex:1 }}>
            <p style={{ fontSize:10, color:"#7eb5ff", fontWeight:800, textTransform:"uppercase", letterSpacing:".12em", margin:"0 0 10px" }}>VoltX Protection Plan</p>
            <h3 style={{ fontFamily:"'Syne',sans-serif", fontSize:28, fontWeight:900, color:"#fff", margin:"0 0 8px" }}>2-Year Warranty on Every Purchase</h3>
            <p style={{ fontSize:14, color:"#475569", margin:0 }}>Free repair, replacement & 24/7 support — India's most trusted warranty.</p>
          </div>
          <button className="btn-primary" style={{ flexShrink:0, position:"relative", zIndex:1, padding:"15px 36px", fontSize:15 }}><span>Learn More →</span></button>
        </div>
      </Reveal>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   CATEGORY PAGE
═══════════════════════════════════════════════════════════════ */
function CategoryPage({ onView, compareList, onCompare, onCart, searchQuery, toast }) {
  const [filters, setFilters] = useState({ cat:"all", brand:"all", maxPrice:250000, minRating:0, sort:"popular" });
  const set = (k,v) => setFilters(f => ({...f,[k]:v}));
  const F = filters;

  let list = PRODUCTS
    .filter(p => F.cat==="all"   || p.cat===F.cat)
    .filter(p => F.brand==="all" || p.brand===F.brand)
    .filter(p => p.price <= F.maxPrice)
    .filter(p => p.rating >= F.minRating)
    .filter(p => !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.brand.toLowerCase().includes(searchQuery.toLowerCase()));

  if (F.sort==="price-asc")  list = [...list].sort((a,b)=>a.price-b.price);
  if (F.sort==="price-desc") list = [...list].sort((a,b)=>b.price-a.price);
  if (F.sort==="rating")     list = [...list].sort((a,b)=>b.rating-a.rating);
  if (F.sort==="discount")   list = [...list].sort((a,b)=>disc(b.price,b.mrp)-disc(a.price,a.mrp));

  const SB = ({ active, onClick, children }) => (
    <button onClick={onClick} style={{
      display:"block", width:"100%", textAlign:"left", padding:"8px 10px",
      borderRadius:9, border:"none",
      background: active ? "rgba(59,127,245,.14)" : "transparent",
      color: active ? "#7eb5ff" : "#64748b",
      fontWeight: active ? 700 : 500, fontSize:13, cursor:"pointer",
      marginBottom:3, transition:"all .15s",
    }}>{children}</button>
  );

  return (
    <div style={{ display:"flex", gap:28, alignItems:"flex-start" }}>
      {/* Sidebar */}
      <div className="sidebar" style={{ width:230, flexShrink:0, position:"sticky", top:80 }}>
        <div style={{ background:"rgba(255,255,255,.025)", borderRadius:18, border:"1px solid rgba(255,255,255,.06)", padding:20 }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:18 }}>
            <h3 style={{ fontFamily:"'Syne',sans-serif", fontSize:15, fontWeight:800, color:"#f1f5f9", margin:0 }}>🎛️ Filters</h3>
            <button onClick={() => setFilters({cat:"all",brand:"all",maxPrice:250000,minRating:0,sort:"popular"})} style={{ fontSize:11, color:"#f87171", fontWeight:700, background:"none", border:"none", cursor:"pointer" }}>Reset</button>
          </div>

          <p style={{ fontSize:10, fontWeight:700, color:"#334155", textTransform:"uppercase", letterSpacing:".07em", margin:"0 0 8px" }}>Category</p>
          <SB active={F.cat==="all"} onClick={()=>set("cat","all")}>🛍️ All Products</SB>
          {CATEGORIES.map(c => <SB key={c.id} active={F.cat===c.id} onClick={()=>set("cat",c.id)}>{c.icon} {c.name}</SB>)}

          <div style={{ borderTop:"1px solid rgba(255,255,255,.05)", margin:"14px 0" }} />
          <p style={{ fontSize:10, fontWeight:700, color:"#334155", textTransform:"uppercase", letterSpacing:".07em", margin:"0 0 8px" }}>Brand</p>
          <SB active={F.brand==="all"} onClick={()=>set("brand","all")}>All Brands</SB>
          {BRANDS.map(b => <SB key={b.id} active={F.brand===b.id} onClick={()=>set("brand",b.id)}>{b.logo} {b.name}</SB>)}

          <div style={{ borderTop:"1px solid rgba(255,255,255,.05)", margin:"14px 0" }} />
          <p style={{ fontSize:10, fontWeight:700, color:"#334155", textTransform:"uppercase", letterSpacing:".07em", margin:"0 0 10px" }}>Max Price: <span style={{color:"#7eb5ff",fontWeight:800}}>{fmt(F.maxPrice)}</span></p>
          <input type="range" min={10000} max={250000} step={5000} value={F.maxPrice} onChange={e=>set("maxPrice",+e.target.value)} style={{ width:"100%", accentColor:"#3b7ff5" }} />
          <div style={{ display:"flex", justifyContent:"space-between", fontSize:10, color:"#334155", marginTop:4 }}><span>₹10K</span><span>₹2.5L</span></div>

          <div style={{ borderTop:"1px solid rgba(255,255,255,.05)", margin:"14px 0" }} />
          <p style={{ fontSize:10, fontWeight:700, color:"#334155", textTransform:"uppercase", letterSpacing:".07em", margin:"0 0 8px" }}>Min Rating</p>
          {[[0,"All Ratings"],[4,"4★ & above"],[4.5,"4.5★ & above"],[4.8,"4.8★ & above"]].map(([r,l]) => (
            <SB key={r} active={F.minRating===r} onClick={()=>set("minRating",r)}>{l}</SB>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div style={{ flex:1 }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:18, background:"rgba(255,255,255,.025)", borderRadius:12, padding:"12px 18px", border:"1px solid rgba(255,255,255,.06)" }}>
          <p style={{ fontSize:14, color:"#475569", margin:0 }}><strong style={{color:"#e2e8f0"}}>{list.length}</strong> products found {searchQuery && <span>for "<strong style={{color:"#7eb5ff"}}>{searchQuery}</strong>"</span>}</p>
          <select value={F.sort} onChange={e=>set("sort",e.target.value)} style={{ border:"1px solid rgba(255,255,255,.08)", borderRadius:8, padding:"7px 12px", fontSize:13, color:"#e2e8f0", background:"#0d1428", cursor:"pointer" }}>
            <option value="popular">Popularity</option>
            <option value="price-asc">Price: Low → High</option>
            <option value="price-desc">Price: High → Low</option>
            <option value="rating">Top Rated</option>
            <option value="discount">Best Discount</option>
          </select>
        </div>

        {list.length === 0 ? (
          <div style={{ textAlign:"center", padding:"80px 0" }}>
            <p style={{ fontSize:50, marginBottom:14, opacity:.3 }}>🔍</p>
            <p style={{ fontFamily:"'Syne',sans-serif", fontSize:18, fontWeight:700, color:"#334155", marginBottom:8 }}>No products found</p>
            <p style={{ fontSize:14, color:"#1e293b" }}>Try adjusting your filters</p>
          </div>
        ) : (
          <div className="product-grid" style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:18 }}>
            {list.map((p,i) => (
              <div key={p.id} className="fade-up" style={{ animationDelay:`${i*35}ms` }}>
                <ProductCard product={p} onView={onView} onCompare={onCompare} onCart={onCart} compareList={compareList} toast={toast} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   PRODUCT DETAIL
═══════════════════════════════════════════════════════════════ */
function ProductDetail({ product, onBack, onCompare, onCart, compareList, toast }) {
  const [activeImg, setActiveImg] = useState(0);
  const [cartDone, setCartDone] = useState(false);
  const [buyNowDone, setBuyNowDone] = useState(false);
  const related = PRODUCTS.filter(p => p.cat === product.cat && p.id !== product.id).slice(0,4);

  const handleCart = () => {
    setCartDone(true);
    onCart(product);
    toast("Added to cart 🛒", "success");
    setTimeout(() => setCartDone(false), 2500);
  };

  const handleBuyNow = () => {
    setBuyNowDone(true);
    onCart(product);
    toast(`${product.name.split(" ").slice(0,3).join(" ")} added — proceed to cart! ⚡`, "info");
    setTimeout(() => setBuyNowDone(false), 2000);
  };

  const inCmp = compareList.includes(product.id);

  return (
    <div className="zoom-in">
      <button onClick={onBack} style={{ background:"rgba(255,255,255,.04)", border:"1px solid rgba(255,255,255,.07)", color:"#7eb5ff", cursor:"pointer", fontSize:13, fontWeight:700, marginBottom:28, display:"flex", alignItems:"center", gap:8, padding:"9px 18px", borderRadius:10, transition:"all .2s" }}
        onMouseEnter={e=>e.currentTarget.style.background="rgba(59,127,245,.1)"}
        onMouseLeave={e=>e.currentTarget.style.background="rgba(255,255,255,.04)"}>
        ← Back
      </button>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:48, marginBottom:56 }}>
        {/* Gallery */}
        <div>
          <div className="img-zoom" style={{ background:"#0a0e1a", borderRadius:24, overflow:"hidden", height:430, marginBottom:14, border:"1px solid rgba(255,255,255,.07)", position:"relative" }}>
            <SafeImg src={product.imgs[activeImg]} alt={product.name} style={{ width:"100%", height:"100%", objectFit:"cover" }} />
            {product.badge && <span className="badge" style={{ position:"absolute", top:16, left:16, background:BADGE_COLORS[product.badge]||"#475569" }}>{product.badge}</span>}
          </div>
          <div style={{ display:"flex", gap:10 }}>
            {product.imgs.map((img,i) => (
              <button key={i} onClick={() => setActiveImg(i)} style={{
                width:84, height:84, borderRadius:14, overflow:"hidden", cursor:"pointer",
                border:`2px solid ${activeImg===i ? "#3b7ff5" : "rgba(255,255,255,.07)"}`,
                background:"#0a0e1a", transition:"border-color .2s", padding:0, outline:"none",
                boxShadow: activeImg===i ? "0 0 0 3px rgba(59,127,245,.18)" : "none",
              }}>
                <SafeImg src={img} alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }} />
              </button>
            ))}
          </div>
        </div>

        {/* Info */}
        <div>
          <p style={{ fontSize:10, color:"#334155", textTransform:"uppercase", fontWeight:800, letterSpacing:".12em", marginBottom:6 }}>{product.brand}</p>
          <h1 style={{ fontFamily:"'Syne',sans-serif", fontSize:32, fontWeight:900, color:"#f1f5f9", margin:"0 0 14px", lineHeight:1.12 }}>{product.name}</h1>
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:18 }}>
            <Stars rating={product.rating} />
            <span style={{ fontSize:13, color:"#334155" }}>({product.reviews.toLocaleString()} verified reviews)</span>
          </div>
          <p style={{ fontSize:15, color:"#475569", lineHeight:1.75, marginBottom:24 }}>{product.desc}</p>

          {/* Price box */}
          <div style={{ background:"linear-gradient(135deg, rgba(59,127,245,.06), rgba(99,102,241,.04))", borderRadius:18, padding:22, marginBottom:24, border:"1px solid rgba(59,127,245,.14)" }}>
            <div style={{ display:"flex", alignItems:"baseline", gap:14, marginBottom:10 }}>
              <span style={{ fontFamily:"'Syne',sans-serif", fontSize:40, fontWeight:900, color:"#f1f5f9" }}>{fmt(product.price)}</span>
              <span style={{ fontSize:18, color:"#334155", textDecoration:"line-through" }}>{fmt(product.mrp)}</span>
            </div>
            <span style={{ background:"rgba(74,222,128,.12)", color:"#4ade80", border:"1px solid rgba(74,222,128,.25)", padding:"5px 14px", borderRadius:20, fontSize:13, fontWeight:700 }}>
              Save {fmt(product.mrp - product.price)} ({disc(product.price, product.mrp)}%)
            </span>
          </div>

          {/* Highlights */}
          <div style={{ marginBottom:24 }}>
            <p style={{ fontSize:10, fontWeight:800, color:"#334155", textTransform:"uppercase", letterSpacing:".08em", marginBottom:10 }}>Key Highlights</p>
            <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
              {product.hi.map(h => (
                <span key={h} style={{ background:"rgba(59,127,245,.08)", color:"#7eb5ff", border:"1px solid rgba(59,127,245,.2)", padding:"7px 14px", borderRadius:20, fontSize:13, fontWeight:600 }}>✓ {h}</span>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display:"flex", gap:12, marginBottom:12 }}>
            <button onClick={handleCart} className="btn-primary" style={{
              flex:1, padding:"16px", fontSize:15,
              display:"flex", alignItems:"center", justifyContent:"center", gap:10,
              background: cartDone ? "linear-gradient(135deg, #059669, #10b981)" : undefined,
              boxShadow: cartDone ? "0 4px 20px rgba(16,185,129,.4)" : undefined,
              transition:"all .35s",
            }}>
              <span>{cartDone ? "✓ Added to Cart!" : "🛒 Add to Cart"}</span>
            </button>
            <button onClick={handleBuyNow} className="btn-danger" style={{
              padding:"16px 24px", fontSize:15,
              display:"flex", alignItems:"center", gap:8,
              background: buyNowDone ? "linear-gradient(135deg, #059669, #10b981)" : undefined,
              transition:"background .35s",
            }}>
              {buyNowDone ? "✓ Added!" : "⚡ Buy Now"}
            </button>
          </div>

          <button onClick={() => { onCompare(product.id); toast(inCmp?"Removed from compare":"Added to compare ⚖️","info"); }}
            style={{
              width:"100%", background: inCmp?"rgba(59,127,245,.1)":"transparent",
              color: inCmp?"#7eb5ff":"#64748b",
              border:`1px solid ${inCmp?"rgba(59,127,245,.4)":"rgba(255,255,255,.07)"}`,
              borderRadius:12, padding:"12px", fontSize:14, fontWeight:700,
              cursor:"pointer", marginBottom:20, transition:"all .2s",
            }}>
            {inCmp ? "✓ In Comparison" : "+ Add to Compare"}
          </button>

          {/* Trust chips */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10 }}>
            {[["🚚","Free Delivery","₹499+"],["↩️","10-Day Returns","Hassle-free"],["🛡️","2-Year Warranty","Included"]].map(([icon,t,s]) => (
              <div key={t} style={{ background:"rgba(255,255,255,.025)", borderRadius:12, padding:"13px 8px", textAlign:"center", border:"1px solid rgba(255,255,255,.05)" }}>
                <div style={{ fontSize:20, marginBottom:5 }}>{icon}</div>
                <p style={{ fontSize:11, fontWeight:700, color:"#94a3b8", margin:"0 0 2px" }}>{t}</p>
                <p style={{ fontSize:10, color:"#334155", margin:0 }}>{s}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Specs */}
      <div style={{ background:"rgba(255,255,255,.02)", borderRadius:22, border:"1px solid rgba(255,255,255,.06)", padding:32, marginBottom:52 }}>
        <h2 style={{ fontFamily:"'Syne',sans-serif", fontSize:22, fontWeight:800, color:"#f1f5f9", marginBottom:22 }}>📋 Full Specifications</h2>
        <table style={{ width:"100%", borderCollapse:"collapse" }}>
          <tbody>
            {Object.entries(product.specs).map(([key,val],i) => (
              <tr key={key} style={{ background: i%2===0?"rgba(255,255,255,.02)":"transparent" }}>
                <td style={{ padding:"13px 20px", fontSize:14, fontWeight:700, color:"#475569", width:"30%", borderBottom:"1px solid rgba(255,255,255,.04)" }}>{key}</td>
                <td style={{ padding:"13px 20px", fontSize:14, color:"#cbd5e1", borderBottom:"1px solid rgba(255,255,255,.04)", fontWeight:500 }}>{val}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <div>
          <SectionTitle accent="#8b5cf6">You May Also Like</SectionTitle>
          <div className="product-grid" style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:18 }}>
            {related.map(p => <ProductCard key={p.id} product={p} onView={() => {}} onCompare={onCompare} onCart={onCart} compareList={compareList} toast={toast} />)}
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   COMPARE PAGE
═══════════════════════════════════════════════════════════════ */
function ComparePage({ compareList, onView, onRemove }) {
  const products = PRODUCTS.filter(p => compareList.includes(p.id));
  if (products.length < 2) return (
    <div className="fade-in" style={{ textAlign:"center", padding:"90px 0" }}>
      <div style={{ fontSize:60, marginBottom:16, opacity:.3 }}>⚖️</div>
      <h2 style={{ fontFamily:"'Syne',sans-serif", fontSize:28, fontWeight:800, color:"#f1f5f9", marginBottom:10 }}>Compare Products</h2>
      <p style={{ color:"#334155", fontSize:15 }}>Add at least 2 products using the ⚖️ button on any product card.</p>
    </div>
  );

  const allKeys = Array.from(new Set(products.flatMap(p => Object.keys(p.specs))));
  const rows = [
    ["Rating",   p => `${p.rating}★ (${p.reviews.toLocaleString()})`],
    ["Discount", p => `${disc(p.price,p.mrp)}% off`],
    ...allKeys.map(k => [k, p => p.specs[k] || "—"]),
  ];

  return (
    <div className="fade-in">
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:30 }}>
        <h1 style={{ fontFamily:"'Syne',sans-serif", fontSize:28, fontWeight:900, color:"#f1f5f9" }}>Side-by-Side Comparison</h1>
        <span style={{ fontSize:13, color:"#475569" }}>{products.length} products</span>
      </div>
      <div style={{ overflowX:"auto" }}>
        <table style={{ width:"100%", borderCollapse:"collapse", background:"rgba(255,255,255,.02)", borderRadius:22, overflow:"hidden", border:"1px solid rgba(255,255,255,.07)" }}>
          <thead>
            <tr style={{ background:"rgba(255,255,255,.04)", position:"sticky", top:66, zIndex:10 }}>
              <th style={{ padding:"20px", textAlign:"left", fontSize:12, fontWeight:700, color:"#334155", textTransform:"uppercase", width:"22%", borderBottom:"1px solid rgba(255,255,255,.06)" }}>Feature</th>
              {products.map(p => (
                <th key={p.id} style={{ padding:"20px", borderBottom:"1px solid rgba(255,255,255,.06)", verticalAlign:"top" }}>
                  <div style={{ height:130, borderRadius:14, overflow:"hidden", marginBottom:10, background:"#0a0e1a" }}>
                    <SafeImg src={p.imgs[0]} alt={p.name} style={{ width:"100%", height:"100%", objectFit:"cover" }} />
                  </div>
                  <p style={{ fontFamily:"'Syne',sans-serif", fontSize:13, fontWeight:800, color:"#f1f5f9", margin:"0 0 4px" }}>{p.name}</p>
                  <p style={{ fontFamily:"'Syne',sans-serif", fontSize:17, fontWeight:900, color:"#7eb5ff", margin:"0 0 10px" }}>{fmt(p.price)}</p>
                  <div style={{ display:"flex", gap:6 }}>
                    <button onClick={() => onView(p)} style={{ flex:1, background:"rgba(59,127,245,.15)", color:"#7eb5ff", border:"1px solid rgba(59,127,245,.3)", borderRadius:10, padding:"8px", fontSize:12, fontWeight:700, cursor:"pointer" }}>View</button>
                    <button onClick={() => onRemove(p.id)} style={{ background:"rgba(239,68,68,.1)", color:"#f87171", border:"1px solid rgba(239,68,68,.2)", borderRadius:10, padding:"8px 10px", fontSize:11, cursor:"pointer" }}>✕</button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map(([label, fn], i) => (
              <tr key={label} style={{ background: i%2===0?"rgba(255,255,255,.015)":"transparent" }}>
                <td style={{ padding:"13px 20px", fontSize:13, fontWeight:700, color:"#475569", borderBottom:"1px solid rgba(255,255,255,.04)" }}>{label}</td>
                {products.map(p => (
                  <td key={p.id} style={{ padding:"13px 20px", fontSize:14, color:"#cbd5e1", textAlign:"center", borderBottom:"1px solid rgba(255,255,255,.04)", fontWeight:500 }}>{fn(p)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   DEALS PAGE
═══════════════════════════════════════════════════════════════ */
function DealsPage({ onView, onCompare, onCart, compareList, toast }) {
  const mainTimer = useCountdown(86400);
  return (
    <div className="fade-in" style={{ display:"flex", flexDirection:"column", gap:48 }}>
      <div style={{
        borderRadius:24, padding:"44px 56px", position:"relative", overflow:"hidden",
        background:"linear-gradient(135deg, #1a0505 0%, #330f0f 40%, #1a0505 100%)",
        border:"1px solid rgba(239,68,68,.15)",
        display:"flex", alignItems:"center", justifyContent:"space-between",
      }}>
        <div style={{ position:"absolute", inset:0, backgroundImage:"radial-gradient(ellipse at 15% 50%, rgba(239,68,68,.12) 0%, transparent 50%)", pointerEvents:"none" }} />
        <div style={{ position:"relative", zIndex:1 }}>
          <p style={{ fontSize:10, color:"#fca5a5", fontWeight:800, textTransform:"uppercase", letterSpacing:".12em", margin:"0 0 10px" }}>Limited Time Only</p>
          <h1 style={{ fontFamily:"'Syne',sans-serif", fontSize:40, fontWeight:900, color:"#fff", margin:"0 0 6px" }}>⚡ Today's Best Deals</h1>
          <p style={{ fontSize:16, color:"#7f1d1d", margin:0 }}>Grab them before they're gone!</p>
        </div>
        <div style={{ textAlign:"right", position:"relative", zIndex:1 }}>
          <p style={{ fontSize:12, color:"#fca5a5", margin:"0 0 8px", fontWeight:600 }}>Sale ends in</p>
          <span style={{
            background:"rgba(0,0,0,.5)", backdropFilter:"blur(10px)",
            color:"#fbbf24", padding:"12px 24px", borderRadius:14,
            fontSize:24, fontWeight:900, fontFamily:"monospace", letterSpacing:".1em",
            display:"inline-block", border:"1px solid rgba(251,191,36,.2)",
            animation:"pulse 1.5s ease-in-out infinite",
          }}>{mainTimer}</span>
        </div>
      </div>

      <div>
        <SectionTitle accent="#ef4444">🔥 Flash Deals</SectionTitle>
        <div className="deal-grid" style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:22 }}>
          {DEALS.map(deal => {
            const p = PRODUCTS.find(x => x.id === deal.productId);
            const dp = p.price - deal.extraOff;
            return (
              <div key={deal.id} className="card-hover img-zoom" onClick={() => onView(p)} style={{ background:"#0d1428", borderRadius:22, border:"1.5px solid rgba(239,68,68,.2)", overflow:"hidden" }}>
                <div style={{ position:"relative", overflow:"hidden" }}>
                  <SafeImg src={p.imgs[0]} alt={p.name} style={{ width:"100%", height:210, objectFit:"cover" }} />
                  <div style={{ position:"absolute", top:14, left:14, background:"#e53e3e", color:"#fff", padding:"5px 14px", borderRadius:20, fontSize:13, fontWeight:800 }}>Extra {fmt(deal.extraOff)} Off</div>
                </div>
                <div style={{ padding:22 }}>
                  <p style={{ fontFamily:"'Syne',sans-serif", fontSize:17, fontWeight:800, color:"#f1f5f9", marginBottom:8 }}>{p.name}</p>
                  <div style={{ display:"flex", alignItems:"baseline", gap:10, marginBottom:12 }}>
                    <span style={{ fontFamily:"'Syne',sans-serif", fontSize:24, fontWeight:900, color:"#f87171" }}>{fmt(dp)}</span>
                    <span style={{ color:"#334155", textDecoration:"line-through", fontSize:14 }}>{fmt(p.mrp)}</span>
                    <span style={{ fontSize:13, fontWeight:700, color:"#4ade80" }}>{disc(dp,p.mrp)}% off</span>
                  </div>
                  <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                    <span style={{ fontSize:12, color:"#475569" }}>Ends in:</span>
                    <span style={{ background:"#0a0e1a", color:"#fbbf24", padding:"3px 10px", borderRadius:6, fontSize:12, fontWeight:800, fontFamily:"monospace", letterSpacing:".1em", border:"1px solid rgba(251,191,36,.15)" }}>{useCountdown(deal.endsIn)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div>
        <SectionTitle accent="#f59e0b">🏷️ More Offers</SectionTitle>
        <div className="product-grid" style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:18 }}>
          {PRODUCTS.filter(p => disc(p.price,p.mrp) >= 8).map(p => (
            <ProductCard key={p.id} product={p} onView={onView} onCompare={onCompare} onCart={onCart} compareList={compareList} toast={toast} />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   BRANDS PAGE
═══════════════════════════════════════════════════════════════ */
function BrandsPage({ onView, onCompare, onCart, compareList, toast }) {
  const [q, setQ] = useState("");
  const [active, setActive] = useState(null);
  const shown = BRANDS.filter(b => b.name.toLowerCase().includes(q.toLowerCase()));
  const bp = active ? PRODUCTS.filter(p => p.brand === active) : [];

  return (
    <div className="fade-in">
      <h1 style={{ fontFamily:"'Syne',sans-serif", fontSize:32, fontWeight:900, color:"#f1f5f9", marginBottom:6 }}>Top Brands</h1>
      <p style={{ color:"#475569", marginBottom:28 }}>Authorised reseller for India's most trusted electronics brands.</p>
      <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search brands…" style={{ width:300, border:"1px solid rgba(255,255,255,.08)", borderRadius:12, padding:"11px 16px", fontSize:14, display:"block", marginBottom:28, background:"rgba(255,255,255,.03)", color:"#e2e8f0" }} />

      <div style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:16, marginBottom:active?44:0 }}>
        {shown.map(b => {
          const cnt = PRODUCTS.filter(p => p.brand === b.id).length;
          const isActive = active === b.id;
          return (
            <div key={b.id} onClick={() => setActive(isActive ? null : b.id)} className="card-hover" style={{
              background: isActive ? "rgba(59,127,245,.1)" : "rgba(255,255,255,.025)",
              borderRadius:20, border: `1px solid ${isActive ? "rgba(59,127,245,.4)" : "rgba(255,255,255,.06)"}`,
              padding:"32px 16px", textAlign:"center", cursor:"pointer",
              transition:"all .25s cubic-bezier(.22,1,.36,1)",
            }}>
              <div style={{ fontSize:46, marginBottom:12 }}>{b.logo}</div>
              <p style={{ fontFamily:"'Syne',sans-serif", fontSize:17, fontWeight:800, color:"#f1f5f9", marginBottom:4 }}>{b.name}</p>
              <p style={{ fontSize:11, color:"#475569", marginBottom:10 }}>{b.tagline}</p>
              <span style={{ background: isActive?"rgba(59,127,245,.2)":"rgba(255,255,255,.05)", color: isActive?"#7eb5ff":"#64748b", fontSize:11, fontWeight:700, padding:"4px 12px", borderRadius:20 }}>{cnt} products</span>
            </div>
          );
        })}
      </div>

      {active && bp.length > 0 && (
        <div className="fade-in">
          <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:22 }}>
            <span style={{ fontSize:28 }}>{BRANDS.find(b=>b.id===active)?.logo}</span>
            <h2 style={{ fontFamily:"'Syne',sans-serif", fontSize:22, fontWeight:800, color:"#f1f5f9" }}>{BRANDS.find(b=>b.id===active)?.name} Products</h2>
          </div>
          <div className="product-grid" style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:18 }}>
            {bp.map(p => <ProductCard key={p.id} product={p} onView={onView} onCompare={onCompare} onCart={onCart} compareList={compareList} toast={toast} />)}
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   CONTACT PAGE
═══════════════════════════════════════════════════════════════ */
function ContactPage({ toast }) {
  const [form, setForm] = useState({ name:"", email:"", phone:"", type:"support", message:"" });
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name required";
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = "Valid email required";
    if (!form.message.trim()) e.message = "Message required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async () => {
    if (!validate()) { toast("Please fix the errors", "error"); return; }
    setSending(true);
    await new Promise(r => setTimeout(r, 1600));
    setSending(false);
    setSent(true);
    toast("Message sent successfully! 📬", "success");
  };

  const inp = (field, placeholder, type="text", area=false) => (
    <div>
      {area
        ? <textarea rows={4} placeholder={placeholder} value={form[field]} onChange={e=>setForm(f=>({...f,[field]:e.target.value}))}
            style={{ width:"100%", border:`1px solid ${errors[field]?"rgba(248,113,113,.4)":"rgba(255,255,255,.08)"}`, borderRadius:12, padding:"12px 16px", fontSize:14, resize:"vertical", background:errors[field]?"rgba(248,113,113,.05)":"rgba(255,255,255,.03)", color:"#e2e8f0" }} />
        : <input type={type} placeholder={placeholder} value={form[field]} onChange={e=>setForm(f=>({...f,[field]:e.target.value}))}
            style={{ width:"100%", border:`1px solid ${errors[field]?"rgba(248,113,113,.4)":"rgba(255,255,255,.08)"}`, borderRadius:12, padding:"12px 16px", fontSize:14, background:errors[field]?"rgba(248,113,113,.05)":"rgba(255,255,255,.03)", color:"#e2e8f0" }} />
      }
      {errors[field] && <p style={{ color:"#f87171", fontSize:11, marginTop:4, fontWeight:600 }}>⚠ {errors[field]}</p>}
    </div>
  );

  return (
    <div className="fade-in" style={{ display:"flex", flexDirection:"column", gap:40 }}>
      <div>
        <h1 style={{ fontFamily:"'Syne',sans-serif", fontSize:32, fontWeight:900, color:"#f1f5f9", marginBottom:6 }}>Contact & Support</h1>
        <p style={{ color:"#475569" }}>We're here to help — reach us anytime, anywhere.</p>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14 }}>
        {[
          { icon:"📞", label:"Toll-Free", value:"1800-VOLTX-IN", sub:"Mon–Sun, 8am–10pm", bg:"rgba(16,185,129,.06)", border:"rgba(16,185,129,.15)", c:"#34d399" },
          { icon:"✉️", label:"Email", value:"support@voltx.in", sub:"Response in 2hrs", bg:"rgba(59,127,245,.06)", border:"rgba(59,127,245,.15)", c:"#7eb5ff" },
          { icon:"💬", label:"WhatsApp", value:"Chat Now", sub:"Avg 3 min response", bg:"rgba(74,222,128,.06)", border:"rgba(74,222,128,.15)", c:"#4ade80" },
          { icon:"🔧", label:"Service Centre", value:"Walk-in Support", sub:"All major cities", bg:"rgba(251,191,36,.06)", border:"rgba(251,191,36,.15)", c:"#fbbf24" },
        ].map(ch => (
          <div key={ch.label} className="card-hover" style={{ background:ch.bg, border:`1px solid ${ch.border}`, borderRadius:18, padding:"22px 18px" }}>
            <div style={{ fontSize:28, marginBottom:12 }}>{ch.icon}</div>
            <p style={{ fontSize:10, fontWeight:800, color:ch.c, textTransform:"uppercase", letterSpacing:".08em", margin:"0 0 6px" }}>{ch.label}</p>
            <p style={{ fontFamily:"'Syne',sans-serif", fontSize:14, fontWeight:700, color:"#f1f5f9", margin:"0 0 4px" }}>{ch.value}</p>
            <p style={{ fontSize:11, color:"#475569", margin:0 }}>{ch.sub}</p>
          </div>
        ))}
      </div>

      <div className="contact-grid" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:28 }}>
        <div style={{ background:"rgba(255,255,255,.025)", borderRadius:24, border:"1px solid rgba(255,255,255,.06)", padding:32 }}>
          <h2 style={{ fontFamily:"'Syne',sans-serif", fontSize:20, fontWeight:800, color:"#f1f5f9", marginBottom:24 }}>📬 Send a Message</h2>
          {sent ? (
            <div style={{ textAlign:"center", padding:"40px 0" }}>
              <div style={{ fontSize:56, marginBottom:16 }}>✅</div>
              <p style={{ fontFamily:"'Syne',sans-serif", fontSize:22, fontWeight:900, color:"#4ade80", marginBottom:8 }}>Message Sent!</p>
              <p style={{ color:"#475569", marginBottom:24 }}>We'll reply within 2 business hours.</p>
              <button className="btn-primary" onClick={() => { setSent(false); setForm({name:"",email:"",phone:"",type:"support",message:""}); }}><span>Send Another</span></button>
            </div>
          ) : (
            <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
              {inp("name","Your Full Name")}
              {inp("email","Email Address","email")}
              {inp("phone","Phone Number","tel")}
              <select value={form.type} onChange={e=>setForm(f=>({...f,type:e.target.value}))}
                style={{ border:"1px solid rgba(255,255,255,.08)", borderRadius:12, padding:"12px 16px", fontSize:14, cursor:"pointer", background:"rgba(255,255,255,.03)", color:"#e2e8f0" }}>
                <option value="support">Technical Support</option>
                <option value="order">Order Query</option>
                <option value="warranty">Warranty Claim</option>
                <option value="return">Return / Refund</option>
                <option value="other">Other</option>
              </select>
              {inp("message","Describe your issue…","text",true)}
              <button onClick={submit} disabled={sending} className="btn-primary" style={{ padding:"15px", fontSize:15, display:"flex", alignItems:"center", justifyContent:"center", gap:8, opacity:sending?.8:1 }}>
                {sending ? <><span style={{ width:16, height:16, border:"2px solid rgba(255,255,255,.3)", borderTopColor:"#fff", borderRadius:"50%", animation:"spin .7s linear infinite", display:"inline-block" }} /><span>Sending…</span></> : <span>📤 Submit Message</span>}
              </button>
            </div>
          )}
        </div>

        <div style={{ background:"rgba(255,255,255,.025)", borderRadius:24, border:"1px solid rgba(255,255,255,.06)", padding:32 }}>
          <h2 style={{ fontFamily:"'Syne',sans-serif", fontSize:20, fontWeight:800, color:"#f1f5f9", marginBottom:24 }}>🗺️ Store Locator</h2>
          {[
            { name:"VoltX Bengaluru", addr:"42, MG Road, Bengaluru 560001", ph:"080-4567-8901", hours:"10am–9pm", emoji:"🏙️" },
            { name:"VoltX Mumbai", addr:"12, Linking Rd, Bandra West 400050", ph:"022-4567-8901", hours:"11am–9pm", emoji:"🌆" },
            { name:"VoltX New Delhi", addr:"Block A, Connaught Place 110001", ph:"011-4567-8901", hours:"10am–9pm", emoji:"🏛️" },
            { name:"VoltX Hyderabad", addr:"Road 12, Banjara Hills 500034", ph:"040-4567-8901", hours:"10am–9pm", emoji:"🌇" },
          ].map(s => (
            <div key={s.name} style={{ display:"flex", gap:14, padding:"14px", borderRadius:14, background:"rgba(255,255,255,.02)", border:"1px solid rgba(255,255,255,.05)", marginBottom:10, alignItems:"flex-start", transition:"all .2s" }}
              onMouseEnter={e=>{e.currentTarget.style.borderColor="rgba(59,127,245,.3)"; e.currentTarget.style.background="rgba(59,127,245,.05)";}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor="rgba(255,255,255,.05)"; e.currentTarget.style.background="rgba(255,255,255,.02)";}}
            >
              <div style={{ width:44, height:44, borderRadius:12, background:"rgba(59,127,245,.1)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, flexShrink:0 }}>{s.emoji}</div>
              <div style={{ flex:1 }}>
                <p style={{ fontFamily:"'Syne',sans-serif", fontSize:13, fontWeight:700, color:"#f1f5f9", margin:"0 0 3px" }}>{s.name}</p>
                <p style={{ fontSize:11, color:"#475569", margin:"0 0 5px" }}>📍 {s.addr}</p>
                <div style={{ display:"flex", gap:12 }}>
                  <span style={{ fontSize:11, color:"#7eb5ff", fontWeight:700 }}>📞 {s.ph}</span>
                  <span style={{ fontSize:11, color:"#4ade80", fontWeight:600 }}>🕐 {s.hours}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   COMPARE FLOATING BAR
═══════════════════════════════════════════════════════════════ */
function CompareBar({ compareList, setPage, onClear, onRemoveOne }) {
  if (compareList.length === 0) return null;
  const products = PRODUCTS.filter(p => compareList.includes(p.id));
  return (
    <div style={{
      position:"fixed", bottom:0, left:0, right:0, zIndex:400,
      background:"rgba(5,8,16,.96)", backdropFilter:"blur(24px)",
      borderTop:"1px solid rgba(59,127,245,.2)", padding:"12px 28px",
      display:"flex", alignItems:"center", gap:16,
      boxShadow:"0 -4px 40px rgba(0,0,0,.4)",
    }}>
      <span style={{ color:"#475569", fontSize:13, flexShrink:0 }}>⚖️ Compare ({compareList.length}/3):</span>
      <div style={{ display:"flex", gap:10, flex:1, overflowX:"auto" }}>
        {products.map(p => (
          <div key={p.id} style={{ display:"flex", alignItems:"center", gap:8, background:"rgba(59,127,245,.08)", border:"1px solid rgba(59,127,245,.2)", borderRadius:10, padding:"6px 10px 6px 6px", flexShrink:0 }}>
            <div style={{ width:32, height:32, borderRadius:8, overflow:"hidden", flexShrink:0, background:"#0a0e1a" }}>
              <SafeImg src={p.imgs[0]} alt={p.name} style={{ width:"100%", height:"100%", objectFit:"cover" }} />
            </div>
            <span style={{ color:"#e2e8f0", fontSize:12, fontWeight:600, maxWidth:120, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{p.name}</span>
            <button onClick={() => onRemoveOne(p.id)} style={{ background:"none", border:"none", color:"#475569", cursor:"pointer", fontSize:14, padding:"0 2px" }}>×</button>
          </div>
        ))}
      </div>
      {compareList.length >= 2 && (
        <button onClick={() => setPage("compare")} className="btn-primary" style={{ flexShrink:0, padding:"9px 20px", fontSize:13 }}><span>Compare Now →</span></button>
      )}
      <button onClick={onClear} style={{ background:"transparent", color:"#475569", border:"none", fontSize:20, cursor:"pointer", flexShrink:0 }}>×</button>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   FOOTER
═══════════════════════════════════════════════════════════════ */
function Footer({ setPage }) {
  return (
    <footer style={{ background:"#030508", color:"#475569", padding:"60px 0 28px", marginTop:80, borderTop:"1px solid rgba(255,255,255,.04)" }}>
      <div style={{ maxWidth:1380, margin:"0 auto", padding:"0 24px" }}>
        <div className="footer-grid" style={{ display:"grid", gridTemplateColumns:"2fr 1fr 1fr 1fr", gap:48, marginBottom:48 }}>
          <div>
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:14 }}>
              <div style={{ width:32, height:32, borderRadius:8, background:"linear-gradient(135deg,#3b7ff5,#8b5cf6)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, color:"#fff" }}>⚡</div>
              <span style={{ fontFamily:"'Syne',sans-serif", fontSize:22, fontWeight:900, letterSpacing:"-1px" }}><span style={{color:"#7eb5ff"}}>Volt</span><span style={{color:"#e2e8f0"}}>X</span></span>
            </div>
            <p style={{ fontSize:14, lineHeight:1.75, color:"#334155", marginBottom:22, maxWidth:300 }}>India's most trusted online electronics destination. Authorised reseller of Apple, Samsung, Sony, Dell and 100+ premium brands.</p>
            <div style={{ display:"flex", gap:10 }}>
              {["📘","📸","🐦","▶️"].map(ic => (
                <button key={ic} style={{ width:36, height:36, background:"rgba(255,255,255,.03)", border:"1px solid rgba(255,255,255,.06)", borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center", fontSize:15, cursor:"pointer", transition:"all .2s" }}
                  onMouseEnter={e=>{e.currentTarget.style.background="rgba(59,127,245,.12)"; e.currentTarget.style.borderColor="rgba(59,127,245,.3)";}}
                  onMouseLeave={e=>{e.currentTarget.style.background="rgba(255,255,255,.03)"; e.currentTarget.style.borderColor="rgba(255,255,255,.06)";}}>
                  {ic}
                </button>
              ))}
            </div>
          </div>
          {[
            { title:"Shop",    links:["Smartphones","Laptops","Audio","Smart TVs","Cameras","Gaming"] },
            { title:"Support", links:["Track Order","Return Policy","Warranty","Service Centres","EMI Options"] },
            { title:"Company", links:["About VoltX","Careers","Press Room","Blog","Affiliates"] },
          ].map(col => (
            <div key={col.title}>
              <p style={{ fontFamily:"'Syne',sans-serif", fontSize:13, fontWeight:700, color:"#94a3b8", marginBottom:18, textTransform:"uppercase", letterSpacing:".08em" }}>{col.title}</p>
              {col.links.map(l => (
                <p key={l} style={{ fontSize:13, margin:"0 0 12px", cursor:"pointer", transition:"color .15s" }}
                  onMouseEnter={e=>e.currentTarget.style.color="#7eb5ff"}
                  onMouseLeave={e=>e.currentTarget.style.color="#475569"}>{l}</p>
              ))}
            </div>
          ))}
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:20, padding:"24px 0", borderTop:"1px solid rgba(255,255,255,.04)", borderBottom:"1px solid rgba(255,255,255,.04)", marginBottom:24 }}>
          {[["🚚","Free Delivery","₹499+"],["↩️","Easy Returns","10-day"],["🛡️","2-Year Warranty","All products"],["💳","Secure Payment","100% safe"]].map(([icon,t,s]) => (
            <div key={t} style={{ display:"flex", alignItems:"center", gap:12 }}>
              <span style={{ fontSize:20 }}>{icon}</span>
              <div><p style={{ fontSize:12, fontWeight:700, color:"#e2e8f0", margin:0 }}>{t}</p><p style={{ fontSize:11, color:"#334155", margin:0 }}>{s}</p></div>
            </div>
          ))}
        </div>

        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:12 }}>
          <p style={{ fontSize:13, color:"#1e293b", margin:0 }}>© 2025 VoltX Electronics Pvt. Ltd. All rights reserved.</p>
          <p style={{ fontSize:13, color:"#1e293b", margin:0 }}>Made with ❤️ in India 🇮🇳</p>
        </div>
      </div>
    </footer>
  );
}

/* ═══════════════════════════════════════════════════════════════
   APP ROOT
═══════════════════════════════════════════════════════════════ */
export default function App() {
  const [page, setPage]           = useState("home");
  const [selected, setSelected]   = useState(null);
  const [compareList, setCompare] = useState([]);
  const [cart, setCart]           = useState([]);
  const [cartOpen, setCartOpen]   = useState(false);
  const [searchQuery, setSearch]  = useState("");
  const { toasts, toast }         = useToast();

  // Inject styles
  useEffect(() => {
    const el = document.createElement("style");
    el.textContent = STYLES;
    document.head.appendChild(el);
    return () => el.remove();
  }, []);

  const navigate = p => {
    setPage(p);
    window.scrollTo({ top:0, behavior:"smooth" });
  };

  const handleView = product => {
    setSelected(product);
    navigate("product");
  };

  const handleCompare = id => {
    setCompare(prev =>
      prev.includes(id) ? prev.filter(x => x !== id)
      : prev.length < 3 ? [...prev, id]
      : (toast("Max 3 products for comparison", "warning"), prev)
    );
  };

  const handleCart = product => setCart(c => [...c, product]);
  const handleRemoveCart = idx => setCart(c => c.filter((_,i) => i !== idx));
  const handleClearCart = () => setCart([]);

  const sharedProps = {
    onView: handleView,
    onCompare: handleCompare,
    onCart: handleCart,
    compareList,
    toast,
  };

  const renderPage = () => {
    if (page === "product" && selected) {
      return <ProductDetail product={selected} onBack={() => navigate("category")} {...sharedProps} />;
    }
    switch (page) {
      case "home":     return <HomePage     setPage={navigate} {...sharedProps} />;
      case "category": return <CategoryPage setPage={navigate} searchQuery={searchQuery} {...sharedProps} />;
      case "deals":    return <DealsPage    setPage={navigate} {...sharedProps} />;
      case "brands":   return <BrandsPage   setPage={navigate} {...sharedProps} />;
      case "compare":  return <ComparePage  compareList={compareList} onView={handleView} onRemove={handleCompare} />;
      case "contact":  return <ContactPage  toast={toast} />;
      default:         return <HomePage     setPage={navigate} {...sharedProps} />;
    }
  };

  return (
    <div className="page-bg" style={{ minHeight:"100vh" }}>
      <ToastContainer toasts={toasts} />

      {cartOpen && (
        <CartModal
          cart={cart}
          onClose={() => setCartOpen(false)}
          onRemove={handleRemoveCart}
          onClear={handleClearCart}
          toast={toast}
        />
      )}

      <Navbar
        page={page}
        setPage={navigate}
        cart={cart}
        compareCount={compareList.length}
        onSearch={setSearch}
        onCartOpen={() => setCartOpen(true)}
      />

      <main style={{
        maxWidth:1380, margin:"0 auto",
        padding:"90px 24px 40px",
        paddingBottom: compareList.length > 0 ? 110 : 40,
        minHeight:"80vh",
      }}>
        {renderPage()}
      </main>

      <Footer setPage={navigate} />

      <CompareBar
        compareList={compareList}
        setPage={navigate}
        onClear={() => setCompare([])}
        onRemoveOne={handleCompare}
      />
    </div>
  );
}
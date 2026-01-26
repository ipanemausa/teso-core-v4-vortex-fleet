import{r as l,j as t}from"./index-BO5F2_O_.js";const d=""+new URL("landing_bg-DqNP_8jJ.png",import.meta.url).href;function c({onEnter:n}){const[i,s]=l.useState(!1),[e,a]=l.useState(!1);l.useEffect(()=>{const o=setTimeout(()=>{a(!0)},1e3);return()=>clearTimeout(o)},[]);const p=()=>{s(!0),setTimeout(()=>{n()},2e3)};return t.jsxs("div",{style:{width:"100vw",minHeight:"100vh",backgroundImage:`url(${d})`,backgroundSize:"cover",backgroundPosition:"center",backgroundAttachment:"fixed",color:"#fff",display:"flex",flexDirection:"column",justifyContent:"space-between",alignItems:"center",fontFamily:"'Outfit', 'Segoe UI', sans-serif",padding:"40px 20px",position:"relative",overflowY:"auto",overflowX:"hidden"},children:[t.jsx("style",{children:`
                @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;700;900&display=swap');

                @keyframes float {
                    0% { transform: translateY(0px); }
                    50% { transform: translateY(-10px); }
                    100% { transform: translateY(0px); }
                }
                
                @keyframes glowPulse {
                    0% { box-shadow: 0 0 5px #00f2ff, 0 0 10px #00f2ff inset; }
                    50% { box-shadow: 0 0 20px #00f2ff, 0 0 40px #00f2ff inset; }
                    100% { box-shadow: 0 0 5px #00f2ff, 0 0 10px #00f2ff inset; }
                }

                @keyframes scanline {
                    0% { top: -100%; }
                    100% { top: 200%; }
                }

                .glass-panel {
                    background: rgba(10, 20, 30, 0.6);
                    backdrop-filter: blur(12px);
                    border: 1px solid rgba(0, 242, 255, 0.3);
                    box-shadow: 0 0 30px rgba(0,0,0,0.5);
                }
            `}),t.jsx("div",{style:{position:"absolute",inset:0,background:"linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.8) 100%)",zIndex:1}}),t.jsx("div",{style:{position:"absolute",inset:0,background:"linear-gradient(to bottom, transparent, rgba(0, 255, 255, 0.05), transparent)",zIndex:2,animation:"scanline 8s linear infinite",pointerEvents:"none"}}),t.jsx("div",{style:{position:"absolute",inset:0,zIndex:1,pointerEvents:"none"},children:[...Array(40)].map((o,r)=>t.jsx("div",{style:{position:"absolute",left:`${Math.random()*100}%`,top:`${30+Math.random()*70}%`,width:`${Math.random()*4}px`,height:`${Math.random()*4}px`,background:r%4===0?"#ffffff":r%3===0?"#ff00ff":r%3===1?"#00f2ff":"#ffd700",borderRadius:"50%",boxShadow:`0 0 ${Math.random()*5+2}px ${r%4===0?"#ffffff":r%3===0?"#ff00ff":r%3===1?"#00f2ff":"#ffd700"}`,animation:`${r%2===0?"twinkle":"flicker"} ${1+Math.random()*4}s infinite ${Math.random()*5}s`}},r))}),t.jsx("div",{style:{position:"absolute",top:"-50%",left:"-50%",width:"200%",height:"200%",background:"radial-gradient(circle, rgba(0,242,255,0.03) 0%, transparent 60%)",animation:"spin 120s linear infinite",zIndex:1}}),t.jsxs("div",{style:{position:"fixed",left:"20px",top:"50%",transform:"translateY(-50%)",display:"flex",flexDirection:"column",gap:"15px",zIndex:999},children:[t.jsx("button",{onClick:()=>a(!1),style:{width:"10px",height:"40px",background:e?"rgba(255,255,255,0.1)":"#00f2ff",border:"1px solid #00f2ff",borderRadius:"10px",cursor:"pointer",transition:"all 0.3s",boxShadow:e?"none":"0 0 15px #00f2ff"},title:"Ver Segundo Plano (Fondo)"}),t.jsx("button",{onClick:()=>a(!0),style:{width:"10px",height:"40px",background:e?"gold":"rgba(255,255,255,0.1)",border:"1px solid gold",borderRadius:"10px",cursor:"pointer",transition:"all 0.3s",boxShadow:e?"0 0 15px gold":"none"},title:"Ver Primer Plano (Presentación)"})]}),t.jsxs("div",{style:{zIndex:10,textAlign:"center",marginTop:"4vh",opacity:e?1:0,transform:e?"translateY(0)":"translateY(-150px)",transition:"all 1s ease-out"},children:[t.jsx("h1",{style:{fontSize:"clamp(4rem, 10vw, 8rem)",margin:"0",lineHeight:.9,background:"linear-gradient(180deg, #fff 0%, #00f2ff 100%)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",textTransform:"uppercase",letterSpacing:"8px",fontWeight:"900",filter:"drop-shadow(0 0 20px rgba(0, 242, 255, 0.5))"},children:"TESO"}),t.jsxs("div",{style:{display:"flex",alignItems:"center",justifyContent:"center",gap:"15px",marginTop:"10px"},children:[t.jsx("div",{style:{height:"1px",width:"50px",background:"#00f2ff"}}),t.jsx("p",{style:{fontSize:"clamp(0.8rem, 2vw, 1.2rem)",color:"#b0e0e6",letterSpacing:"4px",textTransform:"uppercase",fontWeight:"300",margin:0},children:"Transporte Ejecutivo Sostenible & Operativo"}),t.jsx("div",{style:{height:"1px",width:"50px",background:"#00f2ff"}})]})]}),t.jsxs("div",{style:{zIndex:10,width:"100%",maxWidth:"1200px",height:"45vh",position:"relative",display:"flex",alignItems:"center",justifyContent:"center",overflow:"visible",opacity:e?1:0,transform:e?"scale(1)":"scale(0.95)",transition:"all 1s cubic-bezier(0.2, 0.8, 0.2, 1) 0.3s"},children:[t.jsxs("div",{style:{width:"100%",height:"100%",position:"relative"},children:[t.jsx("div",{style:{position:"absolute",bottom:"10%",left:0,right:0,height:"1px",background:"linear-gradient(90deg, transparent, rgba(0, 242, 255, 0.3), transparent)",boxShadow:"0 0 15px rgba(0, 242, 255, 0.2)"}}),t.jsx(f,{side:"left",icon:"🛫",label:"AEROPUERTO JMC",delay:"0s",color:"#00f2ff"}),t.jsx(f,{side:"right",icon:"🏢",label:"CORP. CENTER",delay:"2s",color:"#ffd700"}),t.jsxs("div",{style:{position:"absolute",animation:"planeLand 12s infinite linear"},children:[t.jsx("div",{style:{fontSize:"4.5rem",filter:"drop-shadow(0 0 12px rgba(0, 242, 255, 0.8))"},children:"✈️"}),t.jsx("div",{style:{position:"absolute",top:"60%",left:"65%",width:"110px",height:"45px",background:"linear-gradient(90deg, rgba(255,255,255,0.8) 0%, transparent 100%)",transformOrigin:"left center",transform:"rotate(15deg)",clipPath:"polygon(0 40%, 100% 0, 100% 100%, 0 60%)",filter:"blur(5px)",animation:"beamPulse 2s infinite ease-in-out",zIndex:-1}}),t.jsx("div",{style:{position:"absolute",top:"55%",left:"25%",width:"3px",height:"3px",background:"#ff0000",borderRadius:"50%",boxShadow:"0 0 8px #ff0000",animation:"blink 2s infinite",animationDelay:"0.1s"}}),t.jsx("div",{style:{position:"absolute",top:"35%",left:"60%",width:"3px",height:"3px",background:"#00ff00",borderRadius:"50%",boxShadow:"0 0 8px #00ff00",opacity:.8}}),t.jsx("div",{style:{position:"absolute",top:"65%",left:"75%",width:"4px",height:"4px",background:"#ffffff",borderRadius:"50%",boxShadow:"0 0 10px #ffffff, 0 0 20px #ffffff",animation:"blink 1.2s infinite ease-out"}})]}),t.jsxs("div",{style:{position:"absolute",animation:"planeTakeoff 12s infinite ease-in",animationDelay:"6s"},children:[t.jsx("div",{style:{fontSize:"4.5rem",filter:"drop-shadow(0 0 12px rgba(0, 242, 255, 0.8))"},children:"✈️"}),t.jsx("div",{style:{position:"absolute",top:"60%",left:"65%",width:"110px",height:"45px",background:"linear-gradient(90deg, rgba(255,255,255,0.8) 0%, transparent 100%)",transformOrigin:"left center",transform:"rotate(15deg)",clipPath:"polygon(0 40%, 100% 0, 100% 100%, 0 60%)",filter:"blur(5px)",animation:"beamPulse 2s infinite ease-in-out",zIndex:-1}}),t.jsx("div",{style:{position:"absolute",top:"55%",left:"25%",width:"3px",height:"3px",background:"#ff0000",borderRadius:"50%",boxShadow:"0 0 8px #ff0000",opacity:.8}}),t.jsx("div",{style:{position:"absolute",top:"35%",left:"60%",width:"3px",height:"3px",background:"#00ff00",borderRadius:"50%",boxShadow:"0 0 8px #00ff00",animation:"blink 2s infinite",animationDelay:"0.5s"}}),t.jsx("div",{style:{position:"absolute",top:"65%",left:"75%",width:"4px",height:"4px",background:"#ffffff",borderRadius:"50%",boxShadow:"0 0 10px #ffffff",animation:"blink 1s infinite"}})]}),t.jsxs("div",{style:{position:"absolute",bottom:"10%",left:"50%",transform:"translate(-50%, 50%)",width:"120px",height:"45px",zIndex:20,animation:"carShuttle 12s infinite ease-in-out"},children:[t.jsxs("svg",{viewBox:"0 0 140 50",style:{width:"100%",filter:"drop-shadow(0 0 8px var(--neon-green))"},children:[t.jsx("path",{d:"M10,35 L15,20 L35,12 L85,12 L120,20 L130,35 L130,42 L10,42 Z",fill:"#050505",stroke:"var(--neon-green)",strokeWidth:"1.5"}),t.jsx("path",{d:"M38,15 L82,15 L82,22 L36,22 Z",fill:"#333",stroke:"var(--neon-green)",strokeWidth:"0.5",opacity:"0.9"}),t.jsx("path",{d:"M86,15 L115,20 L112,22 L86,22 Z",fill:"#333",stroke:"var(--neon-green)",strokeWidth:"0.5",opacity:"0.9"}),t.jsx("path",{d:"M18,22 L32,15 L35,22 Z",fill:"#444",stroke:"var(--neon-green)",strokeWidth:"0.5",opacity:"0.7"}),t.jsx("circle",{cx:"30",cy:"42",r:"6",fill:"#000",stroke:"var(--neon-green)",strokeWidth:"1.5"}),t.jsx("circle",{cx:"110",cy:"42",r:"6",fill:"#000",stroke:"var(--neon-green)",strokeWidth:"1.5"}),t.jsx("circle",{cx:"128",cy:"38",r:"1.5",fill:"#fff",filter:"blur(1px)"})]}),t.jsx("div",{style:{position:"absolute",top:"55px",width:"100%",textAlign:"center",fontSize:"0.9rem",color:"var(--neon-green)",letterSpacing:"2px",fontWeight:"900",textShadow:"0 0 10px var(--neon-green)"},children:"TESO VIP"})]})]}),t.jsxs("div",{style:{position:"absolute",top:"20px",right:"20px",display:"flex",gap:"10px",fontSize:"0.7rem",color:"#888"},children:[t.jsx("span",{style:{color:"#00f2ff"},children:"● ONLINE"}),t.jsx("span",{children:"LATency: 12ms"})]})]}),t.jsxs("div",{style:{zIndex:100,marginBottom:"5vh",display:"flex",flexDirection:"column",alignItems:"center",gap:"20px",opacity:e?1:0,transform:e?"translateY(0)":"translateY(100px)",transition:"all 1s ease-out 0.6s"},children:[t.jsxs("button",{onClick:p,disabled:i,style:{background:i?"transparent":"rgba(0, 0, 0, 0.3)",border:"1px solid #00f2ff",color:i?"transparent":"#00f2ff",padding:"18px 60px",fontSize:"1rem",letterSpacing:"3px",borderRadius:"0",clipPath:"polygon(10% 0, 100% 0, 100% 70%, 90% 100%, 0 100%, 0 30%)",cursor:i?"default":"pointer",transition:"all 0.3s ease",textTransform:"uppercase",fontWeight:"bold",position:"relative",animation:i?"none":"glowPulse 3s infinite",minWidth:"300px",backdropFilter:"blur(3px)"},onMouseEnter:o=>{i||(o.currentTarget.style.background="#00f2ff",o.currentTarget.style.color="#000",o.currentTarget.style.boxShadow="0 0 30px #00f2ff")},onMouseLeave:o=>{i||(o.currentTarget.style.background="rgba(0, 0, 0, 0.3)",o.currentTarget.style.color="#00f2ff",o.currentTarget.style.boxShadow="none")},children:[i?"":"INGRESAR AL HUB",i&&t.jsx("div",{style:{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%, -50%)",width:"24px",height:"24px",border:"3px solid #00f2ff",borderRadius:"50%",borderTopColor:"transparent",animation:"spin 1s linear infinite"}})]}),t.jsx("div",{style:{fontSize:"0.7rem",color:"#555",letterSpacing:"1px"},children:"SECURE CONNECTION v4.1.5 | MEDELLÍN"})]}),t.jsx("style",{children:`
                @keyframes spin {
                    100% { transform: rotate(360deg); }
                }
                
                @keyframes strobe {
                    0%, 100% { opacity: 0; transform: scale(0.5); }
                    50% { opacity: 1; transform: scale(1.5); }
                }

                @keyframes cityPulse {
                    0% { filter: drop-shadow(0 0 5px #ffd700) brightness(1); }
                    50% { filter: drop-shadow(0 0 20px #ffd700) brightness(1.3); }
                    100% { filter: drop-shadow(0 0 5px #ffd700) brightness(1); }
                }

                 @keyframes neonFlicker {
                    0%, 19%, 21%, 23%, 25%, 54%, 56%, 100% {
                        text-shadow: 0 0 5px #ff00ff, 0 0 10px #ff00ff, 0 0 20px #ff00ff, 0 0 40px #ff00ff;
                        opacity: 1;
                    }
                    20%, 24%, 55% {
                        text-shadow: none;
                        opacity: 0.5;
                    }
                }

                @keyframes twinkle {
                    0%, 100% { opacity: 0.3; transform: scale(1); }
                    50% { opacity: 1; transform: scale(1.5); }
                }

                @keyframes flicker {
                    0% { opacity: 0.1; }
                    5% { opacity: 1; }
                    10% { opacity: 0.1; }
                    15% { opacity: 1; }
                    20% { opacity: 0.1; }
                    100% { opacity: 0.1; }
                }

                @keyframes beamPulse {
                    0% { opacity: 0.4; height: 60px; }
                    50% { opacity: 0.7; height: 80px; }
                    100% { opacity: 0.4; height: 60px; }
                }
                
                /* LANDING: Controlled Stable Approach (Glide Slope)
                   Emoji ✈️ defaults to pointing NE (45°).
                   Rotate(45deg) makes it point East (Level).
                   Rotate(60deg) makes it point slightly Down (Descent).
                   Rotate(35deg) makes it point slightly Up (Flare).
                */
                @keyframes planeLand {
                    0% { left: -10%; top: 10%; transform: rotate(60deg) scale(0.6); opacity: 0; } /* Start gentle descent */
                    10% { opacity: 1; }
                    50% { left: 40%; top: 55%; transform: rotate(60deg) scale(0.9); } /* Steady glide */
                    60% { left: 45%; top: 65%; transform: rotate(45deg) scale(1); } /* Level out */
                    70% { left: 50%; top: 65%; transform: rotate(35deg) scale(1); opacity: 1; } /* Flare (Nose up) & Touchdown */
                    80% { left: 60%; top: 65%; transform: rotate(35deg) scale(1); opacity: 0; } /* Rollout & Vanish */
                    100% { left: 60%; top: 65%; opacity: 0; }
                }

                /* TAKEOFF: Matches 'Airplane Departure' 🛫 icon orientation.
                   Start: Rotate(45deg) = Level/East (Runway Roll).
                   Climb: Rotate(0deg) = Natural NE (Standard Departure Angle).
                */
                @keyframes planeTakeoff {
                    0% { left: 50%; top: 65%; transform: rotate(45deg) scale(1); opacity: 0; }
                    1% { left: 50%; top: 65%; transform: rotate(45deg) scale(1); opacity: 1; } /* Appear Level */
                    20% { left: 65%; top: 65%; transform: rotate(45deg) scale(1); } /* Roll Level */
                    30% { left: 70%; top: 55%; transform: rotate(20deg) scale(1); } /* Rotate/Lift */
                    100% { left: 120%; top: -10%; transform: rotate(0deg) scale(0.8); opacity: 0; } /* Climb Out NE */
                }

                @keyframes carShuttle {
                    0% { left: 2%; transform: translate(0, 50%) scaleX(1); opacity: 0; }
                    5% { opacity: 1; }
                    45% { left: 85%; transform: translate(0, 50%) scaleX(1); } /* Arrive Right (Wider) */
                    50% { left: 85%; transform: translate(0, 50%) scaleX(-1); } /* Turn */
                    90% { left: 2%; transform: translate(0, 50%) scaleX(-1); } /* Arrive Left (Wider) */
                    95% { opacity: 1; }
                    100% { left: 2%; transform: translate(0, 50%) scaleX(1); opacity: 0; } /* Reset */
                }
            `})]})}const f=({side:n,icon:i,label:s,delay:e,color:a})=>t.jsxs("div",{style:{position:"absolute",bottom:"15%",[n]:"0%",textAlign:n==="left"?"left":"right",animation:`float 6s ease-in-out infinite ${e}`},children:[t.jsx("div",{style:{fontSize:"3.5rem",filter:`drop-shadow(0 0 15px ${a})`,marginBottom:"10px",animation:n==="right"?"cityPulse 4s infinite":"none"},children:i}),t.jsx("div",{style:{fontSize:"0.8rem",fontWeight:"bold",color:a,textTransform:"uppercase",letterSpacing:"1px",animation:n==="right"?"neonFlicker 4s infinite":"none",textShadow:n==="right"?`0 0 10px ${a}`:"none"},children:s}),t.jsx("div",{style:{width:"40px",height:"2px",background:a,margin:n==="left"?"0":"0 0 0 auto",boxShadow:`0 0 10px ${a}`}})]});export{c as default};

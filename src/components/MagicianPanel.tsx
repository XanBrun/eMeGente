import React, { useState, useEffect } from "react";
import { 
  Sliders, 
  Settings, 
  Layers, 
  Volume2, 
  Zap, 
  User, 
  Users, 
  Bluetooth, 
  Wifi, 
  HelpCircle,
  FileText,
  AlertTriangle,
  Play,
  QrCode,
  Copy,
  ExternalLink,
  BookOpen,
  DollarSign,
  Briefcase,
  Music,
  MapPin,
  Compass,
  FileCheck
} from "lucide-react";
import { Book, Card, KINDLE_BOOKS, BARALA_21_CARTAS, GEO_CITIES } from "../data/magicData";
import { MagicTrickType } from "../App";

interface MagicianPanelProps {
  mode: 'solo' | 'assistant';
  setMode: (mode: 'solo' | 'assistant') => void;
  activeTrick: MagicTrickType;
  setActiveTrick: (trick: MagicTrickType) => void;
  selectedBook: Book;
  setSelectedBook: (book: Book) => void;
  targetSum: number;
  setTargetSum: (sum: number) => void;
  forcedCard: Card;
  setForcedCard: (card: Card) => void;
  targetEnvelope: number;
  setTargetEnvelope: (env: number) => void;
  logs: string[];
  clearLogs: () => void;
  bleConnected: boolean;
  setBleConnected: (conn: boolean) => void;
  sendManualSecret: (str: string) => void;
  onPostSoundtrack: (sound: string) => void;
}

export default function MagicianPanel({
  mode,
  setMode,
  activeTrick,
  setActiveTrick,
  selectedBook,
  setSelectedBook,
  targetSum,
  setTargetSum,
  forcedCard,
  setForcedCard,
  targetEnvelope,
  setTargetEnvelope,
  logs,
  clearLogs,
  bleConnected,
  setBleConnected,
  sendManualSecret,
  onPostSoundtrack
}: MagicianPanelProps) {

  const [customSecretText, setCustomSecretText] = useState("");
  const [copiedLink, setCopiedLink] = useState(false);
  const [customFinancePrice, setCustomFinancePrice] = useState("68419.12");

  // QR link generator function matching the lock rules
  const getSpectatorLink = () => {
    // Determine the base protocol and host of our page
    const base = window.location.origin + window.location.pathname;
    return `${base}?routine=${activeTrick}`;
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(getSpectatorLink());
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleSendManual = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customSecretText.trim()) return;
    sendManualSecret(customSecretText.trim());
    setCustomSecretText("");
  };

  return (
    <div className="bg-black/40 backdrop-blur-md rounded-3xl p-6 border border-white/5 shadow-2xl h-full flex flex-col justify-between">
      
      {/* Header Panel */}
      <div>
        <div className="flex justify-between items-center pb-4 border-b border-white/10 mb-5">
          <div>
            <span className="text-xs font-mono text-cyan-400 font-semibold tracking-wider uppercase block">PANEL DEL MAGO</span>
            <h2 className="text-lg font-bold text-white font-display">Consola de Control</h2>
          </div>
          <div className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1 rounded-xl border border-white/10">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
            <span className="text-[10px] font-mono text-slate-400">ULTRA-CONSOLE</span>
          </div>
        </div>

        {/* Dynamic Mode Switcher (Solo vs Con Ayudante) */}
        <div className="mb-5">
          <label className="block text-[10px] font-mono text-slate-400 mb-1.5 uppercase tracking-wider">
            Modo Operativo de Trucos
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setMode('solo')}
              className={`flex items-center justify-center gap-2 py-2 rounded-xl transition-all border cursor-pointer ${
                mode === 'solo'
                  ? "bg-cyan-950/35 border-cyan-550/40 text-cyan-450 shadow-[0_0_15px_rgba(6,182,212,0.15)]"
                  : "bg-white/5 border-white/10 text-slate-500 hover:bg-white/10"
              }`}
            >
              <User size={13} />
              <div className="text-left font-sans">
                <span className="block text-xs font-bold leading-tight">AUTOMÁTICO</span>
                <span className="block text-[8px] opacity-75">Mago Solo (BLE)</span>
              </div>
            </button>

            <button
              onClick={() => setMode('assistant')}
              className={`flex items-center justify-center gap-2 py-2 rounded-xl transition-all border cursor-pointer ${
                mode === 'assistant'
                  ? "bg-cyan-950/35 border-cyan-550/40 text-cyan-450 shadow-[0_0_15px_rgba(6,182,212,0.15)]"
                  : "bg-white/5 border-white/10 text-slate-500 hover:bg-white/10"
              }`}
            >
              <Users size={13} />
              <div className="text-left font-sans">
                <span className="block text-xs font-bold leading-tight">CON AYUDANTE</span>
                <span className="block text-[8px] opacity-75">Canal de Rebote</span>
              </div>
            </button>
          </div>
        </div>

        {/* 10 Magic Routines Matrix Grid Selection */}
        <div className="mb-5">
          <label className="block text-[10px] font-mono text-slate-400 mb-1.5 uppercase tracking-wider">
            Selección de Rutina Activa (10 Industriales)
          </label>
          <div className="grid grid-cols-5 gap-1 shadow-inner p-1 rounded-2xl bg-[#09090b]/40">
            {[
              { id: 'kindle', label: '1. Kindle Book', icon: '📔' },
              { id: 'netflix', label: '2. Cine Sound', icon: '🍿' },
              { id: 'card', label: '3. 21-Cards', icon: '♠' },
              { id: 'geo', label: '4. Geo Echo', icon: '🌍' },
              { id: 'clock', label: '5. Chronos', icon: '⏰' },
              { id: 'voice', label: '6. Voice AI', icon: '🎙️' },
              { id: 'stock', label: '7. Stock-Dec', icon: '📈' },
              { id: 'spotify', label: '8. Spotify', icon: '🟢' },
              { id: 'calculator', label: '9. Math M+', icon: '➕' },
              { id: 'wikipedia', label: '10. Wiki-Trace', icon: '🔍' }
            ].map(trick => (
              <button
                key={trick.id}
                onClick={() => {
                  setActiveTrick(trick.id as any);
                  clearLogs();
                }}
                className={`flex flex-col items-center justify-center p-1.5 rounded-xl transition text-center border h-[52px] cursor-pointer ${
                  activeTrick === trick.id
                    ? "bg-[#141417] border-cyan-500 text-cyan-450 font-bold scale-102 shadow-[0_0_10px_rgba(6,182,212,0.25)]"
                    : "bg-white/5 border-white/5 text-slate-450 hover:bg-white/10 hover:text-slate-350"
                }`}
              >
                <span className="text-sm mb-0.5">{trick.icon}</span>
                <span className="text-[7.5px] font-mono leading-tight truncate w-full">{trick.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Trick Settings Parameters Panel */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 mb-5">
          <h3 className="text-xs font-bold text-cyan-400 font-mono mb-3 flex items-center gap-1">
            <Sliders size={12} />
            Parámetros de Forzado Secreto
          </h3>

          {/* 1. KINDLE BOOK-TEST (8 books categorized) */}
          {(activeTrick === 'kindle' || activeTrick === 'matrix' || activeTrick === 'roulette') && (
            <div className="flex flex-col gap-3">
              <div>
                <label className="block text-[9px] text-slate-500 font-mono mb-1 uppercase">Libro Kindle Forzado (2 de fantasía, 2 novelas, 2 cuentos, 2 ensayos)</label>
                <div className="grid grid-cols-2 gap-1.5 h-28 overflow-y-auto pr-1">
                  {KINDLE_BOOKS.map(book => (
                    <button
                      key={book.id}
                      onClick={() => setSelectedBook(book)}
                      className={`text-left p-2 rounded-xl border text-xs flex flex-col justify-between transition h-14 cursor-pointer ${
                        selectedBook.id === book.id
                          ? "bg-cyan-950/40 border-cyan-500 text-white shadow-[0_0_8px_rgba(6,182,212,0.2)]"
                          : "bg-black/50 border-white/10 text-slate-400 hover:bg-white/10"
                      }`}
                    >
                      <span className="font-bold truncate text-[10px] leading-tight block text-slate-200">{book.title}</span>
                      <span className="text-[8px] text-slate-500 truncate block mt-0.5">{book.author}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[9px] text-slate-500 font-mono mb-1 uppercase">Suma / Página Forzada</label>
                  <input 
                    type="number" 
                    min="1" 
                    max="300"
                    value={targetSum}
                    onChange={e => setTargetSum(Number(e.target.value))}
                    className="w-full bg-[#0a0a0c] text-cyan-400 py-1 px-2 rounded-lg text-xs font-mono border border-white/10 text-center"
                  />
                </div>
                <div>
                  <label className="block text-[9px] text-slate-505 font-mono mb-1 uppercase text-slate-500">Sub-modo Atasco</label>
                  <div className="flex gap-1">
                    <button 
                      onClick={() => { setTargetSum(42); }}
                      className="bg-black py-1 font-mono hover:bg-white/5 border border-white/10 rounded flex-1 text-[10px] text-slate-400 text-center"
                    >PD: 42</button>
                    <button 
                      onClick={() => { setTargetSum(69); }}
                      className="bg-black py-1 font-mono hover:bg-white/5 border border-white/10 rounded flex-1 text-[10px] text-slate-400 text-center"
                    >PD: 69</button>
                    <button 
                      onClick={() => { setTargetSum(100); }}
                      className="bg-black py-1 font-mono hover:bg-white/5 border border-white/10 rounded flex-1 text-[10px] text-slate-400 text-center"
                    >PD: 100</button>
                  </div>
                </div>
              </div>

              <div className="bg-cyan-900/10 p-2 rounded-xl border border-dashed border-cyan-800/40 text-[10px] leading-relaxed text-slate-350">
                <span className="text-cyan-400 font-bold font-mono">Forzado en la Sombra Activo:</span> El lector de reojo Weiser se encarga de recibir el extracto y la palabra mágica exacta.
              </div>
            </div>
          )}

          {/* 2. NETFLIX & SOUNDTRACKS */}
          {activeTrick === 'netflix' && (
            <div className="flex flex-col gap-2">
              <span className="text-[10px] uppercase font-mono tracking-wider font-bold text-cyan-400">MindFlix Tracker: 52 Banners</span>
              <p className="text-[11px] text-slate-405 leading-relaxed text-slate-400">
                Al seleccionar cualquier banner el móvil del espectador sintoniza. Tu receptor vibrará con exactitud cuántica y te indicará director, banda sonora y estrellas.
              </p>
              <div className="flex gap-1.5">
                {["Inception (Han Zimmer)", "Speak Softly (Nino Rota)"].map((track) => (
                  <button
                    key={track}
                    onClick={() => onPostSoundtrack(track)}
                    className="bg-black/60 hover:bg-white/5 text-[9px] font-mono text-slate-300 py-1.5 px-2.5 rounded-lg border border-white/10 flex-1 text-center"
                  >
                    🎵 Lanzar {track.split(" (")[0]}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 3. AUTOMATED 21 CARDS & ENVELOPES */}
          {activeTrick === 'card' && (
            <div className="flex flex-col gap-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[8.5px] text-slate-500 font-mono mb-0.5 uppercase">Carta Forzada</label>
                  <select
                    value={forcedCard.id}
                    onChange={(e) => {
                      const found = BARALA_21_CARTAS.find(c => c.id === e.target.value);
                      if (found) setForcedCard(found);
                    }}
                    className="w-full bg-black text-cyan-400 py-1 px-2 rounded-lg text-xs font-mono border border-white/10 cursor-pointer"
                  >
                    {BARALA_21_CARTAS.map(card => (
                      <option key={card.id} value={card.id}>{card.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[8.5px] text-slate-500 font-mono mb-0.5 uppercase">Sobre Asociado</label>
                  <select
                    value={targetEnvelope}
                    onChange={(e) => setTargetEnvelope(Number(e.target.value))}
                    className="w-full bg-black text-cyan-400 py-1 px-2 rounded-lg text-xs font-mono border border-white/10 cursor-pointer"
                  >
                    {[1, 2, 3, 4].map(n => (
                      <option key={n} value={n}>Sobre #{n}</option>
                    ))}
                  </select>
                </div>
              </div>
              <span className="text-[10px] text-slate-500 italic block border-t border-white/5 pt-1.5">
                * El espectador realiza el reparto mental. El resultado forzado es {forcedCard.name} en el sobre {targetEnvelope}.
              </span>
            </div>
          )}

          {/* 4. GEO-ECHO MATRIX */}
          {activeTrick === 'geo' && (
            <div className="flex flex-col gap-2">
              <label className="block text-[9px] text-slate-500 font-mono uppercase">20 Metrópolis y Coordenadas para el Atlas Secreto</label>
              <div className="grid grid-cols-3 gap-1 h-20 overflow-y-auto pr-1">
                {GEO_CITIES.map((city, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setTargetSum(idx);
                      sendManualSecret(`[GEO] ${city.name.substring(0,8)} ${city.coords}`);
                    }}
                    className="p-1 px-2 bg-black/60 font-mono hover:bg-cyan-950/20 active:scale-95 border border-white/5 rounded text-[8px] truncate cursor-pointer text-slate-400 text-left"
                  >
                    📍 {city.name}
                  </button>
                ))}
              </div>
              <p className="text-[9px] text-slate-500 leading-snug">
                Haz clic en cualquier metrópolis para forzar su envío directo al reloj. En el escenario, bastará con que el espectador toque la pantalla del mapa en su teléfono.
              </p>
            </div>
          )}

          {/* 5. CHRONOS PREDICTOR */}
          {activeTrick === 'clock' && (
            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase">Manipulación de Reloj Analogico Weiser</span>
              <p className="text-[11px] text-slate-400">
                La hora elegida por el espectador sintoniza el vibrador local. No requiere pre-configuración en el panel secreto. El reloj sincroniza su chip RTC.
              </p>
            </div>
          )}

          {/* 6. AI VOICE WHISPERER */}
          {activeTrick === 'voice' && (
            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase">Espectrogramas de voz (Mic de pulsera)</span>
              <p className="text-[11px] text-slate-400">
                Permite capturar palabras del espectador y decodificar en pulsos táctiles Weiser o bajo-luz ambar en pantalla.
              </p>
              <div className="grid grid-cols-3 gap-1">
                {["Anhelo", "Espejo", "Reliquia"].map(w => (
                  <button
                    key={w}
                    onClick={() => sendManualSecret(`[VOICE] ESP32: "${w.toUpperCase()}"`)}
                    className="bg-black/80 font-mono pointer-events-auto hover:bg-white/5 rounded py-1 text-[9px] text-slate-400 text-center cursor-pointer border border-white/5"
                  >
                    Simular "{w}"
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 7. STOCK-MARKET BLACKOUT */}
          {activeTrick === 'stock' && (
            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase">Cifras Decimales de Bolsa</span>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customFinancePrice}
                  onChange={e => {
                    setCustomFinancePrice(e.target.value);
                    sendManualSecret(`[STOCK] NASDAQ Override $${e.target.value}`);
                  }}
                  placeholder="Precio custom..."
                  className="bg-black text-[11px] text-cyan-400 py-1.5 font-mono border border-white/10 rounded flex-1 text-center"
                />
                <button
                  type="button"
                  onClick={() => sendManualSecret(`[STOCK] BTC CLOSING: ${customFinancePrice}`)}
                  className="bg-cyan-500 font-bold text-black text-[10px] px-3.5 rounded-lg active:scale-95 transition cursor-pointer"
                >
                  Enviar
                </button>
              </div>
            </div>
          )}

          {/* 8. SPOTIFY ESP */}
          {activeTrick === 'spotify' && (
            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase">Playlist ESP de 50 Clásicos</span>
              <p className="text-[11px] text-slate-400 leading-normal">
                En esta rutina, la persona pulsa cualquier melodía de la estantería del móvil. El receptor siente los bajos acústicos sutilmente en su muñeca mediante pulsos hámpticos.
              </p>
            </div>
          )}

          {/* 9. CALCULATOR CONFESSION */}
          {activeTrick === 'calculator' && (
            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase">Lior Manor Confession Layout</span>
              <p className="text-[11px] text-slate-400">
                La calculadora simulará operaciones complejas. Al final el resultado forzado será: **`18041989`** (o cambia este valor y envía al reloj).
              </p>
            </div>
          )}

          {/* 10. WIKIPEDIA CRAWL TRACE */}
          {activeTrick === 'wikipedia' && (
            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase">Trazado de Enlaces en Wikipedia</span>
              <p className="text-[11px] text-slate-400 leading-normal">
                Observe los logs de la bitácora un paso adelante. Sabrá qué artículo (Houdini, Robert-Houdin, Cagliostro, Telepatía) seleccionó el espectador antes de levantar la vista.
              </p>
            </div>
          )}
        </div>

        {/* Dynamic Interactive QR Router Section */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 mb-5">
          <h4 className="text-xs font-bold text-cyan-400 font-mono mb-2 flex items-center gap-1">
            <QrCode size={13} />
            Generador de QR Dinámico (Cerrar / Auto-Destruir)
          </h4>
          
          <div className="flex flex-col md:flex-row gap-3 items-center">
            {/* Elegant SVG Mathematical QR Code Renderer (Zero dependencies) */}
            <div className="w-20 h-20 bg-white p-1 rounded-xl flex-shrink-0 shadow-[0_0_15px_rgba(255,255,255,0.8)] relative group overflow-hidden">
              <svg viewBox="0 0 25 25" className="w-[102%] h-[102%] text-zinc-950">
                {/* QR Finder patterns Top Left */}
                <path d="M0,0 h7 v1 h-6 v5 h-1 z" fill="currentColor"/>
                <rect x="2" y="2" width="3" height="3" fill="currentColor" />
                <path d="M0,6 h7 v1 h-7 z" fill="currentColor" />
                {/* QR Finder patterns Top Right */}
                <path d="M18,0 h7 v7 h-7 z M19,1 v5 h5 v-5 z M21,3 h1 v1 h-1 z" fill="currentColor" />
                {/* QR Finder patterns Bottom Left */}
                <path d="M0,18 h7 v7 h-7 z M1,19 v5 h5 v-5 z M3,21 h1 v1 h-1 z" fill="currentColor" />
                
                {/* Fake High-fidelity deterministic QR matrix data based on routine name */}
                {Array.from({ length: 15 }).map((_, r) => 
                  Array.from({ length: 15 }).map((_, c) => {
                    const seed = (r * 11 + c * 13 + activeTrick.charCodeAt(0) * 7) % 5;
                    // Do not sketch finder areas
                    if ((r < 8 && c < 8) || (r < 8 && c > 16) || (r > 16 && c < 8)) return null;
                    if (seed === 0 || seed === 2) {
                      return <rect key={`${r}-${c}`} x={c + 5} y={r + 5} width="1.1" height="1.1" fill="currentColor" />;
                    }
                    return null;
                  })
                )}
              </svg>
            </div>

            {/* URL information & direct buttons */}
            <div className="flex-1 text-left w-full">
              <span className="text-[10px] font-mono text-slate-500 block">ENLACE AUTODESTRUIBLE (15S TÚNEL)</span>
              <div className="text-[11px] font-mono text-cyan-400 truncate bg-black/60 p-1.5 rounded-lg border border-white/5 pr-8 relative mb-2 select-all select-all select-all">
                {getSpectatorLink()}
                <button 
                  onClick={handleCopyLink} 
                  title="Copiar URL de truco para móvil"
                  className="absolute right-1 top-1 text-slate-500 hover:text-cyan-400 cursor-pointer p-0.5"
                >
                  <Copy size={12} />
                </button>
              </div>

              {copiedLink && (
                <span className="text-[9px] font-mono text-green-400 block mb-1">✓ ¡Enlace copiado al portapapeles!</span>
              )}

              <div className="flex gap-1.5">
                {/* Simulate Spectator Scan button */}
                <a 
                  href={getSpectatorLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-cyan-600 hover:bg-cyan-500 text-black text-[10px] font-bold py-1 px-2.5 rounded-lg transition text-center flex items-center justify-center gap-1 cursor-pointer"
                >
                  <ExternalLink size={10} /> Escanear / Abrir
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Gateway Telemetry & Action Logs */}
      <div>
        <div className="bg-[#09090b]/80 rounded-2xl p-4 border border-white/10 shadow-inner">
          <div className="flex justify-between items-center mb-2 pb-1.5 border-b border-white/5">
            <h4 className="text-xs font-bold text-slate-300 flex items-center gap-1 font-display">
              <Wifi size={13} className="text-cyan-400 animate-pulse" />
              Túnel Control - Bitácora BLE
            </h4>
            <button
              onClick={clearLogs}
              className="text-[10px] text-slate-500 hover:text-slate-300 font-mono underline cursor-pointer border-0 bg-transparent outline-none"
            >
              Borrar Logs
            </button>
          </div>

          {/* Scrollable Log Container */}
          <div className="h-28 overflow-y-auto text-[10px] font-mono text-slate-400 flex flex-col gap-1.5 scrollbar-none pr-1">
            {logs.length === 0 ? (
              <span className="text-slate-600 italic text-center my-auto block">Esperando conexiones del espectador...</span>
            ) : (
              logs.map((log, i) => (
                <div key={i} className="border-b border-white/5 pb-1 last:border-0 leading-normal">
                  <span className="text-cyan-400 mr-1">[{new Date().toLocaleTimeString()}]</span>
                  <span>{log}</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Manual secret text pushing (For testing) */}
        <form onSubmit={handleSendManual} className="mt-4 flex gap-1.5">
          <input
            type="text"
            placeholder="Enviar texto/vibración de prueba..."
            value={customSecretText}
            onChange={(e) => setCustomSecretText(e.target.value)}
            className="flex-1 bg-black text-slate-300 rounded-xl px-3 py-1.5 text-xs border border-white/15 focus:outline-none focus:border-cyan-550 font-mono placeholder-slate-600"
          />
          <button
            type="submit"
            className="bg-white/5 hover:bg-white/10 text-slate-350 px-3 py-1.5 rounded-xl text-xs font-mono font-medium border border-white/10 cursor-pointer text-[11px]"
          >
            Pulsar
          </button>
        </form>
      </div>
    </div>
  );
}

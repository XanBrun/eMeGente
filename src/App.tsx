/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { 
  Sparkles, 
  Tv, 
  User, 
  Users, 
  Cpu, 
  Watch, 
  Layout, 
  Phone, 
  MessageSquare, 
  Bluetooth, 
  BluetoothConnected, 
  Music, 
  Volume2, 
  Check, 
  RotateCw,
  HelpCircle,
  Eye,
  Settings
} from "lucide-react";
import { Book, Movie, Card, KINDLE_BOOKS, NETFLIX_MOVIES, BARALA_21_CARTAS, getShadowForcedWord } from "./data/magicData";
import MagicianPanel from "./components/MagicianPanel";
import SpectatorMock from "./components/SpectatorMock";
import WatchMock from "./components/WatchMock";
import AssistantPanel from "./components/AssistantPanel";
import DeveloperLab from "./components/DeveloperLab";

// Ambient types for Web Bluetooth to bypass strict compilation errors
interface BluetoothDevice {
  gatt?: {
    connect(): Promise<any>;
    disconnect(): void;
    connected: boolean;
  };
  name?: string;
  addEventListener(type: string, listener: any): void;
}
interface BluetoothRemoteGATTCharacteristic {
  writeValue(value: BufferSource): Promise<void>;
}


// Type for all 10 routines
export type MagicTrickType = 
  | 'kindle'      // 1. Kindle Book Test & Matrix/Roulette
  | 'matrix'      // Sub-routine of Kindle Force Matrix
  | 'roulette'    // Sub-routine of Kindle Force Roulette
  | 'netflix'     // 2. Netflix Mindreader (Soundtrack queue)
  | 'card'        // 3. Automated 21 Card Premonition Force
  | 'geo'         // 4. Geo-Echo Matrix (20 Landmark coords)
  | 'clock'       // 5. Chronos Predictor
  | 'voice'       // 6. AI Voice Whisperer / Voice parsing
  | 'stock'       // 7. Stock Market / Crypto Decimals
  | 'spotify'     // 8. Spotify ESP 50 Tracks play
  | 'calculator'  // 9. Calculator Confession (Lior Manor Force)
  | 'wikipedia';  // 10. Wikipedia Crawl Hyperlink trace

export default function App() {
  // Global magic state variables
  const [mode, setMode] = useState<'solo' | 'assistant'>('solo');
  const [activeTrick, setActiveTrick] = useState<MagicTrickType>('kindle');
  const [selectedBook, setSelectedBook] = useState<Book>(KINDLE_BOOKS[0]);
  const [targetSum, setTargetSum] = useState<number>(115); // default sum forced
  const [forcedCard, setForcedCard] = useState<Card>(BARALA_21_CARTAS[4]); // As de Corazones (AH)
  const [targetEnvelope, setTargetEnvelope] = useState<number>(1); // Envelope 1-4
  
  // Real bluetooth state variables
  const [bleConnected, setBleConnected] = useState<boolean>(false);
  const [bleDevice, setBleDevice] = useState<BluetoothDevice | null>(null);
  const [bleCharacteristic, setBleCharacteristic] = useState<BluetoothRemoteGATTCharacteristic | null>(null);
  const [isPairingBle, setIsPairingBle] = useState<boolean>(false);

  const [batteryLevel, setBatteryLevel] = useState<number>(98);
  const [soundtrackPlaying, setSoundtrackPlaying] = useState<string | null>(null);
  
  // Real-time feeds and logs
  const [logs, setLogs] = useState<string[]>([]);
  const [currentSpectatorSelection, setCurrentSpectatorSelection] = useState<string>("");
  const [currentSecretText, setCurrentSecretText] = useState<string>(
    "Weiser BLE Ready. Elige un truco para empezar..."
  );

  // Active workspace tab (for mobile view, while desktop has side-by-side bento)
  const [activeTab, setActiveTab] = useState<'control' | 'spectator' | 'watch' | 'assistant' | 'lab'>('control');
  
  // View mode state (Side-by-side vs single tab explorer)
  const [isBentoLayout, setIsBentoLayout] = useState<boolean>(true);

  // Tick Clock helper for RTC simulation
  const [rtcTime, setRtcTime] = useState<string>("10:10");

  useEffect(() => {
    // Start tick update, or can be overridden by clock hand trick
    const interval = setInterval(() => {
      const now = new Date();
      const hours = String(now.getHours() % 12 || 12).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      // If student hasn't triggered forced time, update with standard computer clock
      if (activeTrick !== 'clock') {
        setRtcTime(`${hours}:${minutes}`);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [activeTrick]);

  // Log and sync helper
  const addLog = (message: string) => {
    setLogs(prev => [message, ...prev.slice(0, 49)]);
  };

  // --- WEB BLUETOOTH pairing AND TRANSMISSION (1:1 with ESP32-S3 Arduino config) ---
  const conectarBluetooth = async () => {
    if (bleConnected && bleDevice) {
      // Disconnect
      try {
        await bleDevice.gatt?.disconnect();
        addLog("[GATT Bluetooth] Dispositivo desconectado manualmente.");
      } catch (e: any) {
        // Safe check
      }
      setBleConnected(false);
      setBleCharacteristic(null);
      setBleDevice(null);
      return;
    }

    try {
      setIsPairingBle(true);
      addLog("[GATT Bluetooth] Iniciando escaneo de dispositivos 'MAGE-WATCH'...");
      
      const device = await (navigator as any).bluetooth.requestDevice({
        filters: [
          { namePrefix: "MAGE-WATCH" },
          { name: "MAGE-WATCH" }
        ],
        optionalServices: ["6e400001-b5a3-f393-e0a9-e50e24dcca9e"]
      });

      addLog(`[GATT Bluetooth] Encontrado: ${device.name}. Vinculando GATT...`);
      const server = await device.gatt?.connect();
      addLog("[GATT Bluetooth] Servidor GATT conectado. Buscando servicio de escritura...");
      
      const service = await server?.getPrimaryService("6e400001-b5a3-f393-e0a9-e50e24dcca9e");
      const characteristic = await service?.getCharacteristic("6e400002-b5a3-f393-e0a9-e50e24dcca9e");

      setBleDevice(device);
      setBleCharacteristic(characteristic || null);
      setBleConnected(true);
      setIsPairingBle(false);
      addLog("[GATT Bluetooth] ¡CONEXIÓN ESTABLECIDA! Weiser Smartwatch sincronizado.");

      // Monitor disconnection
      device.addEventListener("gattserverdisconnected", () => {
        setBleConnected(false);
        setBleCharacteristic(null);
        setBleDevice(null);
        addLog("[GATT Bluetooth] Canal de comunicación interrumpido por hardware.");
      });

      // Send initial welcome pulse
      await transmitRawToBle("WEISER CONNECTED OK", characteristic);
    } catch (e: any) {
      setIsPairingBle(false);
      addLog(`[GATT Bluetooth Error] Adquisición fallada: ${e.message}`);
      // Fallback: Simulate BLE Connection for non-Bluetooth browser environments
      setBleConnected(true);
      addLog("[GATT Bluetooth] Simulación de vínculo BLE activada como respaldo.");
    }
  };

  // Dynamic XOR Cryptography transmitter
  const transmitRawToBle = async (text: string, overrideChar?: BluetoothRemoteGATTCharacteristic | null) => {
    const activeChar = overrideChar !== undefined ? overrideChar : bleCharacteristic;
    if (!activeChar) {
      // If we are in simulation mode instead, just print locally
      return;
    }

    try {
      const CRYPTO_SALT = 0x5A;
      // Encode String including trailing NULL as EOF delimiter
      const data = new TextEncoder().encode(text + "\x00");
      const encrypted = new Uint8Array(data.length);
      for (let i = 0; i < data.length; i++) {
        encrypted[i] = data[i] ^ CRYPTO_SALT;
      }

      // Fragmentation in 20-byte buffers to prevent ESP32 Queue drops
      for (let i = 0; i < encrypted.length; i += 20) {
        const chunk = encrypted.slice(i, i + 20);
        await activeChar.writeValue(chunk);
        await new Promise(resolve => setTimeout(resolve, 80)); // 80ms delay pacing
      }
      addLog(`[BLE Tx OK] XOR Encriptado enviado: "${text}"`);
    } catch (err: any) {
      addLog(`[BLE Tx Fail] Error al escribir en transductor: ${err.message}`);
    }
  };

  // Synchronize spectator actions into the magician watch
  const handleSpectatorEngagement = (msg: string) => {
    setCurrentSpectatorSelection(msg);
    addLog(msg);

    let displayStr = "";

    // Parse specific tricks for ultra-concise watch layouts
    if (activeTrick === 'kindle' || activeTrick === 'matrix' || activeTrick === 'roulette') {
      // Find page using shadow forcing deterministic fetch
      const val = getShadowForcedWord(selectedBook.id, targetSum);
      displayStr = `[${selectedBook.title.substring(0,10)}] Pag ${targetSum}: "${val.keyword.toUpperCase()}"`;
    } else if (activeTrick === 'card') {
      displayStr = `[Carta] ${forcedCard.name} | Env #${targetEnvelope}`;
    } else if (activeTrick === 'geo') {
      // Extract city from log msg
      // Format: [Geo-Echo] Ciudad: "Roma..." | Coordenadas: "41..."
      const cityName = msg.split('Ciudad: "')[1]?.split('"')[0] || "Roma";
      const coords = msg.split('Coordenadas: "')[1]?.split('"')[0] || "12'";
      displayStr = `[GEO] ${cityName.substring(0,8)} Coord: ${coords}`;
    } else if (activeTrick === 'clock') {
      displayStr = `[Tiempo] RTC Sinc: ${rtcTime}`;
    } else if (activeTrick === 'voice') {
      const parsedWord = msg.split('Palabra capturada en espectrograma: **"')[1]?.split('"')[0] || "Ninguna";
      displayStr = `[Voz AI] Palabra: ${parsedWord.toUpperCase()}`;
    } else if (activeTrick === 'stock') {
      const coin = msg.split('Activo ')[1]?.split(' cotizando')[0] || "BTC_USD";
      const decimals = msg.split('$')[1]?.split(' ')[0] || "69420.50";
      displayStr = `[STOCK] ${coin}: $${decimals}`;
    } else if (activeTrick === 'spotify') {
      const songName = msg.split('Canción seleccionada: "')[1]?.split('"')[0] || "Imagine";
      displayStr = `[SPOTIFY] ${songName.substring(0, 20)}`;
    } else if (activeTrick === 'calculator') {
      const digits = msg.split('Resultado forzado: **')[1]?.split('**')[0] || "";
      displayStr = `[CALC] Resultado: ${digits}`;
    } else if (activeTrick === 'wikipedia') {
      const pageLabel = msg.split('Artículo: "')[1]?.split('"')[0] || "Harry Houdini";
      displayStr = `[WIKI] Recorrido: ${pageLabel}`;
    } else {
      displayStr = msg;
    }

    setCurrentSecretText(displayStr);
    transmitRawToBle(displayStr); // Physical wrist output
  };

  // Voice command triggers coming from ESP32 Watch Speech engine simulation
  const handleVoiceCommand = (cmd: string) => {
    const formattedCmd = cmd.toLowerCase().trim();
    addLog(`[ESP32 Voice Command] Comando de voz: "${cmd}"`);
    
    if (formattedCmd === "siguiente") {
      // Advance forced page
      if (targetSum === 42) {
        setTargetSum(69);
        addLog(`[Voz Gesto] Blanco forzado avanzado a Página 69`);
      } else if (targetSum === 69) {
        setTargetSum(100);
        addLog(`[Voz Gesto] Blanco forzado avanzado a Página 100`);
      } else {
        setTargetSum(42);
        addLog(`[Voz Gesto] Blanco forzado reiniciado a Página 42`);
      }
    } else if (formattedCmd === "carta") {
      setActiveTrick("card");
      addLog(`[Voz Gesto] Cambio de truco automatizado: Baraja de Escenario`);
    } else if (formattedCmd === "revelar") {
      const msg = `👑 MANIFESTAR: Espectador sintonizado. Saca la carta del sobre ${targetEnvelope}...`;
      setCurrentSecretText(msg);
      transmitRawToBle(msg);
    } else if (formattedCmd.includes("libro")) {
      const match = formattedCmd.match(/\d+/);
      if (match) {
        const index = Number(match[0]);
        if (index >= 1 && index <= KINDLE_BOOKS.length) {
          setSelectedBook(KINDLE_BOOKS[index - 1]);
          addLog(`[Voz Gesto] Libro cambiado remotamente: "${KINDLE_BOOKS[index - 1].title}"`);
        }
      }
    }
  };

  const handleManualSecretPush = (str: string) => {
    setCurrentSecretText(str);
    addLog(`[Manual Push] Texto transmitido: "${str}"`);
    transmitRawToBle(str);
  };

  const handleWebSoundtrackTrigger = (sound: string | null) => {
    setSoundtrackPlaying(sound);
    if (sound) {
      addLog(`[Sinfonía De Sugestión] Pista lanzada: "${sound}"`);
    } else {
      addLog(`[Sinfonía De Sugestión] Pista de audio silenciada.`);
    }
  };

  const clearLogs = () => {
    setLogs([]);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-slate-300 flex flex-col font-sans antialiased overflow-x-hidden">
      
      {/* Decorative background grid and flares */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-40 pointer-events-none" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none z-0" />
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-cyan-600/5 rounded-full blur-3xl pointer-events-none z-0" />

      {/* Main Mystical Header Bar */}
      <header className="border-b border-white/10 bg-[#0a0a0c]/90 backdrop-blur-md sticky top-0 z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center border border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
              <Sparkles size={18} className="text-cyan-400 animate-pulse" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tighter text-white font-display">
                MAGE-LINK <span className="text-cyan-400">ULTRA</span>
              </h1>
              <p className="text-[10px] uppercase tracking-widest text-slate-500 font-mono">
                ESP32-S3 BLE Synchronizer • v5.0.0 • emergente.sh
              </p>
            </div>
          </div>

          {/* Center design status indicators widget */}
          <div className="flex gap-6 items-center bg-white/5 px-6 py-2.5 rounded-full border border-white/10">
            <div className="flex flex-col items-center">
              <span className="text-[9px] uppercase tracking-wider text-slate-400 mb-0.5">Physical Watch</span>
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${bleConnected ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)] animate-pulse' : 'bg-red-550 animate-ping'}`} />
                <button 
                  onClick={conectarBluetooth}
                  disabled={isPairingBle}
                  className="text-xs font-mono text-white hover:text-cyan-400 font-bold hover:underline transition cursor-pointer flex items-center gap-1"
                >
                  {isPairingBle ? "Emparejando..." : bleConnected ? "VINCULADO BLE" : "CONECTAR RELOJ"}
                </button>
              </div>
            </div>
            <div className="w-px h-6 bg-white/10" />
            <div className="flex flex-col items-center">
              <span className="text-[9px] uppercase tracking-wider text-slate-400 mb-0.5">Battery</span>
              <span className="text-xs font-mono text-cyan-400">{batteryLevel}%</span>
            </div>
            <div className="w-px h-6 bg-white/10" />
            <div className="flex flex-col items-center">
              <span className="text-[9px] uppercase tracking-wider text-slate-400 mb-0.5">RTC time</span>
              <span className="text-xs font-mono text-white">{rtcTime}</span>
            </div>
          </div>

          {/* Right Header Controls Top Rail */}
          <div className="flex flex-wrap items-center gap-3 text-xs">
            {/* Mode Picker from header */}
            <div className="flex bg-black p-1 rounded-lg border border-white/10">
              <button
                onClick={() => setMode('solo')}
                className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
                  mode === 'solo'
                    ? "bg-cyan-600 text-white shadow-[0_0_10px_rgba(6,182,212,0.4)]"
                    : "text-slate-500 hover:text-slate-300"
                }`}
              >
                SOLO (AUTO)
              </button>
              <button
                onClick={() => setMode('assistant')}
                className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
                  mode === 'assistant'
                    ? "bg-cyan-600 text-white shadow-[0_0_10px_rgba(6,182,212,0.4)]"
                    : "text-slate-500 hover:text-slate-300"
                }`}
              >
                CON AYUDANTE
              </button>
            </div>

            {/* View Mode Switcher */}
            <div className="bg-black rounded-lg p-1 border border-white/10 flex">
              <button
                onClick={() => setIsBentoLayout(false)}
                className={`px-3 py-1.5 rounded text-xs transition font-mono cursor-pointer ${
                  !isBentoLayout
                    ? "bg-[#18181b] text-cyan-400 font-bold text-xs"
                    : "text-slate-500 hover:text-slate-350"
                }`}
              >
                Tabs
              </button>
              
              <button
                onClick={() => setIsBentoLayout(true)}
                className={`px-3 py-1.5 rounded text-xs transition font-mono cursor-pointer ${
                  isBentoLayout
                    ? "bg-[#18181b] text-cyan-400 font-bold text-xs"
                    : "text-slate-500 hover:text-slate-350"
                }`}
              >
                Bento Deck
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main workspace arena */}
      <main className="flex-1 px-4 py-6 max-w-7xl w-full mx-auto relative z-10">
        
        {/* Playback soundtrack alert strip */}
        {soundtrackPlaying && (
          <div className="w-full bg-emerald-950/20 border border-emerald-900/40 rounded-2xl p-3.5 mb-6 text-xs text-emerald-400 flex items-center justify-between gap-3 animate-pulse">
            <div className="flex items-center gap-2">
              <Volume2 className="text-emerald-400" size={16} />
              <span>
                🔊 **Sugerencia escénica activa**: Sonando secretamente en sala: **"{soundtrackPlaying}"**. El espectador está inmerso acústicamente.
              </span>
            </div>
            <button 
              onClick={() => setSoundtrackPlaying(null)}
              className="text-xs underline text-emerald-400 hover:text-emerald-250 font-mono cursor-pointer"
            >
              Apagar Música
            </button>
          </div>
        )}

        {/* --- LAYOUT OPTION 1: RESPONSIVE SIDE-BY-SIDE PRACTICAL BENTO DECK --- */}
        {isBentoLayout ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            
            {/* Column A: Magician Command Deck & IoT settings (lg:col-span-4) */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              <div className="flex-1">
                <MagicianPanel
                  mode={mode}
                  setMode={setMode}
                  activeTrick={activeTrick}
                  setActiveTrick={setActiveTrick}
                  selectedBook={selectedBook}
                  setSelectedBook={setSelectedBook}
                  targetSum={targetSum}
                  setTargetSum={setTargetSum}
                  forcedCard={forcedCard}
                  setForcedCard={setForcedCard}
                  targetEnvelope={targetEnvelope}
                  setTargetEnvelope={setTargetEnvelope}
                  logs={logs}
                  clearLogs={clearLogs}
                  bleConnected={bleConnected}
                  setBleConnected={setBleConnected}
                  sendManualSecret={handleManualSecretPush}
                  onPostSoundtrack={handleWebSoundtrackTrigger}
                />
              </div>
              <div className="h-[230px]">
                {/* Assistant Small Module */}
                <AssistantPanel
                  mode={mode}
                  currentSpectatorSelection={currentSpectatorSelection}
                  activeTrick={activeTrick}
                  selectedBook={selectedBook}
                  setSelectedBook={setSelectedBook}
                  targetSum={targetSum}
                  setTargetSum={setTargetSum}
                  forcedCard={forcedCard}
                  setForcedCard={setForcedCard}
                  targetEnvelope={targetEnvelope}
                  setTargetEnvelope={setTargetEnvelope}
                  soundtrackPlaying={soundtrackPlaying}
                  onPostSoundtrack={handleWebSoundtrackTrigger}
                />
              </div>
            </div>

            {/* Column B: Spectator Virtual SmartPhone Portal (lg:col-span-4) */}
            <div className="lg:col-span-4 flex flex-col items-center justify-start bg-zinc-900/20 p-4 rounded-3xl border border-dashed border-zinc-850 relative">
              <div className="absolute top-2 left-6 text-[10px] font-mono text-zinc-650 uppercase tracking-widest pointer-events-none">
                Pantalla del Espectador (Simulado QR)
              </div>
              
              <div className="w-full mt-4">
                <SpectatorMock
                  activeTrick={activeTrick}
                  targetSum={targetSum}
                  selectedBook={selectedBook}
                  onSpectatorSelection={handleSpectatorEngagement}
                  onUpdateRtcTime={setRtcTime}
                  forcedCard={forcedCard}
                  targetEnvelope={targetEnvelope}
                />
              </div>
              <div className="text-center text-[11px] text-zinc-500 mt-4 px-4 leading-normal">
                * El espectador accedería a esta pantalla escaneando el código QR generado por el mago o mediante un dominio camuflado como **emergente.sh**
              </div>
            </div>

            {/* Column C: ESP32S3 AMOLED Watch Simulator & Developer Lab tabs (lg:col-span-4) */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              <WatchMock
                currentSecretText={currentSecretText}
                bleConnected={bleConnected}
                batteryLevel={batteryLevel}
                setBatteryLevel={setBatteryLevel}
                onSpeakCommand={handleVoiceCommand}
                rtcTime={rtcTime}
              />
              
              {/* Compact developer lab link */}
              <DeveloperLab />
            </div>

          </div>
        ) : (
          /* --- LAYOUT OPTION 2: SINGLE-TAB VIEW EXPLORER (Traditional) --- */
          <div className="flex flex-col gap-6">
            
            {/* Tabs Trigger Rail */}
            <div className="flex flex-wrap gap-2 p-1.5 bg-zinc-900 border border-zinc-850 rounded-2xl">
              <button
                onClick={() => setActiveTab('control')}
                className={`px-4 py-2.5 rounded-xl font-mono text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                  activeTab === 'control' ? "bg-zinc-950 text-white shadow" : "text-zinc-500 hover:text-zinc-350"
                }`}
              >
                <Settings size={14} /> Panel Mago Control
              </button>

              <button
                onClick={() => setActiveTab('spectator')}
                className={`px-4 py-2.5 rounded-xl font-mono text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                  activeTab === 'spectator' ? "bg-zinc-950 text-white shadow" : "text-zinc-500 hover:text-zinc-350"
                }`}
              >
                <Phone size={14} /> Espectador (Móvil)
              </button>

              <button
                onClick={() => setActiveTab('watch')}
                className={`px-4 py-2.5 rounded-xl font-mono text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                  activeTab === 'watch' ? "bg-zinc-950 text-white shadow" : "text-zinc-500 hover:text-zinc-350"
                }`}
              >
                <Watch size={14} /> Weiser AMOLED
              </button>

              <button
                onClick={() => setActiveTab('assistant')}
                className={`px-4 py-2.5 rounded-xl font-mono text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                  activeTab === 'assistant' ? "bg-zinc-950 text-white shadow" : "text-zinc-500 hover:text-zinc-350"
                }`}
              >
                <Users size={14} /> Consola Ayudante
              </button>

              <button
                onClick={() => setActiveTab('lab')}
                className={`px-4 py-2.5 rounded-xl font-mono text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                  activeTab === 'lab' ? "bg-zinc-950 text-white shadow" : "text-zinc-500 hover:text-zinc-350"
                }`}
              >
                <Cpu size={14} /> Firmware C++ IoT
              </button>
            </div>

            {/* Display active individual tab */}
            <div className="bg-zinc-950/40 p-1.5 rounded-3xl border border-zinc-900 min-h-[500px] flex flex-col justify-stretch">
              {activeTab === 'control' && (
                <MagicianPanel
                  mode={mode}
                  setMode={setMode}
                  activeTrick={activeTrick}
                  setActiveTrick={setActiveTrick}
                  selectedBook={selectedBook}
                  setSelectedBook={setSelectedBook}
                  targetSum={targetSum}
                  setTargetSum={setTargetSum}
                  forcedCard={forcedCard}
                  setForcedCard={setForcedCard}
                  targetEnvelope={targetEnvelope}
                  setTargetEnvelope={setTargetEnvelope}
                  logs={logs}
                  clearLogs={clearLogs}
                  bleConnected={bleConnected}
                  setBleConnected={setBleConnected}
                  sendManualSecret={handleManualSecretPush}
                  onPostSoundtrack={handleWebSoundtrackTrigger}
                />
              )}

              {activeTab === 'spectator' && (
                <div className="py-8 bg-zinc-900/10 rounded-2xl border border-dashed border-zinc-850">
                  <SpectatorMock
                    activeTrick={activeTrick}
                    targetSum={targetSum}
                    selectedBook={selectedBook}
                    onSpectatorSelection={handleSpectatorEngagement}
                    onUpdateRtcTime={setRtcTime}
                    forcedCard={forcedCard}
                    targetEnvelope={targetEnvelope}
                  />
                </div>
              )}

              {activeTab === 'watch' && (
                <div className="max-w-md mx-auto w-full">
                  <WatchMock
                    currentSecretText={currentSecretText}
                    bleConnected={bleConnected}
                    batteryLevel={batteryLevel}
                    setBatteryLevel={setBatteryLevel}
                    onSpeakCommand={handleVoiceCommand}
                    rtcTime={rtcTime}
                  />
                </div>
              )}

              {activeTab === 'assistant' && (
                <AssistantPanel
                  mode={mode}
                  currentSpectatorSelection={currentSpectatorSelection}
                  activeTrick={activeTrick}
                  selectedBook={selectedBook}
                  setSelectedBook={setSelectedBook}
                  targetSum={targetSum}
                  setTargetSum={setTargetSum}
                  forcedCard={forcedCard}
                  setForcedCard={setForcedCard}
                  targetEnvelope={targetEnvelope}
                  setTargetEnvelope={setTargetEnvelope}
                  soundtrackPlaying={soundtrackPlaying}
                  onPostSoundtrack={handleWebSoundtrackTrigger}
                />
              )}

              {activeTab === 'lab' && (
                <DeveloperLab />
              )}
            </div>
          </div>
        )}
      </main>

      {/* Secret Bottom Dashboard Meta Logs & Instructions */}
      <footer className="border-t border-cyan-500/20 bg-cyan-950/10 py-6 px-6 relative mt-12 text-slate-500 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <span className="font-mono text-cyan-400 font-bold tracking-wider uppercase text-[10px] block shadow-cyan-550">
              GUÍA DE ESCENARIO RÁPIDA
            </span>
            <p className="max-w-md mt-1 leading-normal text-slate-400">
               **Truco Kindle (Matriz/Ruleta)**: Elige el Libro y la Página meta. Pídele al espectador que resuelva el enigma en su móvil. Levanta el brazo y gira la muñeca discretamente para leer de reojo en tu Weiser Watch.
            </p>
          </div>
          <div className="text-center md:text-right">
            <span>© 2026 Weiser SmartWatch Magic Suite • Criptografía emergente.sh</span>
            <div className="flex gap-2 justify-center md:justify-end mt-1 text-[10px] font-mono">
              <span className="text-slate-600">ESP32-S3 Core: v5.0.0</span>
              <span className="text-slate-600">•</span>
              <span className="text-cyan-400">AMOLED Display Touch (QSPI)</span>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}

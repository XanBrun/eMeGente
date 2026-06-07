import React, { useState, useEffect, useRef } from "react";
import { 
  Watch, 
  Battery, 
  Bluetooth, 
  BluetoothConnected, 
  RotateCw, 
  Mic, 
  Gauge, 
  Volume2, 
  HelpCircle,
  Eye,
  EyeOff,
  Moon,
  Zap,
  Power,
  Sliders,
  AlertTriangle
} from "lucide-react";

interface WatchMockProps {
  currentSecretText: string;
  bleConnected: boolean;
  batteryLevel: number;
  setBatteryLevel: React.Dispatch<React.SetStateAction<number>>;
  onSpeakCommand: (cmd: string) => void;
  rtcTime: string;
}

export type WatchStateMode = 'calle' | 'show' | 'sleep';

export default function WatchMock({
  currentSecretText,
  bleConnected,
  batteryLevel,
  setBatteryLevel,
  onSpeakCommand,
  rtcTime
}: WatchMockProps) {
  
  // Custom smart firmware states
  const [watchMode, setWatchMode] = useState<WatchStateMode>('calle');
  const [hapticFeedback, setHapticFeedback] = useState<string | null>(null);
  const [isCharging, setIsCharging] = useState(false);
  const [speechInput, setSpeechInput] = useState("");
  const [showXRay, setShowXRay] = useState(false); // Developer inspect helper bypasses angles

  // Accelerometer simulated angles (IMU QMI8658)
  const [pitchAngle, setPitchAngle] = useState<number>(10);  // 0 to 90
  const [rollAngle, setRollAngle] = useState<number>(15);   // 0 to 90

  // FT3168 Touch Swipe controller (lights screen for 4 seconds)
  const [swipeActiveSeconds, setSwipeActiveSeconds] = useState<number>(0);

  // Button timer refs to mimic long holds
  const bootTimerRef = useRef<NodeJS.Timeout | null>(null);
  const powerTimerRef = useRef<NodeJS.Timeout | null>(null);
  const swipeIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Trigger haptic vibration simulation on new secret text
  useEffect(() => {
    if (currentSecretText && bleConnected) {
      triggerPulse("Ráfaga BLE Recibida: doble pulso háptico (vibración secreta 80ms)");
    }
  }, [currentSecretText]);

  // Handle FT3168 Capacitive left-to-right swipe (Turns display on for 4 seconds)
  const handleLeftToRightSwipe = () => {
    setSwipeActiveSeconds(4);
    triggerPulse("¡Gesto capacitivo FT3168 detectado! Encendiendo micro-display por 4 segundos.");
    
    if (swipeIntervalRef.current) clearInterval(swipeIntervalRef.current);
    swipeIntervalRef.current = setInterval(() => {
      setSwipeActiveSeconds(prev => {
        if (prev <= 1) {
          if (swipeIntervalRef.current) clearInterval(swipeIntervalRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Button BOOT Long Press (>2s) - enters Mode Show
  const handleBootDown = () => {
    bootTimerRef.current = setTimeout(() => {
      setWatchMode('show');
      setSwipeActiveSeconds(0);
      triggerPulse("MODO SHOW ACTIVADO: Doble vibración sutil feeling (Cargando AMOLED True Black a 80MHz)");
    }, 2000);
  };

  const handleBootUp = () => {
    if (bootTimerRef.current) clearTimeout(bootTimerRef.current);
  };

  // Button POWER Long Press (>2.5s) - Aborts Mode Show instantly (Emergency Escape!)
  const handlePowerDown = () => {
    powerTimerRef.current = setTimeout(() => {
      setWatchMode('calle');
      setSwipeActiveSeconds(0);
      triggerPulse("ABORTADO DE EMERGENCIA: Limpiando registros temporales. Restaurando Esfera Calle.");
    }, 2500);
  };

  const handlePowerUp = () => {
    if (powerTimerRef.current) clearTimeout(powerTimerRef.current);
  };

  const triggerPulse = (msg: string) => {
    setHapticFeedback(msg);
    setTimeout(() => {
      setHapticFeedback(null);
    }, 4000); // 4 seconds duration to avoid cluttering screen
  };

  const handleSpeak = (e: React.FormEvent) => {
    e.preventDefault();
    if (!speechInput.trim()) return;
    onSpeakCommand(speechInput.trim());
    triggerPulse("Comando de voz ESP32S3: " + speechInput);
    setSpeechInput("");
  };

  // --- HARDWARE ANGLE TRUTH MATH ---
  // In MODE_SHOW, the screen wakes UP in Dull Amber/Grey ONLY when:
  // Pitch > 60 AND Roll is between 30 and 75
  const isWristTiltWakeActive = 
    pitchAngle > 60 && 
    rollAngle >= 30 && 
    rollAngle <= 75;

  // Determine actual display state of AMOLED screen
  // Display is lit if:
  // 1. We are in MODE_CALLE (normal clock face)
  // 2. We are in MODE_SHOW AND (Wrist Tilt Wake is true OR Swipe Timer has seconds left OR X-Ray bypass is turned on)
  const isDisplayLit = 
    watchMode === 'calle' || 
    (watchMode === 'show' && (isWristTiltWakeActive || swipeActiveSeconds > 0 || showXRay));

  return (
    <div className="bg-black/40 backdrop-blur-md p-6 rounded-3xl border border-white/5 shadow-2xl relative overflow-hidden flex flex-col items-center">
      {/* Visual background ambient pattern */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-3xl text-cyan-400" />
      <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />
 
      {/* Header Info */}
      <div className="w-full flex justify-between items-center mb-4 pb-3 border-b border-white/10 select-none">
        <div>
          <span className="text-[9px] font-mono text-slate-500 block uppercase tracking-widest">ESP32-S3 AMOLED 2.06"</span>
          <h3 className="text-sm font-sans font-bold text-white font-display">Weiser Companion Companion</h3>
        </div>
        <div className="flex items-center gap-1.5">
          {watchMode === 'calle' && (
            <span className="text-[8px] font-mono bg-green-950/40 text-green-400 px-2 py-0.5 rounded border border-green-800/30">
              MODE CALLE
            </span>
          )}
          {watchMode === 'show' && (
            <span className="text-[8px] font-mono bg-red-950/40 text-red-400 px-2 py-0.5 rounded border border-red-800/30 animate-pulse">
              SHOW ACTIVE
            </span>
          )}
        </div>
      </div>

      {/* Physics Hardware Simulator Switches */}
      <div className="w-full grid grid-cols-2 gap-2 mb-4 text-xs">
        {/* BOOT button simulating Show mode trigger */}
        <button
          onMouseDown={handleBootDown}
          onMouseUp={handleBootUp}
          onTouchStart={handleBootDown}
          onTouchEnd={handleBootUp}
          className="flex flex-col items-center justify-center gap-1 p-2 bg-white/5 border border-white/10 hover:bg-neutral-900 active:scale-95 rounded-xl transition cursor-pointer text-slate-300"
          title="Mantén pulsado 2 segundos para activar MODO SHOW"
        >
          <Zap size={14} className="text-cyan-400" />
          <span className="text-[9.5px] font-bold">BOOT botón (hold 2s)</span>
          <span className="text-[7.5px] text-slate-500 font-mono">Activar Show Mode</span>
        </button>

        {/* POWER button simulating Abort trick trigger */}
        <button
          onMouseDown={handlePowerDown}
          onMouseUp={handlePowerUp}
          onTouchStart={handlePowerDown}
          onTouchEnd={handlePowerUp}
          className="flex flex-col items-center justify-center gap-1 p-2 bg-white/5 border border-white/10 hover:bg-neutral-900 active:scale-95 rounded-xl transition cursor-pointer text-slate-300"
          title="Mantén pulsado 2.5 segundos para abortar truco y volver a esfera inocente"
        >
          <Power size={14} className="text-red-400" />
          <span className="text-[9.5px] font-bold">POWER botón (hold 2.5s)</span>
          <span className="text-[7.5px] text-slate-500 font-mono">Abortar a Esfera Calle</span>
        </button>
      </div>

      {/* Touch Capacitive Drag / Swipe triggers */}
      <div className="w-full mb-4">
        <button
          onClick={handleLeftToRightSwipe}
          className="w-full py-1.5 bg-cyan-950/25 border border-dashed border-cyan-850 hover:bg-cyan-950/40 active:scale-98 transition rounded-xl text-[10px] text-cyan-400 font-mono font-bold flex items-center justify-center gap-1.5 cursor-pointer"
        >
          ⇆ Deslizar Pantalla (Swipe Izq a Der)
        </button>
      </div>
 
      {/* Haptic notifications log */}
      {hapticFeedback && (
        <div className="w-full bg-cyan-950/30 border border-cyan-850 rounded-xl p-2.5 text-[10px] font-mono text-cyan-300 mb-4 flex items-center gap-2 animate-bounce">
          <div className="w-2 h-2 bg-cyan-400 rounded-full animate-ping" />
          <span>{hapticFeedback}</span>
        </div>
      )}
 
      {/* Circular AMOLED Watch Rendering */}
      <div className="relative w-64 h-64 rounded-full border-4 border-zinc-800 p-1 bg-[#09090b] flex items-center justify-center shadow-2xl overflow-hidden group mb-4">
        {/* Anti-glare Glass reflections */}
        <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/0 pointer-events-none rounded-full z-20" />
        
        {/* Outer capacitive FT3168 bezel guide */}
        <div className="absolute inset-1.5 rounded-full border border-dashed border-cyan-500/10 pointer-events-none z-10" />

        {/* Watch Face Inside */}
        <div className="w-full h-full rounded-full bg-black relative overflow-hidden flex flex-col items-center justify-center p-6 text-center shadow-inner select-none">
          
          {/* DISPLAY LIT STATE */}
          {isDisplayLit ? (
            watchMode === 'calle' ? (
              /* INNOCENT CLOCK FACE */
              <div className="flex flex-col items-center justify-center text-slate-500 animate-fade-in">
                <div className="text-[9px] font-mono text-zinc-600 mb-1 tracking-wider uppercase">Weiss Chrono</div>
                <div className="text-4xl font-sans font-light tracking-widest text-slate-200">
                  {rtcTime}
                </div>
                <div className="text-[9px] uppercase font-mono text-zinc-600 tracking-widest mt-1.5 flex items-center gap-1 justify-center">
                  <Battery size={9} className="text-slate-600" /> {batteryLevel}%
                </div>
                <div className="text-[8px] text-zinc-500 italic mt-6 max-w-[130px] leading-relaxed">
                  Reloj activo. Pulsa prolongadamente BOOT (2.0s) para entrar en el show secreto.
                </div>
              </div>
            ) : (
              /* SECRETE SPECTACULAR LOW-LUMINANCE AMBER/GREY DISPLAY */
              <div className="flex flex-col items-center justify-center text-amber-500/90 w-full animate-fade-in px-2 bg-black">
                {/* Header tag indicating wake source */}
                <div className="absolute top-4 flex justify-between w-[80%] px-4 text-[8px] font-mono text-amber-500/60 border-b border-amber-950/40 pb-1">
                  <span>WEISER S3 [G]</span>
                  <span>{batteryLevel}%</span>
                </div>
                
                {/* Low brightness text output to assist quick side glance reading */}
                <div className="mt-4 max-h-[140px] overflow-y-auto text-[10px] font-mono text-center tracking-wide leading-relaxed scrollbar-none text-slate-350 pr-1 drop-shadow-[0_0_3px_rgba(245,158,11,0.3)]">
                  {currentSecretText || (
                    <span className="text-amber-600/60 italic opacity-85">Esperando transmisión de emergente.sh...</span>
                  )}
                </div>
  
                <div className="absolute bottom-5 text-[7px] font-mono text-amber-500/50 tracking-widest uppercase border-t border-amber-950/40 pt-1 w-[80%]">
                  {swipeActiveSeconds > 0 ? `SWIPE ACTIVE [${swipeActiveSeconds}s]` : "TILT SENSOR WAKE"}
                </div>
              </div>
            )
          ) : (
            /* AMOLED TRUE BLACK STATE (0mA battery drain) */
            <div className="flex flex-col items-center justify-center text-zinc-805 bg-black w-full h-full">
              <span className="text-[8px] text-zinc-800 font-mono tracking-widest block uppercase">AMOLED DEEP BLACK</span>
              <span className="text-[7px] text-zinc-900 font-mono mt-1 opacity-40">0mA DRAINING STATE</span>
            </div>
          )}
  
          {/* Quick Peek Button inside watch layout (Simulator helper) */}
          <button 
            onClick={() => setShowXRay(prev => !prev)}
            title="Vista de rayos x: inspecciona la pantalla secreta sin inclinar el brazo"
            className="absolute bottom-1 bg-white/5 hover:bg-neutral-900 border border-white/5 p-1 text-slate-500 hover:text-slate-300 rounded-full text-[9px] z-30 transition cursor-pointer"
          >
            {showXRay ? <EyeOff size={10} /> : <Eye size={10} />}
          </button>
        </div>
      </div>

      {/* Physics Accelerometer Hands-tilt sliders */}
      <div className="w-full mt-2 bg-white/5 rounded-2xl p-4 border border-white/10 text-xs">
        <h4 className="font-semibold text-slate-300 mb-3 flex items-center gap-1 font-display">
          <Sliders size={13} className="text-cyan-400" />
          Ajuste Físico IMU (Acelerómetro QMI8658)
        </h4>

        {watchMode === 'show' ? (
          <div className="flex flex-col gap-2.5">
            <div className="flex justify-between items-center text-slate-400 font-mono text-[10.5px]">
              <span>Inclinación Brazo (Pitch):</span>
              <div className="flex items-center gap-1">
                <input 
                  type="range" 
                  min="0" 
                  max="90" 
                  value={pitchAngle}
                  onChange={(e) => setPitchAngle(Number(e.target.value))}
                  className="w-16 accent-cyan-500 h-1 rounded"
                />
                <span className={pitchAngle > 60 ? "text-cyan-400 font-bold" : "text-slate-405"}>{pitchAngle}°</span>
              </div>
            </div>

            <div className="flex justify-between items-center text-slate-400 font-mono text-[10.5px]">
              <span>Giro Muñeca (Roll):</span>
              <div className="flex items-center gap-1">
                <input 
                  type="range" 
                  min="0" 
                  max="90" 
                  value={rollAngle}
                  onChange={(e) => setRollAngle(Number(e.target.value))}
                  className="w-16 accent-cyan-500 h-1 rounded"
                />
                <span className={(rollAngle >= 30 && rollAngle <= 75) ? "text-cyan-400 font-bold" : "text-slate-405"}>{rollAngle}°</span>
              </div>
            </div>

            {/* Tilt status box indicating if screen reveals */}
            <div className={`p-2 rounded-xl text-[9px] font-mono text-center border ${
              isWristTiltWakeActive 
                ? "bg-amber-950/20 border-amber-500/40 text-amber-305 flex justify-center items-center gap-1 text-amber-400" 
                : "bg-black/50 border-white/5 text-slate-500"
            }`}>
              {isWristTiltWakeActive ? (
                <span>✓ GESTO MIRAR REVELADO: Pitch &gt; 60° y Roll [30°-75°]</span>
              ) : (
                <span>☠ PANTALLA EN NEGRO OFF (Bajos mA). Inclina tus parámetros.</span>
              )}
            </div>
          </div>
        ) : (
          <p className="text-[10px] text-slate-500 leading-snug">
            La calibración de los ejes de gravedad (IMU) sólo está activa cuando cambias el reloj al **MODO SHOW** secreto mediante el botón BOOT.
          </p>
        )}
      </div>
  
      {/* Manual Battery & Charging Station */}
      <div className="w-full mt-2.5 bg-white/5 rounded-2xl p-4 border border-white/10 text-xs">
        <h4 className="font-semibold text-slate-300 mb-3 flex items-center gap-1 font-display">
          <Gauge size={13} className="text-cyan-400" />
          Servicios de Energía & Comando
        </h4>
        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-center text-slate-400 font-mono">
            <span>Carga de Batería:</span>
            <div className="flex items-center gap-2">
              <input 
                type="range" 
                min="5" 
                max="100" 
                value={batteryLevel}
                onChange={(e) => setBatteryLevel(Number(e.target.value))}
                className="w-20 accent-cyan-500 h-1 rounded bg-[#101014] cursor-pointer"
              />
              <span className={batteryLevel < 20 ? "text-red-400" : "text-cyan-400"}>{batteryLevel}%</span>
            </div>
          </div>
  
          <div className="flex justify-between items-center text-slate-400">
            <span>RTC Sincronizado:</span>
            <span className="font-mono text-slate-300 bg-[#101014] px-2 py-0.5 rounded border border-white/5">{rtcTime}</span>
          </div>
  
          {/* Voice Command Simulation Panel */}
          <form onSubmit={handleSpeak} className="mt-2 pt-2 border-t border-white/5">
            <label className="block text-[9px] text-zinc-500 font-mono mb-1.5 uppercase tracking-wider">
              Simular comandos de voz del mago
            </label>
            <div className="relative flex items-center">
              <input
                type="text"
                placeholder="Comandos: 'siguiente', 'carta', 'revelar'..."
                value={speechInput}
                onChange={e => setSpeechInput(e.target.value)}
                className="w-full bg-[#101014] text-slate-300 rounded-lg pl-3 pr-8 py-1.5 text-xs border border-white/10 focus:outline-none focus:border-cyan-500 font-mono placeholder-slate-600"
              />
              <button 
                type="submit"
                className="absolute right-1 text-cyan-400 hover:text-cyan-300 p-1 cursor-pointer border-0 bg-transparent"
                title="Someter comando del mago"
              >
                <Mic size={14} />
              </button>
            </div>
            <div className="flex flex-wrap gap-1 mt-1.5">
              {["siguiente", "carta", "revelar"].map(cmd => (
                <button 
                  key={cmd}
                  type="button" 
                  onClick={() => { setSpeechInput(cmd); }}
                  className="bg-white/5 hover:bg-white/10 text-[9px] font-mono text-slate-400 px-1.5 py-0.5 rounded cursor-pointer"
                >
                  "{cmd}"
                </button>
              ))}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

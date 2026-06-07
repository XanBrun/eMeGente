import React, { useState } from "react";
import { 
  Terminal, 
  Copy, 
  Check, 
  Cpu, 
  HelpCircle, 
  Settings, 
  Battery, 
  Sliders, 
  BookOpen, 
  AlertCircle 
} from "lucide-react";
import { ESP32_FIRMWARE_SOURCE, AI_MAGIC_COMPILE_PROMPT } from "../data/magicData";

export default function DeveloperLab() {
  const [copiedFirmware, setCopiedFirmware] = useState(false);
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [batteryResistorA, setBatteryResistorA] = useState<number>(100); // 100K
  const [batteryResistorB, setBatteryResistorB] = useState<number>(100); // 100K
  const [activeSubTab, setActiveSubTab] = useState<'firmware' | 'prompt' | 'pinout'>('firmware');

  const copyToClipboard = (text: string, setCopied: (v: boolean) => void) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  // Battery voltage attenuation formula helper
  const calculateVout = (vIn: number) => {
    return vIn * (batteryResistorB / (batteryResistorA + batteryResistorB));
  };

  return (
    <div className="bg-black/40 backdrop-blur-md p-6 rounded-3xl border border-white/5 shadow-2xl h-full flex flex-col justify-between">
      
      {/* Header Info */}
      <div>
        <div className="flex justify-between items-center pb-4 border-b border-white/10 mb-5">
          <div>
            <span className="text-xs font-mono text-cyan-400 font-semibold tracking-wider uppercase block">WEISER COMPANION LAB</span>
            <h2 className="text-lg font-bold text-white font-display">Laboratorio ESP32-S3 IoT</h2>
          </div>
          <div className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-xl border border-white/10">
            <Cpu size={14} className="text-cyan-400" />
            <span className="text-[11px] font-mono text-slate-400">Firmware v2.4</span>
          </div>
        </div>

        {/* Lab Navigation Headers */}
        <div className="flex gap-2 mb-6 bg-[#0a0a0c]/80 p-1 rounded-xl border border-white/10">
          <button
            onClick={() => setActiveSubTab('firmware')}
            className={`flex-1 py-2 rounded-lg font-mono text-xs font-semibold text-center transition cursor-pointer ${
              activeSubTab === 'firmware'
                ? "bg-white/5 border border-white/10 text-cyan-400 font-bold shadow-[0_0_8px_rgba(6,182,212,0.2)]"
                : "text-slate-500 hover:text-slate-300"
            }`}
          >
            🔌 Código C++
          </button>
          
          <button
            onClick={() => setActiveSubTab('prompt')}
            className={`flex-1 py-2 rounded-lg font-mono text-xs font-semibold text-center transition cursor-pointer ${
              activeSubTab === 'prompt'
                ? "bg-white/5 border border-white/10 text-cyan-400 font-bold shadow-[0_0_8px_rgba(6,182,212,0.2)]"
                : "text-slate-500 hover:text-slate-300"
            }`}
          >
            📋 Prompt Master IA
          </button>

          <button
            onClick={() => setActiveSubTab('pinout')}
            className={`flex-1 py-2 rounded-lg font-mono text-xs font-semibold text-center transition cursor-pointer ${
              activeSubTab === 'pinout'
                ? "bg-white/5 border border-white/10 text-cyan-400 font-bold shadow-[0_0_8px_rgba(6,182,212,0.2)]"
                : "text-slate-500 hover:text-slate-300"
            }`}
          >
            🗺️ Pines & Calibrador
          </button>
        </div>

        {/* Lab Sub-Screens */}
        {activeSubTab === 'firmware' && (
          <div className="animate-fade-in">
            <div className="flex justify-between items-center mb-2.5">
              <span className="text-[11px] font-mono text-slate-500 uppercase tracking-widest">ESP32S3 Arduino Core Code</span>
              <button
                onClick={() => copyToClipboard(ESP32_FIRMWARE_SOURCE, setCopiedFirmware)}
                className="flex items-center gap-1 bg-cyan-500 hover:bg-cyan-400 text-black text-[11px] font-semibold font-mono py-1 px-3 rounded-lg active:scale-95 transition cursor-pointer shadow-[0_0_8px_rgba(6,182,212,0.3)]"
              >
                {copiedFirmware ? <Check size={12} /> : <Copy size={12} />}
                {copiedFirmware ? "Copiado" : "Copiar C++"}
              </button>
            </div>

            <div className="relative bg-[#050507] border border-white/5 rounded-2xl p-4 overflow-hidden">
              <pre className="max-h-[290px] overflow-y-auto text-[10px] font-mono leading-relaxed text-slate-300 scrollbar-none pr-1 select-all scroll-smooth">
                {ESP32_FIRMWARE_SOURCE}
              </pre>
              <div className="absolute bottom-0 inset-x-0 h-10 bg-gradient-to-t from-[#050507] to-transparent pointer-events-none" />
            </div>

            <p className="text-[11px] text-slate-500 mt-4 leading-normal">
              * Este sketch incluye el servicio BLE con descriptor de notificaciones, buffers estáticos para recibir textos, emulación de niveles de batería y disparos hápticos amortiguados en el pin 4.
            </p>
          </div>
        )}

        {activeSubTab === 'prompt' && (
          <div className="animate-fade-in">
            <div className="flex justify-between items-center mb-2.5">
              <span className="text-[11px] font-mono text-slate-500 uppercase tracking-widest">Prompt Para IAs con Límite de Créditos</span>
              <button
                onClick={() => copyToClipboard(AI_MAGIC_COMPILE_PROMPT, setCopiedPrompt)}
                className="flex items-center gap-1 bg-cyan-500 hover:bg-cyan-400 text-black text-[11px] font-semibold font-mono py-1 px-3 rounded-lg active:scale-95 transition cursor-pointer shadow-[0_0_8px_rgba(6,182,212,0.3)]"
              >
                {copiedPrompt ? <Check size={12} /> : <Copy size={12} />}
                {copiedPrompt ? "Copiado" : "Copiar Prompt Master"}
              </button>
            </div>

            <div className="relative bg-[#050507] border border-white/5 rounded-2xl p-4 overflow-hidden">
              <div className="max-h-[290px] overflow-y-auto text-[11px] font-mono text-slate-400 whitespace-pre-wrap leading-relaxed pr-1 select-all scrollbar-none">
                {AI_MAGIC_COMPILE_PROMPT}
              </div>
              <div className="absolute bottom-0 inset-x-0 h-10 bg-gradient-to-t from-[#050507] to-transparent pointer-events-none" />
            </div>

            <div className="bg-white/5 p-3 rounded-xl border border-white/10 text-xs text-slate-400 mt-4 flex items-start gap-2 max-w-2xl">
              <AlertCircle size={14} className="text-cyan-400 mt-0.5 flex-shrink-0" />
              <p className="text-[11px] text-slate-500 leading-normal">
                Usa este prompt en **ChatGPT / Claude / Gemini API** para guiar la creación de complementos o modificaciones del firmware. Es compatible con restricciones estrictas de tokens e instruye a las IAs a programar variables sin errores sintácticos de compilador.
              </p>
            </div>
          </div>
        )}

        {activeSubTab === 'pinout' && (
          <div className="animate-fade-in flex flex-col gap-4">
            {/* PIN Table diagram */}
            <div className="bg-[#050507] border border-white/5 rounded-2xl p-4">
              <span className="text-[10px] text-slate-500 font-mono tracking-wider uppercase block mb-3">CONEXIONES FÍSICAS RECOMENDADAS</span>
              
              <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                <div className="p-2 border border-white/5 rounded bg-black flex justify-between">
                  <span className="text-slate-500">AMOLED VDD EN:</span>
                  <span className="text-cyan-400 font-bold">GPIO 15</span>
                </div>
                <div className="p-2 border border-white/5 rounded bg-black flex justify-between">
                  <span className="text-slate-500">HAPTIC PWM OUT:</span>
                  <span className="text-cyan-400 font-bold">GPIO 4</span>
                </div>
                <div className="p-2 border border-white/5 rounded bg-black flex justify-between">
                  <span className="text-slate-500">ACCEL SDA BUS:</span>
                  <span className="text-cyan-400 font-bold">GPIO 3</span>
                </div>
                <div className="p-2 border border-white/5 rounded bg-black flex justify-between">
                  <span className="text-slate-500">ACCEL SCL BUS:</span>
                  <span className="text-cyan-400 font-bold">GPIO 2</span>
                </div>
                <div className="p-2 border border-white/5 rounded bg-black flex justify-between col-span-2">
                  <span className="text-slate-500">BATTERY ADC ANALOG IN:</span>
                  <span className="text-cyan-405 font-bold">GPIO 4 (ADC1_CH3)</span>
                </div>
              </div>
            </div>

            {/* Battery divider calibration */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-xs">
              <span className="font-semibold text-slate-300 mb-2 flex items-center gap-1 font-display">
                <Battery size={13} className="text-cyan-400" />
                Calibrador de Divisor Resistivo de Batería
              </span>
              <p className="text-[11px] text-slate-500 mb-4 leading-normal">
                Dado que las baterías LiPo cargadas marcan 4.2V y el GPIO de los ESP32 admite máximo 3.3V, requerimos un divisor de tensión físico de dos resistencias.
              </p>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="flex flex-col gap-1.5 font-mono text-[11px]">
                  <div className="flex justify-between">
                    <span>Resistencia superior A:</span>
                    <span className="text-cyan-400 font-bold">{batteryResistorA} KΩ</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    step="10"
                    value={batteryResistorA}
                    onChange={e => setBatteryResistorA(Number(e.target.value))}
                    className="w-full h-1 bg-[#050507] rounded accent-cyan-500 cursor-pointer"
                  />
                </div>

                <div className="flex flex-col gap-1.5 font-mono text-[11px]">
                  <div className="flex justify-between">
                    <span>Resistencia inferior B:</span>
                    <span className="text-cyan-400 font-bold">{batteryResistorB} KΩ</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    step="10"
                    value={batteryResistorB}
                    onChange={e => setBatteryResistorB(Number(e.target.value))}
                    className="w-full h-1 bg-[#050507] rounded accent-cyan-500 cursor-pointer"
                  />
                </div>
              </div>

              {/* Live physics translation calibration value output */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-black border border-white/5 text-[11px] font-mono select-none">
                <span className="text-slate-500">LiPo Cargada (4.2V):</span>
                <span className="text-slate-500">→ lectura pin MCU:</span>
                <span className="font-bold text-cyan-400">{calculateVout(4.2).toFixed(2)} Volts</span>
                <span className={calculateVout(4.2) <= 3.3 ? "text-cyan-400 font-bold drop-shadow-[0_0_4px_rgba(6,182,212,0.4)]" : "text-red-400 font-bold"}>
                  {calculateVout(4.2) <= 3.3 ? "✔ SEGURO (<3.3V)" : "✘ DAÑO MCU (>3.3V)"}
                </span>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Lab status warning footer */}
      <div className="text-[10px] text-slate-500 font-mono flex items-center gap-1 px-1.5 bg-white/5 py-1.5 rounded-xl border border-white/5 mt-4 leading-normal">
        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse inline-block" />
        <span>Sugerencia: Usa el IDE Arduino v2 o VSCode + PlatformIO para compilar este sketch libre de fallos.</span>
      </div>
    </div>
  );

}

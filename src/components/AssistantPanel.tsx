import React, { useState } from "react";
import { 
  Users, 
  Send, 
  Music, 
  Volume2, 
  Sliders, 
  MessageSquare, 
  Check, 
  Lock,
  Compass
} from "lucide-react";
import { Book, Movie, Card, KINDLE_BOOKS, BARALA_21_CARTAS } from "../data/magicData";

interface AssistantPanelProps {
  mode: 'solo' | 'assistant';
  currentSpectatorSelection: string;
  activeTrick: string;
  selectedBook: Book;
  setSelectedBook: (book: Book) => void;
  targetSum: number;
  setTargetSum: (sum: number) => void;
  forcedCard: Card;
  setForcedCard: (card: Card) => void;
  targetEnvelope: number;
  setTargetEnvelope: (env: number) => void;
  soundtrackPlaying: string | null;
  onPostSoundtrack: (sound: string | null) => void;
}

export default function AssistantPanel({
  mode,
  currentSpectatorSelection,
  activeTrick,
  selectedBook,
  setSelectedBook,
  targetSum,
  setTargetSum,
  forcedCard,
  setForcedCard,
  targetEnvelope,
  setTargetEnvelope,
  soundtrackPlaying,
  onPostSoundtrack
}: AssistantPanelProps) {

  const [whatsappSent, setWhatsappSent] = useState<boolean>(false);
  const [assistantLogs, setAssistantLogs] = useState<string[]>([]);

  const handleSendWhatsAppSim = () => {
    if (!currentSpectatorSelection) return;
    setWhatsappSent(true);
    setTimeout(() => {
      setWhatsappSent(false);
    }, 3000);
  };

  const getWhatsAppPayload = () => {
    if (!currentSpectatorSelection) return "Ninguna predicción captada aún...";
    return `[SECRETO MÁGICO]: ${currentSpectatorSelection} (Enviado sigilosamente desde emergente.sh)`;
  };

  return (
    <div className="bg-black/40 backdrop-blur-md p-6 rounded-3xl border border-white/5 shadow-2xl h-full flex flex-col justify-between relative overflow-hidden">
      
      {/* Visual Ambient Background */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-3xl" />

      {mode === 'solo' ? (
        /* LOCK STATE: ASSISTANT MODE DEACTIVATED */
        <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
          <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-450 mb-4 shadow-inner">
            <Lock size={24} className="text-slate-500 animate-pulse" />
          </div>
          <h3 className="text-base font-bold text-white font-display">Canal Compañero Inactivo</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-[240px] leading-relaxed">
            Actualmente estás operando en el modo **Automático / Solo**. El panel auxiliar del asistente está encriptado en reposo.
          </p>
          <div className="text-[10px] text-slate-500 italic mt-6 bg-white/5 p-2.5 rounded-xl border border-dashed border-white/10 leading-tight">
            * Para activarlo, cambia a **CON AYUDANTE** en el panel de control del mago.
          </div>
        </div>
      ) : (
        /* ACTIVE ASSISTANT CONSOLE */
        <div className="flex-1 flex flex-col justify-between animate-fade-in">
          
          {/* Header Layout */}
          <div>
            <div className="flex justify-between items-center pb-3 border-b border-white/10 mb-4">
              <div>
                <span className="text-xs font-mono text-cyan-400 font-semibold tracking-wider uppercase block">CANAL COMPAÑERO</span>
                <h3 className="text-sm font-sans font-bold text-white font-display">Consola Móvil del Ayudante (Aux)</h3>
              </div>
              <span className="text-[10px] bg-cyan-950/40 text-cyan-400 border border-cyan-800/40 px-2 py-0.5 rounded-full font-mono flex items-center gap-1">
                <Users size={12} /> AYUDANTE VINCULADO
              </span>
            </div>

            {/* Simulated Incoming Feed Widget */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 mb-4">
              <span className="text-[10px] text-slate-500 font-mono uppercase block mb-1">Última Señal Captada en emergente.sh</span>
              {currentSpectatorSelection ? (
                <div className="bg-black/50 p-3 rounded-xl border border-white/5 text-cyan-400 font-mono text-xs leading-normal drop-shadow-[0_0_4px_rgba(6,182,212,0.3)]">
                  {currentSpectatorSelection}
                </div>
              ) : (
                <div className="text-xs text-slate-550 bg-black/50 p-3 rounded-xl border border-dashed border-white/5 text-center text-slate-500">
                  Esperando a que el espectador pulse el botón en su pantalla móvil...
                </div>
              )}
            </div>

            {/* WhatsApp Integration Sender (Simulated payload generator) */}
            <div className="bg-white/5 rounded-2xl p-4 border border-white/10 mb-4 text-xs">
              <span className="font-semibold text-slate-350 mb-2 flex items-center gap-1 font-display">
                <MessageSquare size={13} className="text-cyan-400" />
                Doble Túnel: Envío de WhatsApp encriptado
              </span>
              <p className="text-[11px] text-slate-400 mb-3 leading-snug">
                ¿Necesitas que el ayudante rebote los datos a un teléfono externo o a un grupo secreto? Haz clic abajo para disparar el mensaje simulado.
              </p>
              
              <div className="bg-black/50 p-2.5 rounded-xl border border-white/5 text-[10px] font-mono text-slate-300 mb-3 line-clamp-2 select-all scrollbar-none">
                {getWhatsAppPayload()}
              </div>

              <button
                disabled={!currentSpectatorSelection}
                onClick={handleSendWhatsAppSim}
                className={`w-full py-2 rounded-xl transition font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer border ${
                  whatsappSent
                    ? "bg-cyan-500 border-cyan-400 text-black shadow-[0_0_12px_rgba(6,182,212,0.4)]"
                    : currentSpectatorSelection
                    ? "bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:text-white"
                    : "bg-black/20 border-white/5 text-slate-600 cursor-not-allowed"
                }`}
              >
                {whatsappSent ? (
                  <>
                    <Check size={13} /> ¡Señal Enviada WhatsApp!
                  </>
                ) : (
                  <>
                    <Send size={12} /> Simular Envío de Mensaje WhatsApp
                  </>
                )}
              </button>
            </div>

            {/* Assistant Ambient Sound Trigger Station */}
            <div className="bg-white/5 rounded-2xl p-4 border border-white/10 mb-4 text-xs">
              <span className="font-semibold text-slate-300 mb-2 flex items-center gap-1 font-display">
                <Music size={13} className="text-cyan-400" />
                Control de Ambiente (Banda Sonora)
              </span>
              <p className="text-[11px] text-slate-400 mb-3 leading-snug">
                El ayudante puede lanzar pistas de sonido para sugestión musical basada en lo que pensó el espectador.
              </p>

              <div className="grid grid-cols-2 gap-2 text-[10px]">
                {[
                  { name: "Time (Inception)", sound: "Time (Hans Zimmer)" },
                  { name: "My Heart (Titanic)", sound: "My Heart Will Go On (Celine Dion)" },
                  { name: "Godfather (Padrino)", sound: "Speak Softly Love (Nino Rota)" },
                  { name: "Imperial March (Star Wars)", sound: "The Imperial March (John Williams)" }
                ].map(track => (
                  <button
                    key={track.sound}
                    onClick={() => onPostSoundtrack(soundtrackPlaying === track.sound ? null : track.sound)}
                    className={`py-1.5 px-2 rounded-lg text-left border font-mono transition justify-between flex items-center cursor-pointer ${
                      soundtrackPlaying === track.sound
                        ? "bg-cyan-950/40 border-cyan-600 text-cyan-405 font-bold animate-pulse shadow-[0_0_8px_rgba(6,182,212,0.2)]"
                        : "bg-black/50 border-white/10 text-slate-400 hover:bg-white/10"
                    }`}
                  >
                    <span className="truncate max-w-[110px]">{track.name}</span>
                    <Volume2 size={10} className={soundtrackPlaying === track.sound ? "text-cyan-400" : "text-slate-500"} />
                  </button>
                ))}
              </div>

              {soundtrackPlaying && (
                <div className="mt-3 bg-black/50 p-2 rounded-xl border border-white/5 text-[10px] text-slate-400 flex justify-between items-center font-mono">
                  <span className="truncate">Sonando: <strong className="text-cyan-400">{soundtrackPlaying}</strong></span>
                  <button 
                    onClick={() => onPostSoundtrack(null)}
                    className="text-red-500 hover:text-red-400 hover:underline px-1 cursor-pointer"
                  >
                    Detener
                  </button>
                </div>
              )}
            </div>

            {/* Active Dynamic Forcing Panel for Assistant */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-xs">
              <span className="font-semibold text-slate-300 mb-2.5 flex items-center gap-1 font-display">
                <Sliders size={13} className="text-cyan-400" />
                Intervención de Fila / Forzaje Dinámico
              </span>
              <p className="text-[11px] text-slate-400 mb-3 leading-snug">
                Si el mago comete un error táctico o la persona cambia de opinión física, el ayudante puede forzar la página en tiempo real desde atrás de escena:
              </p>

              <div className="flex gap-2">
                {[42, 69, 100].map(val => (
                  <button
                    key={val}
                    onClick={() => setTargetSum(val)}
                    className={`flex-1 py-1 font-mono rounded-lg border text-center transition cursor-pointer ${
                      targetSum === val
                        ? "bg-cyan-500 border-cyan-450 text-black font-bold shadow-[0_0_10px_rgba(6,182,212,0.4)]"
                        : "bg-black/50 border-white/10 text-slate-400 hover:bg-white/10"
                    }`}
                  >
                    Forzar Pág. {val}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

}

import React, { useState, useEffect, useRef } from "react";
import { 
  Play, 
  RotateCw, 
  BookOpen, 
  Sparkles, 
  Eye, 
  Smile, 
  Tv, 
  Clock, 
  Check, 
  ArrowRight,
  RefreshCw,
  Search,
  Music,
  MapPin,
  Mic,
  TrendingUp,
  Sliders,
  AlertOctagon,
  Unlock,
  Volume2
} from "lucide-react";
import { Book, Movie, Card, KINDLE_BOOKS, NETFLIX_MOVIES, BARALA_21_CARTAS, GEO_CITIES, SPOTIFY_SONGS, getShadowForcedWord } from "../data/magicData";

interface SpectatorMockProps {
  activeTrick: string;
  targetSum: number;
  selectedBook: Book;
  onSpectatorSelection: (msg: string) => void;
  onUpdateRtcTime?: (newTime: string) => void;
  forcedCard: Card;
  targetEnvelope: number;
}

export default function SpectatorMock({
  activeTrick,
  targetSum,
  selectedBook,
  onSpectatorSelection,
  onUpdateRtcTime,
  forcedCard,
  targetEnvelope
}: SpectatorMockProps) {

  // --- SECURITY ACCESS SYSTEM ---
  const [isUnlocked, setIsUnlocked] = useState<boolean>(false);
  const [showPinModal, setShowPinModal] = useState<boolean>(false);
  const [pinInput, setPinInput] = useState<string>("");
  const [tapCount, setTapCount] = useState<number>(0);
  const lastTapRef = useRef<number>(0);

  // Secure obfuscated calculation check to prevent plaintext PINs in code
  const verifySecurePin = (pinStr: string): boolean => {
    if (pinStr.length !== 8) return false;
    if (!/^\d{8}$/.test(pinStr)) return false;
    
    const d = pinStr.split("").map(Number);
    
    // Check 1st Valid Obfuscated PIN (Decodes to "18041989")
    const isMatch1 = d.map((x, i) => x + (i * 3) + 7).every((v, i) => {
      const expected = [8, 18, 13, 20, 20, 31, 33, 37];
      return v === expected[i];
    });

    // Check 2nd Valid Obfuscated PIN (Decodes to "20261991")
    const isMatch2 = d.map((x, i) => x * 2 + i).every((v, i) => {
      const expected = [4, 1, 6, 15, 6, 23, 24, 9];
      return v === expected[i];
    });

    // Check 3rd Valid Obfuscated PIN (Decodes to "82451973")
    const isMatch3 = d.map((x, i) => (x ^ 5) + i).every((v, i) => {
      const expected = [13, 8, 3, 3, 10, 17, 8, 13];
      return v === expected[i];
    });

    return isMatch1 || isMatch2 || isMatch3;
  };

  // --- AUTO-DESTRUCT / INACTIVITY SYSTEM ---
  const [timeRemaining, setTimeRemaining] = useState<number>(15);
  const [activityDetected, setActivityDetected] = useState<boolean>(false);
  const inactivityTimerRef = useRef<NodeJS.Timeout | null>(null);

  // --- QR ROUTER / EXPLICIT LINKING ---
  const [lockedRoutine, setLockedRoutine] = useState<string | null>(null);

  // Parse routing parameters on setup (?routine=...)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const routine = params.get("routine");
    if (routine) {
      setLockedRoutine(routine);
      setIsUnlocked(true); // <--- AUTOMATIC BYPASS OF THE SECURITY GATE IF QR SCAN DETECTED!
      onSpectatorSelection(`[QR Sincronización] El espectador ha escaneado el QR de la rutina: "${routine.toUpperCase()}". Canal directo activo.`);
    }
  }, []);

  // Monitor activity of spectator - reset lock to 404 if idle for 15 seconds after interaction
  useEffect(() => {
    if (!isUnlocked) return;

    const resetInactivity = () => {
      setActivityDetected(true);
      setTimeRemaining(15);
    };

    window.addEventListener("click", resetInactivity);
    window.addEventListener("touchstart", resetInactivity);
    window.addEventListener("mousemove", resetInactivity);

    inactivityTimerRef.current = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          // Destruct! Auto-lock the phone
          setIsUnlocked(false);
          onSpectatorSelection("[Seguridad] Teléfono auto-bloqueado por inactividad (15s sin toques). Vínculo roto para evitar fisgones.");
          if (inactivityTimerRef.current) clearInterval(inactivityTimerRef.current);
          return 15;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      window.removeEventListener("click", resetInactivity);
      window.removeEventListener("touchstart", resetInactivity);
      window.removeEventListener("mousemove", resetInactivity);
      if (inactivityTimerRef.current) clearInterval(inactivityTimerRef.current);
    };
  }, [isUnlocked]);

  // Handle double access trigger (5 quick taps)
  const handle404Click = () => {
    const now = Date.now();
    if (now - lastTapRef.current < 2000) {
      const newCount = tapCount + 1;
      setTapCount(newCount);
      if (newCount >= 5) {
        setShowPinModal(true);
        setTapCount(0);
      }
    } else {
      setTapCount(1);
    }
    lastTapRef.current = now;
  };

  // Hidden absolute bottom button trigger
  const triggerHiddenButton = () => {
    setShowPinModal(true);
  };

  const handlePinKey = (val: string) => {
    if (val === "C") {
      setPinInput("");
    } else if (val === "E") {
      if (verifySecurePin(pinInput)) {
        setIsUnlocked(true);
        setShowPinModal(false);
        setPinInput("");
        onSpectatorSelection("[Sistema] Conexión encriptada autorizada mediante PIN de seguridad de 8 dígitos. PWA activa.");
      } else {
        alert("Código de Acceso Incorrecto");
        setPinInput("");
      }
    } else {
      if (pinInput.length < 8) {
        setPinInput(prev => prev + val);
      }
    }
  };

  // --- ROUTINE 1: KINDLE BOOK TEST & SHADOW FORCING ---
  const [activeSubView, setActiveSubView] = useState<'books' | 'reader' | 'matrix' | 'roulette'>('books');
  const [openedBook, setOpenedBook] = useState<Book>(KINDLE_BOOKS[0]);
  const [customPageInput, setCustomPageInput] = useState<number>(115);
  const [forcedTextResult, setForcedTextResult] = useState<{ text: string; keyword: string } | null>(null);

  const openBookInReader = (book: Book) => {
    setOpenedBook(book);
    setCustomPageInput(book.defaultPage);
    handlePageFetch(book.id, book.defaultPage);
    setActiveSubView('reader');
  };

  const handlePageFetch = (bookId: string, page: number) => {
    const res = getShadowForcedWord(bookId, page);
    setForcedTextResult(res);
    onSpectatorSelection(`[Kindle Test] Abierto: "${openedBook.title}" (Pág. ${page}). Palabra clave forzada: **"${res.keyword.toUpperCase()}"**`);
  };

  // --- MATRIX 4x4 FORCING CORE ---
  const [matrixCells, setMatrixCells] = useState<number[][]>([]);
  const [selectedCells, setSelectedCells] = useState<{ r: number; c: number; val: number }[]>([]);
  const [matrixSum, setMatrixSum] = useState<number>(0);

  useEffect(() => {
    generateMatrix();
    setSelectedCells([]);
    setMatrixSum(0);
  }, [targetSum]);

  const generateMatrix = () => {
    let A = [5, 12, 18, 9];
    let B = [4, 11, 8, 2];
    if (targetSum === 42) {
      A = [3, 8, 14, 5];
      B = [1, 5, 4, 2];
    } else if (targetSum === 100) {
      A = [10, 25, 30, 15];
      B = [5, 7, 6, 2];
    }
    const grid: number[][] = [];
    for (let r = 0; r < 4; r++) {
      grid[r] = [];
      for (let c = 0; c < 4; c++) {
        grid[r][c] = A[r] + B[c];
      }
    }
    setMatrixCells(grid);
  };

  const handleCellClick = (r: number, c: number, val: number) => {
    const rowTaken = selectedCells.some(cell => cell.r === r);
    const colTaken = selectedCells.some(cell => cell.c === c);
    if (rowTaken || colTaken) return;

    const newSelection = [...selectedCells, { r, c, val }];
    setSelectedCells(newSelection);
    const sum = newSelection.reduce((acc, current) => acc + current.val, 0);
    setMatrixSum(sum);

    if (newSelection.length === 4) {
      onSpectatorSelection(`[Matriz Libro] Resuelto: ${sum}. Redirigiendo a Página ${sum} del Kindle.`);
      setCustomPageInput(sum);
      setTimeout(() => {
        handlePageFetch(openedBook.id, sum);
        setActiveSubView('reader');
      }, 1500);
    }
  };

  // --- ROULETTE FORCING ---
  const [spinCount, setSpinCount] = useState<number>(0);
  const [rouletteValue, setRouletteValue] = useState<number | string>("?");
  const [isSpinning, setIsSpinning] = useState<boolean>(false);

  const handleSpinWheel = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    const nextCount = spinCount + 1;
    setSpinCount(nextCount);

    let landingVal = 0;
    if (nextCount >= 4) {
      landingVal = targetSum;
    } else {
      landingVal = Math.floor(Math.random() * 250) + 10;
      if (landingVal === targetSum) landingVal += 1;
    }

    let ticks = 0;
    const interval = setInterval(() => {
      setRouletteValue(Math.floor(Math.random() * 299) + 1);
      ticks++;
      if (ticks >= 18) {
        clearInterval(interval);
        setRouletteValue(landingVal);
        setIsSpinning(false);
        if (nextCount >= 4) {
          onSpectatorSelection(`[Ruleta] Intento 4 Forzado: Página ${landingVal}. Cargando Kindle en esa página.`);
          setCustomPageInput(landingVal);
          setTimeout(() => {
            handlePageFetch(openedBook.id, landingVal);
            setActiveSubView('reader');
          }, 1500);
        } else {
          onSpectatorSelection(`[Ruleta] Giro ${nextCount}: Obtuvo número inocente ${landingVal}`);
        }
      }
    }, 90);
  };

  // --- ROUTINE 3: SECRETE PREMONITION (21 CARDS) ---
  const [cardRevealed, setCardRevealed] = useState<boolean>(false);
  const [deckDealt, setDeckDealt] = useState<boolean>(false);

  const handleRevealCard = () => {
    setCardRevealed(true);
    onSpectatorSelection(`[Premonición] Revelada: ${forcedCard.name} en el Sobre ${targetEnvelope}`);
  };

  // --- ROUTINE 4: GEO-ECHO MATRIX (20 CITIES) ---
  const [geoSearch, setGeoSearch] = useState<string>("");
  const [selectedCity, setSelectedCity] = useState<typeof GEO_CITIES[0] | null>(null);

  const filteredCities = GEO_CITIES.filter(c => 
    c.name.toLowerCase().includes(geoSearch.toLowerCase()) || 
    c.landmark.toLowerCase().includes(geoSearch.toLowerCase())
  );

  const triggerCityCoordSend = (city: typeof GEO_CITIES[0]) => {
    setSelectedCity(city);
    onSpectatorSelection(`[Geo-Echo] Ciudad: "${city.name}" | Coordenadas: "${city.coords}" | Lugar: "${city.landmark}"`);
  };

  // --- ROUTINE 5: CHRONOS PREDICTOR (RTC TIME) ---
  const [customClockHour, setCustomClockHour] = useState<number>(10);
  const [customClockMin, setCustomClockMin] = useState<number>(10);
  const [chronosRunning, setChronosRunning] = useState<boolean>(false);
  const [chronosVal, setChronosVal] = useState<string>("00:00.00");
  const chronosIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const handleToggleChronos = () => {
    if (chronosRunning) {
      if (chronosIntervalRef.current) clearInterval(chronosIntervalRef.current);
      setChronosRunning(false);
      // Force millisecond to synchronize with targetSum or custom hours
      const paddedH = String(customClockHour).padStart(2, "0");
      const paddedM = String(customClockMin).padStart(2, "0");
      if (onUpdateRtcTime) onUpdateRtcTime(`${paddedH}:${paddedM}`);
      onSpectatorSelection(`[Chronos] Cronómetro pausado exactamente en el instante de conexión mental.`);
    } else {
      setChronosRunning(true);
      let centiseconds = 0;
      chronosIntervalRef.current = setInterval(() => {
        centiseconds += 11;
        const s = Math.floor(centiseconds / 100) % 60;
        const m = Math.floor(centiseconds / 6000) % 60;
        const cs = centiseconds % 100;
        setChronosVal(`${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}.${String(cs).padStart(2, '0')}`);
      }, 10);
    }
  };

  const handleManualBirthTimeSubmit = () => {
    const padH = String(customClockHour).padStart(2, "0");
    const padM = String(customClockMin).padStart(2, "0");
    if (onUpdateRtcTime) onUpdateRtcTime(`${padH}:${padM}`);
    onSpectatorSelection(`[Reloj] Sincronía Temporal: ${padH}:${padM}. RTC actualizado.`);
  };

  // --- ROUTINE 6: AI VOICE WHISPERER (MIC SIMULATOR) ---
  const [voiceInput, setVoiceInput] = useState<string>("");
  const [voiceStatus, setVoiceStatus] = useState<string>("Inactivo");

  const handleVoicePush = (txt: string) => {
    setVoiceInput(txt);
    setVoiceStatus("Procesando audio...");
    setTimeout(() => {
      setVoiceStatus("Transmisión encriptada enviada!");
      onSpectatorSelection(`[Voz] Palabra capturada en espectrograma: **"${txt.toUpperCase()}"**`);
    }, 900);
  };

  // --- ROUTINE 7: STOCK-MARKET CRYPTO CHART ---
  const [financeAsset, setFinanceAsset] = useState<string>("BTC_USD");
  const [financePrice, setFinancePrice] = useState<string>("69420.50");

  const sendFinanceDecimals = (price: string) => {
    setFinancePrice(price);
    onSpectatorSelection(`[Finanzas] Activo ${financeAsset} cotizando a $${price}. (Cifra máster enviada al reloj).`);
  };

  // --- ROUTINE 8: SPOTIFY PLAYLIST (50 TRACKS) ---
  const [spotifySearch, setSpotifySearch] = useState("");
  const [playingSong, setPlayingSong] = useState<string | null>(null);

  const filteredSongs = SPOTIFY_SONGS.filter(s => 
    s.toLowerCase().includes(spotifySearch.toLowerCase())
  );

  const triggerSongSelection = (song: string) => {
    setPlayingSong(song);
    onSpectatorSelection(`[Spotify] Canción seleccionada: "${song}". Transmitiendo pulso acústico.`);
  };

  // --- ROUTINE 9: CALCULATOR CONFESSION (LIOR MANOR EQUATION) ---
  const [calcDisplay, setCalcDisplay] = useState<string>("");
  const [calcLogs, setCalcLogs] = useState<string[]>([]);

  const handleCalcKey = (val: string) => {
    if (val === "C") {
      setCalcDisplay("");
    } else if (val === "=") {
      // Algebraic force confession
      // No matter what equation the spectator wrote, the sum will yield the magician's pre-coded prediction
      const predictedVal = "18041989"; // prediction phone/date
      setCalcDisplay(predictedVal);
      onSpectatorSelection(`[Calculadora] Ecuación resuelta. Resultado forzado: **${predictedVal}** (Lior Manor Confession)`);
    } else {
      const doc = calcDisplay + val;
      setCalcDisplay(doc);
      // Stream intermediate figures to the watch in real-time
      onSpectatorSelection(`[Calculadora Digits] Espectador teclea: "${doc}"`);
    }
  };

  // --- ROUTINE 10: WIKIPEDIA CRAWL ESP ---
  const [wikiPage, setWikiPage] = useState<string>("Ilusionismo_y_Magia");
  const [wikiHistory, setWikiHistory] = useState<string[]>(["Ilusionismo_y_Magia"]);

  const setWikiNavigate = (page: string) => {
    setWikiPage(page);
    setWikiHistory(prev => [...prev, page]);
    
    let label = page.replace(/_/g, " ");
    let snippet = "La historia secreta de las artes escénicas de adivinación del pensamiento...";
    if (page === "Robert-Houdin") snippet = "Jean Eugène Robert-Houdin fue un relojero y mago considerado el padre de la magia moderna.";
    if (page === "Harry_Houdini") snippet = "Famoso ilusionista y escapista húngaro-estadounidense célebre por su técnica de escape.";
    if (page === "Cagliostro") snippet = "Ilustre ocultista, alquimista y masón del siglo XVIII que asombró a las cortes europeas.";
    if (page === "Telepatia_Mental") snippet = "La supuesta transferencia telepática de datos entre cerebros de forma biológica.";

    onSpectatorSelection(`[Wikipedia] Artículo: "${label}" | Extracto: "${snippet}"`);
  };

  const handleWikiBack = () => {
    if (wikiHistory.length > 1) {
      const newHistory = wikiHistory.slice(0, -1);
      const prevPage = newHistory[newHistory.length - 1];
      setWikiHistory(newHistory);
      setWikiPage(prevPage);
      onSpectatorSelection(`[Wikipedia Back] Volvió a: "${prevPage.replace(/_/g, " ")}"`);
    }
  };

  // Determine active routine based on lockedRoutine parameter OR magician selected activeTrick
  const currentRoutine = lockedRoutine || activeTrick;

  // --- RENDERING GATE ---
  if (!isUnlocked) {
    return (
      <div 
        id="spectator-404-container"
        onClick={handle404Click}
        style={{ touchAction: "none" }}
        className="bg-[#0c0c0e] text-slate-300 w-full max-w-sm mx-auto h-[580px] rounded-3xl border border-white/10 relative overflow-hidden flex flex-col justify-between p-6 select-none"
      >
        <div className="w-full flex justify-between items-center text-[9px] font-mono text-slate-600 border-b border-white/5 pb-2">
          <span>📶 SECURE FEED</span>
          <span>DISCONNECTED</span>
          <span>404 GATEWAY</span>
        </div>

        {/* Center 404 Visual UI */}
        <div className="flex flex-col items-center text-center my-auto px-4 z-10">
          <AlertOctagon size={48} className="text-red-540 animate-pulse mb-4 text-red-500" />
          <h1 className="text-lg font-bold text-white font-mono uppercase tracking-wider">Error 404</h1>
          <p className="text-xs text-slate-500 mt-2 font-mono leading-relaxed">
            Se ha perdido la conexión remota con el cortafuegos. El servidor de encriptación está fuera de línea temporalmente.
          </p>
          <div className="text-[9px] text-slate-700 font-mono bg-white/5 px-2 py-1 rounded mt-4">
            ERR_CONNECTION_TIMED_OUT (emergente.sh)
          </div>
        </div>

        {/* Interactive ios keypad passcode gate trigger */}
        {showPinModal && (
          <div id="custom-pin-modal" className="absolute inset-0 bg-black/95 bg-opacity-95 z-40 p-6 flex flex-col justify-between animate-fade-in">
            <div className="text-center font-mono mt-2">
              <span className="text-[10px] text-cyan-500 uppercase tracking-widest block mb-2">PIN DE ESCENARIO PROTEGIDO</span>
              <div className="h-10 text-white text-3xl font-bold tracking-widest flex items-center justify-center border-b border-cyan-900 bg-white/5 rounded-xl max-w-[260px] mx-auto">
                {pinInput.length === 0 ? <span className="text-sm opacity-30 text-slate-505">8 DÍGITOS</span> : "*".repeat(pinInput.length)}
              </div>
            </div>

            {/* Matrix Keypad 0-9 */}
            <div className="grid grid-cols-3 gap-3 max-w-[220px] mx-auto my-6 w-full">
              {["1", "2", "3", "4", "5", "6", "7", "8", "9", "C", "0", "E"].map(key => (
                <button
                  key={key}
                  onClick={() => handlePinKey(key)}
                  className={`aspect-square rounded-2xl font-mono text-lg font-bold flex items-center justify-center transition active:scale-90 border cursor-pointer ${
                    key === "E" 
                      ? "bg-cyan-600 text-white border-cyan-500" 
                      : key === "C"
                      ? "bg-zinc-900 text-red-400 border-zinc-850"
                      : "bg-[#141417]/80 hover:bg-zinc-900 text-slate-200 border-white/10"
                  }`}
                >
                  {key}
                </button>
              ))}
            </div>

            <div className="text-center text-[10px] text-zinc-500 font-mono mb-2">
              Introduce el PIN de 8 dígitos para acceder al sincronizador.
            </div>
          </div>
        )}

        {/* Branded footer */}
        <div className="w-full text-center text-[9px] text-slate-755 font-mono text-slate-700 border-t border-white/5 pt-2 flex justify-between">
          <span>© emergente.sh</span>
          <span>SSL Tunnel Secured</span>
        </div>

        {/* Secret Master Toggle Invisible Trigger Button */}
        <button 
          onClick={triggerHiddenButton}
          className="absolute bottom-0 left-0 right-0 h-6 bg-transparent cursor-default border-0 outline-none hover:bg-cyan-500/5 transition opacity-10"
          title="Gatillo secreto"
        />
      </div>
    );
  }

  return (
    <div className="bg-[#0b0b0d] text-slate-100 w-full max-w-sm mx-auto h-[580px] rounded-3xl border-2 border-cyan-950/40 relative overflow-hidden flex flex-col justify-between shadow-2xl">
      
      {/* Phone status bar */}
      <div className="bg-[#060608] border-b border-cyan-950/20 px-5 py-2 flex justify-between items-center text-[9px] text-slate-500 font-mono select-none">
        <span>📶 emergente.sh/predict</span>
        {isUnlocked && (
          <span className="text-cyan-500 font-bold tracking-widest animate-pulse flex items-center gap-1 bg-cyan-950/10 px-2 py-0.5 rounded border border-cyan-900/40">
            SECURE • {timeRemaining}s
          </span>
        )}
        <span>Túnel Cifrado</span>
      </div>

      {/* Screen Interactive Engine */}
      <div className="flex-1 overflow-y-auto p-4 scrollbar-none flex flex-col justify-between bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-950 via-black to-black">
        
        {/* 1. ROUTINE KINDLE BOOK TEST */}
        {currentRoutine === "kindle" && (
          <div className="flex-1 flex flex-col justify-between font-sans">
            <div className="text-center">
              <span className="inline-flex p-1 w-8 h-8 items-center justify-center bg-cyan-950/40 border border-cyan-900/40 text-cyan-400 rounded-full mb-1">
                <BookOpen size={14} />
              </span>
              <h2 className="text-xs font-bold text-white uppercase tracking-wider">E-Book Reader Colección</h2>
              <p className="text-[10px] text-slate-400 mt-0.5">Selecciona y abre libremente cualquier obra literaria.</p>
            </div>

            {/* Sub-views inside kindle: Choose book, read, use algebraic matrix, roulette */}
            {activeSubView === 'books' && (
              <div className="my-auto flex flex-col gap-2.5 h-[340px] overflow-y-auto pr-1">
                <span className="text-[9px] font-mono text-slate-500 block uppercase tracking-widest mb-1">Estantería Virtual</span>
                <div className="grid grid-cols-2 gap-2">
                  {KINDLE_BOOKS.map(book => (
                    <button
                      key={book.id}
                      onClick={() => openBookInReader(book)}
                      className={`text-left p-2.5 rounded-2xl border flex flex-col justify-between h-20 transition cursor-pointer hover:bg-white/5 active:scale-95 ${book.coverColor} border-white/10`}
                    >
                      <div>
                        <span className="text-[10px] font-bold text-white line-clamp-2 leading-tight">{book.title}</span>
                        <span className="text-[8px] text-slate-400 mt-0.5 block">{book.author}</span>
                      </div>
                      <span className="text-[8px] font-mono text-cyan-400 bg-cyan-950/30 px-1 py-0.5 rounded self-start border border-cyan-900/40">
                        {book.category.toUpperCase()}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {activeSubView === 'reader' && forcedTextResult && (
              <div className="bg-[#121215] border border-white/10 p-4 rounded-2xl h-[340px] flex flex-col justify-between text-left">
                <div>
                  <div className="flex justify-between items-center text-[8px] font-mono text-slate-500 border-b border-white/5 pb-1 mb-2">
                    <span>{openedBook.title.toUpperCase()}</span>
                    <span>Pág. {customPageInput}</span>
                  </div>

                  <p className="text-xs text-slate-350 leading-relaxed font-serif tracking-wide">
                    {/* Render the full page text, and highlight the keyword dynamically for the user */}
                    {(() => {
                      const text = forcedTextResult.text;
                      const keyword = forcedTextResult.keyword;
                      const parts = text.split(new RegExp(`(${keyword})`, 'gi'));
                      return parts.map((part, index) => 
                        part.toLowerCase() === keyword.toLowerCase() ? (
                          <span key={index} className="text-cyan-400 font-bold bg-cyan-950/40 border-b border-cyan-500/40 px-1 rounded animate-pulse">
                            {part}
                          </span>
                        ) : part
                      );
                    })()}
                  </p>
                </div>

                <div className="border-t border-white/5 pt-2.5 flex flex-col gap-2">
                  <div className="flex gap-1.5 items-center">
                    <span className="text-[8px] font-mono text-slate-500">Pág:</span>
                    <input 
                      type="number" 
                      min="1" 
                      max="300"
                      value={customPageInput}
                      onChange={e => {
                        const val = Number(e.target.value);
                        setCustomPageInput(val);
                        handlePageFetch(openedBook.id, val);
                      }}
                      className="bg-black/80 text-xs font-mono text-cyan-400 w-14 text-center rounded border border-white/10 focus:outline-none focus:border-cyan-500 py-0.5"
                    />
                    <span className="text-[9px] text-slate-500">Abre cualquier página (1-300).</span>
                  </div>

                  <div className="flex gap-1.5">
                    <button 
                      onClick={() => setActiveSubView('matrix')}
                      className="flex-1 bg-white/5 hover:bg-white/10 text-slate-300 text-[9px] py-1.5 rounded-lg border border-white/10 font-mono cursor-pointer"
                    >
                      🔢 Enigma Matriz
                    </button>
                    <button 
                      onClick={() => setActiveSubView('roulette')}
                      className="flex-1 bg-white/5 hover:bg-white/10 text-slate-300 text-[9px] py-1.5 rounded-lg border border-white/10 font-mono cursor-pointer"
                    >
                      🎡 Ruleta Destino
                    </button>
                    <button 
                      onClick={() => setActiveSubView('books')}
                      className="bg-white/5 hover:bg-white/10 text-slate-400 text-[9px] px-2.5 py-1.5 rounded-lg border border-white/10 font-mono cursor-pointer"
                    >
                      Volver
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Matrix selection sub view */}
            {activeSubView === 'matrix' && (
              <div className="bg-[#121215] border border-white/10 p-3 rounded-2xl h-[340px] flex flex-col justify-between text-center">
                <div>
                  <span className="text-[9px] font-mono text-cyan-400 uppercase tracking-widest block mb-1">Cálculo de Matriz Algorítmica</span>
                  <div className="grid grid-cols-4 gap-1 bg-black/50 p-2 rounded-xl mb-2">
                    {matrixCells.map((row, r) => 
                      row.map((val, c) => {
                        const sel = selectedCells.some(item => item.r === r && item.c === c);
                        const dis = !sel && (selectedCells.some(item => item.r === r) || selectedCells.some(item => item.c === c));
                        return (
                          <button
                            key={`${r}-${c}`}
                            disabled={dis}
                            onClick={() => handleCellClick(r, c, val)}
                            className={`aspect-square rounded text-xs font-mono flex items-center justify-center transition cursor-pointer ${
                              sel 
                                ? "bg-cyan-500 text-black font-bold scale-105" 
                                : dis
                                ? "bg-white/5 text-slate-800 opacity-20 cursor-not-allowed"
                                : "bg-white/5 hover:bg-white/10 text-slate-400"
                            }`}
                          >
                            {val}
                          </button>
                        );
                      })
                    )}
                  </div>
                  <div className="text-[10px] font-mono text-cyan-400">Suma actual: {matrixSum}</div>
                </div>
                <button 
                  onClick={() => { setSelectedCells([]); setMatrixSum(0); setActiveSubView('reader'); }}
                  className="w-full bg-white/5 hover:bg-white/10 text-slate-400 text-[10px] py-1 rounded border border-white/10 cursor-pointer"
                >
                  Volver al E-Book Reader
                </button>
              </div>
            )}

            {/* Roulette view */}
            {activeSubView === 'roulette' && (
              <div className="bg-[#121215] border border-white/10 p-3 rounded-2xl h-[340px] flex flex-col justify-between text-center">
                <div>
                  <span className="text-[9px] font-mono text-cyan-400 uppercase tracking-widest block mb-1">Rueda Mental</span>
                  <div className="w-24 h-24 rounded-full border-2 border-white/10 flex items-center justify-center mx-auto bg-black my-2 relative overflow-hidden">
                    <div className="absolute w-full h-[1px] bg-white/10 rotate-45" />
                    <div className="absolute w-full h-[1px] bg-white/10 -rotate-45" />
                    <div className="z-10 text-white font-mono text-2xl font-bold">{rouletteValue}</div>
                  </div>
                  <div className="text-[9px] font-mono text-slate-400">Tiradas completadas: {spinCount} / 4</div>
                </div>
                <div className="flex flex-col gap-1 w-full">
                  <button 
                    disabled={isSpinning}
                    onClick={handleSpinWheel}
                    className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs py-2 rounded-xl cursor-pointer"
                  >
                    {isSpinning ? "Girando suerte..." : "Girar Rueda"}
                  </button>
                  <button 
                    onClick={() => setActiveSubView('reader')}
                    className="w-full bg-white/5 hover:bg-white/10 text-slate-400 text-[10px] py-1 rounded border border-white/10 cursor-pointer mt-1"
                  >
                    Volver
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 2. ROUTINE NETFLIX MINDFLIX (MOVIE CATALOG) */}
        {currentRoutine === "netflix" && (
          <div className="flex-1 flex flex-col justify-between">
            <div className="flex items-center justify-between border-b border-white/10 pb-1 mb-2">
              <span className="text-cyan-400 font-bold text-sm font-display tracking-tight hover:animate-pulse">MINDFLIX</span>
              <input
                type="text"
                placeholder="Filtrar cine..."
                value={spotifySearch}
                onChange={e => setSpotifySearch(e.target.value)}
                className="bg-black/60 font-mono text-[9px] text-slate-300 w-24 px-2 py-0.5 rounded border border-white/10 focus:outline-none focus:border-cyan-500"
              />
            </div>

            {playingSong ? (
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 my-auto text-center animate-fade-in flex flex-col justify-between h-[280px]">
                <div>
                  <span className="text-[10px] font-mono text-cyan-400 block mb-2 uppercase">Conexión Acústica Exitosa</span>
                  <div className="w-16 h-16 bg-cyan-500/10 border border-cyan-500/40 rounded-full flex items-center justify-center mx-auto animate-pulse mb-3">
                    <Music className="text-cyan-400" size={24} />
                  </div>
                  <h4 className="text-sm font-bold text-white mb-1 line-clamp-2">{playingSong}</h4>
                  <p className="text-[10px] text-slate-400 leading-relaxed max-w-[240px] mx-auto">
                    Cierra los ojos y visualiza las notas musicales de este clásico en tu mente. El mago sentirá tu frecuencia en su reloj de pulsera.
                  </p>
                </div>
                <button
                  onClick={() => setPlayingSong(null)}
                  className="w-full bg-white/5 hover:bg-white/10 text-slate-400 text-[10px] py-1.5 rounded-lg border border-white/10 cursor-pointer"
                >
                  Sintonizar otra canción
                </button>
              </div>
            ) : (
              <div className="h-[320px] overflow-y-auto grid grid-cols-3 gap-1.5 pr-1 my-auto">
                {NETFLIX_MOVIES.filter(m => m.title.toLowerCase().includes(spotifySearch.toLowerCase())).slice(0, 52).map(m => (
                  <button
                    key={m.id}
                    onClick={() => triggerSongSelection(`${m.title} - Ost: ${m.soundtrack}`)}
                    className={`p-2 rounded-xl text-left bg-gradient-to-br ${m.posterHex} border border-white/5 active:scale-95 transition h-20 flex flex-col justify-between relative overflow-hidden cursor-pointer`}
                  >
                    <div className="absolute inset-0 bg-black/25 opacity-40 hover:opacity-10 transition duration-300" />
                    <span className="text-[7px] text-white opacity-90 z-10 block font-mono">{m.year}</span>
                    <h5 className="text-[9px] font-bold text-white z-10 leading-tight line-clamp-2">{m.title}</h5>
                  </button>
                ))}
              </div>
            )}

            <div className="text-[10px] font-mono text-slate-500 border-t border-white/5 pt-1.5 flex justify-between items-center bg-[#07070a] px-3 py-1 rounded-xl">
              <span>RUTINA CINE MENTAL</span>
              <span>52 MOVIES GRID</span>
            </div>
          </div>
        )}

        {/* 3. ROUTINE SECURE PREMONITION (21 CARDS) */}
        {currentRoutine === "card" && (
          <div className="flex-1 flex flex-col justify-between">
            <div className="text-center">
              <span className="inline-flex p-1 w-8 h-8 items-center justify-center bg-cyan-950/40 border border-cyan-900/40 text-cyan-400 rounded-full mb-1">
                <Sparkles size={14} />
              </span>
              <h2 className="text-xs font-bold text-white uppercase tracking-wider">El Oráculo de Corazones</h2>
              <p className="text-[10px] text-slate-400 mt-0.5">El mago ha predicho tu carta exacta en la mesa.</p>
            </div>

            {!deckDealt ? (
              <div className="my-auto text-center">
                <div className="bg-black/60 p-4 border border-white/10 rounded-2xl">
                  <span className="text-[9px] font-mono text-slate-500 block mb-2 uppercase">Sello Del Destino Directo</span>
                  <div className="flex justify-center -space-x-3 overflow-x-auto py-2 max-w-[200px] mx-auto scrollbar-none">
                    {[1, 2, 3, 4, 5].map(i => (
                      <div key={i} className="w-8 h-12 bg-zinc-900 border border-cyan-500/20 rounded-lg flex-shrink-0 relative overflow-hidden" />
                    ))}
                  </div>
                  <button
                    onClick={() => setDeckDealt(true)}
                    className="mt-3 bg-cyan-500 hover:bg-cyan-400 text-black text-[11px] font-bold py-1.5 px-4 rounded-xl transition cursor-pointer active:scale-95 shadow-[0_0_8px_rgba(6,182,212,0.3)]"
                  >
                    Mezclar & Revelar Carta Predicha
                  </button>
                </div>
              </div>
            ) : (
              <div className="my-auto flex flex-col items-center">
                {!cardRevealed ? (
                  <div 
                    onClick={handleRevealCard}
                    className="w-32 h-44 bg-zinc-950 rounded-2xl border-2 border-dashed border-cyan-500/40 p-3 flex flex-col justify-between items-center cursor-pointer group hover:bg-[#121215] transition"
                  >
                    <span className="text-[9px] font-mono text-cyan-400 tracking-wider">PREDICCION</span>
                    <Sparkles size={28} className="text-cyan-400 animate-pulse group-hover:scale-110 transition duration-300" />
                    <span className="text-[8px] font-mono text-slate-500">TOCA REVELAR SINOPSIS</span>
                  </div>
                ) : (
                  <div className="w-36 h-48 bg-white text-zinc-950 rounded-2xl border-4 border-cyan-400 p-4 flex flex-col justify-between transform rotate-1 animate-fade-in shadow-xl shadow-cyan-500/5">
                    <div className="flex justify-between items-center font-bold text-sm">
                      <span className={forcedCard.suite === 'hearts' || forcedCard.suite === 'diamonds' ? "text-red-500" : "text-black"}>
                        {forcedCard.value}
                      </span>
                      <span className={forcedCard.suite === 'hearts' || forcedCard.suite === 'diamonds' ? "text-red-500" : "text-black"}>
                        {forcedCard.imageUrl}
                      </span>
                    </div>

                    <div className="text-center flex flex-col items-center justify-center">
                      <span className={`text-5xl my-1 block ${
                        forcedCard.suite === 'hearts' || forcedCard.suite === 'diamonds' ? "text-red-500" : "text-black"
                      }`}>
                        {forcedCard.imageUrl}
                      </span>
                      <span className="text-[10px] font-bold text-zinc-800 tracking-tight leading-none block">{forcedCard.name}</span>
                    </div>

                    <div className="text-[8px] font-mono text-zinc-500 border-t border-zinc-200 pt-1 flex justify-between">
                      <span>PREDICTED IN</span>
                      <span>ENV #{targetEnvelope}</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="text-[9px] font-mono text-slate-600 text-center leading-normal">
              {cardRevealed ? "La carta indicada coincide invariablemente con el sobre cerrado." : "Concentra tu energía en la premonición del escenario."}
            </div>
          </div>
        )}

        {/* 4. ROUTINE GEO-ECHO MATRIX (20 CITIES) */}
        {currentRoutine === "geo" && (
          <div className="flex-1 flex flex-col justify-between">
            <div className="text-center">
              <span className="inline-flex p-1 w-8 h-8 items-center justify-center bg-cyan-950/40 border border-cyan-900/40 text-cyan-400 rounded-full mb-1">
                <MapPin size={14} />
              </span>
              <h2 className="text-xs font-bold text-white uppercase tracking-wider">Atlas Global de Resonancia</h2>
              <p className="text-[10px] text-slate-400 mt-0.5">Elige una de las 20 metrópolis para iniciar la geolocalización.</p>
            </div>

            <div className="my-2 bg-[#101014]/60 border border-white/5 rounded-2xl p-3 h-[300px] flex flex-col justify-between">
              {selectedCity ? (
                <div className="text-center flex flex-col justify-between h-full animate-fade-in">
                  <div>
                    <span className="text-[9px] font-mono text-cyan-400 block uppercase tracking-widest mb-1">CONEXIÓN SATELITAL ACTIVA</span>
                    <h3 className="text-base font-bold text-white">{selectedCity.name}</h3>
                    <div className="font-mono text-sm text-cyan-300 bg-black py-2 rounded-xl mt-3 select-all border border-cyan-900/20 shadow-inner">
                      {selectedCity.coords}
                    </div>
                    <p className="text-[10px] text-slate-400 mt-3 leading-relaxed">
                      El mago recibirá los desvíos electromagnéticos precisos en grados, minutos y segundos. Intenta abrir Google Maps y copiar estas coordenadas para certificar la precisión.
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedCity(null)}
                    className="w-full bg-white/5 hover:bg-white/10 text-slate-400 text-[10px] py-1.5 rounded-lg border border-white/10 cursor-pointer"
                  >
                    Elegir otra metrópolis
                  </button>
                </div>
              ) : (
                <div className="flex-1 flex flex-col">
                  <div className="relative flex items-center mb-2">
                    <input
                      type="text"
                      placeholder="Filtrar ciudad..."
                      value={geoSearch}
                      onChange={e => setGeoSearch(e.target.value)}
                      className="w-full bg-black/80 text-[10px] font-mono text-slate-300 pl-7 pr-3 py-1.5 rounded-xl border border-white/10 focus:outline-none focus:border-cyan-500"
                    />
                    <Search className="absolute left-2.5 text-slate-500" size={12} />
                  </div>
                  <div className="flex-1 overflow-y-auto pr-1 grid grid-cols-2 gap-1.5 h-[200px]">
                    {filteredCities.map((city, idx) => (
                      <button
                        key={idx}
                        onClick={() => triggerCityCoordSend(city)}
                        className="p-2 bg-white/5 hover:bg-cyan-950/20 rounded-xl text-left border border-white/5 active:scale-95 transition flex flex-col justify-between h-14 cursor-pointer"
                      >
                        <span className="text-[10px] font-bold text-white block">{city.name}</span>
                        <span className="text-[8px] text-slate-500 block">{city.landmark}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="text-[9px] font-mono text-center text-slate-600">
              * El ESP32 S3 decodifica el stream coordinado de París, Tokio o Roma.
            </div>
          </div>
        )}

        {/* 5. ROUTINE CHRONOS PREDICTOR */}
        {currentRoutine === "clock" && (
          <div className="flex-1 flex flex-col justify-between">
            <div className="text-center">
              <span className="inline-flex p-1 w-8 h-8 items-center justify-center bg-cyan-950/40 border border-cyan-900/40 text-cyan-400 rounded-full mb-1">
                <Clock size={14} />
              </span>
              <h2 className="text-xs font-bold text-white uppercase tracking-wider">El Cronómetro del Sincrón</h2>
              <p className="text-[10px] text-slate-400 mt-0.5">La conexión se detendrá exactamente en tu instante de voluntad.</p>
            </div>

            <div className="my-2 bg-[#121215] border border-white/10 p-4 rounded-2xl flex flex-col justify-between h-[300px]">
              <div className="text-center">
                <span className="text-[8px] font-mono text-slate-500 block uppercase mb-1">Intersección de Tiempo Manual</span>
                <div className="text-4xl font-mono font-bold text-white bg-black/80 py-4 rounded-2xl border border-white/5 shadow-inner select-all">
                  {chronosVal}
                </div>
                
                <button
                  onClick={handleToggleChronos}
                  className={`mt-4 w-40 mx-auto py-1.5 rounded-xl font-bold flex items-center justify-center gap-1 text-[11px] cursor-pointer transition active:scale-95 ${
                    chronosRunning 
                      ? "bg-red-550 border-red-500 hover:bg-red-500 text-white bg-red-650" 
                      : "bg-cyan-500 hover:bg-cyan-400 text-black shadow-[0_0_8px_rgba(6,182,212,0.3)]"
                  }`}
                >
                  {chronosRunning ? "DETENER CRONÓMETRO" : "INICIAR CRONÓMETRO"}
                </button>
              </div>

              <div className="border-t border-white/5 pt-2 flex flex-col gap-2">
                <span className="text-[8px] font-mono text-slate-500 text-center uppercase tracking-wider block">O ingresa tu hora de nacimiento</span>
                <div className="flex justify-center items-center gap-3">
                  <div className="flex flex-col items-center">
                    <span className="text-[8px] font-mono text-slate-400 mb-0.5">Horas</span>
                    <input 
                      type="number" 
                      min="1" 
                      max="12"
                      value={customClockHour} 
                      onChange={e => setCustomClockHour(Number(e.target.value))}
                      className="w-12 bg-black py-0.5 border border-white/10 text-cyan-400 text-center text-xs font-mono rounded"
                    />
                  </div>
                  <span className="text-white text-xs mt-3">:</span>
                  <div className="flex flex-col items-center">
                    <span className="text-[8px] font-mono text-slate-400 mb-0.5">Minutos</span>
                    <input 
                      type="number" 
                      min="0" 
                      max="59"
                      value={customClockMin} 
                      onChange={e => setCustomClockMin(Number(e.target.value))}
                      className="w-12 bg-black py-0.5 border border-white/10 text-cyan-400 text-center text-xs font-mono rounded"
                    />
                  </div>
                  <button
                    onClick={handleManualBirthTimeSubmit}
                    className="bg-cyan-950/40 text-[9px] text-cyan-400 px-3 py-1.5 rounded-lg border border-cyan-800/40 mt-3 font-mono cursor-pointer active:scale-95 transition"
                  >
                    Sincronizar
                  </button>
                </div>
              </div>
            </div>

            <p className="text-[9px] text-slate-600 text-center leading-normal">
              * Modificará el chip RTC local del reloj Weiser para mofas analógicas perfectas.
            </p>
          </div>
        )}

        {/* 6. ROUTINE AI VOICE WHISPERER */}
        {currentRoutine === "voice" && (
          <div className="flex-1 flex flex-col justify-between">
            <div className="text-center">
              <span className="inline-flex p-1 w-8 h-8 items-center justify-center bg-cyan-950/40 border border-cyan-900/40 text-cyan-400 rounded-full mb-1">
                <Mic size={14} />
              </span>
              <h2 className="text-xs font-bold text-white uppercase tracking-wider">AI Notas de Sintonía Fónica</h2>
              <p className="text-[10px] text-slate-400 mt-0.5 font-mono">Reconocimimento de locución local emergente.sh</p>
            </div>

            <div className="my-auto bg-[#101014] border border-white/10 p-4 rounded-2xl text-center flex flex-col justify-between h-[280px]">
              <div>
                <span className="text-[8px] font-mono text-slate-500 block mb-2 uppercase">ESTADISTICA DE GRABACION ACTIVA</span>
                <div className="relative w-16 h-16 rounded-full bg-red-650 flex items-center justify-center mx-auto bg-red-950/40 border border-red-500/40 animate-pulse mb-3">
                  <div className="w-6 h-6 rounded-full bg-red-600" />
                </div>
                <div className="text-[10px] font-mono text-slate-400 mb-1">ID TÚNEL: #S3-AUDIO-MEMO</div>
                <div className="text-xs text-white font-mono bg-black/60 p-2.5 rounded-xl border border-white/5 italic">
                  {voiceInput ? `"${voiceInput}"` : "Sintonizando el entorno... Pulsa cualquier botón para forzar palabra clave."}
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest block text-left">PALABRAS DISPONIBLES</span>
                <div className="grid grid-cols-3 gap-1">
                  {["Anhelo", "Espejo", "Diamante", "Pólvora", "Reliquia", "Sombra"].map(word => (
                    <button
                      key={word}
                      onClick={() => handleVoicePush(word)}
                      className="bg-white/5 hover:bg-cyan-950/20 text-slate-300 text-[9px] py-1 rounded border border-white/5 cursor-pointer text-center font-mono active:scale-95"
                    >
                      {word}
                    </button>
                  ))}
                </div>
                <div className="text-[9px] font-mono text-cyan-400 mt-1">{voiceStatus}</div>
              </div>
            </div>

            <span className="text-[9px] italic text-slate-600 text-center block">
              * El reloj vibrará el número de impulsos correspondientes a la palabra.
            </span>
          </div>
        )}

        {/* 7. ROUTINE STOCK MARKET BLACKOUT */}
        {currentRoutine === "stock" && (
          <div className="flex-1 flex flex-col justify-between">
            <div className="text-center">
              <span className="inline-flex p-1 w-8 h-8 items-center justify-center bg-cyan-950/40 border border-cyan-900/40 text-cyan-400 rounded-full mb-1">
                <TrendingUp size={14} />
              </span>
              <h2 className="text-xs font-bold text-white uppercase tracking-wider">Trading predictivo descentralizado</h2>
              <p className="text-[10px] text-slate-400 mt-0.5">Selecciona el activo para ver la cotización y exportar al reloj.</p>
            </div>

            <div className="my-2 bg-[#101014] border border-white/10 p-3 rounded-2xl h-[310px] flex flex-col justify-between">
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { key: "BTC_USD", name: "Bitcoin BTC", val: "68,419.12" },
                  { key: "ETH_USD", name: "Ethereum ETH", val: "3,812.44" },
                  { key: "COMP_NASDAQ", name: "Nasdaq 100", val: "18,443.02" },
                  { key: "APPL_STOCK", name: "Apple AAPL", val: "182.33" },
                  { key: "TSLA_STOCK", name: "Tesla TSLA", val: "174.96" },
                  { key: "XAU_GOLD", name: "Onza Oro", val: "2,331.10" }
                ].map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => { setFinanceAsset(item.key); sendFinanceDecimals(item.val); }}
                    className={`p-2 rounded-xl text-left border cursor-pointer flex flex-col justify-between h-14 ${
                      financeAsset === item.key 
                        ? "bg-cyan-950/40 border-cyan-500 text-cyan-300" 
                        : "bg-white/5 border-white/10 text-slate-400 hover:bg-white/10"
                    }`}
                  >
                    <span className="text-[8px] font-mono truncate font-bold text-white">{item.name}</span>
                    <span className="text-[9px] font-mono font-bold text-cyan-400 block tracking-tight">${item.val}</span>
                  </button>
                ))}
              </div>

              <div className="bg-black/80 rounded-xl p-2.5 border border-white/5 text-center my-2">
                <span className="text-[8px] font-mono text-slate-500 block uppercase mb-0.5">ACTIVO EXPUESTO ACTUAL</span>
                <span className="text-sm font-mono font-bold text-white block">{financeAsset.toUpperCase()}</span>
                <span className="text-lg font-mono font-bold text-cyan-400 block">${financePrice}</span>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Precio custom..."
                  value={financePrice}
                  onChange={e => sendFinanceDecimals(e.target.value)}
                  className="bg-black font-mono text-xs text-white text-center rounded border border-white/10 py-1 flex-1 focus:outline-none focus:border-cyan-550 placeholder-slate-650"
                />
                <button
                  onClick={() => onSpectatorSelection(`[Finanzas] Forzado Custom $${financePrice} en ${financeAsset}`)}
                  className="bg-cyan-500 text-black font-bold text-xs px-3 py-1 rounded-lg hover:bg-cyan-400 transition cursor-pointer"
                >
                  Enviar
                </button>
              </div>
            </div>

            <p className="text-[9px] text-slate-600 text-center leading-normal">
              * El mago puede dictar las cifras decimales con exactitud infinitesimal.
            </p>
          </div>
        )}

        {/* 8. ROUTINE SPOTIFY ESP (REPLICA TRACKLIST) */}
        {currentRoutine === "spotify" && (
          <div className="flex-1 flex flex-col justify-between">
            <div className="flex items-center justify-between border-b border-cyan-950/20 pb-1 mb-1">
              <span className="text-emerald-400 font-bold text-xs tracking-tight uppercase flex items-center gap-1">🟢 shared playlist</span>
              <input
                type="text"
                placeholder="Rastrear track..."
                value={spotifySearch}
                onChange={e => setSpotifySearch(e.target.value)}
                className="bg-black text-[9px] font-mono text-slate-350 pr-2 pl-2 py-0.5 rounded border border-white/10 w-24"
              />
            </div>

            {playingSong ? (
              <div className="bg-[#101014] border border-white/10 p-4 rounded-2xl h-[280px] flex flex-col justify-between text-center animate-fade-in my-auto">
                <div className="my-auto">
                  <div className="w-12 h-12 bg-emerald-500/15 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto mb-3 animate-bounce">
                    <Music className="text-emerald-400" size={18} />
                  </div>
                  <h4 className="text-sm font-bold text-white line-clamp-2">{playingSong}</h4>
                  <p className="text-[9px] text-slate-400 mt-2 max-w-[200px] mx-auto">
                    Sintonizador digital Spotify ESP sincronizado con el terminal móvil. El mago puede controlar la reproducción mediante gestos.
                  </p>
                </div>
                <button
                  onClick={() => setPlayingSong(null)}
                  className="bg-white/5 border border-white/10 rounded-xl text-[10px] text-slate-400 py-1 hover:bg-white/10 cursor-pointer"
                >
                  Elegir otra melodía de la estantería
                </button>
              </div>
            ) : (
              <div className="h-[310px] overflow-y-auto flex flex-col gap-1 pr-1 my-2">
                {filteredSongs.slice(0, 50).map((song, i) => (
                  <button
                    key={i}
                    onClick={() => triggerSongSelection(song)}
                    className="w-full bg-[#101014]/65 hover:bg-emerald-950/10 p-2.5 rounded-xl text-left border border-white/5 font-mono text-[10px] flex items-center gap-3 transition cursor-pointer active:scale-98 text-slate-350"
                  >
                    <span className="text-slate-600 font-bold w-4">#{i+1}</span>
                    <span className="truncate">{song}</span>
                  </button>
                ))}
              </div>
            )}

            <span className="text-[8px] font-mono text-center text-slate-605 text-slate-600 block bg-zinc-950/20 py-1 border-t border-white/5">
              50 CLASSIC MUSIC MATRIX
            </span>
          </div>
        )}

        {/* 9. ROUTINE CALCULATOR CONFESSION */}
        {currentRoutine === "calculator" && (
          <div className="flex-1 flex flex-col justify-between">
            {/* Native looking calculator math grid */}
            <div className="bg-black p-4 border border-white/10 rounded-2xl flex flex-col justify-between h-[360px] my-auto">
              {/* Display view */}
              <div className="h-16 text-right font-mono text-3xl font-bold bg-[#0c0c0e] border border-white/5 p-3 rounded-xl flex items-center justify-end text-cyan-400 select-all shadow-inner">
                {calcDisplay || "0"}
              </div>

              {/* Calculator Keypad */}
              <div className="grid grid-cols-4 gap-2.5 mt-4">
                {["7", "8", "9", "/", "4", "5", "6", "*", "1", "2", "3", "-", "C", "0", "=", "+"].map(key => (
                  <button
                    key={key}
                    onClick={() => handleCalcKey(key)}
                    className={`aspect-square sm:aspect-video rounded-xl font-mono text-xs font-bold flex items-center justify-center transition active:scale-90 border cursor-pointer ${
                      key === "=" 
                        ? "bg-cyan-500 text-black border-cyan-400" 
                        : key === "C"
                        ? "bg-red-950/30 text-red-400 border-red-900/40"
                        : ["/", "*", "-", "+"].includes(key)
                        ? "bg-white/10 text-cyan-400 border-white/15"
                        : "bg-white/5 text-slate-200 border-white/10 hover:bg-white/10"
                    }`}
                  >
                    {key}
                  </button>
                ))}
              </div>
            </div>

            <p className="text-[9px] font-mono text-center text-slate-500 leading-normal">
              * Lior Manor Modified Force Layout. El reloj del mago recibe tus dígitos intermedios de forma instantánea.
            </p>
          </div>
        )}

        {/* 10. ROUTINE wikipedia CRAWL ESP */}
        {currentRoutine === "wikipedia" && (
          <div className="flex-1 flex flex-col justify-between text-left font-serif">
            {/* Wikipedia top bar bar */}
            <div className="bg-white text-zinc-950 px-4 py-2 rounded-t-2xl border-b border-zinc-200 flex justify-between items-center text-[10px] font-sans">
              <span className="font-extrabold text-base tracking-wider font-display">W</span>
              <span className="font-bold text-[11px] truncate text-center flex-1 mx-4">
                {wikiPage.replace(/_/g, " ")} - Wikipedia
              </span>
              {wikiHistory.length > 1 && (
                <button
                  onClick={handleWikiBack}
                  className="bg-zinc-100 border border-zinc-300 rounded px-2 py-0.5 hover:bg-zinc-200 flex items-center gap-0.5 cursor-pointer text-[9px]"
                >
                  ATRÁS
                </button>
              )}
            </div>

            {/* Wikipedia body text frame */}
            <div className="flex-1 bg-white text-zinc-900 p-4 font-serif text-[11px] h-[300px] overflow-y-auto leading-relaxed overflow-x-hidden">
              {wikiPage === "Ilusionismo_y_Magia" && (
                <div>
                  <h1 className="text-sm font-sans font-bold border-b border-zinc-350 pb-1 mb-2">Ilusionismo y Magia antigua</h1>
                  <p className="mb-2">
                    El ilusionismo, popularmente denominado magia, es un arte escénico y de adivinación del pensamiento que consiste en simular fenómenos mágicos que desafían las leyes naturales.
                  </p>
                  <p className="mb-2">
                    Se remonta desde los antiguos jeroglíficos egipcios y las cortes romanas. Los ilusionistas clásicos como el grandioso <button onClick={() => setWikiNavigate("Robert-Houdin")} className="text-blue-700 underline font-semibold text-left">Robert-Houdin</button> o el asombroso maestro de escapes <button onClick={() => setWikiNavigate("Harry_Houdini")} className="text-blue-700 underline font-semibold text-left">Harry Houdini</button> lideraron espectáculos mundiales de sugestión.
                  </p>
                  <p className="mb-1">
                    También se vinculaban a círculos de esoterismo hermético que estudiaban la misteriosa <button onClick={() => setWikiNavigate("Telepatia_Mental")} className="text-blue-700 underline font-semibold text-left">Telepatía Mental</button> y las prácticas alquímicas del conde de <button onClick={() => setWikiNavigate("Cagliostro")} className="text-blue-700 underline font-semibold text-left">Cagliostro</button> en Versalles.
                  </p>
                </div>
              )}

              {wikiPage === "Robert-Houdin" && (
                <div>
                  <h1 className="text-sm font-sans font-bold border-b border-zinc-350 pb-1 mb-2">Jean-Eugène Robert-Houdin</h1>
                  <p className="mb-2">
                    <b>Jean-Eugène Robert-Houdin</b> (Blois, 1805) fue un célebre relojero francés e ilusionista considerado unánimemente como el padre y mentor de la magia escénica científica e industrial moderna, al introducir pilas eléctricas y electromagnetismo en sus autómatas mágicos.
                  </p>
                  <p className="mb-2">
                    Fundó su teatro en París combinando engranes mecánicos infinitesimales de relojería con predicciones ópticas y magnéticas de mentalismo asombroso. Su principal legado fue dignificar el oficio de mago vistiendo frac elegante.
                  </p>
                  <button onClick={() => setWikiNavigate("Ilusionismo_y_Magia")} className="text-xs text-blue-700 underline block font-sans">Volver al artículo principal</button>
                </div>
              )}

              {wikiPage === "Harry_Houdini" && (
                <div>
                  <h1 className="text-sm font-sans font-bold border-b border-zinc-350 pb-1 mb-2">Harry Houdini (Erich Weiss)</h1>
                  <p className="mb-2">
                    <b>Harry Houdini</b> (Budapest, 1874) fue un mítico ilusionista y escapista húngaro-estadounidense célebre por su legendaria habilidad para liberarse de camisas de fuerza suspendido en el aire, esposas policiales bajo ríos congelados, grilletes y bidones d'agua cerrados.
                  </p>
                  <p className="mb-2">
                    Inició su nombre rindiendo veneración literaria al relojero y mago <button onClick={() => setWikiNavigate("Robert-Houdin")} className="text-blue-700 underline font-semibold">Robert-Houdin</button>. Dedicó sus últimos años a desenmascarar espiritistas ingenuos y adivinadoras de mímica falsa.
                  </p>
                  <button onClick={() => setWikiNavigate("Ilusionismo_y_Magia")} className="text-xs text-blue-700 underline block font-sans">Volver al artículo principal</button>
                </div>
              )}

              {wikiPage === "Cagliostro" && (
                <div>
                  <h1 className="text-sm font-sans font-bold border-b border-zinc-350 pb-1 mb-2">Conde de Cagliostro (Giuseppe Balsamo)</h1>
                  <p className="mb-2">
                    <b>Cagliostro</b> fue un charlatán místico, ocultista italiano y aventurero del siglo XVIII que recorrió las cortes reales rusas, alemanas y versallescas ofreciendo pócimas mágicas de inmortalidad, elixires alquímicos y transmutación física de metales.
                  </p>
                  <p className="mb-2">
                    Fue protagonista del intrigante escándalo del collar de la reina en la Francia revolucionaria y estuvo relacionado con sociedades secretas masónicas avanzadas y teosofistas clásicos de la época de la Ilustración escéptica.
                  </p>
                  <button onClick={() => setWikiNavigate("Ilusionismo_y_Magia")} className="text-xs text-blue-700 underline block font-sans">Volver al artículo principal</button>
                </div>
              )}

              {wikiPage === "Telepatia_Mental" && (
                <div>
                  <h1 className="text-sm font-sans font-bold border-b border-zinc-350 pb-1 mb-2">Telepatía Mental y Mímica</h1>
                  <p className="mb-2">
                    La <b>telepatía</b> representa la controvertida hipótesis psíquica de transmisión inter-individual directa de pensamientos, esquemas intelectuales y sensaciones físicas entre mentes sin el uso de ningún canal de comunicación físico clásico biológico.
                  </p>
                  <p className="mb-2">
                    En espectáculos públicos de ilusionismo moderno, se simula con códigos secretos avanzados transmitidos inalámbricamente (por ejemplo, con microprocesadores ocultos y redes Bluetooth) indetectables para el público teatral.
                  </p>
                  <button onClick={() => setWikiNavigate("Ilusionismo_y_Magia")} className="text-xs text-blue-700 underline block font-sans">Volver al artículo principal</button>
                </div>
              )}
            </div>

            <div className="bg-zinc-100 text-[9px] font-sans text-right px-4 py-2 text-zinc-550 border-t border-zinc-200 flex justify-between rounded-b-2xl">
              <span className="text-zinc-650 font-bold">WIKIPEDIA MOBILE EN LATÍN</span>
              <span className="text-zinc-500">HTML5 MIRROR CRAWL</span>
            </div>
          </div>
        )}

      </div>

      {/* Branded subtle footer */}
      <div className="bg-[#060608] px-5 py-2.5 border-t border-cyan-950/20 flex justify-between items-center text-[9px] text-slate-500 font-mono">
        <span>© 2026 emergente.sh</span>
        <span className="text-[7.5px] tracking-wider uppercase bg-cyan-950/30 px-1.5 py-0.5 rounded text-cyan-400 border border-cyan-900/40">Sincronizado vía AES-128</span>
      </div>
    </div>
  );
}

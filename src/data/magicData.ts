export interface Book {
  id: string;
  title: string;
  author: string;
  category: 'fantasy' | 'novel' | 'tale' | 'essay';
  coverColor: string;
  defaultPage: number;
  wordIndex: { [key: number]: { text: string; keywords: string[] } };
}

export interface Movie {
  id: number;
  title: string;
  director: string;
  actor: string;
  actress: string;
  soundtrack: string;
  year: number;
  category: string;
  posterHex: string;
}

export interface Card {
  id: string; // e.g. "AH", "9D"
  name: string;
  suite: 'hearts' | 'diamonds' | 'clubs' | 'spades';
  value: string;
  imageUrl: string;
}

export interface CityGeo {
  name: string;
  coords: string; // Latitude & Longitude (e.g., 48°51'24"N 2°21'08"E)
  landmark: string;
  fact: string;
}

// 8 books of varied genres with authentic narratives
export const KINDLE_BOOKS: Book[] = [
  {
    id: "FANT_DRAGON",
    title: "El Despertar del Dragón",
    author: "Alister Vance",
    category: "fantasy",
    coverColor: "bg-red-950 border-red-500",
    defaultPage: 115,
    wordIndex: {
      115: {
        text: "El cielo sobre las Tierras Altas se tiñó de un carmesí violento. Desde la torre de vigía, el joven paladín vio cómo las antiguas runas de la espada de su padre comenzaban a brillar con un fuego azulado, anunciando el regreso del primer dios.",
        keywords: ["runas", "fuego azulado", "primer dios"]
      }
    }
  },
  {
    id: "FANT_MITHRIL",
    title: "Las Crónicas de Mithril",
    author: "Eldrin Thorne",
    category: "fantasy",
    coverColor: "bg-emerald-950 border-emerald-500",
    defaultPage: 42,
    wordIndex: {
      42: {
        text: "Los elfos de la llanura no recordaban un invierno tan crudo. Elyon avanzaba entre la nieve, con los dedos congelados sobre el arco. Sabía que si no alcanzaba el santuario antes del amanecer, la reliquia se perdería para siempre.",
        keywords: ["invierno", "arco", "reliquia"]
      }
    }
  },
  {
    id: "NOV_LLUVIA",
    title: "Sombras bajo la Lluvia",
    author: "Julián S. Valenzuela",
    category: "novel",
    coverColor: "bg-zinc-900 border-zinc-500",
    defaultPage: 88,
    wordIndex: {
      88: {
        text: "La cafetería olía a café cargado y a secretos mal guardados. Julián observaba el cristal empañado, trazando líneas invisibles con el dedo mientras esperaba a la única persona que conocía la verdad sobre la desaparición de su hermano.",
        keywords: ["café cargado", "desaparición", "hermano"]
      }
    }
  },
  {
    id: "NOV_VIENA",
    title: "El Último Tren a Viena",
    author: "Amalia de Hazburg",
    category: "novel",
    coverColor: "bg-indigo-950 border-indigo-500",
    defaultPage: 210,
    wordIndex: {
      210: {
        text: "El silbato de la locomotora rompió el silencio de la noche berlinesa. Ella apretó la maleta contra su pecho, consciente de que los documentos que escondía en el forro doble cambiarían el rumbo de la guerra si lograba cruzar la frontera.",
        keywords: ["locomotora", "maleta", "frontera"]
      }
    }
  },
  {
    id: "CUEN_RELOJ",
    title: "El Relojero de los Sueños",
    author: "Mateo G. Ceballos",
    category: "tale",
    coverColor: "bg-amber-950 border-amber-500",
    defaultPage: 12,
    wordIndex: {
      12: {
        text: "Había una vez un anciano que no reparaba engranajes, sino recuerdos. Cada vez que alguien le llevaba un reloj parado, él soplaba sobre las agujas y devolvía al dueño el instante exacto en el que había sido más feliz en su vida.",
        keywords: ["engranajes", "agujas", "reloj parado"]
      }
    }
  },
  {
    id: "CUEN_BOSQUE",
    title: "El Bosque Susurrante",
    author: "Silvia Montes",
    category: "tale",
    coverColor: "bg-teal-950 border-teal-500",
    defaultPage: 7,
    wordIndex: {
      7: {
        text: "Mateo se internó en la arboleda buscando su cometa perdida. Al tocar la corteza del roble más antiguo, escuchó una melodía suave que parecía pronunciar su nombre. El bosque no estaba vacío; el bosque estaba escuchando.",
        keywords: ["arboleda", "arboleda roble", "melodía suave"]
      }
    }
  },
  {
    id: "ENS_DIGITAL",
    title: "La Paradoja Digital",
    author: "Prof. Arturo Ramos",
    category: "essay",
    coverColor: "bg-purple-950 border-purple-500",
    defaultPage: 154,
    wordIndex: {
      154: {
        text: "En la era de la hiperconectividad global, el individuo experimenta un aislamiento cognitivo sin precedentes. Las redes no han ampliado nuestro mundo, sino que han construido espejos que solo nos devuelven el reflejo de nuestros propios sesgos.",
        keywords: ["hiperconectividad", "aislamiento", "espejos"]
      }
    }
  },
  {
    id: "ENS_TIEMPO",
    title: "Breve Historia del Tiempo Humano",
    author: "Dr. Hugo del Castillo",
    category: "essay",
    coverColor: "bg-blue-950 border-blue-500",
    defaultPage: 33,
    wordIndex: {
      33: {
        text: "La medición del tiempo transformó al homo sapiens de un ser cíclico a uno lineal. Al inventar el minutero, la humanidad no ganó control sobre las horas, sino que se condenó a vivir bajo la constante tiranía de la productividad.",
        keywords: ["homo sapiens", "minutero", "tiranía"]
      }
    }
  }
];

// Algoritmo "Forzado en la Sombra" - Dynamic Shadow Forcing logic
// Takes any book and any page, returning a realistic deterministic paragraph with keyword to read
export function getShadowForcedWord(bookId: string, pageNum: number): { text: string; keyword: string } {
  const book = KINDLE_BOOKS.find(b => b.id === bookId) || KINDLE_BOOKS[0];
  
  // If we have an exact pre-defined match, return it
  if (book.wordIndex[pageNum]) {
    return {
      text: book.wordIndex[pageNum].text,
      keyword: book.wordIndex[pageNum].keywords[0]
    };
  }

  // Otherwise, deterministically generate a paragraph based on pageNum so it is consistent and looks natural
  const category = book.category;
  const author = book.author;
  const title = book.title;

  let text = "";
  let keyword = "";

  const rSeed = (pageNum * 13 + bookId.charCodeAt(0) * 7) % 10;

  if (category === "fantasy") {
    const keywordsPool = ["hechizo arcano", "relámpago", "cripta sellada", "pergamino", "talisman sagrado", "piedra rúnica", "monstruo", "portal", "espada bendita", "bastón"];
    keyword = keywordsPool[rSeed];
    text = `Página ${pageNum}. El viento ululaba entre los muros derruidos de la ciudadela. El mago sintió cómo el cansancio pesaba sobre sus hombros, pero apretó con firmeza el ${keyword} que llevaba oculto bajo su capa de lana gruesa, preparado para trazar el golpe definitivo antes del ocaso.`;
  } else if (category === "novel") {
    const keywordsPool = ["carta de chantaje", "revolución", "veneno letal", "pasapaso secreto", "caja de cigarros", "testigo clave", "disparo apagado", "confesión", "espejo roto", "huellas"];
    keyword = keywordsPool[rSeed];
    text = `Página ${pageNum}. El inspector encendió un fósforo y observó cómo la llama consumía lentamente los bordes de la ${keyword}. Su contacto en los muelles le había jurado que no encontraría pistas allí, pero el destino a menudo premia a quien busca con paciencia silenciosa.`;
  } else if (category === "tale") {
    const keywordsPool = ["cochinilla", "juguete de cuerda", "llave dorada", "búho sabio", "mapa pirata", "cofre", "sombrerero malvado", "moneda del pozo", "duende travieso", "pócima"];
    keyword = keywordsPool[rSeed];
    text = `Página ${pageNum}. Érase una vez un valle escondido más allá de las colinas de azúcar, donde la noche brillaba con miles de linternas. Un curioso niño encontró una ${keyword} enterrada en las raíces del cerezo, sin saber que al girarla desataría una melodía milenaria.`;
  } else { // essay
    const keywordsPool = ["antropología moderna", "mecanismo cuántico", "sesgo heurístico", "paradoja biológica", "teoría del caos", "entropía social", "paranoia colectiva", "filosofía lineal", "mecanismo digital", "feudo tecnológico"];
    keyword = keywordsPool[rSeed];
    text = `Página ${pageNum}. Si analizamos críticamente el fenómeno de la alienación posmoderna, descubrimos que el ${keyword} no representa una mera coincidencia social, sino más bien el resultado inevitable del proceso expansivo e incontrolable del capital industrial cognitivo.`;
  }

  return { text, keyword };
}

// 20 Geolocation Cities lookup dictionary
export const GEO_CITIES: CityGeo[] = [
  { name: "París, FRA", coords: "48°51'24\"N 2°21'08\"E", landmark: "Torre Eiffel", fact: "Plaza del Trocadero" },
  { name: "Roma, ITA", coords: "41°53'36\"N 12°29'05\"E", landmark: "Coliseo Romano", fact: "Fontana di Trevi" },
  { name: "Madrid, ESP", coords: "40°25'01\"N 03°42'12\"O", landmark: "Puerta del Sol", fact: "Plaza de Cibeles" },
  { name: "Londres, GBR", coords: "51°30'26\"N 0°07'39\"O", landmark: "Big Ben", fact: "Puente del Támesis" },
  { name: "Nueva York, USA", coords: "40°42'46\"N 74°00'21\"O", landmark: "Times Square", fact: "Central Park" },
  { name: "Tokio, JPN", coords: "35°41'22\"N 139°41'30\"E", landmark: "Cruce de Shibuya", fact: "Torre de Tokio" },
  { name: "El Cairo, EGY", coords: "30°02'40\"N 31°14'09\"E", landmark: "Pirámide de Giza", fact: "Río Nilo" },
  { name: "Sídney, AUS", coords: "33°52'04\"S 151°12'26\"E", landmark: "Ópera de Sídney", fact: "Puente de la Bahía" },
  { name: "Río de Jan., BRA", coords: "22°54'10\"S 43°12'27\"O", landmark: "Cristo Redentor", fact: "Playa Copacabana" },
  { name: "Moscú, RUS", coords: "55°45'07\"N 37°36'56\"E", landmark: "Plaza Roja", fact: "Catedral de San Basilio" },
  { name: "Pekín, CHN", coords: "39°54'15\"N 116°24'27\"E", landmark: "Gran Muralla", fact: "Ciudad Prohibida" },
  { name: "Estambul, TUR", coords: "41°00'49\"N 28°57'18\"E", landmark: "Santa Sofía", fact: "Estrecho del Bósforo" },
  { name: "Berlín, DEU", coords: "52°31'12\"N 13°24'18\"E", landmark: "Puerta de Brand.", fact: "Muro de Berlín" },
  { name: "Bombay, IND", coords: "19°04'33\"N 72°52'39\"E", landmark: "Puerta de la India", fact: "Mar Arábigo" },
  { name: "Dubái, ARE", coords: "25°12'04\"N 55°16'36\"E", landmark: "Burj Khalifa", fact: "Palma Jumeirah" },
  { name: "México DF, MEX", coords: "19°25'10\"N 99°08'44\"O", landmark: "Ángel Independ.", fact: "El Zócalo" },
  { name: "Buenos Aires, ARG", coords: "34°36'12\"S 58°22'54\"O", landmark: "El Obelisco", fact: "Plaza de Mayo" },
  { name: "Atenas, GRC", coords: "37°58'20\"N 23°43'35\"E", landmark: "Acrópolis", fact: "Partenón" },
  { name: "Santiago, CHL", coords: "33°27'00\"S 70°40'00\"O", landmark: "Costanera Center", fact: "Cerro San Cristóbal" },
  { name: "Bogotá, COL", coords: "4°35'53\"N 74°04'33\"O", landmark: "Plaza de Bolívar", fact: "Cerro Monserrate" }
];

// 52 titles for Netflix catalogs
export const NETFLIX_MOVIES: Movie[] = [
  { id: 1, title: "Origen (Inception)", director: "Christopher Nolan", actor: "Leonardo DiCaprio", actress: "Marion Cotillard", soundtrack: "Time (Hans Zimmer)", year: 2010, category: "Ciencia Ficción", posterHex: "from-zinc-900 to-slate-950 text-sky-400" },
  { id: 2, title: "Titanic", director: "James Cameron", actor: "Leonardo DiCaprio", actress: "Kate Winslet", soundtrack: "My Heart Will Go On (Celine Dion)", year: 1997, category: "DramaRomance", posterHex: "from-blue-900 to-cyan-950 text-amber-300" },
  { id: 3, title: "El Padrino", director: "Francis Ford Coppola", actor: "Marlon Brando", actress: "Diane Keaton", soundtrack: "Speak Softly Love (Nino Rota)", year: 1972, category: "Crimen", posterHex: "from-amber-950 to-stone-950 text-amber-500" },
  { id: 4, title: "Gladiator", director: "Ridley Scott", actor: "Russell Crowe", actress: "Connie Nielsen", soundtrack: "Now We Are Free (Lisa Gerrard)", year: 2000, category: "Acción", posterHex: "from-amber-950 to-orange-950 text-yellow-500" },
  { id: 5, title: "Matrix", director: "Lana Wachowski", actor: "Keanu Reeves", actress: "Carrie-Anne Moss", soundtrack: "Clubbed to Death (Rob Dougan)", year: 1999, category: "Ciencia Ficción", posterHex: "from-emerald-950 to-zinc-950 text-emerald-400" },
  { id: 6, title: "El Caballero Oscuro", director: "Christopher Nolan", actor: "Christian Bale", actress: "Maggie Gyllenhaal", soundtrack: "Why So Serious? (Hans Zimmer)", year: 2008, category: "Acción / Crimen", posterHex: "from-zinc-900 to-neutral-950 text-blue-400" },
  { id: 7, title: "Pulp Fiction", director: "Quentin Tarantino", actor: "John Travolta", actress: "Uma Thurman", soundtrack: "Misirlou (Dick Dale)", year: 1994, category: "Crimen", posterHex: "from-rose-950 to-red-955 text-yellow-300" },
  { id: 8, title: "Interstellar", director: "Christopher Nolan", actor: "Matthew McConaughey", actress: "Anne Hathaway", soundtrack: "No Time for Caution (Hans Zimmer)", year: 2014, category: "Ciencia Ficción", posterHex: "from-violet-950 to-neutral-950 text-indigo-400" },
  { id: 9, title: "Forrest Gump", director: "Robert Zemeckis", actor: "Tom Hanks", actress: "Robin Wright", soundtrack: "Forrest Gump Suite (Alan Silvestri)", year: 1994, category: "ComediaDrama", posterHex: "from-sky-950 to-blue-900 text-sky-200" },
  { id: 10, title: "El Señor de los Anillos", director: "Peter Jackson", actor: "Elijah Wood", actress: "Liv Tyler", soundtrack: "Concerning Hobbits (Howard Shore)", year: 2001, category: "Fantasía", posterHex: "from-green-950 to-stone-900 text-amber-400" },
  { id: 11, title: "Star Wars: Imperio Contraataca", director: "Irvin Kershner", actor: "Mark Hamill", actress: "Carrie Fisher", soundtrack: "The Imperial March (John Williams)", year: 1980, category: "Ciencia Ficción", posterHex: "from-blue-950 to-black text-blue-300" },
  { id: 12, title: "El Club de la Lucha", director: "David Fincher", actor: "Brad Pitt", actress: "Helena Bonham Carter", soundtrack: "Where Is My Mind? (Pixies)", year: 1999, category: "Drama / Psicología", posterHex: "from-zinc-850 to-zinc-955 text-pink-500" },
  { id: 13, title: "Parásitos", director: "Bong Joon-ho", actor: "Song Kang-ho", actress: "Cho Yeo-jeong", soundtrack: "The Belt of Faith (Jung Jae-il)", year: 2019, category: "Suspense", posterHex: "from-stone-800 to-neutral-950 text-yellow-600" },
  { id: 14, title: "La La Land", director: "Damien Chazelle", actor: "Ryan Gosling", actress: "Emma Stone", soundtrack: "City of Stars (Justin Hurwitz)", year: 2016, category: "Musical", posterHex: "from-pink-900 to-indigo-950 text-pink-300" },
  { id: 15, title: "Amélie", director: "Jean-Pierre Jeunet", actor: "Mathieu Kassovitz", actress: "Audrey Tautou", soundtrack: "La Valse d'Amélie (Yann Tiersen)", year: 2001, category: "RomanceComedia", posterHex: "from-green-900 to-red-955 text-red-400" },
  { id: 16, title: "Braveheart", director: "Mel Gibson", actor: "Mel Gibson", actress: "Sophie Marceau", soundtrack: "For the Love of a Princess (James Horner)", year: 1995, category: "Histórica", posterHex: "from-blue-950 to-orange-950 text-amber-100" },
  { id: 17, title: "El Silencio de los Corderos", director: "Jonathan Demme", actor: "Anthony Hopkins", actress: "Jodie Foster", soundtrack: "Main Title theme (Howard Shore)", year: 1991, category: "Thriller", posterHex: "from-gray-900 to-slate-950 text-red-500" },
  { id: 18, title: "Se7en", director: "David Fincher", actor: "Brad Pitt", actress: "Gwyneth Paltrow", soundtrack: "Closer remix (Nine Inch Nails)", year: 1995, category: "Suspense", posterHex: "from-zinc-900 to-stone-955 text-indigo-200" },
  { id: 19, title: "El Pianista", director: "Roman Polanski", actor: "Adrien Brody", actress: "Emilia Fox", soundtrack: "Nocturne in C-sharp minor (Chopin)", year: 2002, category: "Drama", posterHex: "from-slate-900 to-blue-950 text-amber-400" },
  { id: 20, title: "La Lista de Schindler", director: "Steven Spielberg", actor: "Liam Neeson", actress: "Embeth Davidtz", soundtrack: "Schindler's List Theme (John Williams)", year: 1993, category: "Drama", posterHex: "from-stone-900 to-neutral-950 text-gray-300" },
  { id: 21, title: "Avatar", director: "James Cameron", actor: "Sam Worthington", actress: "Zoe Saldana", soundtrack: "I See You (Leona Lewis)", year: 2009, category: "Ciencia Ficción", posterHex: "from-cyan-950 to-blue-950 text-cyan-300" },
  { id: 22, title: "Whiplash", director: "Damien Chazelle", actor: "Miles Teller", actress: "Melissa Benoist", soundtrack: "Caravan (John Wasson)", year: 2014, category: "DramaMusical", posterHex: "from-amber-900 to-stone-955 text-orange-400" },
  { id: 23, title: "Psicosis", director: "Alfred Hitchcock", actor: "Anthony Perkins", actress: "Janet Leigh", soundtrack: "The Murder theme (Bernard Herrmann)", year: 1960, category: "Terror", posterHex: "from-zinc-800 to-black text-white" },
  { id: 24, title: "Tiburon (Jaws)", director: "Steven Spielberg", actor: "Roy Scheider", actress: "Lorraine Gary", soundtrack: "Main Title Theme (John Williams)", year: 1975, category: "Aventura", posterHex: "from-blue-950 to-emerald-950 text-teal-400" },
  { id: 25, title: "E.T.", director: "Steven Spielberg", actor: "Henry Thomas", actress: "Drew Barrymore", soundtrack: "Flying Theme (John Williams)", year: 1982, category: "Familiar", posterHex: "from-sky-900 to-indigo-955 text-cyan-200" },
  { id: 26, title: "Regreso al Futuro", director: "Robert Zemeckis", actor: "Michael J. Fox", actress: "Lea Thompson", soundtrack: "Back to the Future (Alan Silvestri)", year: 1985, category: "Aventura", posterHex: "from-cyan-900 to-red-950 text-yellow-400" },
  { id: 27, title: "Parque Jurásico", director: "Steven Spielberg", actor: "Sam Neill", actress: "Laura Dern", soundtrack: "Theme from Jurassic Park (John Williams)", year: 1993, category: "Aventura", posterHex: "from-green-950 to-stone-955 text-red-500" },
  { id: 28, title: "El Resplandor", director: "Stanley Kubrick", actor: "Jack Nicholson", actress: "Shelley Duvall", soundtrack: "The Shining (Wendy Carlos)", year: 1980, category: "Terror", posterHex: "from-red-950 to-orange-955 text-yellow-600" },
  { id: 29, title: "Casino Royale", director: "Martin Campbell", actor: "Daniel Craig", actress: "Eva Green", soundtrack: "You Know My Name (Chris Cornell)", year: 2006, category: "Acción", posterHex: "from-slate-900 to-zinc-950 text-amber-400" },
  { id: 30, title: "Django Desencadenado", director: "Quentin Tarantino", actor: "Jamie Foxx", actress: "Kerry Washington", soundtrack: "Ancora Qui (Ennio Morricone)", year: 2012, category: "Western", posterHex: "from-red-950 to-stone-950 text-yellow-500" },
  { id: 31, title: "El Show de Truman", director: "Peter Weir", actor: "Jim Carrey", actress: "Laura Linney", soundtrack: "Truman Sleeps (Philip Glass)", year: 1998, category: "Drama", posterHex: "from-cyan-900 to-amber-955 text-amber-200" },
  { id: 32, title: "Malditos Bastardos", director: "Quentin Tarantino", actor: "Brad Pitt", actress: "Mélanie Laurent", soundtrack: "Un Amico (Ennio Morricone)", year: 2009, category: "Guerra", posterHex: "from-zinc-900 to-stone-900 text-red-600" },
  { id: 33, title: "Kill Bill: Vol. 1", director: "Quentin Tarantino", actor: "David Carradine", actress: "Uma Thurman", soundtrack: "Battle Without Honor (Hotei)", year: 2003, category: "Acción", posterHex: "from-yellow-950 to-black text-yellow-400" },
  { id: 34, title: "Alien", director: "Ridley Scott", actor: "Tom Skerritt", actress: "Sigourney Weaver", soundtrack: "Main Title (Jerry Goldsmith)", year: 1979, category: "Terror", posterHex: "from-emerald-950 to-zinc-955 text-gray-400" },
  { id: 35, title: "El Rey León", director: "Roger Allers", actor: "Matthew Broderick", actress: "Moira Kelly", soundtrack: "Circle of Life (Elton John)", year: 1994, category: "Animación", posterHex: "from-orange-900 to-red-950 text-yellow-500" },
  { id: 36, title: "Ciudad de Dios", director: "Fernando Meirelles", actor: "Alexandre Rodrigues", actress: "Alice Braga", soundtrack: "Convite Para Vida (Antonio Pinto)", year: 2002, category: "Drama", posterHex: "from-yellow-950 to-amber-900 text-orange-400" },
  { id: 37, title: "Memento", director: "Christopher Nolan", actor: "Guy Pearce", actress: "Carrie-Anne Moss", soundtrack: "Opening Theme (David Julyan)", year: 2000, category: "Suspense", posterHex: "from-stone-900 to-zinc-955 text-slate-300" },
  { id: 38, title: "El Sexto Sentido", director: "M. Night Shyamalan", actor: "Bruce Willis", actress: "Toni Collette", soundtrack: "Run to the Church (James Newton Howard)", year: 1999, category: "Misterio", posterHex: "from-violet-950 to-neutral-950 text-stone-200" },
  { id: 39, title: "Amadeus", director: "Milos Forman", actor: "Tom Hulce", actress: "Elizabeth Berridge", soundtrack: "Requiem K. 626 (W.A. Mozart)", year: 1984, category: "Musical", posterHex: "from-purple-950 to-stone-900 text-yellow-400" },
  { id: 40, title: "Cisne Negro", director: "Darren Aronofsky", actor: "Vincent Cassel", actress: "Natalie Portman", soundtrack: "A Swan Song (Clint Mansell)", year: 2010, category: "Drama", posterHex: "from-zinc-900 to-stone-955 text-pink-300" },
  { id: 41, title: "Shutter Island", director: "Martin Scorsese", actor: "Leonardo DiCaprio", actress: "Michelle Williams", soundtrack: "Symphony No. 3 (K. Penderecki)", year: 2010, category: "Misterio", posterHex: "from-slate-900 to-neutral-955 text-emerald-400" },
  { id: 42, title: "El Gran Hotel Budapest", director: "Wes Anderson", actor: "Ralph Fiennes", actress: "Saoirse Ronan", soundtrack: "s'Rothe-Zäuerli (Öse Schuppel)", year: 2014, category: "Comedia", posterHex: "from-pink-950 to-rose-900 text-pink-200" },
  { id: 43, title: "Blade Runner 2049", director: "Denis Villeneuve", actor: "Ryan Gosling", actress: "Ana de Armas", soundtrack: "Rain (Hans Zimmer)", year: 2017, category: "Ciencia Ficción", posterHex: "from-indigo-950 to-pink-955 text-cyan-400" },
  { id: 44, title: "Roma", director: "Alfonso Cuarón", actor: "Yalitza Aparicio", actress: "Marina de Tavira", soundtrack: "Te Solté la Rienda (J. Alfredo)", year: 2018, category: "Drama", posterHex: "from-zinc-700 to-neutral-900 text-neutral-100" },
  { id: 45, title: "La Gran Estafa", director: "Steven Soderbergh", actor: "George Clooney", actress: "Julia Roberts", soundtrack: "Clair de Lune (Debussy)", year: 2001, category: "Comedia", posterHex: "from-blue-950 to-stone-900 text-amber-200" },
  { id: 46, title: "La Naranja Mecánica", director: "Stanley Kubrick", actor: "Malcolm McDowell", actress: "Adrienne Corri", soundtrack: "William Tell (Wendy Carlos)", year: 1971, category: "Disto", posterHex: "from-orange-950 to-neutral-955 text-orange-500" },
  { id: 47, title: "Eterno Resplandor", director: "Michel Gondry", actor: "Jim Carrey", actress: "Kate Winslet", soundtrack: "Everybody's Got to Learn (Beck)", year: 2004, category: "Drama", posterHex: "from-blue-900 to-rose-955 text-cyan-300" },
  { id: 48, title: "La milla verde", director: "Frank Darabont", actor: "Tom Hanks", actress: "Patricia Clarkson", soundtrack: "The Green Mile Theme (Thomas Newman)", year: 1999, category: "Drama", posterHex: "from-emerald-950 to-stone-905 text-emerald-100" },
  { id: 49, title: "Monstruos S.A.", director: "Pete Docter", actor: "John Goodman", actress: "Mary Gibbs", soundtrack: "If I Didn't Have You (Randy)", year: 2001, category: "Animación", posterHex: "from-teal-900 to-sky-955 text-teal-300" },
  { id: 50, title: "El Viaje de Chihiro", director: "Hayao Miyazaki", actor: "Rumi Hiiragi", actress: "Mari Natsuki", soundtrack: "One Summer's Day (Joe Hisaishi)", year: 2001, category: "Fantasía", posterHex: "from-rose-950 to-amber-955 text-yellow-300" },
  { id: 51, title: "Dune", director: "Denis Villeneuve", actor: "Timothée Chalamet", actress: "Zendaya", soundtrack: "Leaving Caladan (Hans Zimmer)", year: 2021, category: "Ciencia Ficción", posterHex: "from-stone-850 to-yellow-955 text-amber-500" },
  { id: 52, title: "Cinema Paradiso", director: "Giuseppe Tornatore", actor: "Salvatore Cascio", actress: "Brigitte Fossey", soundtrack: "Love Theme (Ennio Morricone)", year: 1888, category: "Drama", posterHex: "from-amber-900 to-indigo-955 text-amber-300" }
];

export const BARALA_21_CARTAS: Card[] = [
  { id: "10H", name: "10 de Corazones", suite: "hearts", value: "10", imageUrl: "♥" },
  { id: "JH", name: "Jota de Corazones", suite: "hearts", value: "J", imageUrl: "♥" },
  { id: "QH", name: "Reina de Corazones", suite: "hearts", value: "Q", imageUrl: "♥" },
  { id: "KH", name: "Rey de Corazones", suite: "hearts", value: "K", imageUrl: "♥" },
  { id: "AH", name: "As de Corazones (Cargada en Sobres)", suite: "hearts", value: "A", imageUrl: "♥" },
  
  { id: "10D", name: "10 de Diamantes", suite: "diamonds", value: "10", imageUrl: "♦" },
  { id: "JD", name: "Jota de Diamantes", suite: "diamonds", value: "J", imageUrl: "♦" },
  { id: "QD", name: "Reina de Diamantes", suite: "diamonds", value: "Q", imageUrl: "♦" },
  { id: "KD", name: "Rey de Diamantes", suite: "diamonds", value: "K", imageUrl: "♦" },
  { id: "AD", name: "As de Diamantes", suite: "diamonds", value: "A", imageUrl: "♦" },

  { id: "10S", name: "10 de Espadas", suite: "spades", value: "10", imageUrl: "♠" },
  { id: "JS", name: "Jota de Espadas", suite: "spades", value: "J", imageUrl: "♠" },
  { id: "QS", name: "Reina de Espadas", suite: "spades", value: "Q", imageUrl: "♠" },
  { id: "KS", name: "Rey de Espadas", suite: "spades", value: "K", imageUrl: "♠" },
  { id: "AS", name: "As de Espadas", suite: "spades", value: "A", imageUrl: "♠" },

  { id: "10C", name: "10 de Tréboles", suite: "clubs", value: "10", imageUrl: "♣" },
  { id: "JC", name: "Jota de Tréboles", suite: "clubs", value: "J", imageUrl: "♣" },
  { id: "QC", name: "Reina de Tréboles", suite: "clubs", value: "Q", imageUrl: "♣" },
  { id: "KC", name: "Rey de Tréboles", suite: "clubs", value: "K", imageUrl: "♣" },
  { id: "AC", name: "As de Tréboles", suite: "clubs", value: "A", imageUrl: "♣" },
  { id: "7H", name: "7 de Corazones", suite: "hearts", value: "7", imageUrl: "♥" }
];

export const SPOTIFY_SONGS: string[] = [
  "Bohemian Rhapsody - Queen", "Hotel California - Eagles", "Imagine - John Lennon", "Billie Jean - Michael Jackson", "Smells Like Teen Spirit - Nirvana",
  "Sweet Child O' Mine - Guns N' Roses", "Comfortably Numb - Pink Floyd", "Superstition - Stevie Wonder", "Purple Rain - Prince", "Let It Be - The Beatles",
  "Yesterday - The Beatles", "All Along the Watchtower - Jimi Hendrix", "Like a Rolling Stone - Bob Dylan", "What's Going On - Marvin Gaye", "Born to Run - Bruce Springsteen",
  "Respect - Aretha Franklin", "Good Vibrations - The Beach Boys", "Stairway to Heaven - Led Zeppelin", "Whole Lotta Love - Led Zeppelin", "Hey Jude - The Beatles",
  "Heroes - David Bowie", "London Calling - The Clash", "Creep - Radiohead", "Smells Like Teen Spirit - Nirvana", "One - U2",
  "Lose Yourself - Eminem", "Stan - Eminem", "Rolling in the Deep - Adele", "Someone Like You - Adele", "Bad Romance - Lady Gaga",
  "Thriller - Michael Jackson", "Vogue - Madonna", "Pride - U2", "In the End - Linkin Park", "Numb - Linkin Park",
  "Fix You - Coldplay", "Yellow - Coldplay", "Viva la Vida - Coldplay", "Wonderwall - Oasis", "Clocks - Coldplay",
  "Toxic - Britney Spears", "Say My Name - Destiny's Child", "Rehab - Amy Winehouse", "Hey Ya! - OutKast", "Crazy in Love - Beyoncé",
  "Seven Nation Army - The White Stripes", "Uptown Funk - Mark Ronson ft. Bruno Mars", "Shape of You - Ed Sheeran", "Stay With Me - Sam Smith", "Bad Guy - Billie Eilish"
];

export const ESP32_FIRMWARE_SOURCE = `/**
 * WAVESHARE ESP32-S3-TOUCH-AMOLED-2.06" MAGE-LINK ULTRA COMPANION FIRMWARE
 * ----------------------------------------------------------------------
 * Displays low-luminance predictive cues, vibrates tactile codes, and executes
 * wrist gesture IMU parsing (QMI6658/8658) with strict state security engine.
 */

#include <Arduino.h>
#include <Wire.h>
#include <NimBLEDevice.h> // Async Pila NimBLE (50% menos consumo de batería)

// Pins specific to Waveshare 2.06" AMOLED Layout
#define PIN_AXP_SDA     4
#define PIN_AXP_SCL     5
#define PIN_HAPTIC      45 // ERM Haptic vibration motor GPIO
#define STATUS_LED      38

// Standard Bluetooth BLE Custom Setup
#define SERVICE_UUID           "6e400001-b5a3-f393-e0a9-e50e24dcca9e"
#define CHARACTERISTIC_UUID_RX "6e400002-b5a3-f393-e0a9-e50e24dcca9e"

// XOR crypt key (Salt 0x5a shared secret)
const uint8_t CRYPTO_SALT = 0x5A;

// Watch States
enum WatchMode {
  MODE_CALLE,       // Shows normal time face. BLE offline. Full innocent.
  MODE_SLEEP,       // Deep Sleep state (<15uA)
  MODE_SHOW         // AMOLED true black. BLE live. IMU tracking gestures.
};

WatchMode currentMode = MODE_CALLE;
String textBuffer = "ESPERANDO...";
String rawRxAccumulator = "";
bool screenOn = false;
unsigned long lastActivity = 0;
unsigned long screenTimer = 0;

// NimBLE Callbacks
class ServerCallbacks : public NimBLEServerCallbacks {
  void onConnect(NimBLEServer* pServer) {
    // Bluetooth connected sutil haptic click
    vibrate(250);
  }
  void onDisconnect(NimBLEServer* pServer) {
    NimBLEDevice::startAdvertising();
  }
};

class CharCallbacks : public NimBLECharacteristicCallbacks {
  void onWrite(NimBLECharacteristic* pChar) {
    std::string rx = pChar->getValue();
    if (rx.length() > 0) {
      for (size_t i = 0; i < rx.length(); i++) {
        uint8_t decrypt = (uint8_t)rx[i] ^ CRYPTO_SALT;
        if (decrypt == 0x00) { // EOF Symbol
          textBuffer = rawRxAccumulator;
          rawRxAccumulator = "";
          // Silent confirmation vibrate: double quick impulse
          vibrate(80);
          delay(80);
          vibrate(80);
        } else {
          rawRxAccumulator += (char)decrypt;
        }
      }
    }
  }
};

void vibrate(int ms) {
  digitalWrite(PIN_HAPTIC, HIGH);
  delay(ms);
  digitalWrite(PIN_HAPTIC, LOW);
}

void setup() {
  Serial.begin(115200);
  pinMode(PIN_HAPTIC, OUTPUT);
  pinMode(STATUS_LED, OUTPUT);
  digitalWrite(PIN_HAPTIC, LOW);
  
  // Initialize I2C and PMIC configs
  Wire.begin(PIN_AXP_SDA, PIN_AXP_SCL);
  
  // Power Saving: set CPU Clock speed down to 80MHz to multiply battery life
  setCpuFrequencyMhz(80);
  
  // Initialise NimBLE Server
  NimBLEDevice::init("MAGE-WATCH");
  NimBLEServer* pServer = NimBLEDevice::createServer();
  pServer->setCallbacks(new ServerCallbacks());
  NimBLEService* pService = pServer->createService(SERVICE_UUID);
  NimBLECharacteristic* pChar = pService->createCharacteristic(
    CHARACTERISTIC_UUID_RX,
    NIMBLE_PROPERTY::WRITE
  );
  pChar->setCallbacks(new CharCallbacks());
  pService->start();
  pServer->getAdvertising()->start();
  
  vibrate(100);
}

void loop() {
  // Deep sleep timer trigger
  if (currentMode == MODE_CALLE && (millis() - lastActivity > 60000)) {
    // Go into Deep Sleep (<15uA)
    // Wake up with single click of POWER PIN. Button BOOT hold (>2s) enters Mode Show.
  }
  
  if (currentMode == MODE_SHOW) {
    // Monitor QMI8658 Gyro & Accel
    // Read registers via I2C...
    // Gesto 1 (Mirar): Pitch > 60 y Roll entre 30 y 75 -> Render en ambar/gris.
    // Gesto 2 (Avance Flick): dRoll/dt > Threshold -> Next page line.
    // Left-to-right swipe (capacitive FT3168) -> Turn display on for 4 seconds.
  }
  delay(15);
}`;

export const AI_MAGIC_COMPILE_PROMPT = `As an expert ESP32 embedded researcher, compile an optimized C++ sketch for Waveshare ESP32-S3-AMOLED-2.06.
Verify that:
1. NimBLE libraries are used instead of heavy classic Bluetooth to save 50% battery.
2. The dynamic XOR crypt engine uses salt 0x5A to verify packet consistency.
3. ERM haptic pulses are output using paced GPIO 45.
4. Accelerometer states read via I2C QMI8658 map Pitch > 60 and Roll [30-75] for waking the AMOLED display.`;


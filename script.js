// (Il database degli eventi "eventsDB" si trova ora nel file separato events.js)

// Funzione che capisce quale evento caricare leggendo l'URL
function getSourceConfig() {
    // Gestione errore se il file events.js non è stato caricato sul server o è in cache
    let db = typeof eventsDB !== 'undefined' ? eventsDB : null;
    if (!db) {
        console.error("ATTENZIONE: Il file events.js non è stato caricato! Uso un fallback di emergenza.");
        db = {
            'evento1': {
                dash: "https://dcb-tm-livedazn.dazn.ticdn.it/@st%3D1782751505~exp%3D1782837905~acl%3D%2F*~id%3Dc455b0b765db~data%3Dcountry%3Dit%23path%3D1s%2C1d%23hashp%3Ddf9f2f62ae18f17420870685b827ac7e4a63fef34e5073758a551d9ba60d7af6%23wm%3D0~hmac%3D2e4ba42953c5bde7f8e43d56faefdf19ab65ba524d186cbe81f67c896b8fb5cf/nzfx1csw33a51f9iastxat7mn/web/stream.mpd?channel=1646&mta=it&outlet=dazn-italy&plang=it",
                drm: { clearkey: [{ keyId: '04d60b26f0de512099b5015661768645', key: '6b0178975841d7c5fc54f8dae50658a6' }] }
            }
        };
    }

    // 1. Prova a leggere il percorso nell'URL (es: "acbs.gt.tc/evento2")
    let path = window.location.pathname.replace(/^\/|\/$/g, '');
    
    // 2. Prova a leggere un eventuale parametro (es: "acbs.gt.tc/?id=evento2")
    const urlParams = new URLSearchParams(window.location.search);
    const queryId = urlParams.get('id');

    // Usa il parametro se esiste, altrimenti usa il percorso
    let eventKey = queryId || path;
    
    // Se l'utente visita la pagina principale senza niente
    if (!eventKey || eventKey === '' || eventKey === 'index.html') {
        eventKey = 'evento1';
    }

    // Se l'utente digita un url non configurato
    if (!db[eventKey]) {
        console.warn(`Evento "${eventKey}" non trovato nel database. Ritorno a evento1.`);
        eventKey = 'evento1';
    }

    console.log(`Sto caricando il flusso per: ${eventKey}`);
    return db[eventKey];
}

// Inizializza Bitmovin Player
function initPlayer() {
    const playerConfig = {
        key: "22d16b93-387d-403f-950f-889436b9b2fe", 
        playback: {
            autoplay: true,
            muted: false
        },
        style: {
            width: '100%',
            height: '100%'
        }
    };

    // Ottiene i link video corretti in base a cosa c'è scritto nell'URL!
    const sourceConfig = getSourceConfig();

    const container = document.getElementById('player-container');
    const player = new bitmovin.player.Player(container, playerConfig);

    player.load(sourceConfig).then(() => {
        console.log('Flusso caricato ed avviato correttamente.');
    }).catch((error) => {
        console.error('Errore durante l\'inizializzazione del flusso:', error);
    });
}

// Il file viene caricato dinamicamente, quindi il DOM è già pronto
initPlayer();

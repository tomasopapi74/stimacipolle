// Oggetto per memorizzare tutti i dati della sessione corrente
let misurazione = {
    tara: 0,
    pesoLordo: 0,
    pesoNetto: 0,
    bulbiBuoni: 0,
    bulbiScarto: 0,
    bulbiTotali: 0,
    bulbiPerKg: 0,
    pnc: 0
};

// Navigazione tra le schermate
function vaiAStep(stepTarget) {
    // Prima di andare allo Step 4, eseguiamo i calcoli
    if (stepTarget === 4) {
        calcolaIndicatori();
    }
    // Prima di andare allo Step 5, aggiorniamo il riepilogo
    if (stepTarget === 5) {
        aggiornaRiepilogo();
    }

    // Nascondi tutte le schermate
    document.querySelectorAll('.schermata').forEach(el => {
        el.classList.remove('attiva');
    });
    // Mostra quella richiesta
    document.getElementById('step-' + stepTarget).classList.add('attiva');
}

// Calcolo live dello Step 2
function calcolaNetto() {
    misurazione.tara = parseFloat(document.getElementById('input-tara').value) || 0;
    misurazione.pesoLordo = parseFloat(document.getElementById('input-lordo').value) || 0;
    
    misurazione.pesoNetto = misurazione.pesoLordo - misurazione.tara;
    // Evitiamo numeri negativi
    if (misurazione.pesoNetto < 0) misurazione.pesoNetto = 0; 

    document.getElementById('display-netto').innerText = misurazione.pesoNetto.toFixed(2);
}

// Logica di conteggio per lo Step 3
function aggiungi(tipo) {
    if (tipo === 'buoni') misurazione.bulbiBuoni++;
    if (tipo === 'scarto') misurazione.bulbiScarto++;
    
    misurazione.bulbiTotali = misurazione.bulbiBuoni + misurazione.bulbiScarto;
    
    document.getElementById('cont-buoni').innerText = misurazione.bulbiBuoni;
    document.getElementById('cont-scarto').innerText = misurazione.bulbiScarto;
    document.getElementById('cont-totali').innerText = misurazione.bulbiTotali;

    if (navigator.vibrate) navigator.vibrate(50);
}

// Calcoli per lo Step 4
function calcolaIndicatori() {
    // Bulbi per Kg = Totali / Peso Netto
    if (misurazione.pesoNetto > 0) {
        misurazione.bulbiPerKg = misurazione.bulbiTotali / misurazione.pesoNetto;
    } else {
        misurazione.bulbiPerKg = 0;
    }

    // PNC = (Scarto / Totali) * 100
    if (misurazione.bulbiTotali > 0) {
        misurazione.pnc = (misurazione.bulbiScarto / misurazione.bulbiTotali) * 100;
    } else {
        misurazione.pnc = 0;
    }

    document.getElementById('ind-bulbikg').innerText = misurazione.bulbiPerKg.toFixed(1);
    document.getElementById('ind-pnc').innerText = misurazione.pnc.toFixed(1);
}

// Riempimento finale Step 5
function aggiornaRiepilogo() {
    document.getElementById('riep-netto').innerText = misurazione.pesoNetto.toFixed(2);
    document.getElementById('riep-bulbikg').innerText = misurazione.bulbiPerKg.toFixed(1);
    document.getElementById('riep-pnc').innerText = misurazione.pnc.toFixed(1);
    document.getElementById('riep-buoni').innerText = misurazione.bulbiBuoni;
    document.getElementById('riep-scarto').innerText = misurazione.bulbiScarto;
    document.getElementById('riep-totali').innerText = misurazione.bulbiTotali;
}

// Azzera tutto e ricomincia
function resetTutto() {
    if (confirm("Iniziare una nuova misurazione? I dati attuali andranno persi.")) {
        misurazione = { tara: 0, pesoLordo: 0, pesoNetto: 0, bulbiBuoni: 0, bulbiScarto: 0, bulbiTotali: 0, bulbiPerKg: 0, pnc: 0 };
        
        // Svuota input e contatori a schermo
        document.getElementById('input-tara').value = '';
        document.getElementById('input-lordo').value = '';
        document.getElementById('display-netto').innerText = '0.00';
        document.getElementById('cont-buoni').innerText = '0';
        document.getElementById('cont-scarto').innerText = '0';
        document.getElementById('cont-totali').innerText = '0';
        
        vaiAStep(1);
    }
}
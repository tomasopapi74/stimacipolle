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

function vaiAStep(stepTarget) {
    // Forza il calcolo dei totali e degli indicatori quando vai allo step 4
    if (stepTarget === 4) {
        calcolaTotaleBulbi();
        calcolaIndicatori();
    }
    // Aggiorna il riepilogo quando vai allo step 5
    if (stepTarget === 5) {
        aggiornaRiepilogo();
    }

    // Nasconde tutte le schermate e mostra quella attiva
    document.querySelectorAll('.schermata').forEach(el => {
        el.classList.remove('attiva');
    });
    document.getElementById('step-' + stepTarget).classList.add('attiva');
}

function calcolaNetto() {
    misurazione.tara = parseFloat(document.getElementById('input-tara').value) || 0;
    misurazione.pesoLordo = parseFloat(document.getElementById('input-lordo').value) || 0;
    
    misurazione.pesoNetto = misurazione.pesoLordo - misurazione.tara;
    if (misurazione.pesoNetto < 0) misurazione.pesoNetto = 0; 

    document.getElementById('display-netto').innerText = misurazione.pesoNetto.toFixed(2);
}

// NUOVA FUNZIONE: Calcola i totali in automatico mentre scrivi
function calcolaTotaleBulbi() {
    misurazione.bulbiBuoni = parseInt(document.getElementById('input-buoni').value) || 0;
    misurazione.bulbiScarto = parseInt(document.getElementById('input-scarto').value) || 0;
    
    misurazione.bulbiTotali = misurazione.bulbiBuoni + misurazione.bulbiScarto;
    
    document.getElementById('cont-totali').innerText = misurazione.bulbiTotali;
}

function calcolaIndicatori() {
    if (misurazione.pesoNetto > 0) {
        misurazione.bulbiPerKg = misurazione.bulbiTotali / misurazione.pesoNetto;
    } else {
        misurazione.bulbiPerKg = 0;
    }

    if (misurazione.bulbiTotali > 0) {
        misurazione.pnc = (misurazione.bulbiScarto / misurazione.bulbiTotali) * 100;
    } else {
        misurazione.pnc = 0;
    }

    document.getElementById('ind-bulbikg').innerText = misurazione.bulbiPerKg.toFixed(1);
    document.getElementById('ind-pnc').innerText = misurazione.pnc.toFixed(1);
}

function aggiornaRiepilogo() {
    document.getElementById('riep-netto').innerText = misurazione.pesoNetto.toFixed(2);
    document.getElementById('riep-bulbikg').innerText = misurazione.bulbiPerKg.toFixed(1);
    document.getElementById('riep-pnc').innerText = misurazione.pnc.toFixed(1);
    document.getElementById('riep-buoni').innerText = misurazione.bulbiBuoni;
    document.getElementById('riep-scarto').innerText = misurazione.bulbiScarto;
    document.getElementById('riep-totali').innerText = misurazione.bulbiTotali;
}

// AGGIORNATO: Svuota le nuove caselle di testo
function resetTutto() {
    if (confirm("Iniziare una nuova misurazione? I dati attuali andranno persi.")) {
        misurazione = { tara: 0, pesoLordo: 0, pesoNetto: 0, bulbiBuoni: 0, bulbiScarto: 0, bulbiTotali: 0, bulbiPerKg: 0, pnc: 0 };
        
        document.getElementById('input-tara').value = '';
        document.getElementById('input-lordo').value = '';
        document.getElementById('input-buoni').value = '';
        document.getElementById('input-scarto').value = '';
        
        document.getElementById('display-netto').innerText = '0.00';
        document.getElementById('cont-totali').innerText = '0';
        
        vaiAStep(1);
    }
}

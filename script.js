let misurazione = inizializzaMisurazione();
let storicoSalvataggi = JSON.parse(localStorage.getItem('stimacipolle_storico')) || [];
let idDettaglioAttivo = null;

function inizializzaMisurazione() {
    return {
        id: Date.now(),
        data: new Date().toISOString().split('T')[0],
        coltivatore: '',
        codice: '',
        calibro: '', // Nuova variabile
        tara: 0, pesoLordo: 0, pesoNetto: 0,
        bulbiBuoni: 0, bulbiScarto: 0, bulbiTotali: 0,
        bulbiPerKg: 0, pnc: 0,
        commento: '',
        foto: null
    };
}

document.getElementById('input-data').value = misurazione.data;

// Gestione selezione calibro
function selezionaCalibro(valore) {
    misurazione.calibro = valore;
    document.querySelectorAll('.btn-calibro').forEach(btn => btn.classList.remove('selezionato'));
    document.getElementById('btn-calibro-' + valore.replace('.', '')).classList.add('selezionato');
}

function vaiAStep(stepTarget) {
    // Calcoli spostati in avanti di 1 passaggio
    if (stepTarget === 5) {
        calcolaTotaleBulbi();
        calcolaIndicatori();
    }
    if (stepTarget === 6) aggiornaRiepilogo();

    // Raccoglie i dati anagrafici dal Passaggio 0
    if (stepTarget > 0) {
        misurazione.data = document.getElementById('input-data').value;
        misurazione.coltivatore = document.getElementById('input-coltivatore').value;
        misurazione.codice = document.getElementById('input-codice').value;
    }

    document.querySelectorAll('.schermata').forEach(el => el.classList.remove('attiva'));
    document.getElementById('step-' + stepTarget).classList.add('attiva');
}

function calcolaNetto() {
    misurazione.tara = parseFloat(document.getElementById('input-tara').value) || 0;
    misurazione.pesoLordo = parseFloat(document.getElementById('input-lordo').value) || 0;
    misurazione.pesoNetto = misurazione.pesoLordo - misurazione.tara;
    if (misurazione.pesoNetto < 0) misurazione.pesoNetto = 0; 
    document.getElementById('display-netto').innerText = misurazione.pesoNetto.toFixed(2);
}

function calcolaTotaleBulbi() {
    misurazione.bulbiBuoni = parseInt(document.getElementById('input-buoni').value) || 0;
    misurazione.bulbiScarto = parseInt(document.getElementById('input-scarto').value) || 0;
    misurazione.bulbiTotali = misurazione.bulbiBuoni + misurazione.bulbiScarto;
    document.getElementById('cont-totali').innerText = misurazione.bulbiTotali;
}

function calcolaIndicatori() {
    misurazione.bulbiPerKg = misurazione.pesoNetto > 0 ? (misurazione.bulbiTotali / misurazione.pesoNetto) : 0;
    misurazione.pnc = misurazione.bulbiTotali > 0 ? ((misurazione.bulbiScarto / misurazione.bulbiTotali) * 100) : 0;
    document.getElementById('ind-bulbikg').innerText = misurazione.bulbiPerKg.toFixed(1);
    document.getElementById('ind-pnc').innerText = misurazione.pnc.toFixed(1);
}

function aggiornaRiepilogo() {
    document.getElementById('riep-data').innerText = misurazione.data;
    document.getElementById('riep-coltivatore').innerText = misurazione.coltivatore || '-';
    document.getElementById('riep-codice').innerText = misurazione.codice || '-';
    document.getElementById('riep-calibro').innerText = misurazione.calibro || '-'; // Mostra il calibro
    document.getElementById('riep-netto').innerText = misurazione.pesoNetto.toFixed(2);
    document.getElementById('riep-bulbikg').innerText = misurazione.bulbiPerKg.toFixed(1);
    document.getElementById('riep-pnc').innerText = misurazione.pnc.toFixed(1);
    document.getElementById('riep-buoni').innerText = misurazione.bulbiBuoni;
    document.getElementById('riep-scarto').innerText = misurazione.bulbiScarto;
    document.getElementById('riep-totali').innerText = misurazione.bulbiTotali;
}

function salvaDati() {
    const index = storicoSalvataggi.findIndex(s => s.id === misurazione.id);
    const copiaDati = JSON.parse(JSON.stringify(misurazione)); 
    
    if (index !== -1) {
        storicoSalvataggi[index] = copiaDati;
    } else {
        storicoSalvataggi.push(copiaDati); 
    }
    
    localStorage.setItem('stimacipolle_storico', JSON.stringify(storicoSalvataggi));
    alert("Misurazione salvata con successo nello Storico!");
}

function condividi(metodo) {
    let testo = `Stimacipolle - Campione: ${misurazione.codice}\nData: ${misurazione.data}\nColtivatore: ${misurazione.coltivatore}\nCalibro: ${misurazione.calibro}\n\n`;
    testo += `Peso Netto: ${misurazione.pesoNetto.toFixed(2)} Kg\nBulbi x Kg: ${misurazione.bulbiPerKg.toFixed(1)}\nPNC: ${misurazione.pnc.toFixed(1)}%\n\n`;
    testo += `Buoni: ${misurazione.bulbiBuoni} | Scarto: ${misurazione.bulbiScarto} | Totali: ${misurazione.bulbiTotali}`;
    
    let testoCodificato = encodeURIComponent(testo);
    
    if (metodo === 'whatsapp') {
        window.open(`https://wa.me/?text=${testoCodificato}`);
    } else if (metodo === 'email') {
        window.open(`mailto:?subject=Analisi Campione ${misurazione.codice}&body=${testoCodificato}`);
    }
}

function mostraStorico() {
    document.querySelectorAll('.schermata').forEach(el => el.classList.remove('attiva'));
    document.getElementById('step-storico').classList.add('attiva');
    
    const contenitore = document.getElementById('lista-storico');
    contenitore.innerHTML = '';

    if (storicoSalvataggi.length === 0) {
        contenitore.innerHTML = '<p>Nessun salvataggio presente.</p>';
        return;
    }

    [...storicoSalvataggi].reverse().forEach(item => {
        let div = document.createElement('div');
        div.className = 'card-storico';
        div.innerHTML = `<div><strong>${item.codice || 'N/D'}</strong><br>${item.data} - ${item.coltivatore}</div>
                         <div style="text-align:right">PNC: ${item.pnc.toFixed(1)}%<br>${item.pesoNetto.toFixed(2)} Kg</div>`;
        div.onclick = () => apriDettaglio(item.id);
        contenitore.appendChild(div);
    });
}

function apriDettaglio(id) {
    idDettaglioAttivo = id;
    const item = storicoSalvataggi.find(s => s.id === id);
    
    document.querySelectorAll('.schermata').forEach(el => el.classList.remove('attiva'));
    document.getElementById('step-dettaglio').classList.add('attiva');

    document.getElementById('contenuto-dettaglio').innerHTML = `
        <ul class="riepilogo-lista">
            <li>Data: <span>${item.data}</span></li>
            <li>Coltivatore: <span>${item.coltivatore}</span></li>
            <li>Campione: <span>${item.codice}</span></li>
            <li>Calibro: <span>${item.calibro || '-'}</span></li>
            <li>Peso Netto: <span>${item.pesoNetto.toFixed(2)} Kg</span></li>
            <li>Bulbi per Kg: <span>${item.bulbiPerKg.toFixed(1)}</span></li>
            <li>PNC (Scarto): <span>${item.pnc.toFixed(1)}%</span></li>
            <li>Bulbi Buoni: <span>${item.bulbiBuoni}</span></li>
            <li>Bulbi Scarto: <span>${item.bulbiScarto}</span></li>
            <li>Bulbi Totali: <span>${item.bulbiTotali}</span></li>
        </ul>
    `;

    document.getElementById('input-commento').value = item.commento || '';
    const imgPreview = document.getElementById('preview-foto');
    if (item.foto) {
        imgPreview.src = item.foto;
        imgPreview.style.display = 'block';
    } else {
        imgPreview.style.display = 'none';
        imgPreview.src = '';
    }
}

function eliminaSalvataggio() {
    if(confirm("Sei sicuro di voler eliminare definitivamente questo salvataggio?")) {
        storicoSalvataggi = storicoSalvataggi.filter(s => s.id !== idDettaglioAttivo);
        localStorage.setItem('stimacipolle_storico', JSON.stringify(storicoSalvataggi));
        mostraStorico();
    }
}

function caricaInModifica() {
    if(confirm("Vuoi modificare questo campione? I dati attualmente non salvati andranno persi.")) {
        const item = storicoSalvataggi.find(s => s.id === idDettaglioAttivo);
        misurazione = JSON.parse(JSON.stringify(item)); 
        
        document.getElementById('input-data').value = misurazione.data;
        document.getElementById('input-coltivatore').value = misurazione.coltivatore || '';
        document.getElementById('input-codice').value = misurazione.codice || '';
        
        // Ripristina la selezione visiva del calibro
        document.querySelectorAll('.btn-calibro').forEach(btn => btn.classList.remove('selezionato'));
        if(misurazione.calibro) {
            document.getElementById('btn-calibro-' + misurazione.calibro.replace('.', '')).classList.add('selezionato');
        }

        document.getElementById('input-tara').value = misurazione.tara || '';
        document.getElementById('input-lordo').value = misurazione.pesoLordo || '';
        document.getElementById('display-netto').innerText = misurazione.pesoNetto.toFixed(2);
        document.getElementById('input-buoni').value = misurazione.bulbiBuoni || '';
        document.getElementById('input-scarto').value = misurazione.bulbiScarto || '';
        document.getElementById('cont-totali').innerText = misurazione.bulbiTotali;
        
        vaiAStep(0);
    }
}

function salvaExtra() {
    const item = storicoSalvataggi.find(s => s.id === idDettaglioAttivo);
    item.commento = document.getElementById('input-commento').value;
    localStorage.setItem('stimacipolle_storico', JSON.stringify(storicoSalvataggi));
}

function caricaFoto(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const item = storicoSalvataggi.find(s => s.id === idDettaglioAttivo);
        item.foto = e.target.result;
        localStorage.setItem('stimacipolle_storico', JSON.stringify(storicoSalvataggi));
        
        const imgPreview = document.getElementById('preview-foto');
        imgPreview.src = item.foto;
        imgPreview.style.display = 'block';
    };
    reader.readAsDataURL(file);
}

function resetTutto() {
    if (confirm("Iniziare una nuova misurazione?")) {
        misurazione = inizializzaMisurazione();
        
        document.getElementById('input-data').value = misurazione.data;
        document.getElementById('input-coltivatore').value = '';
        document.getElementById('input-codice').value = '';
        
        // Reset pulsanti calibro
        document.querySelectorAll('.btn-calibro').forEach(btn => btn.classList.remove('selezionato'));

        document.getElementById('input-tara').value = '';
        document.getElementById('input-lordo').value = '';
        document.getElementById('input-buoni').value = '';
        document.getElementById('input-scarto').value = '';
        document.getElementById('display-netto').innerText = '0.00';
        document.getElementById('cont-totali').innerText = '0';
        
        vaiAStep(0);
    }
}

/* ==========================================================
   VIVERO
   Ecosistema de Aprendizaje Socioemocional

   Autor: Jeason Mateus
   Año: 2026
========================================================== */

/* ==========================================================
   CARGA INICIAL
========================================================== */

document.addEventListener('DOMContentLoaded', async () => {
    const data = await fetch('datos.json').then(res => res.json());

// Selectores
    const selCurso = document.getElementById('select-curso');
    const selGrupo = document.getElementById('select-etario');
    const selHSE = document.getElementById('select-hse');
    const selRelacionada = document.getElementById('select-relacionada');

    // Contenido dinámico
    const contentLayout = document.getElementById('content-layout');
    const emptyState = document.getElementById('empty-state');

    const cursos = [...new Set(data.map(i => i["Curso de Vida"]))];
    cursos.forEach(c => selCurso.innerHTML += `<option value="${c}">${c}</option>`);

    // Lógica de encadenamiento
    selCurso.addEventListener('change', () => {
        selGrupo.innerHTML = '<option value="">Seleccione un Grupo Etario...</option>';
        const grupos = [...new Set(data.filter(i => i["Curso de Vida"] === selCurso.value).map(i => i["Grupo Etario"]))];
        grupos.forEach(g => selGrupo.innerHTML += `<option value="${g}">${g}</option>`);
        selGrupo.disabled = !selCurso.value;
    });

    selGrupo.addEventListener('change', () => {
        selHSE.innerHTML = '<option value="">Seleccione una HSE...</option>';
        const hses = [...new Set(data.filter(i => i["Curso de Vida"] === selCurso.value && i["Grupo Etario"] === selGrupo.value).map(i => i["HSE"]))];
        hses.forEach(h => selHSE.innerHTML += `<option value="${h}">${h}</option>`);
        selHSE.disabled = !selGrupo.value;
    });

    selRelacionada.addEventListener('change', () => {
        if (selRelacionada.value) {
            const item = data.find(i => i["Curso de Vida"] === selCurso.value && i["Grupo Etario"] === selGrupo.value && i["HSE"] === selHSE.value && i["HSE Relacionada"] === selRelacionada.value);
            document.getElementById('text-learning-1').textContent = item["Aprendizaje 1"];
            document.getElementById('text-learning-2').textContent = item["Aprendizaje 2"];
            document.getElementById('text-learning-3').textContent = item["Aprendizaje 3"];
            contentLayout.classList.remove('hidden');
            emptyState.classList.add('hidden');
        }
    });

    selHSE.addEventListener('change', () => {
        selRelacionada.innerHTML = '<option value="">Seleccione una HSE Relacionada...</option>';
        const rels = [...new Set(data.filter(i => i["Curso de Vida"] === selCurso.value && i["Grupo Etario"] === selGrupo.value && i["HSE"] === selHSE.value).map(i => i["HSE Relacionada"]))];
        rels.forEach(r => selRelacionada.innerHTML += `<option value="${r}">${r}</option>`);
        selRelacionada.disabled = !selHSE.value;
    });
});

/* ==========================================================
   CONSTRUCTOR DE INDICADORES
========================================================== */
/**
 * Permite seleccionar uno de los tres aprendizajes
 * y actualizar la vista previa del indicador.
 */

// Funciones para el Constructor

function clearLearningSelection() {
    document.querySelectorAll('.learning-card').forEach(card => {
        card.classList.remove('selected');
    });
}

function selectLearning(num) {

    // Quitar selección previa
    clearLearningSelection();

    // Marcar la nueva tarjeta
    document
        .getElementById(`card-learning-${num}`)
        .classList.add('selected');

    const text =
        document.getElementById(`text-learning-${num}`).textContent;

    document.getElementById('selected-learning-preview').textContent =
        text;

    updatePreview();

    const laboratorio = document.getElementById('laboratorio-indicadores');

const inicio = window.scrollY;
const destino = laboratorio.offsetTop - 20;
const duracion = 1000; // tiempo del desplazamiento en milisegundos

let inicioTiempo = null;

function desplazamientoSuave(tiempo) {
    if (!inicioTiempo) inicioTiempo = tiempo;

    const avance = tiempo - inicioTiempo;
    const porcentaje = Math.min(avance / duracion, 1);

    // efecto suave al inicio y al final
    const suavizado = porcentaje < 0.5
        ? 2 * porcentaje * porcentaje
        : 1 - Math.pow(-2 * porcentaje + 2, 2) / 2;

    window.scrollTo(
        0,
        inicio + (destino - inicio) * suavizado
    );

    if (avance < duracion) {
        requestAnimationFrame(desplazamientoSuave);
    }
}

requestAnimationFrame(desplazamientoSuave);
}

/**
 * Actualiza la previsualización del indicador
 * mientras el usuario escribe.
 */

const EMPTY_PREVIEW =
    'Complete los campos de arriba para crear el indicador.';

function updatePreview() {
    const c = document.getElementById('input-conducta').value;
    const ctx = document.getElementById('input-contexto').value;
    const e = document.getElementById('input-evidencia').value;
    const preview = document.getElementById('indicator-preview');
    
    if (c || ctx || e) {
        preview.innerHTML = `${c} ${ctx} ${e}`;        
        preview.classList.remove('empty-preview');
        document.getElementById('btn-copy').classList.remove('hidden');
    } else {
       preview.textContent = EMPTY_PREVIEW;
        preview.classList.add('empty-preview');
        document.getElementById('btn-copy').classList.add('hidden');
    }
}

function showToast(message) {

    const toast = document.getElementById("toast");

    toast.textContent = message;

    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 2500);

}

/**
 * Copia el indicador al portapapeles.
 */
function copyIndicator() {
    const text = document.getElementById('indicator-preview').textContent;
    navigator.clipboard.writeText(text);
    alert("Indicador copiado al portapapeles");
}

/**
 * Guarda el indicador.
 */
function resetConstructor() {

    // Quitar la selección visual de todas las tarjetas
    clearLearningSelection();

    // Limpiar selección del aprendizaje
    document.getElementById('selected-learning-preview').textContent =
        'Ninguno. Por favor, haga clic sobre alguna de las tres tarjetas de aprendizaje de arriba.';

    // Limpiar campos del constructor
    document.getElementById('input-conducta').value = '';
    document.getElementById('input-contexto').value = '';
    document.getElementById('input-evidencia').value = '';

    // Limpiar previsualización
    document.getElementById('indicator-preview').textContent =
        EMPTY_PREVIEW;

    document.getElementById('indicator-preview').classList.add('empty-preview');

    // Ocultar botón copiar
    document.getElementById('btn-copy').classList.add('hidden');

    // Reiniciar HSE
    document.getElementById('select-hse').value = '';

    // Reiniciar HSE relacionada
    document.getElementById('select-relacionada').value = '';
    document.getElementById('select-relacionada').disabled = true;

    // Ocultar contenido dinámico
    document.getElementById('content-layout').classList.add('hidden');

    // Mostrar mensaje inicial
    document.getElementById('empty-state').classList.remove('hidden');
}

function saveIndicator() {

    const periodo =
        document.getElementById('periodo').value;

    const hse =
        document.getElementById('select-hse').value;

    const relacionada =
        document.getElementById('select-relacionada').value;

    const indicador =
        document.getElementById('indicator-preview').textContent;

    if (!periodo || !hse || !indicador) {
        alert("🌱 Aún falta completar alguna información para crear el indicador. Revisa los campos y continúa.");
        return;
    }

    const tbody =
        document.getElementById('planning-body');

    const row =
        document.createElement('tr');

    row.innerHTML = `
    <td>${periodo}</td>
    <td>${hse}</td>
    <td>${relacionada}</td>
    <td>${indicador}</td>
        <td>
        <button onclick="this.closest('tr').remove()">
            🗑️
        </button>
    </td>
`;

    
    tbody.appendChild(row);

    savePlanning();

    resetConstructor();
    function showSavedMessage() {
    showToast("🌱 ¡Excelente! El indicador fue incorporado a tu planeación.");}

function nextPeriod() {

    const periodoSelect = document.getElementById('periodo');

    if (periodoSelect.value === 'Período 1') {
        periodoSelect.value = 'Período 2';
    }
    else if (periodoSelect.value === 'Período 2') {
        periodoSelect.value = 'Período 3';
    }
    else if (periodoSelect.value === 'Período 3') {
        periodoSelect.value = 'Período 4';
    }
    else if (periodoSelect.value === 'Período 4') {

        periodoSelect.value = '';

        showToast('🌸 Tu planeación socioemocional está lista para exportar.');
    }
}
    showSavedMessage();

   function scrollSuave(elemento) {

    const destino = document.getElementById(elemento);

    const inicio = window.scrollY;
    const posicionFinal = destino.offsetTop - 20;
    const duracion = 1000;

    let inicioTiempo = null;

    function animar(tiempo) {

        if (!inicioTiempo) inicioTiempo = tiempo;

        const avance = tiempo - inicioTiempo;
        const porcentaje = Math.min(avance / duracion, 1);

        const suavizado = porcentaje < 0.5
            ? 2 * porcentaje * porcentaje
            : 1 - Math.pow(-2 * porcentaje + 2, 2) / 2;

        window.scrollTo(
            0,
            inicio + (posicionFinal - inicio) * suavizado
        );

        if (avance < duracion) {
            requestAnimationFrame(animar);
        }
    }

    requestAnimationFrame(animar);
}


if (periodo !== 'Período 4') {

    scrollSuave('info-institucional');

} else {

    scrollSuave('planeacion-anual');

}

    nextPeriod();

    function savePlanning() {

    const planning =
        document.getElementById('planning-body').innerHTML;

    localStorage.setItem(
        'planeacionSocioemocional',
        planning
    );
}
}

/* ==========================================================
   EXPORTACIÓN A PDF
========================================================== */

async function exportarPDF() {

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const logo = new Image();
    logo.src = "logo.png";

    logo.onload = function () {

    const institucion =
        document.getElementById('institucion').value || 'No especificada';
        
    const docentes =
        document.getElementById('docentes').value || '';

    const grado =
        document.getElementById('grado').value || 'No especificado';

    const anio =
        new Date().getFullYear();

    doc.setFontSize(18);
    doc.setTextColor(46, 125, 85); // Verde

    doc.setFont(
        'helvetica',
        'bold'
    );

    doc.text(
        'Vivero',
        32,
        20
);

doc.setTextColor(0, 0, 0); // Volver a negro
doc.setFont(
    'helvetica',
    'normal'
);

    doc.setFontSize(11);
   doc.setFont(
    'helvetica',
    'italic'
);

doc.text(
    'Ecosistema de aprendizaje socioemocional',
    32,
    26
);
// Línea separadora
doc.setDrawColor(46, 125, 85);

doc.line(
    14, 29,
    196, 29
);

doc.setFont(
    'helvetica',
    'normal'
);

    doc.setFontSize(14);

    doc.setTextColor(46, 125, 85);

    doc.setFont(
        'helvetica',
        'bold'
);

    doc.text(
        `Colegio ${institucion}`,
        14,
        45
    );

    doc.setTextColor(0, 0, 0);

    doc.setFont(
        'helvetica',
        'normal'
);

doc.setFontSize(11); 
    
    doc.text(
        `Grado: ${grado}`,
        14,
        54
    );

    doc.text(
        `Año: ${anio}`,
        14,
        60
    );
 if (docentes.trim() !== '') {
    doc.text(
        `Docente(s): ${docentes}`,
        14,
        66
    );
}
    

    const filas = [];

    document
        .querySelectorAll('#planning-body tr')
        .forEach(row => {

            const celdas =
                row.querySelectorAll('td');

            filas.push([
                celdas[0]?.innerText || '',
                celdas[1]?.innerText || '',
                celdas[2]?.innerText || '',
                celdas[3]?.innerText || ''
            ]);
        });

    doc.autoTable({
    startY: 70,

    headStyles: {
        fillColor: [46, 125, 85]
    },

    head: [[
        'Período',
        'HSE',
        'HSE Relacionada',
        'Indicador'
    ]],

    body: filas,

    styles: {
        fontSize: 8
    }
});

        const finalY =
        doc.lastAutoTable.finalY + 15;

       // Firma de la herramienta al final de la página

const pageHeight = doc.internal.pageSize.height;

doc.setFontSize(8);
doc.setTextColor(0, 0, 0);

// "Fuente conceptual:" en negrita
doc.setFont('helvetica', 'bolditalic');

doc.text(
    'Fuente conceptual:',
    14,
    pageHeight - 25
);

// El resto en cursiva
doc.setFont('helvetica', 'italic');

doc.text(
    ' Secretaría de Educación del Distrito (2025). Malla de Aprendizajes en Habilidades Socioemocionales.',
    40,
    pageHeight - 25
);
// 🔹 Línea divisoria del footer (gris o verde suave)
doc.setDrawColor(200, 200, 200); // gris claro
// doc.setDrawColor(200, 230, 210); // verde muy suave (opcional)

doc.line(
    14,
    pageHeight - 22,
    196,
    pageHeight - 22
);

// Texto del pie de página
doc.setFontSize(9);
doc.setTextColor(120, 120, 120);
doc.setFont('helvetica', 'italic');

doc.text(
    'Generado con Vivero – Ecosistema de aprendizaje socioemocional.',
    195,
    pageHeight - 15,
    { align: 'right' }
);


doc.setFont('helvetica', 'normal');

doc.setTextColor(0, 0, 0);

doc.addImage(logo, "PNG", 14, 10, 18, 18);

doc.save(
    `Planeacion_Socioemocional_${institucion}.pdf`
);
}

}

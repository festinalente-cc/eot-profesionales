// Puntos de corte y definiciones usados en el sitio, con su fuente y estado.
// Estado: 'publicado' (consta en una publicación del grupo), 'guia' (tomado de una guía,
// pendiente de revisión por el grupo), 'grupo' (dato aportado por el grupo).
export const SOURCES = {
  consenso: { cite: 'Cabarcas-Solano MDS, et al. Rev Colomb Endocrinol Diabet Metab. 2026;13(1):e994.', url: 'https://doi.org/10.53853/encr.13.1.994' },
  revision: { cite: 'Builes-Montaño CE, et al. Clin Med Insights Endocrinol Diabetes. 2026;19.', url: 'https://doi.org/10.1177/11795514261426446' },
  eugogo: { cite: 'Bartalena L, et al. Guía EUGOGO 2021. Eur J Endocrinol. 2021;185(4):G43-G67.', url: 'https://doi.org/10.1530/EJE-21-0479' },
  terwee: { cite: 'Terwee CB, et al. Br J Ophthalmol. 1998;82(7):773-779.', url: '' },
  ataeta: { cite: 'Burch HB, et al. Declaración de consenso ATA/ETA 2022. Eur Thyroid J. 2022;11(6):e220189.', url: 'https://doi.org/10.1530/ETJ-22-0189' },
};

export const CRITERIA = [
  { id: 'cas-activa', label: 'Enfermedad activa', value: 'CAS ≥ 3 de 7', source: 'consenso', status: 'publicado', used: 'Ruta, CAS' },
  { id: 'cas-seguimiento', label: 'Enfermedad activa en seguimiento', value: 'CAS ≥ 4 de 10', source: 'eugogo', status: 'guia', used: 'CAS' },
  { id: 'refractariedad', label: 'Refractariedad a glucocorticoides', value: 'Sin respuesta o respuesta parcial tras un ciclo estándar de 12 semanas de GC IV', source: 'consenso', status: 'publicado', used: 'Ruta' },
  { id: 'grave', label: 'Enfermedad grave (consenso)', value: 'Neuropatía óptica o complicación corneal mayor', source: 'consenso', status: 'publicado', used: 'Ruta' },
  { id: 'retraccion', label: 'Retracción palpebral', value: '≥ 2 mm', source: 'eugogo', status: 'guia', used: 'Gravedad' },
  { id: 'exoftalmos', label: 'Exoftalmos', value: '≥ 3 mm sobre el valor normal para etnia y sexo', source: 'eugogo', status: 'guia', used: 'Gravedad' },
  { id: 'moderada', label: 'Moderada a grave (EUGOGO)', value: 'Dos o más: retracción ≥ 2 mm, tejidos blandos moderados o graves, exoftalmos ≥ 3 mm, diplopía inconstante o constante', source: 'eugogo', status: 'guia', used: 'Gravedad' },
  { id: 'mp-estandar', label: 'Metilprednisolona IV, esquema estándar', value: '4,5 g acumulados en 12 infusiones semanales', source: 'eugogo', status: 'guia', used: 'Dosis, Ruta' },
  { id: 'mp-alta', label: 'Metilprednisolona IV, esquema de dosis alta', value: '7,5 g acumulados en 12 infusiones semanales', source: 'eugogo', status: 'guia', used: 'Dosis' },
  { id: 'mp-max', label: 'Dosis acumulada máxima por ciclo', value: '8 g', source: 'eugogo', status: 'guia', used: 'Dosis' },
  { id: 'goqol', label: 'GO-QoL, puntaje por subescala', value: '(suma − n) / (2 n) × 100, con respuestas de 1 a 3 y n preguntas respondidas; 0 = peor, 100 = mejor', source: 'terwee', status: 'guia', used: 'Calidad de vida' },
  { id: 'goqol-cambio', label: 'GO-QoL, cambio clínicamente relevante', value: '≥ 8 puntos (otras fuentes usan 6 y 10 puntos)', source: 'terwee', status: 'guia', used: 'Calidad de vida' },
  { id: 'col-tepro', label: 'Teprotumumab en Colombia', value: 'Con registro para EOT activa moderada a grave', source: null, status: 'grupo', used: 'Ruta' },
  { id: 'col-toci-rtx', label: 'Tocilizumab y rituximab en Colombia', value: 'Sin indicación aprobada para EOT', source: null, status: 'grupo', used: 'Ruta' },
];

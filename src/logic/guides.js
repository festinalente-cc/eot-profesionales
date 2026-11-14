// Lo que dicen las guías en cada rama de la ruta.
// verified: true = comprobado contra el resumen publicado de la guía;
//           false = pendiente de comprobar contra el texto completo por el grupo.
export const GUIDES = {
  'moderada-primera-linea': [
    { src: 'eugogo', verified: true, text: 'Primera línea: metilprednisolona IV (4,5 g acumulados en 12 infusiones semanales) combinada con micofenolato sódico. Como alternativa, monoterapia con dosis acumuladas mayores, sin superar 8 g, en los casos más graves o con diplopía constante o inconstante.' },
    { src: 'ataeta', verified: false, text: 'Orienta la elección por la manifestación dominante y por la disponibilidad: glucocorticoides IV y, donde esté disponible, teprotumumab. Considera aceptable el micofenolato, sobre todo combinado con glucocorticoides.' },
    { src: 'consenso', verified: true, diff: true, text: 'Diferencia: el panel no calificó el micofenolato como necesario, por la retractación de publicaciones clave y por un efecto menos consistente que el de teprotumumab o los glucocorticoides IV en monoterapia.' },
  ],
  'moderada-refractaria': [
    { src: 'eugogo', verified: true, text: 'Segunda línea: segundo ciclo de metilprednisolona IV (7,5 g) tras evaluación oftalmológica y bioquímica cuidadosa; prednisona oral con ciclosporina o azatioprina; radioterapia orbitaria con glucocorticoides; teprotumumab; rituximab; tocilizumab.' },
    { src: 'ataeta', verified: false, text: 'En resistencia a glucocorticoides admite rituximab y tocilizumab.' },
    { src: 'consenso', verified: true, diff: true, text: 'Diferencia: el panel fue más conservador con rituximab, que no resultó apropiado en ningún escenario, por resultados inconsistentes y por el riesgo de neuropatía óptica distiroidea.' },
  ],
  'grave-neuropatia': [
    { src: 'eugogo', verified: true, text: 'Dosis altas únicas de metilprednisolona IV varias veces por semana; si no hay respuesta, descompresión orbitaria urgente.' },
    { src: 'ataeta', verified: false, text: 'Coincide en glucocorticoides IV a dosis altas y descompresión urgente si no hay respuesta.' },
  ],
  'grave-cornea': [
    { src: 'eugogo', verified: false, text: 'La ruptura corneal se trata como urgencia oftalmológica.' },
  ],
  leve: [
    { src: 'eugogo', verified: true, text: 'Suelen bastar el control de los factores de riesgo, los tratamientos locales y el selenio en zonas con déficit de selenio. Si se elige yodo radiactivo para la enfermedad de Graves, profilaxis con prednisona oral a dosis bajas, sobre todo si hay factores de riesgo.' },
  ],
  inactiva: [
    { src: 'eugogo', verified: true, text: 'Cirugía rehabilitadora (descompresión orbitaria, estrabismo y párpados) para las secuelas en fase inactiva.' },
  ],
};

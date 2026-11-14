# eot-profesionales

Sitio para profesionales del Grupo Colombiano de Enfermedad Ocular Tiroidea (GCEOT): ruta de tratamiento, herramientas, evidencia, directorio.

- Sitio estático, sin dependencias. Publicación por GitHub Pages (Actions): cada push a `main` corre `npm test` y publica solo si pasa.
- Lógica clínica y datos en `src/logic/` (calificaciones del consenso, escenarios, ruta, guías, criterios con fuente y estado).
- Vista previa local: `python3 -m http.server` en la raíz.
- Versión preliminar: `noindex` hasta que el grupo apruebe el contenido.

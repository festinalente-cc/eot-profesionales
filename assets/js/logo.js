// Logo del GCEOT. Letras de Figtree 800 convertidas a trazados; la O es el iris.
// Las letras usan currentColor, así el mismo logo sirve en tema claro y oscuro.
const VB = '28 -15 3343 730';
const LETTERS = 'M397 712Q289 712 206.5 665.5Q124 619 77.0 537.5Q30 456 30 350Q30 244 77.0 162.5Q124 81 206.5 34.5Q289 -12 397 -12Q464 -12 518.5 7.5Q573 27 614.0 61.0Q655 95 682 139L549 219Q534 195 509.5 176.0Q485 157 456.0 146.5Q427 136 397 136Q338 136 292.5 163.0Q247 190 221.0 238.5Q195 287 195 350Q195 413 220.0 461.5Q245 510 292.0 538.0Q339 566 401 566Q444 566 479.0 550.0Q514 534 535.0 506.0Q556 478 560 440H402V316H715V411Q713 509 671.0 576.5Q629 644 558.5 678.0Q488 712 397 712Z M1119 712Q1015 712 935.5 665.5Q856 619 810.5 537.5Q765 456 765 350Q765 244 810.5 162.5Q856 81 935.5 34.5Q1015 -12 1119 -12Q1195 -12 1258.5 14.5Q1322 41 1368.5 89.0Q1415 137 1440 200L1289 251Q1274 216 1248.5 190.0Q1223 164 1190.5 150.0Q1158 136 1119 136Q1064 136 1021.0 163.0Q978 190 954.0 238.5Q930 287 930 350Q930 413 954.5 461.5Q979 510 1022.5 537.5Q1066 565 1122 565Q1163 565 1195.0 550.0Q1227 535 1250.5 508.0Q1274 481 1291 446L1442 497Q1418 561 1371.0 609.5Q1324 658 1260.0 685.0Q1196 712 1119 712Z M1530 700V0H1986V148H1691V276H1938V419H1691V552H1991V700Z M3005.0 700V148H2801.0V0H3369.0V148H3165.0V700Z';
const O = { cx: 2421.0, cy: 350.0, r: 361.5 };

/** Versión compacta, con la O simplificada en anillos: encabezado y pie. */
export function logoSmall(height = 24) {
  const k = O.r;
  return `<svg class="gceot-logo" viewBox="${VB}" height="${height}" role="img" aria-label="GCEOT"><path fill="currentColor" d="${LETTERS}"/><circle cx="${O.cx}" cy="${O.cy}" r="${k}" fill="#5f9a63"/><circle cx="${O.cx}" cy="${O.cy}" r="${(k * 0.6).toFixed(1)}" fill="#e9b833" stroke="#4a6f3a" stroke-width="${(k * 0.1).toFixed(1)}"/><circle cx="${O.cx}" cy="${O.cy}" r="${(k * 0.32).toFixed(1)}" fill="#080909"/></svg>`;
}

/** Versión grande, con el iris dibujado del logo. irisUrl: ruta a assets/img/iris-logo.webp. */
export function logoLarge(irisUrl, name = true) {
  const s = O.r * 2;
  return `<div class="gceot-lockup"><svg class="gceot-logo" viewBox="${VB}" role="img" aria-label="GCEOT"><path fill="currentColor" d="${LETTERS}"/><image href="${irisUrl}" x="${O.cx - O.r}" y="${O.cy - O.r}" width="${s}" height="${s}"/></svg>${name ? '<p class="gceot-name">Grupo Colombiano de<br>Enfermedad Ocular Tiroidea</p>' : ''}</div>`;
}

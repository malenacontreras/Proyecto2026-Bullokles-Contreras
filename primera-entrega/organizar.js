'use strict';

/**
 * Busca el primer elemento que coincide con un selector CSS.
 * @method $
 * @param {string} s - Selector CSS a buscar
 * @param {ParentNode} [r=document] - Nodo donde se realiza la búsqueda
 * @return {Element|null} El elemento encontrado o null
 */
const $ = (s, r = document) => r.querySelector(s);

/**
 * Crea una copia de un <template> del HTML, adoptada por el documento (para que funcionen sus eventos).
 * @method clone
 * @param {string} id - Nombre del template (sin el prefijo "tpl-")
 * @return {Element} Copia del primer elemento del template
 */
const clone = id => document.importNode($('#tpl-' + id).content.firstElementChild, true);

/**
 * Busca un contenedor marcado con data-slot dentro de un nodo.
 * @method slot
 * @param {Element} n - Nodo donde se busca
 * @param {string} k - Valor del atributo data-slot
 * @return {Element|null} El contenedor encontrado
 */
const slot = (n, k) => $(`[data-slot="${k}"]`, n);

/**
 * Escribe texto en los elementos marcados con data-f dentro de un nodo.
 * @method fill
 * @param {Element} n - Nodo que contiene los elementos a completar
 * @param {Object<string, (string|number)>} data - Pares data-f / texto a escribir
 * @return {Element} El mismo nodo recibido
 */
const fill = (n, data) => {
  for (const k in data) {
    const e = n.matches(`[data-f="${k}"]`) ? n : $(`[data-f="${k}"]`, n);
    if (e) e.textContent = data[k];
  }
  return n;
};


const KEY = 'padelmaster-v3';

/**
 * Crea un borrador vacío para el formulario de configuración.
 * @method blank
 * @return {Object} Borrador con nombre, descripción, lugar, sorteo, tipo y duplas
 */
const blank = () => ({n: '', d: '', p: '', r: true, type: 'ko', teams: []});

let T = JSON.parse(localStorage.getItem(KEY));
let S = blank();

/**
 * Guarda el torneo actual en localStorage.
 * @method save
 * @return {void}
 */
const save = () => localStorage.setItem(KEY, JSON.stringify(T));

/**
 * Devuelve el nombre de una dupla a partir de su id.
 * @method name
 * @param {(number|string|null)} id - Índice de la dupla, 'BYE' o null
 * @return {string} Nombre a mostrar
 */
const name = id => id === 'BYE' ? 'Libre (pasa)' : id == null ? 'Por definir' : T.teams[id];

/**
 * Indica si un partido está terminado (mejor de 3 sets: gana quien llega a 2).
 * @method done
 * @param {Object} m - Partido con los sets sa y sb
 * @return {boolean} true si el resultado es válido y definitivo
 */
const done = m => (m.sa === 2 && [0, 1].includes(m.sb)) || (m.sb === 2 && [0, 1].includes(m.sa));

/**
 * Devuelve el ganador de un partido ya terminado.
 * @method mw
 * @param {Object} m - Partido terminado
 * @return {(number|string)} Id de la dupla ganadora
 */
const mw = m => m.sa > m.sb ? m.a : m.b;


/**
 * Guarda en el borrador el valor de un campo del formulario.
 * @method actualizarCampo
 * @param {string} campo - Clave del borrador ('n', 'd', 'p' o 'r')
 * @param {(string|boolean)} valor - Valor ingresado por el usuario
 * @return {void}
 */
const actualizarCampo = (campo, valor) => { S[campo] = valor };

/**
 * Muestra u oculta el mapa del formulario según el lugar ingresado.
 * @method dibujarMapa
 * @return {void}
 */
const dibujarMapa = () => {
  const p = S.p.trim(), q = encodeURIComponent(p);
  $('#mp').hidden = $('#ml').hidden = !p;
  if (!p) return;
  $('#mp').src = 'https://maps.google.com/maps?q=' + q + '&output=embed';
  $('#mlink').href = 'https://www.google.com/maps/search/?api=1&query=' + q;
};

/**
 * Dibuja la lista de duplas cargadas y su contador.
 * @method dibujarDuplas
 * @return {void}
 */
const dibujarDuplas = () => {
  $('#cnt').textContent = S.teams.length;
  $('#chips').replaceChildren(...S.teams.map((t, i) => {
    const c = fill(clone('chip'), {t});
    c.dataset.i = i;
    return c;
  }));
};

/**
 * Marca como seleccionada la tarjeta del tipo de torneo elegido.
 * @method dibujarTipos
 * @return {void}
 */
const dibujarTipos = () => {
  document.querySelectorAll('#types .type').forEach(c => c.classList.toggle('sel', c.dataset.type === S.type));
};

/**
 * Sincroniza el formulario de configuración con el borrador actual.
 * @method sincronizarSetup
 * @return {void}
 */
const sincronizarSetup = () => {
  $('#n').value = S.n; $('#d').value = S.d; $('#p').value = S.p; $('#r').checked = S.r; $('#t').value = '';
  dibujarDuplas(); dibujarTipos(); dibujarMapa();
};

/**
 * Elige el tipo de torneo al hacer click en una tarjeta.
 * @method elegirTipo
 * @param {HTMLElement} el - Tarjeta clickeada (con data-type)
 * @return {void}
 */
const elegirTipo = el => { S.type = el.dataset.type; dibujarTipos() };

/**
 * Carga las duplas de ejemplo definidas en el botón del HTML.
 * @method cargarEjemplo
 * @return {void}
 */
const cargarEjemplo = () => { S.teams = $('#demo').dataset.duplas.split('|'); dibujarDuplas() };

/**
 * Quita del borrador la dupla cuyo botón "×" fue clickeado.
 * @method quitarDupla
 * @param {HTMLElement} el - Botón "×" dentro de la ficha de la dupla
 * @return {void}
 */
const quitarDupla = el => { S.teams.splice(+el.parentElement.dataset.i, 1); dibujarDuplas() };

/**
 * Valida el nombre ingresado y agrega la dupla. Si es inválido avisa con alert y blanquea el campo.
 * @method agregarDupla
 * @return {void}
 */
const agregarDupla = () => {
  const campo = $('#t'), v = campo.value.trim();
  if (!v) alert('Escribí el nombre de la dupla antes de agregarla.');
  else if (S.teams.includes(v)) alert(`La dupla "${v}" ya fue agregada.`);
  else { S.teams.push(v); dibujarDuplas() }
  campo.value = '';
  campo.focus();
};


/**
 * Mezcla un arreglo al azar (Fisher-Yates), modificándolo en el lugar.
 * @method shuffle
 * @param {Array} a - Arreglo a mezclar
 * @return {Array} El mismo arreglo mezclado
 */
const shuffle = a => { for (let i = a.length - 1; i > 0; i--) { const j = Math.random() * (i + 1) | 0; [a[i], a[j]] = [a[j], a[i]] } return a };

/**
 * Crea un partido sin resultado.
 * @method mk
 * @param {(number|string|null)} a - Id de la dupla A
 * @param {(number|string|null)} b - Id de la dupla B
 * @param {Object} [x={}] - Propiedades extra (fecha, grupo)
 * @return {Object} Partido con sets vacíos
 */
const mk = (a, b, x = {}) => ({a, b, sa: '', sb: '', ...x});

/**
 * Genera el fixture todos contra todos con el método del círculo.
 * @method rr
 * @param {number[]} ids - Ids de las duplas
 * @param {number} [g] - Número de grupo (opcional)
 * @return {Object[]} Lista de partidos con su fecha
 */
const rr = (ids, g) => {
  const l = ids.slice(); if (l.length % 2) l.push(null);
  const n = l.length, out = [];
  for (let r = 0; r < n - 1; r++) {
    for (let i = 0; i < n / 2; i++) { const a = l[i], b = l[n - 1 - i]; if (a != null && b != null) out.push(mk(a, b, {r: r + 1, g})) }
    l.splice(1, 0, l.pop());
  }
  return out;
};

/**
 * Calcula el orden estándar de un cuadro (1 vs último, 2 vs anteúltimo...).
 * @method seedOrder
 * @param {number} n - Tamaño del cuadro (potencia de 2)
 * @return {number[]} Posiciones de siembra en orden
 */
const seedOrder = n => { let a = [1]; while (a.length < n) { const s = a.length * 2; a = a.flatMap(x => [x, s + 1 - x]) } return a };

/**
 * Devuelve el ganador de un partido de eliminación (considera los libres).
 * @method win
 * @param {Object} m - Partido de eliminación
 * @return {(number|null)} Id del ganador o null si todavía no se definió
 */
const win = m => {
  if (m.a === 'BYE') return m.b; if (m.b === 'BYE') return m.a;
  if (m.a == null || m.b == null) return null;
  return done(m) ? mw(m) : null;
};

/**
 * Pasa los ganadores a la ronda siguiente y limpia resultados si cambió el cruce.
 * @method prop
 * @return {void}
 */
const prop = () => {
  const R = T.ko.rounds;
  for (let r = 1; r < R.length; r++) R[r].forEach((m, i) => {
    const a = win(R[r - 1][2 * i]), b = win(R[r - 1][2 * i + 1]);
    if (m.a !== a || m.b !== b) Object.assign(m, {a, b, sa: '', sb: ''});
  });
};

/**
 * Arma el cuadro de eliminación directa; los mejores sembrados reciben los libres.
 * @method buildKO
 * @param {number[]} seeds - Ids de las duplas ordenados por siembra
 * @return {void}
 */
const buildKO = seeds => {
  const n = seeds.length; let size = 2; while (size < n) size *= 2;
  const o = seedOrder(size).map(s => s <= n ? seeds[s - 1] : 'BYE'), r0 = [];
  for (let i = 0; i < size; i += 2) r0.push(mk(o[i], o[i + 1]));
  const rounds = [r0]; let c = size / 2;
  while (c > 1) { c /= 2; rounds.push(Array.from({length: c}, () => mk(null, null))) }
  T.ko = {rounds}; prop();
};

/**
 * Valida el formulario de configuración. Si hay un error avisa con alert y blanquea el campo.
 * @method validarTorneo
 * @return {boolean} true si los datos son correctos
 */
const validarTorneo = () => {
  const min = S.type === 'groups' ? 6 : 3, n = S.teams.length;
  if (!S.n.trim()) {
    alert('Poné un nombre al torneo.');
    S.n = ''; $('#n').value = ''; $('#n').focus();
    return false;
  }
  if (n < min) {
    alert(`Para este formato necesitás al menos ${min} duplas (tenés ${n}).`);
    return false;
  }
  return true;
};

/**
 * Crea el torneo con los datos del formulario (si son válidos) y lo muestra.
 * @method crearTorneo
 * @return {void}
 */
const crearTorneo = () => {
  if (!validarTorneo()) return;
  const n = S.teams.length;
  const ids = S.teams.map((_, i) => i); if (S.r) shuffle(ids);
  T = {name: S.n.trim(), desc: S.d, place: S.p.trim(), type: S.type, teams: S.teams.slice(), matches: [], ko: null, tab: 'a', groups: null};
  if (S.type === 'rr') T.matches = rr(ids);
  if (S.type === 'groups') {
    const g = n <= 7 ? 2 : Math.ceil(n / 4);
    T.groups = Array.from({length: g}, () => []);
    ids.forEach((id, i) => { const k = i % (2 * g); T.groups[k < g ? k : 2 * g - 1 - k].push(id) }); // reparto en serpiente
    T.groups.forEach((gr, gi) => T.matches.push(...rr(gr, gi)));
  }
  if (S.type === 'ko') buildKO(ids);
  save(); mountApp(); render();
};

/**
 * Genera la fase final de eliminación con los clasificados de cada grupo.
 * @method startKO
 * @return {void}
 */
const startKO = () => {
  const st = T.groups.map(g => standings(g, T.matches.filter(m => g.includes(m.a))));
  const w = st.map(s => s[0].id); const r = st.map(s => s[1].id);
  if (r.length % 2) r.push(r.shift()); // evita cruces del mismo grupo
  buildKO(w.concat(r)); T.tab = 'b'; save(); render();
};

/**
 * Descarta el torneo actual (con confirmación) y vuelve al formulario.
 * @method nuevoTorneo
 * @return {void}
 */
const nuevoTorneo = () => {
  if (!confirm('¿Descartar este torneo y crear uno nuevo?')) return;
  T = null; S = blank();
  localStorage.removeItem(KEY);
  render();
};


/**
 * Calcula la tabla de posiciones: 3 puntos por victoria, desempate por diferencia de sets y sets ganados.
 * @method standings
 * @param {number[]} ids - Ids de las duplas a incluir
 * @param {Object[]} ms - Partidos a considerar
 * @return {Object[]} Filas ordenadas con pj, g, p, sf, sc y pts
 */
const standings = (ids, ms) => {
  const o = {}; ids.forEach(i => o[i] = {id: i, pj: 0, g: 0, p: 0, sf: 0, sc: 0, pts: 0});
  ms.filter(done).forEach(m => {
    const A = o[m.a], B = o[m.b]; if (!A || !B) return;
    A.pj++; B.pj++; A.sf += m.sa; A.sc += m.sb; B.sf += m.sb; B.sc += m.sa;
    const w = mw(m) === m.a ? [A, B] : [B, A]; w[0].g++; w[0].pts += 3; w[1].p++;
  });
  return Object.values(o).sort((x, y) => y.pts - x.pts || (y.sf - y.sc) - (x.sf - x.sc) || y.sf - x.sf);
};

/**
 * Construye la tabla de posiciones lista para mostrar.
 * @method table
 * @param {number[]} ids - Ids de las duplas
 * @param {Object[]} ms - Partidos a considerar
 * @param {number} q - Cantidad de posiciones a resaltar como clasificadas
 * @return {Element} Tabla HTML
 */
const table = (ids, ms, q) => {
  const t = clone('table'), body = $('tbody', t);
  standings(ids, ms).forEach((s, i) => {
    const r = clone('row'), d = s.sf - s.sc;
    fill(r, {pos: i + 1, name: name(s.id), pj: s.pj, g: s.g, p: s.p, sets: `${s.sf}-${s.sc}`, dif: (d > 0 ? '+' : '') + d, pts: s.pts});
    r.classList.toggle('q', i < q);
    body.append(r);
  });
  return t;
};


/**
 * Obtiene un partido a partir de su referencia ("m,i" para fixture o "k,ronda,i" para eliminación).
 * @method get
 * @param {string} r - Referencia del partido
 * @return {Object} El partido
 */
const get = r => { const p = r.split(','); return p[0] === 'm' ? T.matches[p[1]] : T.ko.rounds[p[1]][p[2]] };

/**
 * Comprueba un resultado de sets (mejor de 3: de 0 a 2 por dupla y máximo 3 sets en total).
 * @method validarSet
 * @param {(number|string)} n - Sets ingresados ('' si el campo está vacío)
 * @param {(number|string)} other - Sets de la otra dupla
 * @return {string} Mensaje de error, o cadena vacía si el valor es correcto
 */
const validarSet = (n, other) => {
  if (n !== '' && !(Number.isInteger(n) && n >= 0 && n <= 2)) return 'Ingresá un número entero de sets entre 0 y 2 (mejor de 3).';
  if (n !== '' && other !== '' && n + other > 3) return `Máximo 3 sets en total: ${n}-${other} no es posible.`;
  return '';
};

/**
 * Carga los sets de un input. Si el valor es inválido avisa con alert y blanquea el campo.
 * @method cargarSet
 * @param {HTMLInputElement} inp - Input modificado (con data-ref y data-k)
 * @return {void}
 */
const cargarSet = inp => {
  const ref = inp.dataset.ref, k = inp.dataset.k, m = get(ref);
  const n = inp.value === '' ? '' : +inp.value;
  const error = validarSet(n, m[k === 'sa' ? 'sb' : 'sa']);
  if (error) alert(error);
  m[k] = error ? '' : n;
  if (ref[0] === 'k') prop();
  save(); render();
};

/**
 * Cambia la pestaña visible del torneo.
 * @method cambiarTab
 * @param {string} k - Clave de la pestaña ('a', 'b' o 'z')
 * @return {void}
 */
const cambiarTab = k => { T.tab = k; save(); render() };

/**
 * Construye la tarjeta de un partido (o la de pase libre).
 * @method card
 * @param {Object} m - Partido
 * @param {string} ref - Referencia del partido
 * @param {string} [lbl] - Etiqueta que se muestra arriba
 * @return {Element} Tarjeta HTML
 */
const card = (m, ref, lbl = '') => {
  if (m.a === 'BYE' || m.b === 'BYE') {
    return fill(clone('bye'), {lbl, txt: `${name(m.a === 'BYE' ? m.b : m.a)} pasa directo`});
  }
  const n = clone('match'), d = done(m);
  fill(n, {lbl, na: name(m.a), nb: name(m.b)});
  n.classList.toggle('done', d);
  [['a', 'sa', 'sb'], ['b', 'sb', 'sa']].forEach(([side, mine, rival]) => {
    const row = $(`[data-side="${side}"]`, n), inp = $('input', row);
    row.classList.toggle('w', d && m[mine] > m[rival]);
    inp.value = m[mine]; inp.disabled = m.a == null || m.b == null;
    inp.dataset.ref = ref; inp.dataset.k = mine;
  });
  $('.hint', n).hidden = !(m.sa !== '' && m.sb !== '' && !d);
  return n;
};

/**
 * Construye el cuadro de eliminación directa.
 * @method bracket
 * @return {Element} Cuadro HTML
 */
const bracket = () => {
  const b = clone('bracket'), R = T.ko.rounds;
  const nombres = {1: 'Final', 2: 'Semifinales', 3: 'Cuartos de final', 4: 'Octavos de final'};
  R.forEach((ms, r) => {
    const c = fill(clone('col'), {title: nombres[R.length - r] || 'Ronda ' + (r + 1)});
    slot(c, 'cards').append(...ms.map((m, i) => card(m, `k,${r},${i}`, 'Partido ' + (i + 1))));
    b.append(c);
  });
  return b;
};

/**
 * Indica si todos los partidos del fixture están terminados.
 * @method allDone
 * @return {boolean} true si no queda ningún partido pendiente
 */
const allDone = () => T.matches.every(done);

/**
 * Determina el campeón del torneo si ya terminó.
 * @method champion
 * @return {(number|null)} Id de la dupla campeona o null
 */
const champion = () => {
  if (T.type === 'rr') return allDone() ? standings(T.teams.map((_, i) => i), T.matches)[0].id : null;
  return T.ko ? win(T.ko.rounds.at(-1)[0]) : null;
};

/**
 * Reúne todos los partidos ya jugados (fixture y eliminación).
 * @method played
 * @return {Object[]} Partidos terminados
 */
const played = () => [...T.matches, ...(T.ko ? T.ko.rounds.flat() : [])].filter(m => m.a !== 'BYE' && m.b !== 'BYE' && done(m));

/**
 * Calcula la cantidad total de partidos que tendrá el torneo.
 * @method total
 * @return {number} Total de partidos
 */
const total = () => {
  let n = T.matches.length;
  if (T.ko) n += T.ko.rounds.flat().filter(m => m.a !== 'BYE' && m.b !== 'BYE').length;
  if (T.type === 'groups' && !T.ko) n += 2 * T.groups.length - 1;
  return n;
};


/**
 * Arma la vista de la primera pestaña (cuadro, fechas o grupos).
 * @method viewMatches
 * @return {Node} Contenido a mostrar
 */
const viewMatches = () => {
  if (T.type === 'ko') return bracket();
  if (T.type === 'rr') {
    const w = clone('fechas');
    [...new Set(T.matches.map(m => m.r))].forEach(r => {
      const f = fill(clone('fecha'), {title: 'Fecha ' + r});
      slot(f, 'cards').append(...T.matches.map((m, i) => m.r === r ? card(m, 'm,' + i) : null).filter(Boolean));
      w.append(f);
    });
    return w;
  }
  const box = document.createDocumentFragment();
  T.groups.forEach((g, gi) => {
    const c = fill(clone('group'), {title: 'Grupo ' + String.fromCharCode(65 + gi)});
    slot(c, 'table').append(table(g, T.matches.filter(m => m.g === gi), 2));
    slot(c, 'cards').append(...T.matches.map((m, i) => m.g === gi ? card(m, 'm,' + i, 'Fecha ' + m.r) : null).filter(Boolean));
    box.append(c);
  });
  return box;
};

/**
 * Arma la vista de la segunda pestaña (posiciones o fase final).
 * @method viewSecond
 * @return {Element} Contenido a mostrar
 */
const viewSecond = () => {
  if (T.type === 'rr') {
    const s = clone('standings');
    slot(s, 'table').append(table(T.teams.map((_, i) => i), T.matches, 1));
    return s;
  }
  if (T.ko) return bracket();
  const w = clone('kowait'), ok = allDone();
  $('[data-state="ok"]', w).hidden = !ok;
  $('[data-state="wait"]', w).hidden = ok;
  $('#startko', w).disabled = !ok;
  return w;
};

/**
 * Arma un análisis simple del torneo terminado (o un aviso si todavía no terminó).
 * @method analysis
 * @return {Element} Contenido a mostrar
 */
const analysis = () => {
  const c = champion();
  if (c == null) return clone('pending');
  const P = played(), ids = T.teams.map((_, i) => i), st = standings(ids, P), s0 = st.find(s => s.id === c);
  const final = T.ko && T.ko.rounds.at(-1)[0];
  const sub = T.type === 'rr' ? st[1].id : final.a === c ? final.b : final.a;
  const n = fill(clone('analysis'), {
    kicker: T.name.toUpperCase(),
    champ: name(c),
    runner: name(sub),
    story: `¡${name(c)} es el campeón de ${T.name}! Ganó ${s0.g} de sus ${s0.pj} partidos, con ${s0.sf} sets a favor y ${s0.sc} en contra. El subcampeón fue ${name(sub)}.`
  });
  const stats = [
    ['Duplas participantes', T.teams.length],
    ['Partidos jugados', P.length],
    ['Partidos definidos en 3 sets', P.filter(m => m.sa + m.sb === 3).length],
    ['Efectividad del campeón', Math.round(100 * s0.g / s0.pj) + '%']
  ];
  slot(n, 'stats').append(...stats.map(([k, v]) => fill(clone('stat'), {k, v})));
  slot(n, 'rank').append(table(ids, P, 1));
  return n;
};


/**
 * Completa la cabecera del torneo (nombre, tipo, descripción y mapa).
 * @method mountApp
 * @return {void}
 */
const mountApp = () => {
  const a = $('#app'), q = encodeURIComponent(T.place);
  fill(a, {name: T.name, meta: `${$(`[data-type="${T.type}"] h4`).textContent} · ${T.teams.length} duplas`, desc: T.desc, place: T.place});
  $('[data-f="desc"]', a).hidden = !T.desc;
  $('#place').hidden = $('#amap').hidden = !T.place;
  $('#plink').href = 'https://www.google.com/maps/search/?api=1&query=' + q;
  $('#amap').src = T.place ? 'https://maps.google.com/maps?q=' + q + '&output=embed' : '';
};

/**
 * Actualiza la pantalla completa: formulario o torneo (progreso, pestañas y contenido).
 * @method render
 * @return {void}
 */
const render = () => {
  $('#setup').hidden = !!T; $('#app').hidden = !T;
  if (!T) { sincronizarSetup(); return }

  const pj = played().length, tt = total();
  $('#fill').style.width = Math.min(100, Math.round(100 * pj / tt)) + '%';
  fill($('#app'), {prog: `${pj} de ${tt} partidos`});
  $('#fin').hidden = champion() == null;
  if (!$('#fin').hidden && !T.fin) { T.fin = 1; T.tab = 'z'; save() } // al terminar, abre el análisis

  [...$('#tabs').children].forEach(b => {
    const visible = !b.dataset.tipos || b.dataset.tipos.split(' ').includes(T.type);
    if (!visible && T.tab === b.dataset.tab) T.tab = 'a';
    b.style.display = visible ? '' : 'none';
    b.textContent = b.dataset[T.type] || b.textContent;
    b.classList.toggle('on', b.dataset.tab === T.tab);
  });
  $('#body').replaceChildren(T.tab === 'a' ? viewMatches() : T.tab === 'b' ? viewSecond() : analysis());
};

if (T) mountApp();
render();
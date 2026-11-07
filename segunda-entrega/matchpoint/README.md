# MatchPoint

MatchPoint es una página web para consultar y organizar torneos de pádel de manera simple e intuitiva.

Esta es la **segunda entrega** del proyecto: el sitio de la primera entrega (HTML, CSS y JavaScript) fue migrado a **React** con **Vite**, con estilos en **SASS** y un **mock de servicios** con json-server.

## Índice

- [Descripción](#descripción)
- [Funcionalidades](#funcionalidades)
- [Páginas del sitio](#páginas-del-sitio)
- [Tecnologías utilizadas](#tecnologías-utilizadas)
- [Requisitos previos](#requisitos-previos)
- [Pasos de ejecución](#pasos-de-ejecución)
- [Scripts disponibles](#scripts-disponibles)
- [Mock de servicios](#mock-de-servicios)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Vulnerabilidades conocidas](#vulnerabilidades-conocidas)
- [Autores](#autores)

## Descripción

**MatchPoint** fue desarrollado como proyecto de la materia **Taller de Desarrollo Web**.

El objetivo del sitio es facilitar la organización de torneos de pádel entre amigos y permitir la consulta de torneos publicados. La página permite organizar un torneo propio, registrar los resultados de cada partido y generar automáticamente las siguientes instancias y cruces según los resultados obtenidos.

## Funcionalidades

- Visualización de torneos publicados, obtenidos del mock de servicios.
- Búsqueda de torneos por nombre y filtrado por fecha, nivel y ubicación.
- Los filtros elegidos se guardan en el navegador (localStorage).
- Visualización de información detallada de cada torneo: fecha, ubicación, jugadores e inscripción.
- Creación de un torneo con validaciones en tiempo real y mensajes de error accesibles.
- Carga de duplas participantes (máximo 16).
- Selección del formato de competencia: eliminación directa, fase de grupos + final o todos contra todos.
- Generación automática de partidos, carga y validación de resultados.
- Avance automático entre las fases y visualización del campeón y del análisis final.
- El torneo en curso se guarda en el navegador (localStorage).

## Páginas del sitio

| Ruta         | Página               | Descripción                                                             |
| ------------ | -------------------- | ----------------------------------------------------------------------- |
| `/`          | **Inicio**           | Presenta MatchPoint y sus principales funcionalidades.                  |
| `/torneos`   | **Torneos**          | Lista los torneos publicados con buscador, filtros y modal de detalles. |
| `/organizar` | **Organizar torneo** | Permite crear un torneo, cargar los resultados y ver el análisis final. |

## Tecnologías utilizadas

- **React 19** para construir la interfaz con componentes y hooks (`useState`, `useEffect`, `useNavigate`).
- **Vite 8** para crear y ejecutar el proyecto.
- **React Router DOM 7** para la navegación entre páginas (con `Outlet` en el layout principal).
- **SASS (SCSS)** para los estilos.
- **json-server** para el mock de servicios (`db.json`).
- **Fetch API** con `async`/`await` para consumir el mock.
- **ESLint** para detectar errores en el código.
- **Git** y **GitHub** para el control de versiones.

## Requisitos previos

- [Node.js](https://nodejs.org/) **22.12 o superior** (incluye npm).
- Git.

## Pasos de ejecución

1. Clonar el repositorio:

   ```bash
   git clone https://github.com/malenacontreras/Proyecto2026-Bullokles-Contreras.git
   ```

2. Entrar a la carpeta del proyecto:

   ```bash
   cd Proyecto2026-Bullokles-Contreras/segunda-entrega/matchpoint
   ```

3. Instalar las dependencias:

   ```bash
   npm install
   ```

4. Levantar el mock de servicios (dejar esta terminal abierta):

   ```bash
   npm run services
   ```

5. En **otra terminal**, dentro de la misma carpeta, levantar la página:

   ```bash
   npm run dev
   ```

6. Abrir en el navegador: [http://localhost:5173](http://localhost:5173)

> El archivo `.env` ya incluye la dirección del mock (`VITE_BASE_URL = "http://localhost:4000/"`). Si se cambia el puerto del mock, hay que actualizarlo ahí.

## Scripts disponibles

| Script             | Descripción                                                 |
| ------------------ | ----------------------------------------------------------- |
| `npm run dev`      | Levanta la página en modo desarrollo (puerto 5173).         |
| `npm run services` | Levanta el mock de servicios con json-server (puerto 4000). |
| `npm run build`    | Genera la versión de producción en la carpeta `dist`.       |
| `npm run preview`  | Muestra la versión de producción generada.                  |
| `npm run lint`     | Revisa el código con ESLint.                                |

## Mock de servicios

Los datos de los torneos están en `src/data/db.json` y se sirven con json-server en:

```
GET http://localhost:4000/torneos
```

Cada torneo tiene el siguiente formato:

```json
{
  "id": 1,
  "nombre": "Torneo Central Club",
  "description": "Torneo de eliminación directa para parejas de nivel intermedio, a disputarse en canchas cubiertas.",
  "categoria": "Intermedio",
  "fecha": "15 - 16 Feb 2026",
  "mes": "2026-02",
  "ubicacion": "Córdoba",
  "jugadores": "16 jugadores",
  "precio": 30000,
  "web": "https://www.google.com/maps/search/?api=1&query=Torneo+Central+Club+C%C3%B3rdoba",
  "imagen": "/Imagenes/cancha_red.avif",
  "alt": "Cancha de pádel con red"
}
```

## Estructura del proyecto

```
matchpoint/
├── public/            Imágenes públicas (fotos de torneos, logo y favicon)
├── src/
│   ├── api/           Funciones que consumen el mock con fetch y async/await
│   ├── assets/        Imágenes importadas desde los componentes (logo)
│   ├── components/    Componentes reutilizables (Header, Footer, Button, etc.)
│   ├── data/          Mock de servicios (db.json) y datos fijos del organizador
│   ├── pages/         Páginas de cada ruta (Inicio, Torneos, Organizar)
│   ├── styles/        Estilos SCSS
│   ├── utils/         Funciones auxiliares (lógica del torneo, formato, niveles)
│   ├── App.jsx        Rutas y layout principal
│   └── main.jsx       Punto de entrada
├── .env               Dirección del mock de servicios
├── index.html
├── package.json
└── vite.config.js     Configuración de Vite y del alias @
```

## Vulnerabilidades conocidas

Al ejecutar `npm audit` se informan **4 vulnerabilidades de severidad moderada**. No hay vulnerabilidades altas ni críticas.

| Paquete                 | Severidad | Detalle                                                                                                                         |
| ----------------------- | --------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `minimatch`             | Moderada  | Posible denegación de servicio ([GHSA-g3hv-75wg-m249](https://github.com/advisories/GHSA-g3hv-75wg-m249)).                      |
| `@eslint/config-array`  | Moderada  | Depende de la versión vulnerable de `minimatch`.                                                                                |
| `eslint`                | Moderada  | Depende de las versiones vulnerables de `@eslint/config-array` y `minimatch`.                                                   |
| `@eslint/js`            | Moderada  | Depende de la versión vulnerable de `eslint`.                                                                                   |

Todas pertenecen a **ESLint**, una dependencia de desarrollo que solo se usa para revisar el código: no forma parte de la página que se ejecuta en el navegador. La única solución disponible (`npm audit fix --force`) baja ESLint a una versión mayor anterior, lo que rompe la configuración actual. Por eso se decidió mantener la versión actual.

## Autores

Proyecto realizado por:

- **Justina Bullokles**
- **Malena Contreras**

Carrera: **Ingeniería Informática - Universidad Católica de Córdoba**.
Materia: **Taller de Desarrollo Web**
# Guess Colors · Práctica 1 de FENW

Cliente web del juego **Guess Colors** (adivinar colores), desarrollado para la
asignatura **Front-end para Navegadores Web** del Máster en Ingeniería Web
(E.T.S.I. Sistemas Informáticos, U.P.M.).

La aplicación es un **Mastermind**: el sistema genera una combinación secreta de
cuatro colores y el jugador debe descubrirla en un máximo de doce intentos,
guíandose por las pistas que devuelve cada jugada.

## Cómo ejecutar

No requiere instalación ni servidor: todo funciona en el navegador.

1. Descomprimir el archivo `practica1.zip`.
2. Abrir `index.html` con un navegador (doble clic).

Las librerías (Bootstrap y jQuery) están incluidas en la carpeta `lib/`, por lo
que la práctica **funciona sin conexión**. Las páginas de Records y de inicio
consumen la API REST de la asignatura, por lo que esas dos vistas necesitan
conexión a Internet para mostrar datos reales.

## Páginas

| Página | Archivo | Función |
|---|---|---|
| Inicio | `index.html` | Presentación del juego, reglas y accesos directos |
| Jugar | `play.html` | Partida local: genera la combinación y evalúa los intentos |
| Records | `records.html` | Los diez mejores records almacenados en el servidor |
| Registro | `register.html` | Formulario de alta de usuario con validación |
| Login | `login.html` | Identificación del usuario y almacenamiento del token |

## Reglas del juego

- El sistema sortea una combinación secreta de **cuatro colores**.
- Hay **cinco colores** disponibles: rojo, verde, azul, amarillo y blanco
  (identificados del 0 al 4, en ese orden).
- Los colores **pueden repetirse**.
- El jugador dispone de **doce intentos**.

En cada intento se devuelven pistas:

| Pista | Significado |
|---|---|
| **Ficha negra** | El color es correcto y está en la posición correcta |
| **Ficha blanca** | El color forma parte de la combinación, pero en otra posición |
| **Sin ficha** | El color no está en la combinación o ya se ha contado |

Las pistas indican únicamente **cuántos** aciertos hay de cada tipo: no revelan
a qué colores corresponden ni en qué posiciones están.

## API REST

Se consume la API de la asignatura en `http://fenw.etsisi.upm.es:4500`.

| Método | Ruta | Uso en la práctica |
|---|---|---|
| `GET` | `/game/colors` | Colores disponibles (usado en Inicio y en el juego) |
| `GET` | `/scores` | Los diez mejores records (página Records) |
| `GET` | `/users/login` | Inicio de sesión: devuelve el token en la cabecera `Authorization` |

El token recibido se guarda en el **almacenamiento web** (`localStorage`) para
poder usarlo en la segunda práctica. Credenciales de prueba: `user1` / `user1`.

> El **Registro** únicamente muestra el formulario con su validación. Tal y como
> indica el enunciado, **no se desarrolla el proceso asociado en la API REST**
> en esta práctica: queda preparado para la siguiente.

## Estructura del proyecto

```
practica1/
├── index.html          Página de presentación
├── play.html           Juego
├── records.html        Records
├── register.html       Formulario de registro
├── login.html          Formulario de login
├── css/
│   └── styles.css      Estilos propios (sobre Bootstrap)
├── js/
│   ├── api/            Cliente de acceso a la API REST
│   ├── models/         Lógica del juego, independiente de la vista
│   ├── services/       Persistencia del token en el almacenamiento web
│   ├── views/          Comportamiento de cada página
│   └── pages/          Arranque de cada página
└── lib/                Bootstrap 5.3.3 y jQuery 3.7.1 (locales)
```

## Decisiones de diseño

**Programación orientada a objetos con ECMAScript 6.** Todo el código se
organiza en clases (`ApiClient`, `AuthStorage`, `Game`, `GameView`,
`RecordsView`, `LoginView`, `RegisterView`) agrupadas bajo un único espacio de
nombres global (`FENW`), evitando la contaminación del ámbito global. La lógica
del juego (`Game`) está separada por completo de la interfaz (`GameView`).

**Tecnologías asíncronas.** La comunicación con el servidor se hace con la API
`fetch` y promesas (`async`/`await`). La página de Records utiliza **jQuery**,
que también se emplea para la manipulación del DOM en esa vista.

**Diseño de la interfaz.** Se ha procurado una presentación cuidada y uniforme
en las cinco páginas: cabecera con menú, tipografía y paleta coherentes, tarjetas
con sombra suave y comportamiento adaptativo gracias a Bootstrap.

## Tecnologías

HTML5 · CSS3 · JavaScript (ECMAScript 6) · Bootstrap 5.3.3 · jQuery 3.7.1 ·
AJAX (fetch y promesas)

## Autoría

Práctica individual de la asignatura *Front-end para Navegadores Web* (curso
2026/2027), Máster en Ingeniería Web, E.T.S.I. Sistemas Informáticos (U.P.M.).

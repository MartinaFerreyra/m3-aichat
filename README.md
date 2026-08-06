Chat con Patrick Stump

Single Page Application que permite chatear con Patrick Stump (cantante de Fall Out Boy) usando Google Gemini AI. Proyecto integrador desarrollado como práctica de SPA con routing, integración segura de AI mediante Vercel Serverless Functions, y testing con Vitest.

🔗 Repositorio: https://github.com/MartinaFerreyra/m3-aichat 🔗 Aplicación desplegada: https://m3-aichat.vercel.app

Personaje elegido

Patrick Stump — cantante de Fall Out Boy.

El personaje fue diseñado con un system prompt que define:

Personalidad: amable, inteligente, muy creativo, fanático de la música.
Forma de hablar: respuestas breves (2-3 oraciones), tono natural de chat, sin admitir nunca ser una IA.
Comportamiento especial: si le preguntan de música responde con entusiasmo; si le preguntan de programación, intenta ayudar usando ejemplos musicales.

El prompt completo está en src/characters/patrick.js.

Estructura del proyecto
CHAT-PERSONAJE/
├── api/
│   └── chat.js                  # Vercel Serverless Function — proxy seguro a Gemini
├── src/
│   ├── characters/
│   │   ├── index.js              # Registro central de personajes (CHARACTERS)
│   │   └── patrick.js            # Datos y system prompt de Patrick Stump
│   ├── css/
│   │   └── styles.css
│   ├── router/
│   │   └── router.js             # Routing SPA con History API
│   ├── services/
│   │   └── geminiService.js      # Cliente que llama a /api/chat
│   ├── ui/
│   │   └── characterCards.js     # Render de tarjetas de personajes
│   └── views/
│       ├── about.js
│       ├── chat.js               # Lógica del chat (historial, sesiones, UI)
│       ├── home.js
│       └── notFound.js
├── tests/
│   ├── characters.test.js
│   ├── geminiService.test.js
│   └── utils.test.js
├── images/
│   └── pat.webp
├── .env.example
├── .gitignore
├── index.html
├── main.js
├── package.json
└── vercel.json
Requisitos y pasos para ejecutar en local
Requisitos previos
Node.js instalado
Una API key de Google Gemini (obtenerla acá)
Vercel CLI (se instala como dependencia del proyecto, no hace falta instalarlo global)
Pasos
Clonar el repositorio
bash
   git clone https://github.com/MartinaFerreyra/m3-aichat.git
   cd m3-aichat
Instalar dependencias
bash
   npm install
Configurar variables de entorno Copiar .env.example a un nuevo archivo .env y completar con tu API key real:
bash
   cp .env.example .env

Contenido de .env:

   GEMINI_API_KEY=tu_api_key_real

⚠️ El archivo .env nunca se sube al repositorio (está en .gitignore). Solo .env.example (sin valores reales) queda versionado.

Ejecutar en local con Vercel dev
bash
   vercel dev

Esto levanta tanto el frontend como la Serverless Function (api/chat.js) en un mismo servidor local, simulando el entorno de producción de Vercel.

Abrir en el navegador La terminal va a indicar la URL local (normalmente http://localhost:3000).
Cómo ejecutar los tests

El proyecto usa Vitest para los tests unitarios.

bash
npm run test
Cobertura de tests (13 tests en 3 archivos)
Archivo	Qué testea
tests/characters.test.js	Integridad de los datos de personajes (nombre, imagen, prompt definido)
tests/utils.test.js	Funciones puras de lógica: recorte de historial (getTrimmedHistory), armado de clave de storage (getStorageKey), formateo de timestamps (formatTime)
tests/geminiService.test.js	Llamada a la API con mocking de fetch: caso éxito, caso error, y verificación del body enviado
Cómo desplegar a Vercel
Crear una cuenta en vercel.com (se puede vincular directo con GitHub).
Desde el dashboard de Vercel, click en "Add New Project".
Seleccionar el repositorio de GitHub del proyecto y confirmar la vinculación.
En la configuración del proyecto, agregar la variable de entorno GEMINI_API_KEY con el valor real (Settings → Environment Variables).
Confirmar el deploy. Vercel construye y publica la app automáticamente.
A partir de ahí, cada git push a la rama principal genera un nuevo deployment visible en la pestaña "Deployments" del proyecto en Vercel.
Para que un deployment quede como la versión pública activa, hay que abrirlo desde "Deployments" y marcarlo como Production.
El dominio fijo de producción (ej. https://m3-aichat.vercel.app) siempre apunta al último deployment marcado como Production — es ese link el que se comparte, no el link específico de cada deployment individual (que cambia en cada push).
Capturas de pantalla

Agregar acá las capturas de la aplicación funcionando. Se recomienda incluir:

Vista Home (galería de personajes)
Vista Chat en desktop, con una conversación en curso
Vista Chat en mobile (usando las DevTools del navegador en modo responsive)
Estado de "escribiendo..." mientras la AI genera una respuesta
markdown
![Home](./docs/screenshots/home.png)
![Chat desktop](./docs/screenshots/chat-desktop.png)
![Chat mobile](./docs/screenshots/chat-mobile.png)
Registro del uso de AI en el proyecto

Se utilizó Claude (Anthropic) como asistente durante todo el desarrollo del proyecto, no solo en etapas puntuales. Resumen de las áreas donde se usó:

Diseño de la arquitectura del chat: implementación del sistema de sesiones múltiples guardadas en localStorage, separadas por personaje mediante clave dinámica (chatSessions_<characterId>).
Corrección de bugs: identificación y corrección de un bug de duplicación del mensaje del usuario en cada request (el mensaje se agregaba al historial antes de la respuesta de la API en vez de después).
Diseño responsive: implementación del sidebar con comportamiento distinto en mobile (overlay deslizable) vs. desktop (panel fijo con toggle de ancho).
Integración de avatar del personaje: reestructuración de los mensajes del chat para separar el avatar del globo de texto (messageRow + message).
Funcionalidades de UX: indicador de "escribiendo...", timestamps en los mensajes, botón de copiar respuesta al portapapeles.
Testing: diseño y redacción de los 13 tests unitarios con Vitest, incluyendo el patrón de mocking de fetch para testear sendMessage sin depender de la red real.
Deployment: configuración de vercel.json con rewrites para resolver el error 404 en rutas de SPA al recargar la página.
Explicaciones conceptuales: comprensión de conceptos como tokens, rate limiting (error 429 y manejo con Retry-After), y por qué el historial de conversación no es "gratis" en términos de costo y límites de la API.

Todo el código generado por AI fue revisado, adaptado a la estructura real del proyecto, y probado manualmente antes de integrarlo.

Funcionalidades extra implementadas
Persistencia con localStorage: el historial de cada conversación se guarda por personaje (chatSessions_<characterId>), con sidebar para crear nuevas conversaciones y volver a conversaciones anteriores.
Timestamps en los mensajes: cada mensaje (usuario y personaje) muestra la hora en que fue enviado.
Indicador "escribiendo...": se muestra mientras se espera la respuesta de la API, y desaparece al llegar la respuesta o si ocurre un error.
Enviar con Enter: además del botón, se puede enviar el mensaje presionando Enter en el input.
Botón de copiar respuesta: cada mensaje del personaje tiene un botón para copiar el texto al portapapeles.
Modo oscuro/claro: toggle que aplica la clase dark al <body>, con estilos propios para header, mensajes, sidebar, input y botones en ambos temas.
Notas adicionales
El historial de conversación persiste en localStorage durante la sesión del navegador (extra credit implementado), separado por personaje.
La API key de Gemini nunca se expone en el cliente: todas las llamadas pasan por la Serverless Function en api/chat.js, que lee GEMINI_API_KEY desde variables de entorno del servidor.
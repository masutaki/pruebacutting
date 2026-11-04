# Really Grass Cutting Incremental — 2D clásico

Juego incremental completo para navegador, en **HTML, CSS y JavaScript**. Conserva el motor y el estilo visual de [Really Grass Cutting Incremental, extensión de TehAarex](https://aarextiaokhiao.github.io/Really-Grass-Cutting-Incremental/): fondo azul, campo verde con hierba cuadrada, tipografía Inconsolata, barras de nivel, paneles de colores, mejoras con iconos y mapa con flechas. Todo se representa en 2D.

## Jugar

Todos los recursos son locales: no requiere cuentas, servicios externos, compilación ni conexión a Internet. Para jugar o desarrollar con un origen HTTP estable y guardar siempre en el mismo navegador:

```sh
cd /workspace/pruebacutting
npm start
```

El servidor escucha en el puerto **3000**. `PORT` y `HOST` permiten cambiar el puerto y la interfaz. Requiere Node.js 20 o posterior. Servir el juego no necesita instalar paquetes. Cualquier alojamiento de archivos estáticos también sirve. La apertura directa de `index.html` depende de las políticas del navegador y no se ha verificado aquí: Chromium del entorno bloquea las direcciones `file:`. El flujo mediante el servidor HTTP sí está probado.

## Controles y progresión

- Ratón: recorre los cuadrados de hierba para cortarlos. Móvil: toca o arrastra sobre el campo.
- Teclado: enfoca el campo con un clic o Tab y usa **WASD / flechas** para mover el área cuadrada de corte. Fuera del campo, estas teclas recorren el mapa del motor original.
- Haz clic en un icono de mejora para abrir sus detalles. **Buy 1**, **Buy Next** y **Buy Max** permiten comprar una mejora, llegar al siguiente múltiplo de 25 o comprar el máximo. **Mayús + clic** sobre el icono compra el máximo directamente. Cada nivel otorga un punto de talento.
- Automatización desde nivel 5; prestigio desde nivel 30; cristalización desde nivel 100; desafíos desde nivel 200 tras cristalizar; Grasshop desde nivel 300.
- La progresión posterior incluye acero, fábricas, carga, antipradera, combustible, cohetes, galaxias, cartas estelares, materia oscura, planetoides, prestigio astral y obeliscos lunares. **Map** muestra las ubicaciones desbloqueadas; las flechas inferiores recorren las pantallas adyacentes.
- **P**, **C**, **G** y sus variantes con Mayús conservan los atajos de reinicio del rework y piden confirmación. No se ejecutan mientras escribes ni con un diálogo abierto.

La interfaz y las descripciones conservan el inglés del rework. **Options → How to play** incluye ayuda en español. En móvil se adaptan los tamaños y se apilan los paneles, conservando la misma paleta e iconos.

## Guardado

Guardado automático cada 30 segundos y al ocultar o salir de la página. Los datos permanecen en el almacenamiento local del **mismo navegador y origen**. No se comparte progreso entre dispositivos ni entre abrir el archivo y servirlo por HTTP.

En **Map → Options** puedes guardar, exportar un archivo, importar una partida o borrar el progreso. La exportación es compatible con el formato base64 del rework. La importación valida los datos antes de cargarlos y conserva el progreso actual si falla. Las partidas de la anterior interfaz Grassland se cargan automáticamente en el mismo navegador y origen; no hace falta reiniciar. Cambiar de origen o borrar datos del navegador requiere importar una copia. Si el navegador bloquea el almacenamiento, el juego continúa y muestra un aviso para exportar.

La simulación ocurre mientras la página está abierta; no se conceden ganancias por tiempo con la página cerrada. Se limita el salto de tiempo al volver de una pestaña suspendida para evitar bloqueos del motor.

## Verificar

```sh
npm ci --ignore-scripts --no-audit --no-fund
npm test
npm run test:browser
```

Las **10 pruebas del motor** comprueban generación, recompensas, gasto, bloqueos de nivel, desafíos, prestigio, cristalización, automatización, integridad y carga/guardado. Las **12 comprobaciones de navegador** verifican el tema clásico, la fuente, los iconos, el corte real, las compras desde sus detalles, controles, mapa, confirmación de prestigio, recarga, importación/exportación y escritorio/móvil. Usan escenarios de progreso avanzado para comprobar las 15 pantallas; no equivalen a una partida completa hasta el final.

Las pruebas de navegador arrancan y detienen su propio servidor en el puerto 3177. Usan `/usr/bin/chromium` cuando existe. En otra máquina, instala Chromium con `npx playwright install chromium`, o indica su ruta mediante `CHROMIUM_PATH`. `TEST_BASE_URL` permite probar un servidor ya iniciado. Las capturas se escriben en `test-results/`, que está excluido de Git.

## Estructura y créditos

- `index.html`, `js/`, `images/`, `legacy.css`: interfaz, motor, iconos y estilo original del rework.
- `style.css`, `game.js`: adaptación móvil, accesibilidad, controles táctiles y compatibilidad del guardado.
- `fonts/`: la misma fuente Inconsolata del rework, con licencia SIL OFL.
- `server.mjs`: servidor estático sin dependencias de ejecución.
- `tests/`, `scripts/`: pruebas reproducibles.

Se han corregido valores iniciales ausentes, el temporizador de guardado, la validación recursiva de partidas, bloqueos de compra y bucles de simulación de alto volumen. Consulta [THIRD_PARTY.md](THIRD_PARTY.md) y [LICENSE](LICENSE) para las atribuciones y la licencia MIT del código original. Proyecto independiente, no oficial de Roblox.

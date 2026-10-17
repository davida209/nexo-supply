# Nexo Supply

Ecommerce de muestra para accesorios de escritorio: productos ficticios, carrito, promociones y ciclo de pedidos.

Demo de portafolio de **Lester David Uicab Gongora**. Reconstrucción independiente, desarrollada con Vite, JavaScript, HTML y CSS.

## Funcionalidades

- Seis productos con variantes, búsqueda, categorías y orden por precio.
- Favoritos y ficha de cada producto.
- Carrito con cantidades y validación del stock agregado entre variantes.
- Cupón NEXO10: 10% desde $1,500 en productos.
- Envío de muestra de $149 o gratis desde $1,500 después de descuento.
- Checkout con datos ficticios, sin tarjeta ni pasarela de pago.
- Pedidos persistentes: preparar, simular envío, simular entrega o cancelar antes del envío.
- Inventario local que disminuye al confirmar y se restaura al cancelar.

## Ejecutar

Requiere Node.js 22.12 o superior. Abre una terminal en esta carpeta:

```bash
npm ci
npm run dev
```

## Validar y compilar

```bash
npm test
npm run build
npm run preview
```

Las pruebas de Node.js validan la lógica del dominio. GitHub Actions ejecuta instalación, pruebas y compilación en pull requests y cambios de main/develop.

## Recorrido de prueba

1. Agrega un Teclado Forma 65 y un Mouse Trazo.
2. En Carrito, aplica NEXO10: el total de ejemplo será $1,602.
3. Continúa con el checkout y confirma con los datos precargados.
4. Abre Mis pedidos y cancela: las unidades regresan al stock.
5. Crea otro pedido y simula el envío y la entrega.

## Persistencia y alcance

No realiza cobros ni envíos y no tiene usuarios reales. El inventario no se comparte entre dispositivos. Correo y dirección del checkout no se conservan; el nombre de prueba sí se guarda en el pedido.

Los datos se guardan en localStorage bajo la clave `les-nexo-v1`. No hay servidor, cuentas reales ni sincronización entre dispositivos. Para reiniciar la demo, utiliza Reiniciar demo en el pie de página y confirma el restablecimiento. Utiliza datos ficticios y evita documentos sensibles.

## Estructura

```text
src/main.js       Interfaz y eventos
src/model.js      Catálogo y reglas del dominio
src/utils.js      Almacenamiento, diálogos y utilidades
src/style.css     Estilos y diseño adaptable
public/           Recursos estáticos
tests/            Pruebas de lógica
vercel.json       Compilación y reescritura de rutas
```

Cada carpeta es autosuficiente. No importa archivos de los otros proyectos. Puedes modificar datos y reglas en model.js, la interfaz en main.js y el diseño en style.css.

## Repositorio y demo

- [Ver demo](https://nexo-supply.vercel.app/)
- [Ver código](https://github.com/davida209/nexo-supply)
- [Portafolio de Lester David](https://portfoliolester.vercel.app/)

## Git y despliegue

```bash
git clone https://github.com/davida209/nexo-supply.git
cd nexo-supply
npm ci
npm run dev
```

El repositorio está conectado a su proyecto de Vercel. Los cambios en `main` activan un despliegue automático. GitHub Actions valida las pruebas y la compilación en cambios de `main` y `develop`, y en pull requests.

Configuración: framework Vite, instalación `npm ci`, compilación `npm run build`, salida `dist`. No requiere variables de entorno. No subas `node_modules`, `dist`, `.env` ni `.vercel`; `.gitignore` ya los excluye.

Antes de subir cambios, ejecuta `npm test` y `npm run build`. Usa ramas `feature/*` y pull requests para revisar cambios. Conserva el proyecto de Vercel existente para mantener su dirección pública.

## Recursos visuales

El catálogo combina fotografías de referencia locales e ilustraciones CSS. Las fuentes de las imágenes están en CREDITOS.md.

Las fuentes se incluyen en `public/fonts`, con sus licencias OFL. No se requiere Google Fonts para visualizar el diseño.

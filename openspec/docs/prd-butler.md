Especificación de Producto — Sistema de Gestión de Bar Estudiantil Butler (Autoservicio)

Sección 1 — Visión del Producto

BarTáctil es un sistema de gestión de cafetería estudiantil con quioscos táctiles de autoservicio que permite a los estudiantes realizar y pagar sus pedidos de forma autónoma. Resuelve los largos tiempos de espera durante las horas pico de demanda y disminuye los errores humanos en la toma manual de pedidos.

Sección 2 — Usuarios y Casos de Uso

A continuación se detallan los distintos perfiles de usuario que interactúan con el sistema, su descripción y sus flujos de trabajo específicos:

Usuario Principal: Estudiante

Descripción: Estudiante de la institución con poco tiempo entre clases que busca comprar comida de forma ágil.

Casos de uso:

Navega por el menú visual mediante categorías y agrega productos al carrito de compras de manera interactiva.

Selecciona el método de pago de su preferencia, ya sea electrónico (tarjeta o transferencia a través de Kushki) o físico (efectivo en la caja).

Confirma el pedido y recibe un ticket físico que contiene su código de orden único para retirar su comida.

Usuario Secundario: Cajero

Descripción: Personal del bar que administra el cobro físico en la caja de la cafetería.

Casos de uso:

Visualiza el listado completo de pedidos que se encuentran en estado "Reservado", es decir, pendientes de pago.

Registra los pagos en efectivo recibidos, lo que provoca que el pedido se envíe automáticamente al sistema de cocina.

Cancela pedidos pendientes por algún error detectado o por solicitud directa del estudiante.

Usuario Secundario: Cocinero

Descripción: Personal de cocina encargado de la preparación de los alimentos.

Casos de uso:

Visualiza en tiempo real, a través de la pantalla de cocina (KDS), únicamente aquellos pedidos que están en estado "Preparando".

Consulta los detalles de cada pedido, incluyendo productos específicos, cantidades requeridas y tiempos transcurridos.

Marca los pedidos como "Finalizado" una vez que han sido preparados y entregados al estudiante.

Usuario Secundario: Administrador

Descripción: Propietario o administrador general del bar estudiantil.

Casos de uso:

Gestiona el catálogo de productos (crear, editar, eliminar) y define las categorías del menú.

Administra los usuarios del sistema, controlando sus accesos y asignando roles como Cajero, Cocinero o Administrador.

Consulta reportes detallados de ventas diarios y mensuales, además de analizar el tiempo promedio que toma la cocina en preparar los alimentos.

Sección 3 — Funcionalidades

El sistema está dividido en tres áreas funcionales principales que interactúan entre sí para garantizar un flujo de trabajo continuo.

Área 1: Quiosco de Autoservicio

El usuario puede navegar de forma intuitiva por un catálogo visual de productos organizado por categorías.

El usuario puede ver de forma clara el nombre, imagen, descripción y precio asignado a cada producto en la interfaz táctil.

El usuario puede agregar productos a su carrito de compras y modificar o eliminar cantidades de forma interactiva antes de pagar.

El sistema calcula de manera automática el monto total del pedido en tiempo real.

El usuario puede seleccionar el método de pago que prefiera entre las opciones de Efectivo, Tarjeta o Transferencia.

El sistema genera un código de orden único y emite un ticket físico impreso al momento de confirmarse la orden.

El sistema bloquea de manera automática la opción de agregar productos que tengan un stock igual a cero.

Área 2: Kitchen Display System (KDS)

El sistema de pantalla de cocina muestra en tiempo real únicamente las órdenes que se encuentran en estado "Preparando".

El cocinero puede visualizar de forma rápida el código de orden, la fecha y hora de registro, la lista de productos solicitados y sus cantidades.

El cocinero puede marcar un pedido como "Finalizado" en la interfaz de pantalla, lo que registra automáticamente la hora exacta de finalización y entrega en la base de datos para fines de auditoría y métricas de rendimiento.

Área 3: Módulo de Caja y Gestión Administrativa

El cajero y el administrador pueden iniciar sesión de forma segura con sus credenciales autorizadas.

El cajero puede registrar los pagos de pedidos que estén en estado "Reservado" (pagos en efectivo) o cancelarlos en caso de ser necesario, actualizando al instante el estado en todo el sistema.

El sistema descuenta de forma automática el stock disponible del inventario en el momento exacto en que un pedido pasa al estado "Preparando".

El administrador puede gestionar en su totalidad el catálogo, incluyendo la creación de nuevos productos, categorías y cuentas de usuario.

El sistema genera de forma automática reportes analíticos de ventas (diarios y mensuales), estadísticas de los productos más vendidos y el cálculo del tiempo promedio transcurrido entre los estados "Preparando" y "Finalizado".

Estados de Control del Sistema

Estado de Agotado: El sistema muestra una etiqueta de "Agotado" y deshabilita la compra en la interfaz del quiosco si un producto alcanza stock cero.

Alerta de bajo stock: El sistema genera una alerta visual automática para el administrador cuando el inventario de un producto es menor o igual a 5 unidades.

Gestión de Estados del Pedido: El sistema administra e interconecta cuatro estados posibles para cada orden:

Reservado: El pedido ha sido registrado pero está pendiente de pago.

Preparando: El pedido ha sido pagado y enviado a la cocina para su elaboración.

Finalizado: El pedido fue preparado, entregado al estudiante y archivado como venta exitosa.

Cancelado: El pedido fue anulado mientras se encontraba pendiente de pago.

Elementos Fuera del Alcance (v1)

No se incluye ningún programa de fidelización, sistema de puntos, cupones ni descuentos.

No se incluye control avanzado de inventario por ingredientes (el stock se gestiona únicamente por producto final terminado).

No se contempla la gestión de múltiples sucursales, aplicación móvil de descarga, reserva de mesas físicas ni servicios de entrega a domicilio (delivery).

No se incluye la integración con sistemas contables externos o de facturación electrónica de terceros en esta fase.

Sección 4 — Flujos de Usuario

A continuación se describen los pasos lógicos para las interacciones más importantes del sistema.

Flujo Principal: Realizar pedido y pagar con Tarjeta (Kushki)

El estudiante se acerca al quiosco de autoservicio y visualiza el catálogo de productos ordenado por categorías.

Agrega los productos deseados a su carrito y presiona el botón "Proceder al Pago".

El sistema muestra el total acumulado de la compra y despliega las opciones de pago. El estudiante selecciona la opción "Tarjeta".

El estudiante interactúa con la pasarela de pago integrada de Kushki para ingresar o procesar sus datos.

La pasarela procesa el pago de forma segura en los servidores correspondientes.

Una vez que Kushki confirma que el pago fue exitoso:

El sistema cambia el estado del pedido a "Preparando".

El sistema descuenta las unidades correspondientes del stock físico en la base de datos.

El sistema genera un código único de orden y lo envía en tiempo real (vía WebSockets) a la pantalla de cocina (KDS).

El quiosco imprime de manera física el ticket con el código de orden.

El quiosco regresa automáticamente a la pantalla de bienvenida, quedando disponible para el siguiente estudiante.

Flujo Alternativo: Pago en Efectivo (Caja)

El estudiante arma su carrito en el quiosco de autoservicio y selecciona la opción "Efectivo (Pago en Caja)".

El sistema registra el pedido en estado "Reservado" e imprime un ticket provisional con el código de orden temporal.

El estudiante se dirige a la caja física de la cafetería y presenta su ticket provisional al cajero.

El cajero busca la orden en el panel de caja utilizando el código, recibe el dinero físico y presiona el botón "Registrar Pago".

El sistema actualiza el estado de la orden a "Preparando", descuenta las unidades del stock y envía la información en tiempo real a la pantalla de la cocina (KDS).

Flujo de Error

Si el procesamiento del pago con la pasarela Kushki falla (por tarjeta rechazada, fondos insuficientes o un error inesperado de red), el sistema muestra en pantalla el mensaje: "Su pago no pudo ser procesado. Por favor, intente con otra tarjeta o seleccione Pago en Caja para pagar en efectivo."

El pedido no se envía a la cocina, no se descuenta del inventario y el carrito del estudiante se mantiene intacto en la pantalla del quiosco para que pueda seleccionar una alternativa de pago.

Sección 5 — Arquitectura y Tecnologías

El sistema está estructurado mediante una arquitectura cliente-servidor desacoplada que permite el flujo ágil de datos entre los distintos módulos.

Componentes y Tecnologías

Frontend: Desarrollado con React y Tailwind CSS. Se encarga de proveer las interfaces visuales adaptadas para el Quiosco (diseño táctil), la cocina (KDS de alto contraste), el módulo de caja y el dashboard del administrador.

Backend: Desarrollado con Node.js y Express mediante una API REST. Centraliza la lógica de negocio, la gestión de pedidos, la autenticación de usuarios y el control de inventario.

Base de Datos: PostgreSQL alojado en la plataforma Neon. Almacena de manera relacional las tablas de productos, categorías, ventas, stock, estados de órdenes y datos de usuarios del sistema.

Tiempo Real: Implementado con WebSockets mediante Socket.io o Server-Sent Events (SSE). Permite el envío inmediato de pedidos pagados desde el backend hacia la pantalla de cocina sin necesidad de recargar la página.

Servicio Externo de Pagos: Integración con la API y SDK de Kushki para procesar cobros seguros con tarjeta de crédito/débito y transferencias bancarias.

Servicio Externo de Media: AWS S3 para el almacenamiento seguro y la entrega rápida de las imágenes de los productos del menú.

Despliegue (Deploy): Frontend publicado en Vercel, y Backend alojado en plataformas de hosting en la nube como Render o Railway, con despliegue continuo desde GitHub.

Esquema del Flujo de Datos

El Quiosco, la Caja y el panel de Administración interactúan directamente con el Frontend de React. El Frontend envía las peticiones a la API de Node.js, la cual consulta y escribe datos en la base de datos PostgreSQL en Neon. En paralelo, la API de Node.js se comunica con la pasarela de Kushki y el almacenamiento de AWS S3. Al confirmarse un pago de manera exitosa, el Backend emite un evento de WebSocket para actualizar instantáneamente la pantalla de cocina (KDS).

Sección 6 — Requisitos No Funcionales

Rendimiento

Los pedidos confirmados deben aparecer en la pantalla de cocina (KDS) en tiempo real, estableciendo una latencia máxima de un segundo a través de WebSockets.

El tiempo total de procesamiento en la interfaz del quiosco, desde que el estudiante confirma la compra hasta la emisión del ticket, no debe superar los 3 segundos (excluyendo el tiempo que demore la pasarela externa Kushki).

La interfaz y usabilidad del quiosco de autoservicio deben estar optimizadas para permitir que un estudiante complete una compra fluida en menos de 2 minutos.

El sistema y sus APIs deben garantizar una disponibilidad de servicio superior al 99%.

El sistema debe asegurar el registro correcto del 100% de las transacciones financieras y mantener sincronizado el inventario físico sin duplicaciones ni inconsistencias.

Seguridad

Las llaves de API de Kushki, las credenciales de AWS S3 y las credenciales de la base de datos PostgreSQL se deben configurar exclusivamente a través de variables de entorno en el servidor de Node.js y nunca quedar expuestas en el código del Frontend.

Se debe implementar un sistema de control de acceso basado en roles (RBAC). Las interfaces administrativas, de cocina y de caja requerirán autenticación de usuario mediante contraseñas cifradas con algoritmos seguros como bcrypt.

Toda transacción de pago operada con Kushki debe realizarse bajo entornos seguros y conexiones cifradas con HTTPS de extremo a extremo.

Accesibilidad

La interfaz del quiosco táctil debe contar con botones grandes, con un tamaño mínimo de 48 por 48 píxeles para facilitar la pulsación con los dedos, fuentes de alta legibilidad y una navegación simple libre de elementos distractores.

La pantalla de cocina (KDS) debe emplear colores de alto contraste que faciliten la lectura rápida en condiciones de velocidad y calor dentro del área de preparación.

Las interfaces administrativas y de caja deben ser completamente compatibles y visualmente consistentes en los navegadores Google Chrome, Mozilla Firefox, Apple Safari y Microsoft Edge.

Escalabilidad

El sistema debe estar preparado para soportar transacciones simultáneas de múltiples terminales de quioscos y cajas de cobro al mismo tiempo, sin pérdida de datos en la sincronización del stock de inventario.

Fuera del Alcance Técnico (v1)

No se incluye soporte para procesamiento en modo desconectado (offline). Si el bar pierde la conexión a internet, el quiosco no podrá procesar cobros con Kushki ni sincronizar stock de productos.

No se incluye facturación electrónica formal o integraciones tributarias locales (el ticket emitido es de control estrictamente interno).

No se incluye soporte para múltiples locales, franquicias o sucursales de cafetería (es un sistema dedicado exclusivamente a una sola sucursal local).
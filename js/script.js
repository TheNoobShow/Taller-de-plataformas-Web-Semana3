/**
 * ============================================================================
 * SCRIPT DE COTIZACIÓN DINÁMICA - AURORA DIGITAL
 * ============================================================================
 * Este script gestiona el formulario de cotización de servicios web.
 * Funcionalidades principales:
 * - Validación en tiempo real de campos del formulario
 * - Cálculo de cotización con simulación asincrónica
 * - Manejo de errores y feedback visual al usuario
 * ============================================================================
 */

// Se espera a que el documento cargue para asegurar que todos los elementos del DOM existan.
document.addEventListener('DOMContentLoaded', () => {
    // Referencias a elementos del formulario en el DOM
    const form = document.getElementById('quoteForm');
    const resultado = document.getElementById('resultado');

    /**
     * TABLA DE TARIFAS
     * Define los precios base en CLP para cada tipo de servicio ofrecido.
     * Estos valores se utilizan como referencia para calcular cotizaciones.
     */
    const tarifas = {
        landing: 180000,        // Landing page: $180.000
        corporativa: 320000,    // Web corporativa: $320.000
        catalogo: 260000        // Catálogo de productos: $260.000
    };


    /**
     * FUNCIÓN: setError
     * Actualiza el contenido de texto en los elementos de error.
     * Se utiliza para mostrar mensajes de validación específicos bajo cada campo.
     * 
     * @param {string} id - ID del elemento DOM donde se mostrará el error
     * @param {string} mensaje - Texto del mensaje de error a mostrar
     */
    const setError = (id, mensaje) => {
        document.getElementById(id).textContent = mensaje;
    };

    /**
     * FUNCIÓN: limpiarErrores
     * Borra todos los mensajes de error del formulario.
     * Se ejecuta antes de cada validación para evitar mostrar errores anteriores.
     */
    const limpiarErrores = () => {
        setError('errorNombre', '');
        setError('errorCorreo', '');
        setError('errorServicio', '');
    };


    /**
     * FUNCIÓN: calcularCotizacion
     * Simula el cálculo de una cotización obtenida desde un servidor.
     * Utiliza una Promesa con setTimeout para simular una llamada HTTP asincrónica.
     * 
     * LÓGICA:
     * 1. Obtiene el precio base según el servicio seleccionado
     * 2. Si el cliente requiere soporte mensual, suma $70.000 adicionales
     * 3. Retorna la cotización total después de 600ms (simula latencia de red)
     * 
     * @param {string} servicio - Tipo de servicio: 'landing', 'corporativa' o 'catalogo'
     * @param {boolean} soporte - Indica si el cliente desea agregar soporte mensual
     * @returns {Promise<number>} Promesa que resuelve con el total en CLP
     * @throws {Error} Si el servicio seleccionado no existe en las tarifas
     */
    const calcularCotizacion = (servicio, soporte) => {
        return new Promise((resolve, reject) => {
            // Simula una llamada a servidor con 600ms de espera
            setTimeout(() => {
                // Valida que el servicio exista en la tabla de tarifas
                if (!tarifas[servicio]) {
                    reject(new Error('No fue posible calcular la cotización para el servicio seleccionado.'));
                    return;
                }

                // Calcula tarifa base + soporte opcional
                let total = tarifas[servicio];
                if (soporte) {
                    total += 70000;  // Costo mensual de soporte: $70.000
                }

                resolve(total);
            }, 600);
        });
    };


    /**
     * EVENT LISTENER: Formulario Submit
     * Se activa cuando el usuario envía el formulario de cotización.
     * Realiza validación, cálculo y muestra el resultado en pantalla.
     */
    form.addEventListener('submit', async (event) => {
        // Previene el comportamiento por defecto del formulario (reload)
        event.preventDefault();
        
        // Limpia errores previos antes de nueva validación
        limpiarErrores();

        // ─────────────────────────────────────────────────────────────────────
        // SECCIÓN 1: EXTRAE DATOS DEL FORMULARIO
        // ─────────────────────────────────────────────────────────────────────
        const nombre = document.getElementById('nombre').value.trim();
        const correo = document.getElementById('correo').value.trim();
        const servicio = document.getElementById('servicio').value;
        const soporte = document.getElementById('soporte').checked;

        let valido = true;
        // Expresión regular para validar formato de correo electrónico
        const correoValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        // ─────────────────────────────────────────────────────────────────────
        // SECCIÓN 2: VALIDACIÓN DE ENTRADAS DEL USUARIO
        // ─────────────────────────────────────────────────────────────────────
        // Previene datos incompletos o incorrectos que no se pueden procesar
        
        // Validación del nombre: mínimo 3 caracteres
        if (nombre.length < 3) {
            setError('errorNombre', 'Ingresa un nombre válido con al menos 3 caracteres.');
            valido = false;
        }

        // Validación del correo: debe cumplir con el formato de email
        if (!correoValido.test(correo)) {
            setError('errorCorreo', 'Ingresa un correo electrónico válido.');
            valido = false;
        }

        // Validación del servicio: debe seleccionar una opción
        if (!servicio) {
            setError('errorServicio', 'Debes seleccionar un tipo de servicio.');
            valido = false;
        }

        // Si hay errores, muestra mensaje y detiene el proceso
        if (!valido) {
            resultado.innerHTML = `
                <h3>Resultado</h3>
                <p>Corrige los campos marcados para continuar con la simulación de cotización.</p>
            `;
            return;
        }

        // ─────────────────────────────────────────────────────────────────────
        // SECCIÓN 3: INDICA PROCESAMIENTO AL USUARIO
        // ─────────────────────────────────────────────────────────────────────
        resultado.innerHTML = `
            <h3>Resultado</h3>
            <p>Procesando solicitud de <strong>${nombre}</strong>...</p>
        `;

        // ─────────────────────────────────────────────────────────────────────
        // SECCIÓN 4: CALCULA Y MUESTRA COTIZACIÓN
        // ─────────────────────────────────────────────────────────────────────
        try {
            // Espera el resultado de la cotización (promesa)
            const total = await calcularCotizacion(servicio, soporte);

            // Muestra la cotización con todos los detalles
            resultado.innerHTML = `
                <h3>Resultado</h3>
                <p class="success">Cotización generada correctamente.</p>
                <p><strong>Cliente:</strong> ${nombre}</p>
                <p><strong>Servicio:</strong> ${servicio}</p>
                <p><strong>Soporte mensual:</strong> ${soporte ? 'Sí' : 'No'}</p>
                <p><strong>Total estimado:</strong> $${total.toLocaleString('es-CL')}</p>
            `;
        } catch (error) {
            // ─────────────────────────────────────────────────────────────────────
            // SECCIÓN 5: MANEJO DE ERRORES
            // ─────────────────────────────────────────────────────────────────────
            // Se ejecuta si la Promesa es rechazada (servicio inválido, etc.)
            resultado.innerHTML = `
                <h3>Resultado</h3>
                <p>No se pudo generar la cotización.</p>
                <p class="error">${error.message}</p>
            `;
        }
    });
});

// ═════════════════════════════════════════════════════════════════════════════
// FIN DEL SCRIPT
// ═════════════════════════════════════════════════════════════════════════════

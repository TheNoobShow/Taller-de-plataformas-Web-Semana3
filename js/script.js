// Se espera a que el documento cargue para asegurar que todos los elementos existan.
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('quoteForm');
  const resultado = document.getElementById('resultado');

  const tarifas = {
    landing: 180000,
    corporativa: 320000,
    catalogo: 260000
  };

  // Función reutilizable para mostrar errores debajo de cada campo.
  const setError = (id, mensaje) => {
    document.getElementById(id).textContent = mensaje;
  };

  const limpiarErrores = () => {
    setError('errorNombre', '');
    setError('errorCorreo', '');
    setError('errorServicio', '');
  };

  // Se usa una promesa para simular una cotización obtenida desde un servidor.
  const calcularCotizacion = (servicio, soporte) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!tarifas[servicio]) {
          reject(new Error('No fue posible calcular la cotización para el servicio seleccionado.'));
          return;
        }

        let total = tarifas[servicio];
        if (soporte) {
          total += 70000;
        }

        resolve(total);
      }, 600);
    });
  };

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    limpiarErrores();

    const nombre = document.getElementById('nombre').value.trim();
    const correo = document.getElementById('correo').value.trim();
    const servicio = document.getElementById('servicio').value;
    const soporte = document.getElementById('soporte').checked;

    let valido = true;
    const correoValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Validación de entradas del usuario para prevenir datos incompletos o incorrectos.
    if (nombre.length < 3) {
      setError('errorNombre', 'Ingresa un nombre válido con al menos 3 caracteres.');
      valido = false;
    }

    if (!correoValido.test(correo)) {
      setError('errorCorreo', 'Ingresa un correo electrónico válido.');
      valido = false;
    }

    if (!servicio) {
      setError('errorServicio', 'Debes seleccionar un tipo de servicio.');
      valido = false;
    }

    if (!valido) {
      resultado.innerHTML = `
        <h3>Resultado</h3>
        <p>Corrige los campos marcados para continuar con la simulación de cotización.</p>
      `;
      return;
    }

    resultado.innerHTML = `
      <h3>Resultado</h3>
      <p>Procesando solicitud de <strong>${nombre}</strong>...</p>
    `;

    try {
      const total = await calcularCotizacion(servicio, soporte);

      resultado.innerHTML = `
        <h3>Resultado</h3>
        <p class="success">Cotización generada correctamente.</p>
        <p><strong>Cliente:</strong> ${nombre}</p>
        <p><strong>Servicio:</strong> ${servicio}</p>
        <p><strong>Soporte mensual:</strong> ${soporte ? 'Sí' : 'No'}</p>
        <p><strong>Total estimado:</strong> $${total.toLocaleString('es-CL')}</p>
      `;
    } catch (error) {
      // Manejo de error en caso de fallo en la promesa o selección inválida.
      resultado.innerHTML = `
        <h3>Resultado</h3>
        <p>No se pudo generar la cotización.</p>
        <p class="error">${error.message}</p>
      `;
    }
  });
});

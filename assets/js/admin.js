 
// admin.js

// Función para cargar la barra de navegación y el footer en admin.html
function cargarComponentesAdmin() {
    cargarComponente('navbar-admin', 'components/navbar.html');
    cargarComponente('footer-admin', 'components/footer.html').then(() => {
        cargarTablaProductos();
        cargarTablaOrdenes();
    });
}

// Función para agregar un nuevo producto
function agregarProducto(event) {
    event.preventDefault();

    const nombre = document.getElementById('nombre-producto').value.trim();
    const precio = parseFloat(document.getElementById('precio-producto').value);
    const imagen = document.getElementById('imagen-producto').value.trim();

    if (!nombre || isNaN(precio) || !imagen) {
        alert('Por favor, completa todos los campos correctamente.');
        return;
    }

    const nuevoProducto = {
        id: `prod-${Date.now()}`,
        nombre: nombre,
        precio: precio,
        imagen: imagen
    };

    let productos = JSON.parse(localStorage.getItem('productos')) || [];
    productos.push(nuevoProducto);
    localStorage.setItem('productos', JSON.stringify(productos));

    // Resetear el formulario
    document.getElementById('form-agregar-producto').reset();

    // Actualizar la tabla de productos
    cargarTablaProductos();
}

// Función para cargar la tabla de productos en admin.html
function cargarTablaProductos() {
    const productos = JSON.parse(localStorage.getItem('productos')) || [];
    const tablaProductos = document.getElementById('tabla-productos');
    tablaProductos.innerHTML = '';

    if (productos.length === 0) {
        tablaProductos.innerHTML = '<tr><td colspan="4" class="text-center py-4">No hay productos disponibles.</td></tr>';
        return;
    }

    productos.forEach(producto => {
        const fila = `
            <tr>
                <td class="py-2 px-4 border-b">
                    <img src="${producto.imagen}" alt="${producto.nombre}" class="w-16 h-16 object-cover rounded">
                </td>
                <td class="py-2 px-4 border-b">${producto.nombre}</td>
                <td class="py-2 px-4 border-b">Q ${producto.precio.toFixed(2)}</td>
                <td class="py-2 px-4 border-b">
                    <button onclick="eliminarProducto('${producto.id}')" class="text-red-600 hover:text-red-800">Eliminar</button>
                </td>
            </tr>
        `;
        tablaProductos.insertAdjacentHTML('beforeend', fila);
    });
}

// Función para eliminar un producto
function eliminarProducto(idProducto) {
    let productos = JSON.parse(localStorage.getItem('productos')) || [];
    productos = productos.filter(producto => producto.id !== idProducto);
    localStorage.setItem('productos', JSON.stringify(productos));
    cargarTablaProductos();
}

// Función para cargar la tabla de órdenes en admin.html
function cargarTablaOrdenes() {
    const ordenes = JSON.parse(localStorage.getItem('ordenes')) || [];
    const tablaOrdenes = document.getElementById('tabla-ordenes');
    tablaOrdenes.innerHTML = '';

    if (ordenes.length === 0) {
        tablaOrdenes.innerHTML = '<tr><td colspan="5" class="text-center py-4">No hay órdenes realizadas.</td></tr>';
        return;
    }

    ordenes.forEach(orden => {
        const fila = `
            <tr>
                <td class="py-2 px-4 border-b">${orden.id}</td>
                <td class="py-2 px-4 border-b">${orden.nombre} (${orden.correo})</td>
                <td class="py-2 px-4 border-b">Q ${orden.total.toFixed(2)}</td>
                <td class="py-2 px-4 border-b">${orden.fecha}</td>
                <td class="py-2 px-4 border-b">
                    <button onclick="verDetallesOrden('${orden.id}')" class="text-blue-600 hover:text-blue-800">Ver Detalles</button>
                </td>
            </tr>
        `;
        tablaOrdenes.insertAdjacentHTML('beforeend', fila);
    });
}

// Función para ver detalles de una orden
function verDetallesOrden(idOrden) {
    const ordenes = JSON.parse(localStorage.getItem('ordenes')) || [];
    const orden = ordenes.find(o => o.id === idOrden);

    if (!orden) {
        alert('Orden no encontrada.');
        return;
    }

    let detalles = `
        <h3 class="text-xl font-semibold mb-2">Detalles de la Orden: ${orden.id}</h3>
        <p><strong>Cliente:</strong> ${orden.nombre}</p>
        <p><strong>Correo:</strong> ${orden.correo}</p>
        <p><strong>Dirección:</strong> ${orden.direccion}</p>
        <p><strong>Método de Pago:</strong> ${orden.metodoPago}</p>
        <p><strong>Fecha:</strong> ${orden.fecha}</p>
        <h4 class="text-lg font-semibold mt-4">Productos:</h4>
        <ul class="list-disc list-inside">
    `;

    orden.productos.forEach(p => {
        detalles += `<li>${p.nombre} - Q ${p.precio.toFixed(2)} x ${p.cantidad} = Q ${p.subtotal.toFixed(2)}</li>`;
    });

    detalles += `
        </ul>
        <p class="mt-2"><strong>Total:</strong> Q ${orden.total.toFixed(2)}</p>
    `;

    alert(detalles);
}

// Función para inicializar las funcionalidades de administración
function inicializarAdmin() {
    const formAgregarProducto = document.getElementById('form-agregar-producto');
    if (formAgregarProducto) {
        formAgregarProducto.addEventListener('submit', agregarProducto);
    }
}

// Inicializar la administración al cargar el DOM
document.addEventListener("DOMContentLoaded", () => {
    cargarComponentesAdmin();
    inicializarAdmin();
    window.eliminarProducto = eliminarProducto;
    window.verDetallesOrden = verDetallesOrden;
});

function añadirAlCarrito(idProducto) {
    let carrito = JSON.parse(localStorage.getItem('carrito')) || {};

    if (carrito[idProducto]) {
        carrito[idProducto] += 1;
    } else {
        carrito[idProducto] = 1;
    }

    localStorage.setItem('carrito', JSON.stringify(carrito));
    actualizarContadorCarrito();
    mostrarMensaje('Producto añadido al carrito.');
}
// Función para cargar un componente HTML en un contenedor específico
function cargarComponente(id, ruta) {
    return fetch(ruta)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error cargando ${ruta}: ${response.status} ${response.statusText}`);
            }
            return response.text();
        })
        .then(data => {
            const elemento = document.getElementById(id);
            if (elemento) {
                elemento.innerHTML = data;
            }
        })
        .catch(error => {
            console.error(error);
            const elemento = document.getElementById(id);
            if (elemento) {
                elemento.innerHTML = `<p class="text-red-500">Error cargando el componente: ${error.message}</p>`;
            }
        });
}

// Función para cargar todos los componentes necesarios en index.html
function cargarComponentes() {
    cargarComponente('navbar', 'components/navbar.html').then(() => {
        // Configurar el modal y actualizar el contador después de cargar el navbar
        actualizarContadorCarrito();
        configurarModalCarrito();
    });
    cargarComponente('productos', 'components/productos.html').then(() => {
        // Cargar productos después de cargar el componente de productos
        cargarProductos();
    });
    cargarComponente('footer', 'components/footer.html');
}

// Función para actualizar el contador del carrito en la barra de navegación
function actualizarContadorCarrito() {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || {};
    const contador = Object.values(carrito).reduce((acc, cantidad) => acc + cantidad, 0);
    const contadorElemento = document.getElementById('contador-carrito');
    if (contadorElemento) {
        contadorElemento.textContent = contador;
    }
}

// Función para configurar la apertura y cierre del modal del carrito
function configurarModalCarrito() {
    const botonCarrito = document.getElementById('boton-carrito');
    const modalCarrito = document.getElementById('modal-carrito');
    const cerrarModal = document.querySelector('.modal-close');

    if (botonCarrito && modalCarrito && cerrarModal) {
        // Abrir modal al hacer clic en el botón del carrito
        botonCarrito.addEventListener('click', () => {
            // Verificar si el elemento 'contenido-carrito' existe
            console.log('Contenido del carrito antes de cargar:', document.getElementById('contenido-carrito'));
            cargarContenidoCarrito(); // Cargar contenido cada vez que se abre el modal
            modalCarrito.classList.remove('hidden');
        });

        // Cerrar modal al hacer clic en el botón de cerrar
        cerrarModal.addEventListener('click', () => {
            modalCarrito.classList.add('hidden');
        });

        // Cerrar modal al hacer clic fuera del contenido del modal
        window.addEventListener('click', (event) => {
            if (event.target === modalCarrito) {
                modalCarrito.classList.add('hidden');
            }
        });
    }
}

// Función para cargar y mostrar los productos en el contenedor 'lista-productos'
function cargarProductos() {
    const productos = JSON.parse(localStorage.getItem('productos')) || [];
    const listaProductos = document.getElementById('lista-productos');

    if (listaProductos) {
        listaProductos.innerHTML = ''; // Limpiar contenido previo

        productos.forEach(producto => {
            const productoElemento = document.createElement('div');
            productoElemento.classList.add('product-card', 'bg-white', 'p-4', 'rounded', 'shadow');

            productoElemento.innerHTML = `
                <img src="${producto.imagen}" alt="${producto.nombre}" class="w-full h-48 object-cover rounded">
                <h3 class="text-lg font-semibold mt-2">${producto.nombre}</h3>
                <p class="text-gray-700">Q ${producto.precio.toFixed(2)}</p>
                <button onclick="añadirAlCarrito('${producto.id}')" class="mt-2 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">
                    Añadir al Carrito
                </button>
            `;

            listaProductos.appendChild(productoElemento);
        });
    }
}

// Funciones para gestionar el carrito
function añadirAlCarrito(idProducto) {
    let carrito = JSON.parse(localStorage.getItem('carrito')) || {};
    if (carrito[idProducto]) {
        carrito[idProducto] += 1;
    } else {
        carrito[idProducto] = 1;
    }
    localStorage.setItem('carrito', JSON.stringify(carrito));
    actualizarContadorCarrito();
    alert('Producto añadido al carrito.');
}

// Función para cargar el contenido del carrito en el modal
function cargarContenidoCarrito() {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || {};
    const contenidoCarrito = document.getElementById('contenido-carrito');
    const totalCarritoModal = document.getElementById('total-carrito-modal');

    if (contenidoCarrito) {
        contenidoCarrito.innerHTML = ''; // Limpiar contenido previo
        let total = 0;

        const productos = JSON.parse(localStorage.getItem('productos')) || [];

        for (const [id, cantidad] of Object.entries(carrito)) {
            const producto = productos.find(p => p.id === id);

            if (producto) {
                const subtotal = producto.precio * cantidad;
                total += subtotal;

                const productoElemento = document.createElement('div');
                productoElemento.classList.add('flex', 'items-center', 'justify-between', 'py-2');

                productoElemento.innerHTML = `
                    <div class="flex items-center">
                        <img src="${producto.imagen}" alt="${producto.nombre}" class="w-16 h-16 object-cover rounded">
                        <div class="ml-4">
                            <h4 class="text-lg font-semibold">${producto.nombre}</h4>
                            <p class="text-gray-700">Q ${producto.precio.toFixed(2)} x ${cantidad} = Q ${subtotal.toFixed(2)}</p>
                        </div>
                    </div>
                    <button onclick="eliminarDelCarrito('${id}')" class="text-red-500 hover:text-red-700">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 fill-current" viewBox="0 0 24 24">
                            <path d="M6 19c0 1.104.896 2 2 2h8c1.104 0 2-.896 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                        </svg>
                    </button>
                `;

                contenidoCarrito.appendChild(productoElemento);
            } else {
                console.warn(`Producto con ID ${id} no encontrado en productos.`);
            }
        }

        totalCarritoModal.textContent = `Total: Q ${total.toFixed(2)}`;
    }
}

// Función para eliminar un producto del carrito
function eliminarDelCarrito(idProducto) {
    let carrito = JSON.parse(localStorage.getItem('carrito')) || {};
    if (carrito[idProducto]) {
        delete carrito[idProducto];
        localStorage.setItem('carrito', JSON.stringify(carrito));
        actualizarContadorCarrito();
        cargarContenidoCarrito();
        alert('Producto eliminado del carrito.');
    }
}

// Función para configurar el formulario de checkout si está presente
function configurarFormularioCheckout() {
    const formCheckout = document.getElementById('form-checkout');
    if (formCheckout) {
        formCheckout.addEventListener('submit', function(event) {
            event.preventDefault();

            const nombre = document.getElementById('nombre').value.trim();
            const direccion = document.getElementById('direccion').value.trim();
            const correo = document.getElementById('correo').value.trim();
            const metodoPago = document.getElementById('metodo-pago').value;

            if (!nombre || !direccion || !correo || !metodoPago) {
                alert('Por favor, completa todos los campos.');
                return;
            }

            const carrito = JSON.parse(localStorage.getItem('carrito')) || {};
            const productos = JSON.parse(localStorage.getItem('productos')) || [];
            let total = 0;

            const detalles = [];

            for (const [id, cantidad] of Object.entries(carrito)) {
                const producto = productos.find(p => p.id === id);
                if (producto) {
                    const subtotal = producto.precio * cantidad;
                    total += subtotal;
                    detalles.push(`${producto.nombre} - Q ${producto.precio.toFixed(2)} x ${cantidad} = Q ${subtotal.toFixed(2)}`);
                }
            }

            if (detalles.length === 0) {
                alert('Tu carrito está vacío.');
                return;
            }

            const orden = {
                id: `orden-${Date.now()}`,
                nombre: nombre,
                direccion: direccion,
                correo: correo,
                metodoPago: metodoPago,
                productos: detalles,
                total: total.toFixed(2),
                fecha: new Date().toLocaleString()
            };

            // Obtener órdenes existentes
            let ordenes = JSON.parse(localStorage.getItem('ordenes')) || [];
            ordenes.push(orden);
            localStorage.setItem('ordenes', JSON.stringify(ordenes));

            // Limpiar el carrito
            localStorage.removeItem('carrito');

            // Mostrar confirmación
            const mensajeConfirmacion = document.getElementById('mensaje-confirmacion');
            if (mensajeConfirmacion) {
                mensajeConfirmacion.textContent = `¡Gracias por tu compra, ${nombre}! Tu orden ha sido confirmada. ID de Orden: ${orden.id}`;
            }

            // Resetear el formulario
            formCheckout.reset();

            // Actualizar el contador del carrito
            actualizarContadorCarrito();
        });
    }
}

// Función para inicializar los componentes y configuraciones cuando se carga el DOM
function inicializar() {
    cargarComponentes();

    // Asignar funciones al objeto window para acceder desde el HTML
    window.añadirAlCarrito = añadirAlCarrito;
    window.eliminarDelCarrito = eliminarDelCarrito;

    // Configurar el formulario de checkout si está presente
    configurarFormularioCheckout();
}

// Inicializar la tienda al cargar el DOM
document.addEventListener("DOMContentLoaded", inicializar);

// Inicializar productos si no existen (Opcional)
function inicializarProductosDefault() {
    if (!localStorage.getItem('productos')) {
        const productosDefault = [
            {
                id: 'prod-1729182657921',
                nombre: 'Labiales',
                precio: 150,
                imagen: 'https://siman.vtexassets.com/arquivos/ids/2784204-800-800?v=637849671625770000&width=800&height=800&aspect=true'
            },
            {
                id: 'prod-1729182672843',
                nombre: 'Labial 2',
                precio: 1500,
                imagen: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTgjtFKaIT54ABCfAMIUcV35CahsTLb5TF9Sg&s'
            }
        ];
        localStorage.setItem('productos', JSON.stringify(productosDefault));
        alert('Productos iniciales cargados en el Local Storage.');
        location.reload();
    }
}

// Descomenta la línea siguiente para inicializar productos por defecto
inicializarProductosDefault();

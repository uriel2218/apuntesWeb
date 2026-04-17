let carrito = [];

const productos = [
  { id: 1, nombre: "Correa", precio: 200 },
  { id: 2, nombre: "Shampoo", precio: 150 },
  { id: 3, nombre: "Juguete", precio: 300 }
];

function agregar(id){
  const producto = productos.find(p => p.id === id);

  const existente = carrito.find(p => p.id === id);

  if(existente){
    existente.cantidad++;
  } else {
    carrito.push({
      id: producto.id,
      nombre: producto.nombre,
      precio: producto.precio,
      cantidad: 1
    });
  }

  mostrarCarrito();
}

function mostrarCarrito(){
  const lista = document.getElementById("listaCarrito");
  lista.innerHTML = "";

  let total = 0;
  let totalItems = 0;

  carrito.forEach((item, index) => {
    const li = document.createElement("li");
    li.className = "list-group-item";

    li.innerHTML = `
      ${item.nombre} 
      | Cantidad: ${item.cantidad} 
      | Subtotal: $${item.precio * item.cantidad}
      <button class="btn btn-danger btn-sm mr-5" onclick="eliminar(${index})">-</button>
    `;

    lista.appendChild(li);

    total += item.precio * item.cantidad;
    totalItems += item.cantidad;
  });

  document.getElementById("total").textContent = "Total: $" + total;
  document.getElementById("contador").textContent = "Productos: " + totalItems;
}

function eliminar(index){

  if(carrito[index].cantidad > 1){
    carrito[index].cantidad--;
  } else {
    carrito.splice(index, 1);
  }

  mostrarCarrito();
}
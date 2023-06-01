const socket = io();

const tarjetas = document.getElementById("tarjetas");

const crearTarjeta = (productos) => {
    let tarjeta = '';

    productos.forEach((producto) => {
        tarjeta += '<div class="tarjetas">';
        tarjeta += '<p>' + producto.title + '</p>';
        tarjeta += '<p>' + producto.description + '</p>';
        tarjeta += '<p>' + producto.code + '</p>';
        tarjeta += '<p>' + producto.price + '</p>';
        tarjeta += '<p>' + producto.stock + '</p>';
        tarjeta += '<p>' + producto.category + '</p>';
        tarjeta += '<p>' + producto.thumbnail + '</p>';
        tarjeta += '</div>';
    });

    return tarjeta;
}

socket.on('products', (products) => {
    crearTarjeta(products)
    tarjetas.innerHTML = crearTarjeta(products);
})
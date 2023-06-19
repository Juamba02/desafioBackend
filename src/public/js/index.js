const socket = io();

const tarjetas = document.getElementById("tarjetas");

const crearTarjeta = (productos) => {
  let tarjeta = "";

  productos.forEach((producto) => {
    tarjeta += '<div class="tarjetas">';
    tarjeta += "<p>" + producto.title + "</p>";
    tarjeta += "<p>" + producto.description + "</p>";
    tarjeta += "<p>" + producto.code + "</p>";
    tarjeta += "<p>" + producto.price + "</p>";
    tarjeta += "<p>" + producto.stock + "</p>";
    tarjeta += "<p>" + producto.category + "</p>";
    tarjeta += "<p>" + producto.thumbnail + "</p>";
    tarjeta += "</div>";
  });

  return tarjeta;
};

socket.on("products", (products) => {
  crearTarjeta(products);
  tarjetas.innerHTML = crearTarjeta(products);
});

let user;
// const messageManager = new MessageManager()

const chatbox = document.getElementById("chatbox");

const messageLogs = document.getElementById("messageLogs");

Swal.fire({
  title: "Identificate",

  input: "text",

  inputValidator: (value) => {
    return !value && "necesitas escribir un nombre para identificarte";
  },

  allowOutsideClick: false,
}).then((result) => {
  console.log(result.value);

  user = result.value;

  socket.emit("authenticatedUser", user);
});

chatbox.addEventListener("keyup", (evt) => {
  if (evt.key === "Enter") {
    socket.emit("message", { user: user, message: chatbox.value });
    // messageManager.saveMessage({ user: user, message: chatbox.value })
    chatbox.value == "";
  }
});

socket.on("imprimir", (data) => {
  let mensajes = "";

  data.forEach((msj) => {
    mensajes += `${msj.user} escribio: ${msj.message} <br/>`;
  });

  messageLogs.innerHTML = mensajes;
});

socket.on("newUserAlert", (data) => {
  if (!user) return;

  Swal.fire({
    toast: true,

    position: "top-end",

    showConfirmButton: false,

    timer: 5000,

    title: data + " se ha unido al chat",

    icon: "success",
  });
});

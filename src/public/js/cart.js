const cartBtn = document.getElementById("cartBtn");

cartBtn.addEventListener("click", () => {
    // Realizar una solicitud al servidor para obtener los datos del usuario autenticado
    fetch("/api/users/userCart", {
        method: "GET",
        credentials: "include", // Incluye las cookies en la solicitud
    })
    .then((res) => {
        if (!res.ok) {
            throw new Error(`Network response was not ok: ${res.status}`);
        }
        return res.json();
    })
    .then((data) => {
        const cartId = data.cart; // Obtener el cartId desde la respuesta del servidor

        // Redirigir al usuario a la ruta del carrito con el ID correcto
        window.location.href = `/cart/${cartId}`;
    })
    .catch((error) => {
        console.error('Error:', error);
        // Manejar el error, por ejemplo, mostrar un mensaje al usuario
    });
});

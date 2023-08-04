const addToCartBtns = document.querySelectorAll(".addToCartBtn");

addToCartBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    const productId = btn.getAttribute("dataproductId");
    
    // Realizar una solicitud al servidor para obtener los datos del usuario autenticado
    fetch("/api/users/userCart", {
      method: "GET",
      credentials: "include", // Incluye las cookies en la solicitud
    })
      .then((res) => res.json())
      .then((data) => {
        const cartId = data.cart; // Obtener el cartId desde la respuesta del servidor
        console.log({cartId:cartId});

        // Realizar una solicitud para agregar el producto al carrito
        fetch(`/api/carts/${cartId}/product/${productId}`, {
          method: "POST",
        })
          .then((res) => res.json())
          .then((data) => {
            // Capturar el mensaje de éxito del servidor y mostrarlo como una alerta
        if (data.message) {
            alert(data.message);
            console.log(data);
            }
        })
          .catch((error) => console.error(error));
      })
      .catch((error) => console.error(error));
  });
});


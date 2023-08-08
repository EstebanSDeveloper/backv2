const purchaseBtn = document.getElementById("purchaseBtn");

purchaseBtn.addEventListener("click", async () => {
    try {
        // Obtener el cartId del usuario autenticado
        const cartResponse = await fetch("/api/users/userCart", {
            method: "GET",
            credentials: "include",
        });
        const cartData = await cartResponse.json();
        const cartId = cartData.cart;
        console.log(cartId);

        // Realizar una solicitud al servidor para realizar la compra
        fetch(`/api/carts/${cartId}/purchase`, {
            method: "POST",
            credentials: "include", // Incluye las cookies en la solicitud
        })
        .then((res) => {
            if (!res.ok) {
                throw new Error(`Network response was not ok: ${res.status}`);
            }
            return res.json();
        })
        .then((data) => {
            // Realizar una solicitud para eliminar el carrito después de realizar la compra
            fetch(`/api/carts/${cartId}`, {
                method: "DELETE",
            })
            .then((deleteRes) => deleteRes.json())
            .then((deleteData) => {
                // Redirigir al usuario a la página de agradecimiento
                window.location.href = `/purchase`;
            })
            .catch((deleteError) => {
                console.error('Error deleting cart:', deleteError);
            });
        })
        .catch((error) => {
            console.error('Error:', error);
            // Manejar el error, por ejemplo, mostrar un mensaje al usuario
        });
    } catch (error) {
        console.error('Error:', error);
        // Manejar el error, por ejemplo, mostrar un mensaje al usuario
    }
});

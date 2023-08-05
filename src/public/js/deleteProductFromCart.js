const deleteCartBtn = document.querySelectorAll(".deleteCartBtn");

deleteCartBtn.forEach(async (btn) => {
    btn.addEventListener("click", async () => {
        const productId = btn.getAttribute("data-product-id");
        console.log(productId)
      
        try {
            // Obtener el cartId del usuario autenticado
            const cartResponse = await fetch("/api/users/userCart", {
                method: "GET",
                credentials: "include",
            });
            const cartData = await cartResponse.json();
            const cartId = cartData.cart;
            console.log(cartId)

            // Eliminar el producto del carrito
            const deleteResponse = await fetch(`/api/carts/${cartId}/product/${productId}`, {
                method: "DELETE",
                credentials: "include",
            });
            const deleteData = await deleteResponse.json();

            if (deleteData.message) {
                alert(deleteData.message);
                console.log(deleteData);
            }
        } catch (error) {
            console.error(error);
        }
    });
});

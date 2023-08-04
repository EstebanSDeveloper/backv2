const addToCartBtns = document.querySelectorAll(".addToCartBtn");

addToCartBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    const productId = btn.getAttribute("dataproductId");
    const cartId = '64c4853174b88ace74cbd3f0';
  
    fetch(`/api/carts/${cartId}/product/${productId}`, {
      method: "POST",
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
      })
      .catch((error) => console.error(error));
  });
});

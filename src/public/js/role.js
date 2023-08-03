const roleBtns = document.querySelectorAll(".roleBtn");

roleBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    const userId = btn.dataset.userId; // Obtiene el ID del usuario del atributo data-user-id

    fetch(`/api/users/premium/${userId}`, {
      method: "PUT",
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.status === "error") {
          alert(data.message); // Mostrar alerta con el mensaje de error del backend
        } else {
          location.reload(); // Recargar la página en caso de éxito (opcional)
        }
      })
      .catch((error) => console.error(error));
  });
});


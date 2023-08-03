
const deleteUserBtns = document.querySelectorAll(".deleteUserBtn");

deleteUserBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    const userId = btn.dataset.userId; // Obtiene el ID del usuario del atributo data-user-id

    fetch(`/api/users/${userId}`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        location.reload();
      })
      .catch((error) => console.error(error));
  });
});


const logoutBtn = document.getElementById("logoutBtn");

logoutBtn.addEventListener("click",()=>{
    fetch("/api/sessions/logout",{
        method:"post"
    }).then((response)=>{
        return response.json()
    })
    .then(()=>{
        window.location.href="/login"
    });
});
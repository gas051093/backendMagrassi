const formUpdate = document.getElementById("formUpdate");
const { inputEmail, inputPassword } = formUpdate;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
formUpdate.addEventListener("submit",async (e) => {
  e.preventDefault();
  if (!inputEmail.value || !emailRegex.test(String(inputEmail.value).trim())) {
    return noti("warning", `Ingrese un email valido`);
  }
  if (!inputPassword.value)
        return noti("warning", `la contrasena no puede estar vacia`);
    
    validateEmail(inputEmail.value);
    const user = {
        email: inputEmail.value,
        password: inputPassword.value
    }
    try {
        const data = await fetch("/user/update", {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify(user),
        });
        const res = await data.json()
        if (data.ok) {
            Swal.fire({
            title: "se realizo la modificacion de su constrasena",
            text: `${res.email}`,
            footer: `<a href="/register">Registrate aca!</a>`,
                icon: "error",
                didClose: () => { 
                    formUpdate.reset()
                    window.location.href = "/login";
                }
        });
        } else {
        return Swal.fire({
            title: "Error de inicio",
            text: `${res.message}`,
            footer: `<a href="/register">Registrate aca!</a>`,
            icon: "error",
        });
        }
    } catch (err) {
        console.log(err.message)
    }
});
const validateEmail = async (email) => {
  try {
    const checkEmail = await fetch(`/user/check?email=${email}`);
    const res = await checkEmail.json();
    if (!res.exists) {
      return Swal.fire({
        title: "Revise el usuario",
        text: `el usuario no existe`,
        footer: `<a href="/register">Registrate aca!</a>`,
        icon: "error",
      });
    }
  } catch (err) {
    console.log(err.message);
  }
};

const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.onmouseenter = Swal.stopTimer;
    toast.onmouseleave = Swal.resumeTimer;
  },
});
const noti = (ico, msg) => {
  Toast.fire({
    icon: `${ico}`,
    title: `${msg}`,
  });
};

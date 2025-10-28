const formRegister = document.getElementById("form_register");
const {
  inputFirstname,
  inputLastname,
  inputAge,
  inputEmail,
  inputPassword,
  inputPassword2,
} = formRegister;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
formRegister.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!inputFirstname.value) return noti("warning", `Ingrese un nombre valido`);
  if (!inputLastname.value)
    return noti("warning", `Ingrese un Apellido valido`);
  if (!inputAge.value || inputAge.value <= 1)
    return noti("warning", `Ingrese una edad valida`);
  if (!inputEmail.value || !emailRegex.test(String(inputEmail.value).trim())) {
    return noti("warning", `Ingrese un email valido`);
  }
  if (!inputPassword.value || !inputPassword2.value) {
    return noti("warning", `Ingrese la contrasena`);
  }
  if (inputPassword.value != inputPassword2.value) {
    return noti("warning", `Las contrasenas no coinciden`);
  }
  //una vez validado vamos a poceder a crear el objeto para mandar al back
  const user = {
    first_name: inputFirstname.value,
    last_name: inputLastname.value,
    age: inputAge.value,
    email: inputEmail.value,
    password: inputPassword.value,
  };
    const check_email = await validateEmail(inputEmail.value);
  try {
    const createUser = await fetch("/user/register", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(user),
    });
    const res = await createUser.json();
    Swal.fire({
      title: "Usuario creado",
      text: `Usuario creado con el email: ${res.payload.email}`,
      icon: "success",
        didClose: () => {
            formRegister.reset();
            window.location.href = "/login";
      }
    });
  } catch (err) {
    console.log(err.message);
  }
});
const validateEmail = async (email) => {
  try {
    const checkEmail = await fetch(`/user/check?email=${email}`);
    const res = await checkEmail.json();
      if (res.exists) {
          return Swal.fire({
            title: "El usuario ya existe",
            text: ``,
            icon: "error",
          });
       }
  } catch (err) {
      console.log(err.message)
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

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

  if (!inputFirstname.value) return noti("warning", "Ingrese un nombre válido");
  if (!inputLastname.value)
    return noti("warning", "Ingrese un apellido válido");
  if (!inputAge.value || Number(inputAge.value) <= 1)
    return noti("warning", "Ingrese una edad válida");
  if (!inputEmail.value || !emailRegex.test(inputEmail.value.trim()))
    return noti("warning", "Ingrese un email válido");
  if (!inputPassword.value || !inputPassword2.value)
    return noti("warning", "Ingrese la contraseña");
  if (inputPassword.value !== inputPassword2.value)
    return noti("warning", "Las contraseñas no coinciden");

  // Validar si el email ya existe
  const emailExists = await validateEmail(inputEmail.value);
  if (emailExists) return; // si existe, salimos

  const user = {
    first_name: inputFirstname.value,
    last_name: inputLastname.value,
    age: inputAge.value,
    email: inputEmail.value,
    password: inputPassword.value,
  };

  try {
    const createUser = await fetch("/user/register", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(user),
    });
    const res = await createUser.json();
    console.log(res)
    if (createUser.ok) {
      Swal.fire({
        title: "Usuario creado",
        text: `Usuario creado con el email: ${res.payload.email}`,
        icon: "success",
      }).then(() => {
        formRegister.reset();
        window.location.href = "/login";
      });
    } else {
      Swal.fire({
        title: "Error",
        text: res.message,
        icon: "error",
      });
    }
  } catch (err) {
    console.log(err.message);
  }
});

const validateEmail = async (email) => {
  try {
    const checkEmail = await fetch(`/user/check?email=${email}`);
    const res = await checkEmail.json();
    if (res.exists) {
      await Swal.fire({
        title: "El usuario ya existe",
        icon: "error",
      });
      return true;
    }
    return false;
  } catch (err) {
    console.log(err.message);
    return false;
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
  Toast.fire({ icon: ico, title: msg });
};
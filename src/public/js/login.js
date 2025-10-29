const loginForm = document.getElementById("loginForm");
const { loginEmail, loginPassword } = loginForm;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!loginEmail.value || !emailRegex.test(String(loginEmail.value).trim())) {
    return noti("warning", `Ingrese un email valido`);
  }
  if (!loginPassword.value)
    return noti("warning", `la contrasena no puede estar vacia`);
  const user = {
    email: loginEmail.value,
    password: loginPassword.value,
  };
  validateEmail(loginEmail.value);
  try {
    const data = await fetch("/user/login", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(user),
    });
    const res = await data.json();
    if (data.ok) {
      window.location.href = "/profile";
    } else {
      return Swal.fire({
        title: "Error de inicio",
        text: `${res.message}`,
        footer: `<a href="/register">Registrate aca!</a>`,
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
    if (!res.exists) {
      return Swal.fire({
        title: "Error de inicio",
        text: `${res.message}`,
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

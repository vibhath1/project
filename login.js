document.addEventListener("DOMContentLoaded", function () {
    const userLoginForm = document.getElementById("userLoginForm");
    const loginButton = document.getElementById("userLoginButton");
    const userEmailError = document.getElementById("userEmailError");
    const userPasswordError = document.getElementById("userPasswordError");
  
    function validateEmail(email) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
  
    function validatePassword(password) {
      return password.length >= 8;
    }
  
    userLoginForm.addEventListener("submit", async function (event) {
      event.preventDefault();
  
      const email = document.getElementById("userEmail").value.trim();
      const password = document.getElementById("userPassword").value.trim();
  
      userEmailError.textContent = validateEmail(email)
        ? ""
        : "Invalid email format";
      userPasswordError.textContent = validatePassword(password)
        ? ""
        : "Password must be at least 8 characters long";
  
      if (!validateEmail(email) || !validatePassword(password)) {
        return;
      }
  
      loginButton.disabled = true;
      loginButton.querySelector(".button-text").classList.add("hidden");
      loginButton.querySelector(".button-loader").classList.remove("hidden");
  
      try {
        const response = await fetch(
          "https://legal-blessed-viper.ngrok-free.app/login",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
          }
        );
  
        const data = await response.json();
  
        if (response.ok) {
          window.location.href = "/index.html";
        } else {
          throw new Error(data.message || "Invalid credentials");
        }
      } catch (error) {
        userEmailError.textContent = error.message;
      } finally {
        loginButton.disabled = false;
        loginButton.querySelector(".button-text").classList.remove("hidden");
        loginButton.querySelector(".button-loader").classList.add("hidden");
      }
    });
  });
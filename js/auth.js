import { supabase } from "./supabase.js";

const form = document.getElementById("login-form");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = form.email.value;
  const password = form.password.value;

  // Try login
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (!error) {
    // Login success
    window.location.href = "index.html";
    return;
  }

  // If user not found, create account
  if (error.message.includes("Invalid login credentials")) {
    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signUpError) {
      alert(signUpError.message);
    } else {
      alert("Account created successfully. Please login now.");
    }
  } else {
    alert(error.message);
  }
});

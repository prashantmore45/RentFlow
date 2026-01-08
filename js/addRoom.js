import { supabase } from "./supabase.js";

const form = document.getElementById("add-room-form");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const user = (await supabase.auth.getUser()).data.user;

  if (!user) {
    alert("Please login first");
    window.location.href = "login.html";
    return;
  }

  const formData = new FormData(form);

  const room = {
    owner_id: user.id,
    title: formData.get("title"),
    location: formData.get("location"),
    price: formData.get("price"),
    property_type: formData.get("property_type"),
    tenant_preference: formData.get("tenant_preference"),
    contact_number: formData.get("contact_number"),
  };

  const { error } = await supabase.from("rooms").insert([room]);

  if (error) {
    alert("Error adding room");
  } else {
    alert("Room added successfully");
    form.reset();
  }
});

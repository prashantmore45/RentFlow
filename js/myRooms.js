import { supabase } from "./supabase.js";

const container = document.getElementById("my-rooms-container");

async function loadMyRooms() {
  const user = (await supabase.auth.getUser()).data.user;

  if (!user) {
    alert("Please login first");
    window.location.href = "login.html";
    return;
  }

  const { data, error } = await supabase
    .from("rooms")
    .select("*")
    .eq("owner_id", user.id);

  if (error) {
    container.innerHTML = "<p>Error loading rooms</p>";
    return;
  }

  container.innerHTML = "";

  if (data.length === 0) {
    container.innerHTML = "<p>No rooms added yet</p>";
    return;
  }

  data.forEach(room => {
    const div = document.createElement("div");
    div.className = "room-card";

    div.innerHTML = `
      <h3>${room.title}</h3>
      <p>${room.location} | ₹${room.price}</p>
      <button data-id="${room.id}" class="delete-btn">Delete</button>
    `;

    container.appendChild(div);
  });

  document.querySelectorAll(".delete-btn").forEach(btn => {
    btn.addEventListener("click", async () => {
      const roomId = btn.getAttribute("data-id");

      const { error } = await supabase
        .from("rooms")
        .delete()
        .eq("id", roomId);

      if (error) {
        alert("Error deleting room");
      } else {
        loadMyRooms();
      }
    });
  });
}

loadMyRooms();

import { supabase } from "./supabase.js";

const container = document.getElementById("rooms-container");
const locationInput = document.getElementById("locationFilter");

async function fetchRooms(location = "") {
  let query = supabase.from("rooms").select("*");

  if (location) {
    query = query.ilike("location", `%${location}%`);
  }

  const { data, error } = await query;

  if (error) {
    container.innerHTML = "<p>Error loading rooms</p>";
    return;
  }

  container.innerHTML = "";

  if (data.length === 0) {
    container.innerHTML = "<p>No rooms found</p>";
    return;
  }

  data.forEach(room => {
    const div = document.createElement("div");
    div.className = "room-card";

    div.innerHTML = `
      <h3>${room.title}</h3>
      <p><strong>Location:</strong> ${room.location}</p>
      <p><strong>Rent:</strong> ₹${room.price}</p>
      <p><strong>Type:</strong> ${room.property_type}</p>
      <p><strong>Tenant:</strong> ${room.tenant_preference}</p>
      <p><strong>Contact:</strong> ${room.contact_number}</p>
    `;

    container.appendChild(div);
  });
}

// Filter by location (highest priority)
locationInput.addEventListener("input", () => {
  fetchRooms(locationInput.value);
});

fetchRooms();

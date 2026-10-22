const button = document.getElementById("sync");

button.addEventListener("click", async () => {
  button.disabled = true;
  try {
    await fetch("/api/sync", { method: "POST" });
  } finally {
    button.disabled = false;
  }
});

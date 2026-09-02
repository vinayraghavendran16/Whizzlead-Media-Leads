(() => {
  const legacy = {
    "Connected message sent": "Contacted",
    "Connection request sent": "Contacted"
  };

  const merged = new Map();

  leads.forEach((lead) => {
    const name = (lead.name || "").trim();
    if (!name) return;

    const key = name.toLowerCase();

    merged.set(key, {
      ...merged.get(key),
      ...lead,
      name,
      status: legacy[lead.status] || lead.status || "Researching"
    });
  });

  leads = [...merged.values()];
  localStorage[key] = JSON.stringify(leads);

  const standardStatuses = [
    "Researching",
    "Ready to contact",
    "Contacted",
    "Replied",
    "Interested",
    "Follow-up",
    "Meeting booked",
    "Won",
    "Not interested",
    "Lost",
    "DQ"
  ];

  document.getElementById("filter").innerHTML =
    '<option value="">All statuses</option>' +
    standardStatuses.map((status) => `<option>${status}</option>`).join("");

  document.getElementById("form").status.innerHTML =
    standardStatuses.map((status) => `<option>${status}</option>`).join("");

  document.querySelectorAll(".cards .card").forEach((card, index) => {
    card.style.cursor = "pointer";

    card.onclick = () => {
      const filters = [
        "",
        "",
        "Interested",
        "Follow-up",
        "Meeting booked",
        "Not interested"
      ];

      document.getElementById("filter").value = filters[index] || "";
      document.getElementById("search").value = "";

      render();
    };
  });

  const total = leads.length || 1;

  function addPercentage(id, number, denominator) {
    const element = document.getElementById(id);
    if (!element) return;

    const percentage = document.createElement("small");
    percentage.textContent =
      `${denominator ? Math.round((number / denominator) * 100) : 0}%`;

    percentage.style.display = "block";
    percentage.style.color = "#9aa7b5";
    percentage.style.fontSize = "12px";

    element.parentElement.appendChild(percentage);
  }

  const completedToday = leads.filter(
    (lead) => lead.date === today() && contacted(lead.status)
  ).length;

  addPercentage("total", leads.length, leads.length);
  addPercentage("done", completedToday, 25);
  addPercentage("pending", Math.max(0, 25 - completedToday), 25);
  addPercentage(
    "interested",
    leads.filter((lead) => ["Interested", "Replied"].includes(lead.status))
      .length,
    total
  );
  addPercentage(
    "followups",
    leads.filter((lead) => lead.status === "Follow-up").length,
    total
  );
  addPercentage(
    "meet",
    leads.filter((lead) => ["Meeting booked", "Won"].includes(lead.status))
      .length,
    total
  );
  addPercentage(
    "notinterested",
    leads.filter((lead) => ["Not interested", "Lost"].includes(lead.status))
      .length,
    total
  );
})();

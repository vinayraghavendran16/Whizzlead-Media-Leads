(() => {
  const sentDate = "2026-09-02";

  const statuses = [
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

  const clean = (value) =>
    !value || value === "undefined" || value === "null"
      ? ""
      : value;

  leads = leads.map((lead) => ({
    ...lead,
    name: clean(lead.name),
    company: clean(lead.company),
    role: clean(lead.role),
    date: clean(lead.date) || sentDate,
    status: statuses.includes(lead.status)
      ? lead.status
      : "Researching",
    url: clean(lead.url),
    notes: clean(lead.notes)
  }));

  const uniqueLeads = new Map();

  leads.forEach((lead) => {
    uniqueLeads.set(lead.name.toLowerCase(), lead);
  });

  leads = [...uniqueLeads.values()];
  localStorage.setItem("whizzlead_leads", JSON.stringify(leads));

  function addEditButtons() {
    document.querySelectorAll("#rows tr").forEach((row, index) => {
      if (row.dataset.editReady) return;

      const lead = leads[index];
      if (!lead) return;

      const cell = document.createElement("td");
      const button = document.createElement("button");

      button.textContent = "Edit";

      button.onclick = () => {
        const name = prompt("Name", lead.name);
        if (name === null) return;

        const company = prompt("Company", lead.company);
        const role = prompt("Role", lead.role);
        const date = prompt("Outreach date", lead.date);
        const status = prompt("Status", lead.status);
        const url = prompt("LinkedIn URL", lead.url);
        const notes = prompt("Notes", lead.notes);

        lead.name = name;
        lead.company = company || "";
        lead.role = role || "";
        lead.date = date || sentDate;
        lead.status = statuses.includes(status)
          ? status
          : "Researching";
        lead.url = url || "";
        lead.notes = notes || "";

        localStorage.setItem(
          "whizzlead_leads",
          JSON.stringify(leads)
        );

        location.reload();
      };

      cell.appendChild(button);
      row.appendChild(cell);
      row.dataset.editReady = "true";
    });
  }

  const observer = new MutationObserver(addEditButtons);

  observer.observe(document.getElementById("rows"), {
    childList: true
  });

  setTimeout(addEditButtons, 500);
})();

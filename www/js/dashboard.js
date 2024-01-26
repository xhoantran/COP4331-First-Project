window.onload = async function () {
  if (localStorage.getItem("user") === null) {
    window.location.href = "index.html";
  }
  const user = JSON.parse(localStorage.getItem("user"));
  document.getElementById("name").innerHTML = user.name;

  // Clean search query
  window.history.replaceState({}, "", `?search=`);

  getContacts()
    .then((contacts) => displayContacts(contacts))
    .catch((e) => {
      console.log(e);
      Toastify({
        text: "Failed to get contacts!",
        duration: 3000,
        close: true,
        gravity: "top",
        position: "center",
        stopOnFocus: true,
        className: "bg-none bg-red-500",
      }).showToast();
    });

  // Bind event listeners
  const search = document.getElementById("search");
  search.addEventListener("input", () => {
    window.history.replaceState({}, "", `?search=${search.value}`);
    debounce(refreshContacts, 500)();
  });
}

function detectRowInView(ref, callback) {
  const options = {
    root: null,
    rootMargin: "0px",
    threshold: 1.0,
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        callback();
      }
    });
  }, options);

  observer.observe(ref);
}

function spinner() {
  return `
    <tr id="spinner-row">
      <td
        class="whitespace-nowrap text-gray-900 py-4"
        colspan="4"
      >
        <svg 
          class="animate-spin mx-auto h-5 w-5 text-gray-900" 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </td>
    </tr>
    
  `;
}

function removeSpinner() {
  let spinner = document.getElementById("spinner-row");
  if (spinner) {
    spinner.remove();
  }
}


// -------------------CREATE-------------------
function createContactRow() {
  const template = `
    <tr class="even:bg-gray-50" id="new-contact-row">
      <td
        class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-3"
      >
        <input
          type="text"
          id="new-contact-name"
          class="w-full border-gray-300 rounded-md shadow-sm text-sm"
        />
      </td>
      <td
        class="whitespace-nowrap px-3 py-4 text-sm text-gray-500"
      >
        <input
          type="text"
          id="new-contact-phone"
          class="w-full border-gray-300 rounded-md shadow-sm text-sm"
        />
      </td>
      <td
        class="whitespace-nowrap px-3 py-4 text-sm text-gray-500"
      >
        <input
          type="text"
          id="new-contact-email"
          class="w-full border-gray-300 rounded-md shadow-sm text-sm"
        />
      </td>
      <td
        class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-3"
      >
        <button
          type="button"
          class="rounded-md bg-blue-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          onclick="createContactSubmit()"
        >
          Save
        </button>
        <button
          type="button"
          class="rounded-md bg-red-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
          onclick="cancelCreateContactRow()"
        >
          Cancel
        </button>
      </td>
    </tr>
  `;

  // Check if new-contact-row already exists
  if (document.getElementById("new-contact-row")) {
    return;
  }

  if (document.getElementById("no-contacts-row")) {
    // Get no-contacts-row
    let noContactsRow = document.getElementById("no-contacts-row");

    // Remove no-contacts-row
    noContactsRow.remove();
  }

  // Get contacts-body
  let contactsBody = document.getElementById("contacts-body");

  // Append row to contacts-body first row  
  contactsBody.innerHTML = template + contactsBody.innerHTML;
}

function createContactSubmit() {
  // Get new-contact-name
  let name = document.getElementById("new-contact-name").value;

  // Get new-contact-phone
  let phone = document.getElementById("new-contact-phone").value;

  // Get new-contact-email
  let email = document.getElementById("new-contact-email").value;

  // Get user id from local storage
  let user = JSON.parse(localStorage.getItem("user"));

  // Create contact object
  let contact = {
    name: name,
    phone: phone,
    email: email,
    user_id: user.id,
  };

  // Send contact to server
  fetch("http://localhost/api/addcontact.php", {
    method: "POST",
    body: JSON.stringify(contact),
  })
    .then(() => {
      refreshContacts();
      Toastify({
        text: "Successfully created contact!",
        duration: 3000,
        close: true,
        gravity: "top",
        position: "center",
        stopOnFocus: true,
        className: "bg-none bg-green-500",
      }).showToast();
    })
    .catch(() => {
      Toastify({
        text: "Failed to create contact!",
        duration: 3000,
        close: true,
        gravity: "top",
        position: "center",
        stopOnFocus: true,
        className: "bg-none bg-red-500",
      }).showToast();
    });
}

function cancelCreateContactRow() {
  // Get new-contact-row
  let newContactRow = document.getElementById("new-contact-row");

  // Remove new-contact-row
  newContactRow.remove();

  // Check if contacts-body is empty
  let contactsBody = document.getElementById("contacts-body");
  let rows = contactsBody.querySelectorAll("tr");
  if (rows.length === 0) {
    contactsBody.innerHTML = noContactsRow();
  }
}

// -------------------READ---------------------
function contactRow(contact) {
  return `
    <tr class="even:bg-gray-50">
      <td
        class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-3"
      >
        ${contact.name}
      </td>
      <td
        class="whitespace-nowrap px-3 py-4 text-sm text-gray-500"
      >
        ${contact.phone}
      </td>
      <td
        class="whitespace-nowrap px-3 py-4 text-sm text-gray-500"
      >
        ${contact.email}
      </td>
      <td
        class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-3"
      >
        <button
          type="button"
          class="rounded-md bg-blue-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          onclick="editContactRow(${contact.id}, '${contact.name}', '${contact.phone}', '${contact.email}')"
        >
          Edit
        </button>
        <button
          type="button"
          class="rounded-md bg-red-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
          onclick="showDeleteModal(${contact.id}, '${contact.name}')"
        >
          Delete
        </button>
      </td>
    </tr>
  `;
}

function noContactsRow() {
  return `
      <tr id="no-contacts-row">
        <td
          class="whitespace-nowrap py-20 text-sm text-center font-medium text-gray-900"
          colspan="4"
        >
          No contacts found!
        </td>
      </tr>
    `;
}

function displayContacts(contacts, page = 1) {
    // Get contacts-body
    let contactsBody = document.getElementById("contacts-body");

    // Check if contacts is empty
    if (contacts.length === 0 && page === 1) {
      // Append no-contacts-row
      contactsBody.innerHTML = noContactsRow();
      return;
    }

    // Loop through contacts
    for (let contact of contacts) {
        // Create contact row
        let row = contactRow(contact);

        // Append row to contacts-body
        contactsBody.innerHTML += row;
    }

    // Get last row
    let lastRow = contactsBody.lastElementChild;

    // Detect row in view
    if (contacts.length !== 0 && contacts.length <= 20) {
      detectRowInView(lastRow, () => {
        contactsBody.innerHTML += spinner();

        getPage(page + 1).then(() => removeSpinner());
      });
    }
    
}

async function getContacts(query, page = 1) {
  // Get user id from local storage
  let user = JSON.parse(localStorage.getItem("user"));

  const res = await fetch(`http://localhost/api/getcontacts.php?user_id=${user.id}&page=${page}&search=${query ?? ""}`);
  return res.json();
}

async function getPage(page) {
  // Get search query
  const params = new URLSearchParams(window.location.search);
  const query = params.get("search");

  return getContacts(query, page)
    .then((contacts) => displayContacts(contacts, page))
    .catch(() => {
      Toastify({
        text: "Failed to get contacts!",
        duration: 3000,
        close: true,
        gravity: "top",
        position: "center",
        stopOnFocus: true,
        className: "bg-none bg-red-500",
      }).showToast();
    });
}

function refreshContacts() {
  // Get contacts-body
  let contactsBody = document.getElementById("contacts-body");

  // Remove all rows
  contactsBody.innerHTML = spinner();

  getPage(1).then(() => removeSpinner());
}

// -------------------UPDATE-------------------
function editContactRow(id, name, phone, email) {
  // Check if edit-contact-row already exists
  if (document.getElementById("edit-contact-row")) {
    // Get edit-contact-row
    let editContactRow = document.getElementById("edit-contact-row");

    // Click cancel button
    editContactRow.querySelector("button:nth-child(2)").click();
  }

  // Create edit template
  const template = `
    <tr class="even:bg-gray-50" id="edit-contact-row">
      <td
        class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-3"
      >
        <input
          type="text"
          class="w-full border-gray-300 rounded-md shadow-sm text-sm"
          name="name"
          value="${name}"
        />
      </td>
      <td
        class="whitespace-nowrap px-3 py-4 text-sm text-gray-500"
      >
        <input
          type="text"
          class="w-full border-gray-300 rounded-md shadow-sm text-sm"
          name="phone"
          value="${phone}"
        />
      </td>
      <td
        class="whitespace-nowrap px-3 py-4 text-sm text-gray-500"
      >
        <input
          type="text"
          class="w-full border-gray-300 rounded-md shadow-sm text-sm"
          name="email"
          value="${email}"
        />
      </td>
      <td
        class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-3"
      >
        <button
          type="button"
          class="rounded-md bg-blue-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          onclick="editContactSubmit(${id})"
        >
          Save
        </button>
        <button
          type="button"
          class="rounded-md bg-red-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
          onclick="cancelEditContactRow('${id}', '${name}', '${phone}', '${email}')"
        >
          Cancel
        </button>
      </td>
    </tr>
  `;

  // Get edit button
  let editButton = event.target;

  // Get contact row
  let contactRow = editButton.closest("tr");

  // Append template after contact row
  contactRow.insertAdjacentHTML("afterend", template);

  // Remove contact row
  contactRow.remove();
}

function cancelEditContactRow(id, name, phone, email) {
  // Get edit-contact-row
  let editContactRow = document.getElementById("edit-contact-row");

  // Create contact row
  let row = contactRow({ id, name, phone, email });

  // Append row to edit-contact-row
  editContactRow.insertAdjacentHTML("afterend", row);

  // Remove edit-contact-row
  editContactRow.remove();
}

function editContactSubmit(id) {
  let name = document.querySelector("#edit-contact-row input[name=name]").value;
  let phone = document.querySelector("#edit-contact-row input[name=phone]").value;
  let email = document.querySelector("#edit-contact-row input[name=email]").value;

  // Create contact object
  let contact = {
    id: id,
    name: name,
    phone: phone,
    email: email,
  };

  // Send contact to server
  fetch("http://localhost/api/updatecontact.php", {
    method: "PUT",
    body: JSON.stringify(contact),
  })
    .then((response) => response.json())
    .then(() => {
      refreshContacts();
      Toastify({
        text: "Successfully updated contact!",
        duration: 3000,
        close: true,
        gravity: "top",
        position: "center",
        stopOnFocus: true,
        className: "bg-none bg-green-500",
      }).showToast();
    })
    .catch(() => {
      Toastify({
        text: "Failed to update contact!",
        duration: 3000,
        close: true,
        gravity: "top",
        position: "center",
        stopOnFocus: true,
        className: "bg-none bg-red-500",
      }).showToast();
    });
}

// -------------------DELETE-------------------
function showDeleteModal(id, name) {
  // Get delete-modal
  let deleteModal = document.getElementById("delete-contact-modal");

  // Show delete-modal
  deleteModal.classList.remove("hidden");

  // Set delete-modal message
  deleteModal.querySelector("#delete-contact-name").innerHTML = name;

  // Set delete-modal contact id
  deleteModal.querySelector("#delete-contact-id").value = id;
}

function hideDeleteModal() {
  // Get delete-modal
  let deleteModal = document.getElementById("delete-contact-modal");

  // Hide delete-modal
  deleteModal.classList.add("hidden");
}

function deleteContact() {
  // Get delete-modal
  let id = document.getElementById("delete-contact-id");

  // Send with delete method
  fetch(`http://localhost/api/deletecontact.php`, {
    method: "DELETE",
    body: JSON.stringify({ id: id.value }),
  })
    .then(() => {
      hideDeleteModal();
      refreshContacts();
      Toastify({
        text: "Successfully deleted contact!",
        duration: 3000,
        close: true,
        gravity: "top",
        position: "center",
        stopOnFocus: true,
        className: "bg-none bg-green-500",
      }).showToast();
    })
    .catch(() => {
      Toastify({
        text: "Failed to delete contact!",
        duration: 3000,
        close: true,
        gravity: "top",
        position: "center",
        stopOnFocus: true,
        className: "bg-none bg-red-500",
      }).showToast();
    });
}

// -------------------SEARCH-------------------
let debounceTrail = null;
function debounce(fn, delay) {
  return function () {
    clearTimeout(debounceTrail);
    debounceTrail = setTimeout(() => fn.apply(this, arguments), delay);
  };
}

function toggleMenu(){
    const menu = document.querySelector('.menu-links');
    const icon = document.querySelector('.hamburger-icon');
   menu.classList.toggle('open');
   icon.classList.toggle('open');
}


// Skills Filter Functionality
const skillsFilter = document.getElementById('skillsFilter');
const skillsGroup = document.getElementsByClassName('skills-group');

skillsFilter.addEventListener("change", () => {
    const selectedValue = skillsFilter.value;

    Array.from(skillsGroup).forEach(group => {
        if (selectedValue === "all" || group.classList.contains(selectedValue)) {
            group.style.display = "block";
        } else {
            group.style.display = "none";
        }
    });
});


// Project Modal Functionality
const modal = document.getElementById("projects-modal");
const modalTitle = document.getElementById("modal-title");
const modalDescription = document.getElementById("modal-description");
const modalTech = document.getElementById("modal-tech-stack");
const closeBtn = document.querySelector(".modal-close");
const overlay = document.querySelector(".modal-overlay");

const projects = {
    lp: {
        title: "Linear Programming Solver",
        description:
            "A command line interface (CLI) solver that allows users to input constraints and objective functions to solve optimisation problems.",
        tech: [
            "C#",
            ".NET Core",
            "Command Line Interface (CLI)",
            "Linear Programming Algorithms"
        ],
    },
    login: {
        title: "Register & Login System",
        description:
            "A secure authentication system with user registration, login, and session-based access control.",
        tech: [
            "HTML5",
            "CSS3",
            "JSP",
            "Javascript (Client-Side Validation)",
            "Java Servlets",
            "PostgreSQL",
            "Apache Tomcat"
        ],
    },
};

document.querySelectorAll(".project-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
        const projectKey = btn.dataset.project;
        const project = projects[projectKey];

        modalTitle.textContent = project.title;
        modalDescription.textContent = project.description;

        modalTech.innerHTML = "";
        project.tech.forEach((item) => {
            const li = document.createElement("li");
            li.textContent = item;
            modalTech.appendChild(li);
        });

        modal.classList.remove("hidden");
    });
});

closeBtn.addEventListener("click", closeModal);
overlay.addEventListener("click", closeModal);

function closeModal() {
    modal.classList.add("hidden");
}


//Contact Form Listener and Validation
const form = document.getElementById("contactForm");

form.addEventListener("submit", function (e) {
  e.preventDefault();
  validateForm();
});

function validateForm() {
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const message = document.getElementById("message").value.trim();

  let isValid = true;

  document.getElementById("nameError").textContent = "";
  document.getElementById("emailError").textContent = "";
  document.getElementById("messageError").textContent = "";
  document.getElementById("successMessage").textContent = "";

  if (name === "") {
    document.getElementById("nameError").textContent = "Name is required";
    isValid = false;
  }

  if (email === "") {
    document.getElementById("emailError").textContent = "Email is required";
    isValid = false;
  } else if (!email.includes("@")) {
    document.getElementById("emailError").textContent = "Invalid email format";
    isValid = false;
  }

  if (message.length < 10) {
    document.getElementById("messageError").textContent =
      "Message must be at least 10 characters";
    isValid = false;
  }

  if (isValid) {
    document.getElementById("successMessage").textContent =
      "Message sent successfully!";
    form.reset();
  }
}

document.getElementById("email").addEventListener("input", function () {
  if (!this.value.includes("@")) {
    document.getElementById("emailError").textContent = "Invalid email format";
  } else {
    document.getElementById("emailError").textContent = "";
  }
});

localStorage.setItem("lastMessage", JSON.stringify({ name, email, message }));




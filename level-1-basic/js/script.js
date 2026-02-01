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
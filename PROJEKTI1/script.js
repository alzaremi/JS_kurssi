     // vaihe 1 : rakenna html pohja
// vaihe 2: lisää tyylit css-tiedostoon (nyt html sivu on nätti)
// vaihe 3: lisää toiminnallisuudet JavaScriptillä


// haetaan elementit 
const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const clearButton = document.getElementById("clearButton");
const tehtavaError = document.getElementById("tehtavaError");

// haetaan aiemmat tehtävät localStoragesta
// jos ei ole aiempia tehtäviä, luodaan uusille taulukko
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// haetaan arpanappulat 
const randomButton = document.getElementById("randomButton");
const randomTaskDisplay = document.getElementById("randomTask");

// lisätään toiminto, joka arpoo seuraavan tehtävän käyttäjälle
randomButton.addEventListener("click", function() {
    // vain tekemättömistä tehtävistä
    const undoneTasks = tasks.filter(t => !t.done);

    // paitsi, jos ei ole tekemättömiä tehtäviä :D
    if (undoneTasks.length === 0) {
        randomTaskDisplay.textContent = "Ei tekemättömiä tehtäviä! Hyvää työtä!";
        return;
    }

    // arvotaan satunnainen tehtävä vain tekemättömistä
    const randomIndex = Math.floor(Math.random() * undoneTasks.length);
    const randomTask = undoneTasks[randomIndex];

    randomTaskDisplay.textContent = "Seuraava tehtäväsi: " + randomTask.text;
});


// lisätään "tyhjennä kaikki"-napille kuuntelija ja toiminto  
clearButton.addEventListener("click", function() {
    taskList.innerHTML = "";
    tasks = [];
    localStorage.removeItem("tasks");
});

// näytetään kaikki tehtävät DOMissa
function renderTasks() {
    taskList.innerHTML =""; // tyhjennetään näkymä

    // käydään läpi tallennetut tehtävät
    tasks.forEach(task => {
        const li = document.createElement("li");
        li.textContent = task.text;

        // jos tehtävä on merkitty valmiiksi, näytetään viiva ja harmaa väri
        if (task.done) {
            li.style.textDecoration ="line-through";
            li.style.color="gray";
        }

        // "suoritettu"-nappi
        const doneBtn = document.createElement("button");
        doneBtn.textContent="\u2714";
        doneBtn.classList.add("done-btn");
        doneBtn.addEventListener("click", function(){
            task.done = !task.done; // vaihdetaan tilaa
            localStorage.setItem("tasks", JSON.stringify(tasks));
            renderTasks(); // päivitetään näkymä
        });

        //"poista"-nappi
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent="\u274C";
        deleteBtn.classList.add("delete-btn");
        deleteBtn.addEventListener("click", function(){
            tasks = tasks.filter(t => t.text !== task.text);
            localStorage.setItem("tasks", JSON.stringify(tasks));
            renderTasks(); // päivitetään näkymä
        });

        // lisätään napit ja li-elementti listaan
        li.appendChild(doneBtn);
        li.appendChild(deleteBtn);
        taskList.appendChild(li);
    });
}

// renderöidään tehtävät heti sivun latautuessa
renderTasks();


// palautetaan alkuperäinen tyyli, kun käyttäjä kirjoittaa
taskInput.addEventListener("input", function() {
    taskInput.classList.remove("invalid", "success");
    tehtavaError.textContent="";
});

// lisätään kuuntelija lomakkeen lähetykselle
taskForm.addEventListener("submit", function(event) {
    // estetään lähetys koska ei ole paikkaa minne se lähetetään
    event.preventDefault();

    //tyhjennetään virheet
    taskInput.classList.remove("invalid", "success");
    tehtavaError.textContent="";
    let isValid = true;

    // siivotaan syötettä vähän
    const taskText = taskInput.value.trim();

    // tehdään oma validointi valmiin tilalle, jotta saadaan virheilmoituksesta sellainen, kuin halutaan
    if (taskText.length < 3) {
        taskInput.classList.add("invalid"); // punainen reuna lisätty css:ssä
        tehtavaError.textContent="Tehtävän tulee olla vähintään 3 merkkiä pitkä.";
        isValid = false;
    } else {
        taskInput.classList.add("success");
    }
    if (!isValid) return;

    // tallennetaan lisättävä tehtävä LocalStorageen ja tehdään tiedoille oma taulukko
    tasks.push({ text: taskText, done: false });
    localStorage.setItem("tasks", JSON.stringify(tasks));
    renderTasks(); // näytetään tehtävät uudelleen

    // tyhjennetään syötekenttä seuraavaa varten
    taskInput.value = "";
});

function $(selector, el) {
  if (!el) {
    el = document;
  }
  return el.querySelector(selector);
}
function $$(selector, el) {
  if (!el) {
    el = document;
  }
  return Array.prototype.slice.call(el.querySelectorAll(selector));
}

var solution;
var tour;
var level;

const tabCouleurs = ["yellow", "blue", "red", "green", "whitesmoke", "black"];

/* GÃ©nÃ©ration de la rÃ©ponse alÃ©atoire */
function finalCode() {
  let code = new Array();
  for (let i = 0; i < 4; i++) {
    let random = Math.floor(Math.random() * tabCouleurs.length);
    code[i] = tabCouleurs[random];
  }
  return code;
}

/* RÃ©cupÃ©ration choix utilisateur */
function recupChoix() {
  let choix = [];

  boutonsEnCours.forEach((element) => {
    let color = element.className;
    choix.push(color);
  });

  return choix;
}

/* Comparaison de la proposition avec la solution */
function validate(proposition, bonCode) {
  let good = new Array();
  let bad = new Array();

  for (let i = 0; i < proposition.length; i++) {
    if (bonCode[i] === proposition[i]) {
      good.push(true);
      proposition[i] = "a";
      bonCode[i] = "b";
    }
  }

  for (let i = 0; i < proposition.length; i++) {
    if (proposition.includes(bonCode[i])) {
      let j = proposition.indexOf(bonCode[i]);
      bonCode[i] = "y";
      proposition[j] = "x";
      bad.push(false);
    }
  }

  let validation = [...good, ...bad];
  return validation;
}

/* Affichage de la solution */
function affichageReponse(verif) {
  let affichage = "";
  let win = [true, true, true, true];

  for (let i = 0; i < verif.length; i++) {
    if (verif[i] === true) {
      affichage += '<p class="verif good"></p>';
    }
    if (verif[i] === false) {
      affichage += '<p class="verif bad"></p>';
    }
  }
  if (verif != win) {
    affichage2 = "<p> RÃ©essayez une nouvelle fois </p>";
  }
  if (JSON.stringify(verif) === JSON.stringify(win)) {
    affichage2 = "<p>Vous avez gagnÃ©! </p>";

    var score = level;

    //recupÃ©rer le nom et le score dans le localStorage
    let playerName = $(".nomJoueur").value;

    let pastPlayers = localStorage.getItem("players");
    let tabScores = JSON.parse(pastPlayers);
    let newResult = tabScores
      ? [...tabScores, { nomJoueur: playerName, value: score }]
      : [{ nomJoueur: playerName, value: score }];
    localStorage.setItem("players", JSON.stringify(newResult));

    level = 11;
  }

  affichage += affichage2;
  return affichage;
}

/*Lignes inutilisables */
function disabledLines(tour) {
  $$("section").forEach((section) => {
    if (section.classList.contains(tour)) {
      let buttons = section.querySelectorAll("button");

      buttons.forEach((element) => {
        element.removeAttribute("disabled");
      });
    } else {
      let buttons = section.querySelectorAll("button");

      buttons.forEach((element) => {
        element.setAttribute("disabled", true);
      });
    }
  });
}

/* Changement couleurs boutons */
function chColors(tour) {
  $$("section").forEach((section) => {
    if (section.classList.contains(tour)) {
      boutonsEnCours = section.querySelectorAll(".propositions button");
    }
  });

  boutonsEnCours.forEach((element) => {
    let i = 0;
    element.addEventListener("click", function () {
      element.classList.remove(tabCouleurs[i]);
      i++;
      if (i > tabCouleurs.length - 1) {
        i = 0;
      }
      element.classList.add(tabCouleurs[i]);
    });

    document.addEventListener("contextmenu", (event) => event.preventDefault());

    element.addEventListener("contextmenu", function () {
      element.classList.remove(tabCouleurs[i]);
      i--;
      if (i < 0) {
        i = tabCouleurs.length - 1;
      }
      element.classList.add(tabCouleurs[i]);
    });
  });
}

/*Lancement du jeu */
window.addEventListener("DOMContentLoaded", function () {
  solution = finalCode();
  level = 1;
  tour = "tour" + level;

  $(".start").addEventListener("click", function () {
    let start = chColors(tour);
    let tourUtilisateur = disabledLines(tour);
    $(".tours").removeAttribute("style");
  });
});

/*A chaque clic */
function validation() {
  let choix = recupChoix();

  let reponse = solution.slice();

  let validation = validate(choix, reponse);
  let affichage = affichageReponse(validation);

  $$("section").forEach((section) => {
    if (section.classList.contains(tour)) {
      correction = $(".reponse", section);
    }
  });

  correction.innerHTML += affichage;

  level++;
  tour = "tour" + level;

  if (level == 11) {
    let perdu = "<p>Vous avez Perdu !! </p>";
    for (let i = 0; i < solution.length; i++) {
      perdu += '<button class="' + solution[i] + '"></button>';
    }
    correction.innerHTML = perdu;
  }

  tourUtilisateur = disabledLines(tour);
  let colors = chColors(tour);
}

// Rechargement de la page pour recommencer le jeu
const reloadButton = document.querySelector(".reload");
// Reload everything:
function reload() {
  reload = location.reload();
}
// Event listeners for reload
reloadButton.addEventListener("click", reload, false);

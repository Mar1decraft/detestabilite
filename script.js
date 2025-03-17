const PASSWORDS = {
    "1234": "Marin",
    "4321": "Lola"
};

let utilisateurActuel = "";
let score = 0;
let customScore = null;
let currentQuestion = 0;
let nomPersonne = "";
let personnes = [];

// Charger les données au démarrage
document.addEventListener("DOMContentLoaded", () => {
    chargerTableau();
});

const questions = [
    { question: "Qu'est-ce qui t’énerve chez cette personne ?", options: { "Bruit (5 pts)": 5, "Hypocrisie (10 pts)": 10, "Trahison (20 pts)": 20, "Mensonge (30 pts)": 30 } },
    { question: "À quelle fréquence elle t’énerve ?", options: { "Rarement (5 pts)": 5, "Parfois (10 pts)": 10, "Souvent (20 pts)": 20, "Tout le temps (30 pts)": 30 } },
    { question: "À quel point elle te fait péter un câble ?", options: { "Peu (5 pts)": 5, "Moyennement (10 pts)": 10, "Beaucoup (20 pts)": 20, "Extrême (30 pts)": 30 } }
];

function verifierMotDePasse() {
    let mdp = document.getElementById("password").value;
    if (PASSWORDS[mdp]) {
        utilisateurActuel = PASSWORDS[mdp];
        document.getElementById("login-screen").style.display = "none";
        document.getElementById("main-content").style.display = "block";
    } else {
        document.getElementById("error-message").style.display = "block";
    }
}

function ouvrirQuiz() {
    nomPersonne = prompt("Nom ou pseudo de la personne :");
    if (!nomPersonne) return;

    score = 0;
    customScore = null;
    currentQuestion = 0;
    document.getElementById("quiz-container").style.display = "block";
    afficherQuestion();
}

function afficherQuestion() {
    let q = questions[currentQuestion];
    document.getElementById("quiz-question").textContent = q.question;
    let optionsDiv = document.getElementById("quiz-options");
    optionsDiv.innerHTML = "";

    Object.keys(q.options).forEach(option => {
        let btn = document.createElement("button");
        btn.textContent = option;
        btn.onclick = () => {
            score += q.options[option];
            suivant();
        };
        optionsDiv.appendChild(btn);
    });
}

function suivant() {
    currentQuestion++;
    if (currentQuestion < questions.length) {
        afficherQuestion();
    } else {
        document.getElementById("quiz-container").style.display = "none";
        document.getElementById("validation-container").style.display = "block";
        document.getElementById("calculated-score").textContent = score;
        document.getElementById("custom-score").value = score;
    }
}

function confirmerNote() {
    customScore = parseInt(document.getElementById("custom-score").value);
    if (isNaN(customScore) || customScore < 0 || customScore > 100) {
        alert("Merci d’entrer un score entre 0 et 100.");
        return;
    }
    document.getElementById("validation-container").style.display = "none";
    ajouterAuTableau(nomPersonne, customScore, score);
}

function ajouterAuTableau(nom, finalScore, quizScore) {
    let personne = personnes.find(p => p.nom === nom);
    if (!personne) {
        personne = { nom, marin: null, quizMarin: null, lola: null, quizLola: null };
        personnes.push(personne);
    }

    if (utilisateurActuel === "Marin") {
        personne.marin = finalScore;
        personne.quizMarin = quizScore;
    } else {
        personne.lola = finalScore;
        personne.quizLola = quizScore;
    }

    sauvegarderTableau();
    afficherTableau();
}

function calculerMoyenne(marin, lola) {
    if (marin !== null && lola !== null) {
        return Math.round((marin + lola) / 2);
    }
    return marin !== null ? marin : lola;
}

function afficherTableau() {
    let tableau = document.getElementById("table-body");
    tableau.innerHTML = "";
    personnes.forEach(personne => {
        let moyenne = calculerMoyenne(personne.marin, personne.lola);
        let couleur = getCouleur(moyenne);

        let row = tableau.insertRow();
        row.innerHTML = `
            <td>${personne.nom}</td>
            <td>${personne.quizMarin !== null ? personne.quizMarin + "/100" : "-"}</td>
            <td>${personne.marin !== null ? personne.marin + "/100" : "-"}</td>
            <td>${personne.quizLola !== null ? personne.quizLola + "/100" : "-"}</td>
            <td>${personne.lola !== null ? personne.lola + "/100" : "-"}</td>
            <td class="score-box" style="background-color: ${couleur}">${moyenne}/100</td>
        `;
    });
}

function sauvegarderTableau() {
    localStorage.setItem("personnes", JSON.stringify(personnes));
}

function chargerTableau() {
    let data = localStorage.getItem("personnes");
    if (data) {
        personnes = JSON.parse(data);
        afficherTableau();
    }
}

// ✅ Correction : Bouton "Supprimer tout"
function viderTableau() {
    if (confirm("Voulez-vous vraiment supprimer toutes les entrées ?")) {
        personnes = [];
        localStorage.removeItem("personnes");
        afficherTableau();  // Met à jour l'affichage du tableau après suppression
    }
}

// Fonction pour obtenir la couleur du score final
function getCouleur(score) {
    if (score <= 20) return "green";
    if (score <= 40) return "yellow";
    if (score <= 60) return "orange";
    if (score <= 80) return "red";
    return "black";
}

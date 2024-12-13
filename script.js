// Määritellään pelitiedot tasoittain
const levelData = {
    1: [
        { image: '1_mansikka.png', audio: 'Valinta_mansikka.mp3', correct: 1 },
        { image: '1_nalle.png', audio: 'Valinta_nalle.mp3', correct: 1 },
        { image: '1_paita.png', audio: 'Valinta_paita.mp3', correct: 1 },
        { image: '2_hevosta.png', audio: 'Valinta_hevosta.mp3', correct: 2 },
        { image: '2_kukkaa.png', audio: 'Valinta_kukka.mp3', correct: 2 },
        { image: '2_tikkaria.png', audio: 'Valinta_tikkari.mp3', correct: 2 },
        { image: '2_vadelmaa.png', audio: 'Valinta_vadelma.mp3', correct: 2 },
        { image: '3_koiraa.png', audio: 'Valinta_koira.mp3', correct: 3 },
        { image: '3_mustikkaa.png', audio: 'Valinta_mustikka.mp3', correct: 3 },
        { image: '3_paitaa.png', audio: 'Valinta_paita.mp3', correct: 3 }
    ],
    2: [
        // Taso 1 kuvat + nämä
        { image: '4_omenaa.png', audio: 'Valinta_omena.mp3', correct: 4 },
        { image: '4_reppua.png', audio: 'Valinta_reppu.mp3', correct: 4 },
        { image: '5_autoa.png', audio: 'Valinta_auto.mp3', correct: 5 },
        { image: '5_kakkua.png', audio: 'Valinta_kakku.mp3', correct: 5 }
    ],
    3: [
        // Tasot 1-2 kuvat + nämä
        { image: '6_autoa.png', audio: 'Valinta_auto.mp3', correct: 6 },
        { image: '6_hevosta.png', audio: 'Valinta_hevosta.mp3', correct: 6 },
        { image: '6_koiraa.png', audio: 'Valinta_koira.mp3', correct: 6 },
        { image: '7_kakkua.png', audio: 'Valinta_kakku.mp3', correct: 7 },
        { image: '7_paitaa.png', audio: 'Valinta_paita.mp3', correct: 7 },
        { image: '7_vadelmaa.png', audio: 'Valinta_vadelma.mp3', correct: 7 },
        { image: '8_hanskaa.png', audio: 'Valinta_hanska.mp3', correct: 8 },
        { image: '8_kukkaa.png', audio: 'Valinta_kukka.mp3', correct: 8 },
        { image: '8_leppakerttua.png', audio: 'Valinta_leppakerttu.mp3', correct: 8 },
        { image: '9_mansikkaa.png', audio: 'Valinta_mansikka.mp3', correct: 9 },
        { image: '9_omenaa.png', audio: 'Valinta_omena.mp3', correct: 9 },
        { image: '10_hanskaa.png', audio: 'Valinta_hanska.mp3', correct: 10 },
        { image: '10_mustikkaa.png', audio: 'Valinta_mustikka.mp3', correct: 10 },
        { image: '10_nallea.png', audio: 'Valinta_nalle.mp3', correct: 10 },
        { image: '10_sormea.png', audio: 'Valinta_sormi.mp3', correct: 10 }
    ]
};

let currentLevel = 1;
let currentQuestions = [];
let currentQuestionIndex = 0;
let selectedAnswer = null;
let correctAnswers = 0;
let currentAudio = null;

// Tason valinta
document.querySelectorAll('.level-button').forEach(button => {
    button.addEventListener('click', () => {
        currentLevel = parseInt(button.dataset.level);
        startLevel();
    });
});

function getQuestionsForLevel(level) {
    let questions = [];
    
    if (level === 1) {
        // Taso 1: normaali sekoitus 1-3
        return shuffleArray([...levelData[1]]).slice(0, 5);
    } 
    else if (level === 2) {
        // Taso 2: varmistetaan vähintään 3 kysymystä numeroista 4-5
        let lowerNumbers = shuffleArray(levelData[1].concat(levelData[2].filter(q => q.correct <= 3)));
        let higherNumbers = shuffleArray(levelData[2].filter(q => q.correct >= 4));
        
        // Valitaan ensin 3 kysymystä numeroista 4-5
        questions = questions.concat(higherNumbers.slice(0, 3));
        
        // Täydennetään loput satunnaisesti alemmista numeroista
        questions = questions.concat(lowerNumbers.slice(0, 2));
        
        return shuffleArray(questions);
    }
    else if (level === 3) {
        // Taso 3: varmistetaan vähintään 3 kysymystä numeroista 6-10
        let lowerNumbers = shuffleArray([...levelData[1], ...levelData[2]]);
        let higherNumbers = shuffleArray(levelData[3]);
        
        // Valitaan ensin 3 kysymystä numeroista 6-10
        questions = questions.concat(higherNumbers.slice(0, 3));
        
        // Täydennetään loput satunnaisesti alemmista numeroista
        questions = questions.concat(lowerNumbers.slice(0, 2));
        
        return shuffleArray(questions);
    }
}

// Päivitetty startLevel-funktio
function startLevel() {
    document.getElementById('start-screen').classList.remove('active');
    document.getElementById('question-container').classList.add('active');
    
    // Käytetään uutta kysymystenvalintafunktiota
    currentQuestions = getQuestionsForLevel(currentLevel);
    currentQuestionIndex = 0;
    correctAnswers = 0;
    
    createNumberButtons();
    loadQuestion();
}

function createNumberButtons() {
    const numberButtons = document.querySelector('.number-buttons');
    numberButtons.innerHTML = '';
    const maxNumber = currentLevel === 1 ? 3 : currentLevel === 2 ? 5 : 10;
    
    // Lisää level3-luokka jos ollaan tasolla 3
    numberButtons.className = 'number-buttons' + (currentLevel === 3 ? ' level3-buttons' : '');
    
    for (let i = 1; i <= maxNumber; i++) {
        const button = document.createElement('button');
        button.className = 'number-button';
        button.textContent = i;
        button.addEventListener('click', () => selectAnswer(i));
        numberButtons.appendChild(button);
    }
}

function loadQuestion() {
    const question = currentQuestions[currentQuestionIndex];
    document.getElementById('question-image').src = question.image;
    selectedAnswer = null;
    document.getElementById('check-button').disabled = true;
    document.getElementById('check-button').style.display = 'block';
    document.getElementById('next-button').style.display = 'none';
    
    // Nollaa painikkeiden tyylit ja luokat
    document.querySelectorAll('.number-button').forEach(button => {
        button.classList.remove('selected');
        button.style.backgroundColor = 'white';
        button.style.borderColor = 'black';
        button.style.color = 'black';
    });
    
    playAudio(question.audio);
}

function selectAnswer(number) {
    selectedAnswer = number;
    document.querySelectorAll('.number-button').forEach(button => {
        button.classList.remove('selected');
        // Palauta alkuperäiset tyylit muille napeille
        if (parseInt(button.textContent) !== number) {
            button.style.backgroundColor = 'white';
            button.style.color = 'black';
        }
    });

    // Lisää selected-luokka ja tyylit valitulle napille
    const selectedButton = document.querySelector(`.number-button:nth-child(${number})`);
    selectedButton.classList.add('selected');
    selectedButton.style.backgroundColor = 'black';
    selectedButton.style.color = 'white';
    
    document.getElementById('check-button').disabled = false;
}

function checkAnswer() {
    const question = currentQuestions[currentQuestionIndex];
    
    // Etsi valittu nappi ja oikea nappi
    const selectedButton = document.querySelector(`.number-button:nth-child(${selectedAnswer})`);
    const correctButton = document.querySelector(`.number-button:nth-child(${question.correct})`);
    
    if (selectedAnswer === question.correct) {
        correctAnswers++;
        updateStars();
        playAudio('oikein.mp3');
        selectedButton.style.backgroundColor = '#4CAF50';  // vihreä
        selectedButton.style.borderColor = '#4CAF50';
        selectedButton.style.color = 'white';
    } else {
        playAudio('vaarin.mp3');
        selectedButton.style.backgroundColor = '#FF5252';  // punainen
        selectedButton.style.borderColor = '#FF5252';
        selectedButton.style.color = 'white';
        correctButton.style.backgroundColor = '#4CAF50';  // näytetään myös oikea vastaus vihreänä
        correctButton.style.borderColor = '#4CAF50';
        correctButton.style.color = 'white';
    }
    
    document.getElementById('check-button').style.display = 'none';
    document.getElementById('next-button').style.display = 'block';
}

function updateStars() {
    const starsContainer = document.getElementById('stars-container');
    starsContainer.innerHTML = '';
    for (let i = 0; i < correctAnswers; i++) {
        const star = document.createElement('img');
        star.src = 'tahti.png';
        star.className = 'star-icon';
        star.alt = 'Tähti';
        starsContainer.appendChild(star);
    }
}

function nextQuestion() {
    currentQuestionIndex++;
    if (currentQuestionIndex >= currentQuestions.length) {
        showResult();
    } else {
        loadQuestion();
    }
}

function showResult() {
    const questionContainer = document.getElementById('question-container');
    questionContainer.innerHTML = `
        <h1>OPITAAN NUMEROITA</h1>
        <p id="result">SAIT ${correctAnswers} / ${currentQuestions.length} OIKEIN</p>
        <div id="final-stars-container"></div>
        <button class="level-button" onclick="restartGame()">PELAA UUDELLEEN</button>
    `;
    
    const finalStarsContainer = document.getElementById('final-stars-container');
    for (let i = 0; i < correctAnswers; i++) {
        const star = document.createElement('img');
        star.src = 'tahti.png';
        star.className = 'star-icon';
        star.alt = 'Tähti';
        finalStarsContainer.appendChild(star);
    }
}

function restartGame() {
    stopAudio();
    document.getElementById('question-container').classList.remove('active');
    document.getElementById('start-screen').classList.add('active');
    
    // Palauta alkuperäinen HTML-rakenne
    document.getElementById('question-container').innerHTML = `
        <h2>KUINKA MONTA?</h2>
        <div class="image-container">
            <img id="question-image" src="" alt="Kuinka monta?">
        </div>
        <div class="number-buttons"></div>
        <div id="controls">
            <button id="check-button" disabled>TARKISTA</button>
            <img id="next-button" src="nuoli.png" alt="Seuraava">
        </div>
        <div id="stars-container"></div>
    `;

    // Lisää event listenerit takaisin
    document.getElementById('next-button').addEventListener('click', nextQuestion);
    document.getElementById('check-button').addEventListener('click', checkAnswer);
    
    // Nollaa pelin tila
    currentQuestionIndex = 0;
    selectedAnswer = null;
    correctAnswers = 0;
    currentAudio = null;
}

function playAudio(src) {
    stopAudio();
    currentAudio = new Audio(src);
    currentAudio.play().catch(error => console.error('Error playing audio:', error));
}

function stopAudio() {
    if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
        currentAudio = null;
    }
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Lisää click-kuuntelijat
document.getElementById('next-button').addEventListener('click', nextQuestion);
document.getElementById('check-button').addEventListener('click', checkAnswer);

// Näppäimistökuuntelijat
document.addEventListener('keydown', (event) => {
    const number = parseInt(event.key);
    if (!isNaN(number) && number >= 1 && number <= (currentLevel === 1 ? 3 : currentLevel === 2 ? 5 : 10)) {
        selectAnswer(number);
    } else if (event.key === 'Enter' && !document.getElementById('check-button').disabled) {
        checkAnswer();
    } else if (event.key === 'ArrowRight' && document.getElementById('next-button').style.display === 'block') {
        nextQuestion();
    }
});
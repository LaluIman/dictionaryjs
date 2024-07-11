// app.js
const url = "https://api.dictionaryapi.dev/api/v2/entries/en/";
const result = document.getElementById("result");
const sound = document.getElementById("sound");
const btn = document.getElementById("search-btn");

btn.addEventListener("click", () => {
    debounceFetchWord();
});

let debounceTimer;
function debounceFetchWord() {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(fetchWord, 300);
}

async function fetchWord() {
    let inpWord = document.getElementById("inp-word").value.trim();
    if (!inpWord) {
        result.innerHTML = `<h3 class="error">Please enter a word</h3>`;
        return;
    }

    try {
        result.innerHTML = `<h3 class="loading">Loading...</h3>`;
        const response = await fetch(`${url}${inpWord}`);
        if (!response.ok) {
            throw new Error('Word not found');
        }
        const data = await response.json();
        displayResult(data, inpWord);
    } catch (error) {
        result.innerHTML = `<h3 class="error">${error.message}</h3>`;
    }
}

function displayResult(data, inpWord) {
    const wordData = data[0];
    const meanings = wordData.meanings.map(meaning => `
        <div class="meaning">
            <p><strong>${meaning.partOfSpeech}:</strong> ${meaning.definitions[0].definition}</p>
            <p><em>${meaning.definitions[0].example || ""}</em></p>
        </div>
    `).join('');

    const synonyms = wordData.meanings.flatMap(meaning => meaning.definitions.flatMap(def => def.synonyms || [])).join(', ');

    result.innerHTML = `
        <div class="word">
            <h3>${inpWord}</h3>
            <button onclick="playSound()">
                <i class="fas fa-volume-up"></i>
            </button>
        </div>
        <div class="details">
            <p>Phonetic: /${wordData.phonetic || wordData.phonetics[0].text || ""}/</p>
            ${meanings}
            ${synonyms ? `<p><strong>Synonyms:</strong> ${synonyms}</p>` : ""}
        </div>`;
    
    if (wordData.phonetics[0] && wordData.phonetics[0].audio) {
        sound.setAttribute("src", wordData.phonetics[0].audio);
    }
}

function playSound() {
    sound.play();
}

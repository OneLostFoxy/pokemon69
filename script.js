let correctPokemon;
let options = [];

// Função para buscar um Pokémon aleatório pela API
async function getRandomPokemon() {
    const randomId = Math.floor(Math.random() * 1025) + 1; // Pega um Pokémon aleatório entre 1 e 150 (Geração 1)
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomId}`);
    const data = await response.json();
    return data;
}

// Função para buscar quatro Pokémon aleatórios e embaralhar as opções
async function generateQuestion() {
    correctPokemon = await getRandomPokemon(); // Pokémon correto
    options = [correctPokemon]; // Adiciona o Pokémon correto nas opções

    // Adiciona mais 3 Pokémon aleatórios nas opções
    while (options.length < 4) {
        const randomPokemon = await getRandomPokemon();
        // Verifica se o Pokémon já está nas opções
        if (!options.some(option => option.id === randomPokemon.id)) {
            options.push(randomPokemon);
        }
    }

    // Embaralha as opções
    options.sort(() => Math.random() - 0.5);

    displayQuestion(); // Exibe a imagem e as opções de resposta
}

// Função para exibir a imagem do Pokémon e as opções de resposta
function displayQuestion() {
    const pokemonImage = document.getElementById('pokemonImage');
    pokemonImage.src = correctPokemon.sprites.front_default; // Exibe a imagem do Pokémon
    pokemonImage.style.display = 'block';

    const optionsDiv = document.getElementById('options');
    optionsDiv.innerHTML = ''; // Limpa as opções anteriores

    // Cria botões para cada uma das opções de resposta
    options.forEach(option => {
        const button = document.createElement('button');
        button.innerText = capitalizeFirstLetter(option.name); // Nome do Pokémon
        button.onclick = () => checkAnswer(option);
        optionsDiv.appendChild(button);
    });

    // Esconde o botão "Próximo" ao gerar uma nova pergunta
    const nextButton = document.getElementById('nextButton');
    nextButton.style.display = 'none';
}

// Função para verificar se a resposta está correta
function checkAnswer(selected) {
    const resultDiv = document.getElementById('result');
    const nextButton = document.getElementById('nextButton');

    if (selected.name === correctPokemon.name) {
        resultDiv.innerHTML = '<p>Correto!</p>';
    } else {
        resultDiv.innerHTML = `<p>Incorreto! O Pokémon correto era: ${capitalizeFirstLetter(correctPokemon.name)}</p>`;
    }

    nextButton.style.display = 'block'; // Exibe o botão "Próximo"
}

// Quando o botão "Próximo" for clicado, gera uma nova pergunta
document.getElementById('nextButton').onclick = () => {
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = ''; // Limpa o resultado
    generateQuestion(); // Gera uma nova pergunta
};

// Função para capitalizar a primeira letra do nome do Pokémon
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Gera a primeira pergunta ao carregar a página
generateQuestion();

const words = [
    { category: "animal", words: ["bear", "cat", "dog", "dolphin", "elephant", "fox", "giraffe", "horse", "kangaroo", "lion", "penguin", "rabbit", "tiger", "wolf", "zebra"] },
    { category: "colour", words: ["black", "blue", "brown", "cyan", "gray", "green", "lime", "magenta", "orange", "pink", "purple", "red", "teal", "white", "yellow"] },
    { category: "country", words: ["Australia", "Brazil", "Canada", "China", "France", "Germany", "India", "Italy", "Japan", "Mexico", "Russia", "South Africa", "Spain", "United Kingdom", "USA"] },
    { category: "food", words: ["bread", "burger", "cake", "curry", "hamburger", "ice cream", "noodles", "pasta", "pizza", "salad", "sandwich", "sushi", "taco", "vegetables", "chocolate"] },
    { category: "profession", words: ["artist", "chef", "doctor", "engineer", "firefighter", "journalist", "lawyer", "musician", "nurse", "pilot", "scientist", "software developer", "teacher", "farmer", "police"] },
    { category: "sport", words: ["baseball", "basketball", "boxing", "cricket", "cycling", "fishing", "golf", "gymnastics", "hockey", "running", "rugby", "soccer", "swimming", "tennis", "volleyball"] },
    { category: "vehicle", words: ["airplane", "bicycle", "boat", "bus", "helicopter", "motorcycle", "scooter", "submarine", "train", "tractor", "truck", "van", "hoverboard", "skateboard", "car"] }
];  

let {category,word} = getWord()
let indexesForHint = []
document.getElementById("guessForm").addEventListener('submit', (e)=>{
    e.preventDefault()
    if(getInput()){
        compareWords(word,getInput())
    }

})

document.getElementsByClassName("get-hint")[0].addEventListener("click",()=>{
    createHint(category,word)
    category=null
})

function getWord(){
    index1 = Math.floor(Math.random()*words.length)
    index2 = Math.floor(Math.random()*words[0].words.length)
    return {category: words[index1].category,
        word: words[index1].words[index2]}
}

function getInput(){
    const userInput = document.getElementById("guess").value
    if(userInput === ""){
        return null
    }
    return userInput
}

function compareWords(word1, word2) {
    const API_KEY = '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';
    const model = 'sentence-transformers/paraphrase-MiniLM-L6-v2'; 
    let returnData
    fetch(`https://api-inference.huggingface.co/models/${model}`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${API_KEY}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            inputs: {
                source_sentence: word1, 
                sentences: [word2]
            }
        })
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById("scoreValue").innerHTML = Math.floor(data[0]*1000)
    })
    .catch(error => {
        console.error("Error:", error);
    });
}

function createHint (category, word){

    if(category){
        const hint = document.createElement('div')
        hint.innerHTML = `It is a ${category}`
        document.getElementsByClassName("hint")[0].appendChild(hint)
    }else if(!indexesForHint[0]){
        let spaces = ''
        for (let i = 0; i < word.length-1; i++) {
            indexesForHint[i+1]=false
            spaces+=' ...'
        }
        const hint = document.createElement('div')
        hint.innerHTML = `Word: ${word[0]}${spaces}`
        document.getElementsByClassName("hint")[0].appendChild(hint)
        indexesForHint[0] = word[0]
    }else{
        function thirdHintOrAbove(){
            if (!indexesForHint.includes(false)) {
                return;
            }
            let randomIndex = Math.floor(Math.random()*indexesForHint.length)
            if(indexesForHint[randomIndex]){
                
                thirdHintOrAbove()
            }else{
                indexesForHint[randomIndex] = word[randomIndex]
                const hint = document.createElement('div')
                let hintString =''
                for(let i = 0; i < indexesForHint.length; i++){
                    if(indexesForHint[i]){
                        hintString+=" "
                        hintString+=indexesForHint[i]
                    }else{
                        hintString+=" ..."
                    } 
                }
                hint.innerHTML = `Word: ${hintString}`
                document.querySelectorAll(".hint div")[document.querySelectorAll(".hint div").length-1].remove()
                document.getElementsByClassName("hint")[0].appendChild(hint)

            }
        }
        thirdHintOrAbove()
    }
}
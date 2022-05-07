import { useState } from "react"
import './App.sass'
import dict from './web2'

let words
let trie
fetch(dict)
    .then(response => response.text())
    .then(text => {
        words = text.split('\n')
        trie = buildTrie(words)
    })

function buildTrie(words) {
    let root = {};
    words.forEach(word => {
        let current = root;
        for (const c of word) {
            if (!current[c]) current[c] = {}
            current = current[c];
        }
        current["$"] = true;
    })
    return root
}

function findWordsStarting(node, current, result) {
    for (const key in node) {
        if (key === "$") result.push(current)
        findWordsStarting(node[key], current + key, result)
    }
}

function findWordsWithPrefix(trie, prefix) {
    if (!prefix) return []

    for (const c of prefix) {
        if (!trie[c]) return [];
        trie = trie[c];
    }

    const results = [];
    findWordsStarting(trie, prefix, results);

    return results
}

function App() {
    const [suggestions, setSuggestions] = useState([]);


    function handleInput(e) {
        const input = e.target.value

        const lastWord = input.split(' ').pop()
        const words = findWordsWithPrefix(trie, lastWord)

        setSuggestions(words)
    }

    const suggestionLIs = suggestions.map(suggestion =>
        <li key={suggestion}>{suggestion}</li>
    )

    return (
        <div className="App">
            <div>
                <input type="text" className="search" onChange={handleInput}/>
                <button className="search-btn">Search</button>
                <ul>
                    {suggestionLIs}
                </ul>
            </div>
        </div>
    );
}

export default App;

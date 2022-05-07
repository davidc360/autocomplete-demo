import { useState } from "react"
import './App.sass'

const words = ["word", "wear", "weary", "wood"]

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

    const trie = buildTrie(words);

    function handleInput(e) {
        const input = e.target.value
        const words = findWordsWithPrefix(trie, input)
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

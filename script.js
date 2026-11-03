function debounce(fn, delay) {
    let timerId
    return function (...args) {
        clearTimeout(timerId)
        timerId = setTimeout(() => {fn(...args)}, delay)
    }
}

const input = document.getElementById('search')
const suggestionsList = document.getElementById('suggestions')
const selectedList = document.getElementById('selected')

function searchRepos(query) {
    return fetch(`https://api.github.com/search/repositories?q=${query}&per_page=5`)
        .then((response) => {
            if(!response.ok) {
                return {items: []}
            } return response.json()
        })
        .then((data) => data.items)
        .catch(() => [])
}

function addRepo(repo) {
    const li = document.createElement('li')
    const info = document.createElement('div')

    const lines = [
        `Name: ${repo.name}`,
        `Owner: ${repo.owner.login}`,
        `Stars: ${repo.stargazers_count}`
    ]

    for (let line of lines) {
        const row = document.createElement('div')
        row.textContent = line
        info.appendChild(row)
    }

    li.appendChild(info)

    let clearButton = document.createElement('button')
    clearButton.type = 'button'
    clearButton.textContent = 'x'

    li.appendChild(clearButton)

    clearButton.addEventListener('click', () => {
        li.remove()
    })

    selectedList.appendChild(li)
}

function renderSuggestions(repos) {
    suggestionsList.innerHTML = '';
    for (let repo of repos) {
        const li = document.createElement('li');
         li.addEventListener('click', () => {
            addRepo(repo)
            input.value = ''
            suggestionsList.innerHTML = ''
        })
        li.textContent = repo.name;
        suggestionsList.appendChild(li);
    }
}

const debouncedSearch = debounce((query) => {
    searchRepos(query).then((repos) => {
        if (query === input.value.trim()) {
            renderSuggestions(repos)
        }
    })
}, 400)

input.addEventListener('input', () => {
    const query = input.value.trim()
    if (query ===  '') {
       suggestionsList.innerHTML = '';
       return 
    } 
    debouncedSearch(query)
})


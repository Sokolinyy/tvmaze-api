  // Fetch a data form TV MAZe API, what will be searching for name of series, or movies

// User will write into input field, then function searchShow grab the value of "query"
// and display name of show in the #resultList
function searchShow(query) {
  const url = `https://api.tvmaze.com/search/shows?q=${query}`
  fetch(url)
  // If response from server is okay, then return response in JSON, otherwise display error
  .then(response => {
    if (response.ok) {
      return response.json()
    }
    else {
      throw("HTTP ERROR")
    }
  })
  // Loop through jsonData and if everything if ok, 
  // display name of TV show in <ul> of renderResult function
  .then((jsonData) => {
    const resultOfSearch = jsonData.map(element => element.show.name)
    const resultId = jsonData.map(element => element.show.id)
    renderResults(resultOfSearch, query)
    renderInfoAboutShow(resultId, query)
    // If no errors, set error to empty string and not display it
    document.getElementById("errorMessage").innerHTML = "";
    console.log(resultOfSearch);
  })
  .catch((error) => {
    // If have an error, display error, and clear renderResult
    document.getElementById("errorMessage").innerHTML = error;
    renderResults([])
  })
}

function renderInfoAboutShow(resultId, query) {
  console.log(resultId);
  const urlEpisodeList = `https://api.tvmaze.com/shows/1/episodes`
  fetch(urlEpisodeList)
    .then((response) => {
      return response.json()
    })
    .then((jsonData) => {
      console.log(jsonData);

      const link = document.getElementById("episodeQuantity")
      link.addEventListener("click", () => {
        displayEpisodeQuantity(jsonData.length, query);
      })
    })
}

function displayEpisodeQuantity(quantity, query) {
  const message = `The TV show "${query}" has ${quantity} episodes.`;
  alert(message);
}

// Function for rendering result of fetch, on the page
function renderResults(results, query) {
  const list = document.getElementById("resultList") // ! <ul>
  // Always when user want to find, a new TV show, clear the resultList
  list.innerHTML = ""

  const link = document.createElement("a")
  link.href = `https://api.tvmaze.com/shows/${results}/episodes`

  link.addEventListener('click', (event) => {
    event.preventDefault(); // prevent the default action of following the link
    const id = event.target.id
    console.log(id);
    renderInfoAboutShow()
  });
  // For each result, which grab from response, 
  // create a new <li> element, inside the resultList <ul>
  results.forEach(result => {
    const element = document.createElement("li")
    element.innerText = result
    link.appendChild(element) // Append the li element as a child of the a tag
    list.appendChild(link)
  });
}

let searchTimeoutToken = 0;

window.onload = () => {
  const searchFieldElement = document.getElementById("searchField")
  searchFieldElement.onkeyup = (event) => {

    clearTimeout(searchTimeoutToken)

    // If value in input above zero length, return name of TV show
    if (searchFieldElement.value.trim().length === 0) {
      return;
    }

    // Display result of search only if delay of typing above 1 second,
    // for reducing the number of requests to the server
    searchTimeoutToken = setTimeout(() => {
      searchShow(searchFieldElement.value)
    }, 250)
  }
}
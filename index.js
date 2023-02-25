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
    const results = jsonData.map(element => {
      return {
        name: element.show.name,
        id: element.show.id,
        image: element.show.image.medium
      }
    })

    renderResults(results)
/*     infoAboutShow(results) */
/*     renderEpisodeList(resultId, query) */
    // If no errors, set error to empty string and not display it
    document.getElementById("errorMessage").innerHTML = "";
  })
  .catch((error) => {
    // If have an error, display error, and clear renderResult
    document.getElementById("errorMessage").innerHTML = error;
    renderResults([])
  })
}

/* function infoAboutShow(result) {
  const urlEpisodeList = `https://api.tvmaze.com/shows/${result.id}/episodes`
  
} */

// Function for rendering result of fetch, on the page
function renderResults(results) {
  const list = document.getElementById("resultList")
  list.innerHTML = ""

  results.forEach(result => {
    const link = document.createElement("a")
    link.href = `https://api.tvmaze.com/shows/${result.id}/episodes`

    const element = document.createElement("li")
    element.innerText = result.name
    link.appendChild(element)
    list.appendChild(link)

    link.addEventListener("click", (event) => {
      event.preventDefault()

      fetch(link.href)
      .then((response) => {
        if (response.ok) {
          return response.json()
        }
        else {
          throw new Error("HTTP Error")
        }
      })
      .then(jsonData => {

        const episodeList = document.createElement("ul")
        for (let i = 0; i < jsonData.length; i++) {
          const episode = jsonData[i]
          const episodeItem = document.createElement("li")
          episodeItem.innerText = `${episode.name} - Season ${episode.season} Episode ${episode.number} Episode Date ${episode.airdate}`
          episodeList.appendChild(episodeItem)
        }
        link.appendChild(episodeList)
      })
      .catch(error => {
        console.error(error)
      })

    const name = document.createElement("h2")
    name.innerText = result.name
    link.appendChild(name)

    const image = document.createElement("img")
    image.src = result.image
    link.appendChild(image)

    list.appendChild(link)

    console.log(result);

    link.addEventListener("click", (event) => {
      event.preventDefault()
      })
    })
  })
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
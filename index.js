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
    console.log(jsonData);
    const results = jsonData.map(element => {
      return {
        name: element.show.name,
        id: element.show.id,
        image: element.show.image.medium,
        rating: element.show.rating.average
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

// Function for rendering result of fetch, on the page
function renderResults(results) {
  const list = document.getElementById("resultList")
  list.innerHTML = ""

  // Loop through result, then take result id, for display episode list on the page
  results.forEach(result => {
    const link = document.createElement("a")

    link.href = `https://api.tvmaze.com/shows/${result.id}/episodes`

    // Creating element <li> which will place into <a> tag, on const link
    const element = document.createElement("li")
    element.innerText = result.name
    link.appendChild(element)
    list.appendChild(link)

    link.style.width = "fit-content"
    link.style.display = "block"
    link.style.listStyle = "none"
    link.style.margin = "auto"

    // When user click on link result of search, 
    // then fetch "Show episode list" from TV MAZE API
    link.addEventListener("click", (event) => {
      // Prevent default behavior of clicks
      event.preventDefault()
      list.innerText = ""
      renderListEpisode(link, result, list)
    })
  })
}

function renderListEpisode(link, result, list) {
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
        // <ul> element for displaying episode list
        const episodeList = document.getElementById("episodeList")
        // Loop through jsonData and take all the value, like name, id and etc
        for (let i = 0; i < jsonData.length; i++) {
          const episode = jsonData[i]
          // Create <li> elements and put info which takes from jsonData
          const episodeItem = document.createElement("li");
          episodeItem.innerHTML = `
          <p class="name">Episode Name:<br><br> ${episode.name}</p>
          <p class="season">Season:<br><br> ${episode.season}</p>
          <p class="episode-number">Episode:<br><br> ${episode.number}</p>
          <p class="episode-date">Release Date:<br><br> ${episode.airdate}</p>
          `;
          
          // add styles to episodeItem
          episodeItem.style.backgroundColor = "#f2f2f2";
          episodeItem.style.border = "1px solid black";
          
          // add styles to season variable
          // Render episodeList on the page
          episodeList.appendChild(episodeItem)
        }
      })
      .catch(error => {
        console.error(error)
      })

    // Just some elements for design
    const name = document.createElement("h2")
    name.setAttribute("id", "name")
    name.innerText = result.name
    link.appendChild(name)

    const image = document.createElement("img")
    image.src = result.image
    link.appendChild(image)

    list.appendChild(link)

    console.log(result);
}

let searchTimeoutToken = 0;

window.onload = () => {
  const episodeList = document.getElementById("episodeList")

  const searchFieldElement = document.getElementById("searchField")
  searchFieldElement.onkeyup = (event) => {

    clearTimeout(searchTimeoutToken)

    // If value in input above zero length, 
    // immediately check for empty string with setTimeout to zero
    // and clear all the search result
    if (searchFieldElement.value.trim().length === 0) {
      searchTimeoutToken = setTimeout(() => {
        searchShow(searchFieldElement.value)
      }, 0)

      episodeList.innerText = ""
    }

    // Display result of search only if delay of typing above 1 second,
    // for reducing the number of requests to the server
    searchTimeoutToken = setTimeout(() => {
      searchShow(searchFieldElement.value)
    }, 250)
  }
}
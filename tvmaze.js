"use strict";
const MISSING_IMAGE_URL = "http://tinyurl.com/missing-tv";

const $showsList = $("#shows-list");
const $episodesArea = $("#episodes-area");
const $searchForm = $("#search-form");


/** Given a search term, search for tv shows that match that query.
 *
 *  Returns (promise) array of show objects: [show, show, ...].
 *    Each show object should contain exactly: {id, name, summary, image}
 *    (if no image URL given by API, put in a default image URL)
 */
async function searchTvShows(query){
  const showResponse = await axios.get(`http://api.tvmaze.com/search/shows?q=${query}`)
  let shows = showResponse.data.map(results =>{
    let show = results.show;
    return {
      id: show.id,
      name: show.name,
      symmary: show.summary,
      image: show.image ? show.image.medium : MISSING_IMAGE_URL,
    };

  });
  return shows;

}
//searchTvShows()
async function getShowsByTerm( /* term */) {
  // ADD: Remove placeholder & make request to TVMaze search shows API.

  return [
    {
      id: 1767,
      name: "The Bletchley Circle",
      summary:
        `<p><b>The Bletchley Circle</b> follows the journey of four ordinary 
           women with extraordinary skills that helped to end World War II.</p>
         <p>Set in 1952, Susan, Millie, Lucy and Jean have returned to their 
           normal lives, modestly setting aside the part they played in 
           producing crucial intelligence, which helped the Allies to victory 
           and shortened the war. When Susan discovers a hidden code behind an
           unsolved murder she is met by skepticism from the police. She 
           quickly realises she can only begin to crack the murders and bring
           the culprit to justice with her former friends.</p>`,
      image:
          "http://static.tvmaze.com/uploads/images/medium_portrait/147/369403.jpg"
    }
  ]
}


/** Given list of shows, create markup for each and to DOM */

function populateShows(shows) {
  const $showsList = $("#shows-list")// adding the shows List.
  $showsList.empty();// empty the list

  for (let show of shows) {// looking each shows through loop
    const $show = $(
        `<div data-show-id="${show.id}" class="Show col-md-12 col-lg-6 mb-4">
         <div class="media">
           <img 
              src="http://static.tvmaze.com/uploads/images/medium_portrait/160/401704.jpg" 
              alt="Bletchly Circle San Francisco" 
              class="w-25 mr-3">
           <div class="media-body">
             <h5 class="text-primary">${show.name}</h5>
             <div><small>${show.summary}</small></div>
             <button class="btn btn-outline-light btn-sm Show-getEpisodes">
               Episodes
             </button>
           </div>
         </div>  
       </div>
      `);

    $showsList.append($show);  }
}


/** Handle search form submission: get shows from API and display.
 *    Hide episodes area (that only gets shown if they ask for episodes)
 */
$("#search-form").on("submit", async function handleSearch(evt){// handle search form submission
  evt.preventDefault();
  
  let query = $("search-query").val()
  if(!query) return;// if not in the query return nothings
  $("#episodes-area").hide()// hide episodes area

  let shows = await searchTvShows(query)
  populateShows(shows);
});

async function searchForShowAndDisplay() {
  const term = $("#searchForm-term").val();
  const shows = await getShowsByTerm(term);

  $episodesArea.hide();
  populateShows(shows);
}

$searchForm.on("submit", async function (evt) {
  evt.preventDefault();
  await searchForShowAndDisplay();
});


/** Given a show ID, get from API and return (promise) array of episodes:
 *      { id, name, season, number }
 */
async function getEpisodes(id){
  const respons = await axios.get(`http://api.tvmaze.com/shows/${id}/episodes`);
  let episodes = respons.data.map(episode =>({
    id: episode.id,
    name: episode.name,
    season: episode.season,
    number: episode.number,
  }));

  return episodes();
}

// async function getEpisodesOfShow(id) { }
async function getEpisodesOfShow(id) {
  const respons = await axios.get(`http://api.tvmaze.com/shows/${id}/episodes`);
  let episodes = respons.data.map(episode =>({
    id: episode.id,
    name: episode.name,
    season: episode.season,
    number: episode.number,
  }));
  return episodes;

 }
/** Write a clear docstring for this function... */
// function populateEpisodes(episodes) { }
function populateEpisodes(episodes) {
  const $episodesList = $("#episodes-list");
  $episodesList.empty()// EMPTY THE LIST
  for (const episode of episodes) {
    let $item = $(
      `<li>
      ${episode.name}
      (season ${episode.season}, episode ${episode.number})
      </li>
      `);
      $episodesList.append($item)
  }
  $("#episodes-area").show();
}

/** Handle click on show name. */
$("#shows-list").on("click", ".get-episodes", async function handleEpisodesClick(evt){
  let showId = $(evt.target).closet(".Show").data("show-id");
  let episodes = await getEpisodes(showId);
  populateEpisodes(episodes);
})

import axios from "axios";
import * as $ from 'jquery';

const $showsList = $("#showsList");
const $episodesArea = $("#episodesArea");
const $searchForm = $("#searchForm");

const TVMAZE_API_URL = "http://api.tvmaze.com";

interface ShowInterface {
  id: number;
  name: string;
  summary: string;
  image: { original: string; } | null;
}


/** Given a search term, search for tv shows that match that query.
 *
 *  Returns (promise) array of show objects: [show, show, ...].
 *    Each show object should contain exactly: {id, name, summary, image}
 *    (if no image URL given by API, put in a default image URL)
 */

async function getShowsByTerm(term: string): Promise<ShowInterface[]> {
  // ADD: Remove placeholder & make request to TVMaze search shows API.
  const response =
    await axios.get('http://api.tvmaze.com/search/shows',
      { params: { q: term } });


  const showList = response.data.map(
    function (x: {
      show: ShowInterface;
    }) {
      let fallBackImage = "";
      if (x.show.image === null) {
        fallBackImage = "https://tinyurl.com/tv-missing";
      }
      else {
        fallBackImage = x.show.image.original;
      }

      const result: ShowInterface = {
        id: x.show.id,
        name: x.show.name,
        summary: x.show.summary,
        image: { original: fallBackImage }
      };
      return result;
    });
  return showList;

}


/** Given list of shows, create markup for each and to DOM */

function populateShows(shows: ShowInterface[]) {
  $showsList.empty();

  shows.forEach((show: ShowInterface) => {
    const $show = $(
      `<div data-show-id="${show.id}" class="Show col-md-12 col-lg-6 mb-4">
         <div class="media">
           <img
              src="http://static.tvmaze.com/uploads/images/medium_portrait/160/401704.jpg"
              alt="Bletchly Circle San Francisco"
              class="w-25 me-3">
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
    $showsList.append($show);
  });
}


/** Handle search form submission: get shows from API and display.
 *    Hide episodes area (that only gets shown if they ask for episodes)
 */

async function searchForShowAndDisplay() {

  const term = $("#searchForm-term").val() as string;

  const shows: ShowInterface[] = await getShowsByTerm(term);

  $episodesArea.hide();

  populateShows(shows);
}

$searchForm.on("submit", async function (evt) {
  evt.preventDefault();
  await searchForShowAndDisplay();
});


interface EpisodeInterface {
  id: number;
  name: string;
  season: number;
  number: number;
}


/** Given a show ID, get from API and return (promise) array of episodes:
 *      { id, name, season, number }
 */



 async function getEpisodesOfShow(id:number): Promise<EpisodeInterface[]> {

   const response = await axios({
     baseURL: TVMAZE_API_URL,
     url: `shows/${id}/episodes`,
     method: "GET",
   });

  return response.data;
 }


/** Write a clear docstring for this function... */

function populateEpisodes(episodes: EpisodeInterface[]) {

  $episodesList.empty();

  episodes.forEach((episode: EpisodeInterface) => {
    const $episode = $(`
      <ul>
      </ul>

    `);
    $episodesArea.append($episode);
  });


}
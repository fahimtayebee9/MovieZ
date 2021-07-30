import ApiManager from "./api.js";
import UrlManager from "./url.js";
import Element from "./element.js";

export default function App () {
    
    // GETTING REQUIRED ELEMENTS
    const element    = new Element();
    const urlManager = new UrlManager();
    // let currentPage  = 1;

    var radius = element.circle.r.baseVal.value;
    var circumference = radius ;

    // FETCH DATA FROM URL
    const fetchMovies = async (url) => {
        const response = await fetch(url);
        if(response.status == 200){
            var data = await response.json();
            console.log(data);
            return data;
        }
    }

    // FETCH ALL FOR HOME
    const fetchAll = async (currentPage) => {
        const data = await fetchMovies(urlManager.createUrl( [ 'page', 'sort_by'] , [ currentPage, 'popularity.desc' ] ));
        if(data != null){
            renderMovies(data.results);
            renderPagination(data, currentPage);
        }
    }

    // SEARCH ACTION
    const seachAction = async () => {
        var searchInput = element.searchField.value;
        renderPreloader();
        const data = await fetchMovies(urlManager.createSearchUrl( [ 'page', 'sort_by', 'query' ] , [ 1, 'popularity.desc' , searchInput ]) );
        if(data.total_results >= 1){
            renderMovies(data.results);
        }
    }

    // Pagination 
    const renderPagination = (result, page = 1) => {
        let count = 0;
        let endPage = 100;
        let markUp = `<li class="page-item disabled" id="prevBtn-con">
                            <a class="page-link" href="#" id="prevBtn" tabindex="-1" aria-disabled="true">Previous</a>
                        </li>`;
        for(let pg = 1 ; pg <= endPage; pg++){
            let active = (pg == page) ? "active" : "";
            if(pg < 5){
                markUp += `<li class="page-item ${active}"><a class="page-link page-no" href="#" data-order="pg" >${pg}</a></li>`;
            }
            else if(pg > 5 && pg < 97 && count == 0){
                markUp += setPaginationDots();
                count++;
            }
            else if(pg > 97){
                markUp += `<li class="page-item ${active}"><a class="page-link" href="#" data-order="pg" >${pg}</a></li>`;
            }
            
        }
        markUp += `<li class="page-item" id="nextBtn-con">
                        <a class="page-link" id="nextBtn" href="#">Next</a>
                    </li>`;
        setValue(element.paginationUl, markUp);
    }

    const setPaginationDots = () => {
        let markUp = `<li class="page-item"><a class="page-link" href="#">...</a></li>`;
        return markUp;
    }

    // MENU ITEM CLICK
    const renderMenuResult = async (event) => {
        event.preventDefault();
        renderPreloader();
        const data = (event.target.id == 0 ) ? 
                    await fetchAll(1) : 
                    await fetchMovies(urlManager.createUrl( [ 'page', 'sort_by','with_genres'] , [ 1 , 'popularity.desc', event.target.id] ));
        if(data != null){
            renderMovies(data.results);
            renderPagination(data, currentPage);
        }
    }

    // CHANGE PAGE (not working)
    const changePage = (event) => {
        event.preventDefault();
        // this.fetchAll();
        console.log(event.target);
    }

    // NEXT PAGE (not working)
    const nextPage = (event) => {
        event.preventDefault();
        console.log(event.target.id);
    }

    // EVENT LISTENERS
    const eventListeners = () => {
        element.searchField.addEventListener('keyup', seachAction );
        element.btnSearch.addEventListener('click',seachAction);
        element.nextBtn.addEventListener('click', nextPage);
        element.menuList.forEach( function(item){
            item.addEventListener('click',renderMenuResult);
        });
        element.pageNo.forEach( function(page){
            page.addEventListener('click', function(event){
                console.log(page);
            });
        });
    }

    // GET GENRE FOR SINGLE MOVIE
    const getGenre = async (id_list) => {
        let genres = "";
        for(let i = 0; i < id_list.length; i++){
            let genre = await fetchMovies(urlManager.createFindUrl(id_list[i] , 'genre'));
            genres += `<p class="genre-title">${genre.name}</p>`;
        }
        console.log(genres);
        return genres;
    }

    // RENDER PRELOADER WHEN NEEDED
    const renderPreloader = () => {
        element.preloader.classList.remove('d-none');
        element.preloader.classList.add('d-flex');
        element.mainDiv.classList.remove('d-block');
        element.mainDiv.classList.add('d-none');
        setTimeout(function(){
            element.preloader.classList.add('d-none');
            element.preloader.classList.remove('d-flex');
            element.mainDiv.classList.add('d-block');
        },2000);
    }

    // RENDER RATING CIRLCE
    const renderRatingCircle = (vote_average) => {
        var radius = 25;
        var circumference = radius * 2 * Math.PI;

        const offset = circumference - vote_average / 10 * circumference; //movie.vote_average * 10;
        let color  = ""; 
        if(vote_average >= 7.0){
            color = "#21d07a";
        }
        else if(vote_average <= 6.9 && vote_average >= 4.0){
            color = "#f5ed00";
        }
        else{
            color = "#ce0249";
        }

        const ratingCirlce = `
                <circle 
                    stroke-dashoffset="${offset}"
                    stroke-dasharray="${circumference} ${circumference}"
                    stroke="${color}"
                    stroke-width="4.5"
                    fill="transparent"
                    stroke-linecap="round"
                    r="25"
                    cx="35"
                    cy="35" />
            `;
        return ratingCirlce;
    }

    // RENDER SINGLE MOVIE DATA
    const renderMovies = async (movies) => {
        let markUp = '';
        movies.forEach(movie => {
            // let genres = await getGenre(movie.genre_ids);
            const subTitle = (movie.title.length > 16) ? `${movie.title.substr(0,16)}..` : movie.title;

            markUp += `
                <div class="col-md-3 mb-3">
                    <div class="mv-box">
                        <div class="img-holder">
                            <img class="img-fluid w-100 lazy" src="${urlManager.baseImgUrl}${movie.poster_path}">
                        </div>
                        <div class="content-holder d-flex justify-content-between align-items-center">
                            <div class="title-holder">
                                <h4 class="title">${subTitle}
                                    <span class="tooltip">${movie.title}</span>
                                </h4>
                                <div class="genreBox" id="genre-Box">
                                    <p class="genre-title">genre</p>
                                </div>
                            </div>
                            <div class="rating-holder">
                                <p class="rating">${movie.vote_average}</p>
                                <div class="rating-box">
                                    <svg class="progress-ring" height="70" width="70" >
                                        ${renderRatingCircle(movie.vote_average)}
                                    </svg>
                                </div>
                            </div>
                        </div>
                        <div class="overview-box">
                            <h5 class="hd-title">${movie.title} (Overview)</h5>
                            <p class="overview">${movie.overview.substr(0, 280)}...</p>
                        </div>
                    </div>
                </div>`;
            setValue(element.wrapperBnr, markUp);
        });
    };


    const setValue = (elementObj, value) => {
        elementObj.innerHTML = value;
    }

    
    // RENDER ALL
    const renderAll = () => {
        // Fetch Movies
        fetchAll(1);
        
        // Event Listeners
        eventListeners();

    };

    return {
        renderAll       : renderAll(),
    };
};

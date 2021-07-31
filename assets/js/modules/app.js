import ApiManager from "./api.js";
import UrlManager from "./url.js";
import Element from "./element.js";

export default function App () {
    
    // GETTING REQUIRED ELEMENTS
    const element    = new Element();
    const urlManager = new UrlManager();
    // let currentPage  = 1;

    // FETCH DATA FROM URL
    const fetchMovies = async (url) => {
        const response = await fetch(url);
        if(response.status == 200){
            var data = await response.json();
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
        var searchInput = Element.searchField.value;
        renderPreloader();
        const data = await fetchMovies(urlManager.createSearchUrl( [ 'page', 'sort_by', 'query' ] , [ 1, 'popularity.desc' , searchInput ]) );
        if(data.total_results >= 1){
            renderMovies(data.results);
        }
    }

    // CHANGE PAGE (not working)
    const changePage = async (event) => {
        if(event.target.id == "nextBtn"){
            // NOT GETTING THE IDEA TO TRIGGER NEXT BUTTON
        }
        if(event.target.id == "prevBtn"){
            // NOT GETTING THE IDEA TO TRIGGER PREV BUTTON
        }
        await fetchAll(event.target.id);
    }


    // Pagination 
    const renderPagination = (result, page = 1) => {
        let count = 0;
        let markUp = `<li class="page-item disabled" id="prevBtn-con">
                            <button class="page-link" href="#" id="prevBtn" tabindex="-1" aria-disabled="true">Previous</button>
                        </li>`;
        for(let pg = 1 ; pg <= result.total_pages; pg++){
            let active = (pg == page) ? "active" : "";
            if(pg <= 10){
                markUp += `<li class="page-item ${active}"><button type="button" class="page-link page-no" href="#" id="${pg}" >${pg}</button></li>`;
            }
            else if(pg > page && count == 0 && page != 1){
                markUp += setPaginationDots();
                count++;
            }
        }
        markUp += `<li class="page-item" id="nextBtn-con">
                        <button class="page-link" id="nextBtn" href="#">Next</button>
                    </li>`;
        setValue(Element.paginationUl, markUp);
        document.querySelectorAll('.page-no').forEach( button => {
            button.addEventListener('click', changePage);
            
            // changePage(button);
        });
        document.querySelector('#nextBtn').addEventListener('click', changePage);
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

    // RENDER PRELOADER WHEN NEEDED
    const renderPreloader = () => {
        Element.preloader.classList.remove('d-none');
        Element.preloader.classList.add('d-flex');
        Element.mainDiv.classList.remove('d-block');
        Element.mainDiv.classList.add('d-none');
        setTimeout(function(){
            Element.preloader.classList.add('d-none');
            Element.preloader.classList.remove('d-flex');
            Element.mainDiv.classList.add('d-block');
        },2000);
    }

    // RENDER RATING CIRLCE
    const renderRatingCircle = (vote_average, info = false) => {
        var radius  = (info == false) ? 25 : 30;
        var cxcy    = (info == false) ? 35 : 40;
        var hw      = (info == false) ? 70 : 80;
        var circumference = radius * 2 * Math.PI;

        const offset = circumference - vote_average / 10 * circumference;
        let circle_color  = "", circle_bg = ""; 
        if(vote_average >= 7.0){
            circle_color = "#21d07a";
            circle_bg = "#081c22";
        }
        else if(vote_average <= 6.9 && vote_average >= 4.0){
            circle_color = "#f5ed00";
            circle_bg = "#313000";
        }
        else{
            circle_color = "#ce0249";
            circle_bg = "#310011";
        }
        const ratingCirlce = `<div class="rating-holder" style="background: ${circle_bg};">
                                    <p class="rating">${vote_average}</p>
                                    <div class="rating-box">
                                        <svg class="progress-ring" height="${hw}" width="${hw}" >
                                            <circle 
                                                class="progress-ring__circle"
                                                stroke-dashoffset="${offset}"
                                                stroke-dasharray="${circumference} ${circumference}"
                                                stroke="${circle_color}"
                                                stroke-width="4.5"
                                                fill="transparent"
                                                stroke-linecap="round"
                                                r="${radius}"
                                                cx="${cxcy}"
                                                cy="${cxcy}" />
                                        </svg>
                                    </div>
                                </div>`;
        return ratingCirlce;
    }

    // RENDER SINGLE MOVIE DATA
    const renderMovies = async (movies) => {
        let markUp = '';
        let count = 0;
        movies.forEach(movie => {
            const subTitle = (movie.title.length > 16) ? `${movie.title.substr(0,16)}..` : movie.title;
            const options = { year: 'numeric', month: 'long', day: 'numeric' };
            const release_date = new Date(movie.release_date);

            markUp += `<div class="col-md-6 col-sm-6 col-lg-3 col-10 mb-3 ">
                    <button type="button" class="movieBtn_${count}" data-toggle="modal" data-target="#movieDetail_${count}" style="border: none; border-radius: 8px;">
                        <div data-target="movieDetails" data-toggle="modal" class="mv-box " id="movieBox_${count}">
                            <div class="img-holder">
                                <img loading="lazy" class="img-fluid w-100 lazy" src="${urlManager.baseImgUrl}${movie.poster_path}">
                            </div>
                            <div class="content-holder d-flex justify-content-between align-items-center">
                                <div class="title-holder">
                                    <h4 class="title">${subTitle}
                                        <span class="tooltip">${movie.title}</span>
                                    </h4>
                                    <div class="genreBox" id="genre-Box">
                                        <p class="genre-title">${release_date.toLocaleDateString("en-US", options)}</p>
                                    </div>
                                </div>
                                ${renderRatingCircle(movie.vote_average, false)}
                            </div>
                            <div class="overview-box">
                                <h5 class="hd-title">${movie.title} (Overview)</h5>
                                <p class="overview">${movie.overview.substr(0, 280)}...</p>
                            </div>
                        </div>
                    </button>
                </div>`;
            setValue(Element.wrapperBnr, markUp);
            renderDetails(movie.id,`movieDetail_${count}`);
            count++;
        });
    };

    const setValue = (elementObj, value) => {
        elementObj.innerHTML = value;
    }

    // GET MOVIE DETAILS (CREDITS, KEYWORDS, GENRES)
    const getInfos = async (id,key) => {
        let url = (key == null) ? urlManager.createFindUrl(id, 'movie'): urlManager.getMovieInfo('movie', id, key);
        if(key == "images"){
            url += "&include_image_language=en";
        }
        const result = await fetchMovies(url);
        return result;
    }

    // RENDER INFOS OF MOVIE DATAS (CREDITS, KEYWORDS, GENRES)
    const renderInfos = (data, type = "") =>{
        let markUp = "";
        if( Array.isArray(data)){
            let c = 0;
            if(type == "genre"){
                data.forEach( item => {
                    markUp += (c == data.length-1 ) ? `${item.name}` : `${item.name}, `;
                    c++;
                });
            }
            else if(type == "country"){
                data.forEach( item => {
                    markUp += (c == data.length-1 ) ? `${item.iso_3166_1}` : `${item.iso_3166_1}, `;
                    c++;
                });
            }
            else if( type == "cast"){
                data.forEach( item => {
                    markUp += `<div class="col-md-3">
                                    <div class="cast-box">
                                        <div class="img-box">
                                            <img src="${(item.profile_path != null) ? UrlManager.castImgUrl + item.profile_path : 
                                                    "https://www.lgrc.us/wp-content/uploads/2020/09/Businessman-Headshot-Placeholder.jpg" }" class="img-fluid w-100" alt="">
                                        </div>
                                        <div class="info-box">
                                            <h5 class="r-name">${item.original_name}</h5>
                                            <p class="m-name">${item.character}</p>
                                        </div>
                                    </div>
                                </div>`;
                });
                
            }
            else if (type == "videos"){
                data.forEach( item => {
                    markUp += `<div class="cast-box">
                                <div class="video card no_border">
                                    <div class="wrapper" 
                                        style="background-image: url('https://i.ytimg.com/vi/${item.key}/hqdefault.jpg');">
                                        <a class="no_click play_trailer" 
                                            href="https://www.themoviedb.org/video/play?key=${item.key}" 
                                            data-site="YouTube" 
                                            data-id="${item.key}" 
                                            data-title="${item.name}" 
                                            things="" change"="" (2021)"="">
                                                <div class="play_background"><i class="fas fa-play"></i></div></a>
                                    </div>
                                </div>
                            </div>`;
                });
            }
            else if (type == "images"){
                data.forEach( item => {
                    markUp += `<div class="cast-box">
                                    <div class="backdrop">
                                        <img loading="lazy" class="backdrop" src="${UrlManager.backDropPath}${item.file_path}" alt="F9">
                                    </div>
                                </div>`;
                });
            }
            else if(type == "keywords"){
                data.forEach( item => {
                    markUp += `<p class="genre-title mr-1 mb-1">${item.name}</p>`;
                });
            }
            return markUp;
        }
        else{

        }
    }

    // RENDER SINGLE MOVIE DETAILS MODAL
    const renderDetails = async (movie_id, modal_id) => {
        let markUp          = "";
        const movieData     = await getInfos(movie_id, null);
        const options       = { year: 'numeric', month: 'long', day: 'numeric' };
        const release_date  = new Date(movieData.release_date);
        const r_year        = release_date.getFullYear();
        const runtime       = `${Math.floor((movieData.runtime / 60))}h ${ Math.floor(  movieData.runtime - Math.floor((movieData.runtime / 60)) * 60) }m`;
        const CREDITS       = await getInfos(movie_id, 'credits'); 
        const KEYWORDS      = await getInfos(movie_id, 'keywords');
        const VIDEOS        = await getInfos(movie_id, 'videos');
        const IMAGES        = await getInfos(movie_id, 'images');

        markUp += `
            <div class="modal fade" id="${modal_id}" tabindex="-1" aria-labelledby="${modal_id}" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content ">
                        <div class="modal-header">
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">
                            <div class="mvd-banner"
                                style="background-image: url(${UrlManager.bannerImgUrl}${movieData.poster_path});">
                                <div class="container">
                                    <div class="mvd-bnr-box">
                                        <div class="row">
                                            <div class="col-md-4">
                                                <div class="img-holder">
                                                    <img class="img-fluid w-100"
                                                        src="${urlManager.baseImgUrl}${movieData.poster_path}"
                                                        alt="">
                                                </div>
                                            </div>
                                            <div class="col-md-8">
                                                <div class="mvd-title">
                                                    <h1>${movieData.title} <span class="year">(${r_year})</span></h1>
                                                    <div class="sub-title">
                                                        <span class="release">${release_date.toLocaleDateString("en-US", options)} (${renderInfos(movieData.production_countries, 'country')})</span>
                                                        <span class="genres">${renderInfos(movieData.genres, 'genre')}</span>
                                                        <span class="runtime">${runtime}</span>
                                                    </div>
                                                </div>

                                                <div class="tag-box">
                                                    <div class="userRating">
                                                        ${renderRatingCircle(movieData.vote_average, true)}
                                                        <p>
                                                            User Score
                                                        </p>
                                                    </div>
                                                    <p class="tagline">
                                                        ${movieData.tagline}
                                                    </p>
                                                </div>

                                                <div class="overview-box">
                                                    <h5 class="hd-title">Overview</h5>
                                                    <p class="overview">
                                                        ${movieData.overview}
                                                    </p>
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="mvd-info">
                                <div class="container">
                                    <div class="row">
                                        <div class="col-md-9">
                                            <div class="mvd-casts">
                                                <h1>Top Billed Cast</h1>
                                                <div class="row casts-list">
                                                    ${renderInfos(CREDITS.cast, 'cast')}
                                                </div>
                                            </div>

                                            <div class="mvd-media">
                                                <div class="media-header d-flex justify-content-start align-items-center">
                                                    <h1>Media</h1>

                                                    <nav>
                                                        <div class="nav nav-tabs m-auto" id="nav-tab" role="tablist">
                                                            <a class="nav-item nav-link active" data-toggle="tab" href="#videos" role="tab" aria-controls="videos" aria-selected="false">Videos</a>
                                                            
                                                        </div>
                                                    </nav>
                                                </div>

                                                <!-- Tab panes -->
                                                <div class="tab-content " id="nav-tabContent">
                                                    <div class="tab-pane fade active show" id="videos" role="tabpanel" aria-labelledby="privacy-tab">
                                                        <div class="casts-list d-flex justify-content-start align-items-center">
                                                            ${renderInfos(VIDEOS.results,'videos')}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                        </div>
                                        <div class="col-md-3">
                                            <div class="info-area">
                                                <div class="info-box">
                                                    <h5 class="r-name">Status</h5>
                                                    <p class="m-name">${movieData.status}</p>
                                                </div>
                                                <div class="info-box">
                                                    <h5 class="r-name">Original Language</h5>
                                                    <p class="m-name">${movieData.original_language.toUpperCase()}</p>
                                                </div>
                                                <div class="info-box">
                                                    <h5 class="r-name">Budget</h5>
                                                    <p class="m-name">$${movieData.budget}</p>
                                                </div>
                                                <div class="info-box">
                                                    <h5 class="r-name">Revenue</h5>
                                                    <p class="m-name">$${movieData.revenue}</p>
                                                </div>
                                            </div>
                                            <div class="info-area keywords">
                                                <h1>Keywords</h1>
                                                <div class="info-box">
                                                    ${renderInfos(KEYWORDS.keywords, 'keywords')}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`;
        Element.movideDetails_list.insertAdjacentHTML('beforeend', markUp);
    }

    // EVENT LISTENERS
    const eventListeners = () => {
        // Element.searchField.addEventListener('keyup', seachAction );
        Element.btnSearch.addEventListener('click',seachAction);
        
        Element.menuList.forEach( function(item){
            item.addEventListener('click',renderMenuResult);
        });
        
        Element.movieBox.forEach( function(item){
            item.addEventListener('click', renderDetails);
        });
    }

    // RENDER ALL
    const renderAll = () => {
        // Fetch Movies
        fetchAll(1);
        
        getInfos(497698,null);

        eventListeners();

    };

    return {
        renderAll       : renderAll(),
    };
};

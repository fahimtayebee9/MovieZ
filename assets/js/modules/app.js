import ApiManager from "./api.js";
import UrlManager from "./url.js";
import Element from "./element.js";

export default function App () {
    
    // GETTING REQUIRED ELEMENTS
    const element    = new Element();
    const urlManager = new UrlManager();
    let currentPage  = 1;

    var radius = element.circle.r.baseVal.value;
    var circumference = radius ;

    const fetchMovies = async () => {
        const response = await fetch(urlManager.createUrl( [ 'page', 'sort_by'] , [ currentPage, 'popularity.desc' ] ) );
        if(response.status == 200){
            var data = await response.json();
            renderMovies(data.results);
            renderPagination(data);
        }
    }

    const setProgress = (percent) => {
        const offset = circumference - percent / 10 * circumference;
        element.circle.style.strokeDashoffset = percent * 10;
    }

    const seachAction = async () => {
        var domainInput = element.btnDomain.value;
        if(domainInput != null || domainInput != ""){
            console.log(domainInput);
            var searchInput = element.searchField.value;
            const response = await fetch(urlManager.createSearchUrl( [ 'page', 'sort_by', 'query' ] , [ 1, 'popularity.desc' , searchInput ] , domainInput) );
            if(response.status == 200){
                var data = await response.json();
                renderMovies(data.results);
            }
        }
    }

    const nextPage = (event) => {
        event.preventDefault();
        console.log(id);
    }

    const renderPagination = (result) => {
        // total_pages: 500
        // total_results: 10000
        // page: 1
        let pg = 1;
        let count = 0;
        let markUp = `<li class="page-item disabled">
                        <a class="page-link" href="#" tabindex="-1" aria-disabled="true">Previous</a>
                    </li>`;
        for( ; pg <= result.total_pages; pg++){
            let active = (pg == currentPage) ? "active" : "";
            if(pg < 5){
                markUp += `<li class="page-item ${active}"><a class="page-link" href="#" >${pg}</a></li>`;
            }
            else if(pg > 5 && pg < 497 && count == 0){
                markUp += setPaginationDots();
                count++;
            }
            else if(pg > 497){
                markUp += `<li class="page-item ${active}"><a class="page-link" href="#" >${pg}</a></li>`;
            }
            
        }
        markUp += `<li class="page-item">
                        <a class="page-link" href="#">Next</a>
                    </li>`;
        setValue(element.paginationUl, markUp);
    }

    const setPaginationDots = () => {
        let markUp = `<li class="page-item"><a class="page-link" href="#">...</a></li>`;
        return markUp;
    }

    const eventListeners = () => {
        element.searchField.addEventListener('keyup', seachAction );
        element.btnSearch.addEventListener('click',seachAction);
        // element.menuList.addEventListener('click',renderMenuResult);
    }

    // RENDER Choices
    const renderMovies = (movies) => {
        let markUp = '';
        console.log(movies);
        movies.forEach(movie => {
            // Default Value
            element.circle.style.strokeDasharray = `${circumference} ${circumference}`;
            element.circle.style.strokeDashoffset = `${circumference}`;
            setProgress(movie.vote_average);

            markUp += `
                <div class="col-md-3 mb-3">
                    <div class="mv-box">
                        <div class="img-holder">
                            <img class="img-fluid w-100" src="${urlManager.baseImgUrl}${movie.poster_path}" alt="">
                        </div>
                        <div class="content-holder d-flex justify-content-between align-items-center">
                            <div class="title-holder">
                                <h4 class="title">${movie.title}
                                    <span class="tooltip">${movie.title}</span>
                                </h4>
                                <p class="upload-dt">Upload Date</p>
                            </div>
                            <div class="rating-holder">
                                <p class="rating">${movie.vote_average}</p>
                                <div class="rating-box">
                                    <svg class="progress-ring" height="70" width="70" >
                                        <circle
                                            stroke="blanchedalmond"
                                            stroke-width="3"
                                            fill="transparent"
                                            r="25"
                                            cx="35"
                                            cy="35" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                        <div class="overview-box">
                            <h5 class="hd-title">Overview</h5>
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
        fetchMovies();
        
        // Event Listeners
        eventListeners();

        // renderMenuResult();
    };

    return {
        renderAll       : renderAll(),
        // renderMenuResult: renderMenuResult()
    };
};

export default function UrlManager(){
    this.apiKey            = "3500244f1e0e7fb7f2647a8c7a70ad56";
    this.baseImgUrl        = "https://image.tmdb.org/t/p/w1280";
    this.defaultUrl        = "http://api.themoviedb.org/3";
    this.baseUrl           = "http://api.themoviedb.org/3/discover/";
    this.moviesUrl         = this.baseUrl + "movie?api_key=" + this.apiKey;
    // "https://api.themoviedb.org/3/search/company?api_key=3500244f1e0e7fb7f2647a8c7a70ad56&"
}

UrlManager.prototype.createUrl = function(key = [], value = []){
    let options = "";
    for(let i = 0; i < key.length && value.length; i++){
        options += `&${key[i]}=${value[i]}`;
    }
    let newUrl = this.moviesUrl + options;
    return newUrl;
}

UrlManager.prototype.createSearchUrl = function(key = [] , value = [], domain){
    let options = "";
    for(let i = 0; i < key.length && value.length; i++){
        options += `&${key[i]}=${value[i]}`;
    }
    let newUrl = `${this.defaultUrl}/search/${domain}?api_key=${this.apiKey}${options}`;
    return newUrl;
}
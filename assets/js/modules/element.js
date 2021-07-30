export default function Element(){
    this.mainDiv           = document.querySelector('.main');
    this.searchField       = document.querySelector('#searchField');
    this.titleBnr          = document.querySelector('#title');
    this.circle            = document.querySelector('circle');
    this.wrapperBnr        = document.querySelector('.mvList-body');
    this.btnSearch         = document.querySelector('#btn-search');
    this.btnDomain         = document.querySelector('#btnDomain');
    this.menuList          = document.querySelectorAll('.menu-ref');
    this.paginationUl      = document.querySelector('#pagination-ul');
    this.prevBtnCon        = document.querySelector('#prevBtn-con');
    this.prevBtn           = document.querySelector('#prevBtn');
    this.nextBtnCon        = document.querySelector('#nextBtn-con');
    this.nextBtn           = document.querySelector('#nextBtn');
    // this.pageNo            = document.querySelector('.page-no');
    this.pageNo            = [];
    this.genreBox          = document.querySelector('#genre-Box');
    this.genreTitle        = document.querySelector('.genre-title');
    this.ratingBox         = document.querySelector('.rating-box');
    this.preloader         = document.querySelector('#preLoader-dv');
}

Element.prototype.store = function(result){
    this.previousResult = [...this.pageNo, result];
}

Element.prototype.addElement = function(value){
    this.nextBtn = value;
}
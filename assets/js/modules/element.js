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
}
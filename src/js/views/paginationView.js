import View from './view.js';
import icons from 'url:../../img/icons.svg';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;

      const goToPage = +btn.dataset.goto;
      handler(goToPage);
    });
  }

  _generateMarkup() {
    const currentPage = this._data.page;

    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );

    // Page 1 and other pages
    if (currentPage === 1 && numPages > 1) {
      return this._generateMarkupButton(currentPage);
    }

    // Last Page
    if (currentPage === numPages && numPages > 1) {
      return this._generateMarkupButton(currentPage, 'prev');
    }

    // Other Page
    if (currentPage < numPages) {
      return (
        this._generateMarkupButton(currentPage, 'prev') +
        this._generateMarkupButton(currentPage)
      );
    }

    // Page 1 and only one page
    return '';
  }

  _generateMarkupButton(currentPage, pageTo = 'next') {
    const goTo = pageTo === 'prev' ? currentPage - 1 : currentPage + 1;

    return `
        <button data-goto="${goTo}" class="btn--inline pagination__btn--${pageTo}">
            <svg class="search__icon">
                <use href="${icons}#icon-arrow-${
      pageTo === 'prev' ? 'left' : 'right'
    }"></use>
            </svg>
            <span>Page ${goTo}</span>
        </button>
        `;
  }
}

export default new PaginationView();

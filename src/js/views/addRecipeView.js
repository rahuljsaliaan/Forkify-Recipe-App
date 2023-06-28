import View from './view.js';

class AddRecipeView extends View {
  _parentElement = document.querySelector('.upload');
  _message = 'Recipe was successfully uploaded :)';

  _window = document.querySelector('.add-recipe-window');
  _overlay = document.querySelector('.overlay');
  _btnOpen = document.querySelector('.nav__btn--add-recipe');
  _btnClose = document.querySelector('.btn--close-modal');

  constructor() {
    super();
    this._addHandlerShowWindow();
    this._addHandlerHideWindow();
  }

  toggleWindow() {
    [this._overlay, this._window].forEach(modal =>
      modal.classList.toggle('hidden')
    );
  }

  _addHandlerShowWindow() {
    this._btnOpen.addEventListener('click', this.toggleWindow.bind(this));
  }

  _addHandlerHideWindow() {
    [this._overlay, this._btnClose].forEach(ele =>
      ele.addEventListener('click', this.toggleWindow.bind(this))
    );
  }

  addHandlerUpload(handler) {
    this._parentElement.addEventListener('submit', function (e) {
      e.preventDefault();
      const dataArr = [...new FormData(this)]; // this points to the _parentElement
      //   const data = Array.from(new FormData(this).entries());

      const data = Object.fromEntries(dataArr); // converts array entries into objects
      handler(data);
    });
  }

  _generateMarkup() {}
}

export default new AddRecipeView();

import icons from 'url:../../img/icons.svg';

export default class View {
  _data;

  /**
   * Render the received object to the DOM
   * @param {Object | Object[]} data The data to be rendered (e.g. Recipe)
   * @returns {undefined}
   * @this {Object} View Instance
   * @author Rahul J
   */
  render(data) {
    try {
      if (!data || (Array.isArray(data) && data.length === 0))
        throw new Error(`No Recipes found!`);

      this._data = data;

      const markup = this._generateMarkup();

      this._clear();
      this._parentElement.insertAdjacentHTML('afterbegin', markup);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Updated the existing DOM with the received object
   * @param {Object | Object[]} data The data to be updated with the existing DOM (e.g. Recipe)
   * @returns {undefined}
   * @this {Object} View Instance
   * @author Rahul J
   */
  update(data) {
    this._data = data;
    const newMarkup = this._generateMarkup();

    // Creating a virtual dom to compare with the actual dom
    const newDOM = document.createRange().createContextualFragment(newMarkup); // RETURN VALUE: document fragment

    const newElements = Array.from(newDOM.querySelectorAll('*')); // RETURN VALUE: NODE list converted into Array
    const currentElements = Array.from(
      this._parentElement.querySelectorAll('*')
    );

    // Algorithm to compare and replace the different values in the current DOM
    newElements.forEach((newElement, i) => {
      const currentElement = currentElements[i];

      if (!currentElement.isEqualNode(newElement)) {
        // Change the text content
        if (currentElement.firstChild?.nodeValue.trim() !== '')
          currentElement.textContent = newElement.textContent;

        Array.from(newElement.attributes).forEach(attr => {
          currentElement.setAttribute(attr.name, attr.value);
        });
      }
    });
  }

  /**
   * Render the spinner until the actual content is loaded or the error message is displayed
   * @returns {undefined}
   * @this {Object} View Instanc
   * @author Rahul J
   */
  renderSpinner() {
    const markup = `
          <div class="spinner">
              <svg>
                <use href="${icons}#icon-loader"></use>
              </svg>
          </div> 
      `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  /**
   * Displays error message if the content is not loaded
   * @param {String} message Error message to be displayed if the content it not loaded
   * @returns {undefined}
   * @this {Object} View Instance
   * @author Rahul J
   */
  renderError(message = this._errorMessage) {
    const markup = `
          <div class="error">
            <div>
              <svg>
                <use href="${icons}#icon-alert-triangle"></use>
              </svg>
            </div>
            <p>${message}</p>
          </div> 
      `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  /**
   * Displays message on success
   * @param {String} message Message to be displayed on success
   * @returns {undefined}
   * @this {Object} View Instanc
   * @author Rahul J
   */
  renderMessage(message = this._message) {
    console.log(message);
    const markup = `
          <div class="message">
            <div>
              <svg>
                <use href="${icons}#icon-smile"></use>
              </svg>
            </div>
            <p>${message}</p>
          </div> 
      `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  /**
   * Publisher function to add event listener on the window object
   * @param {Function} handler Callback function that is called on hashchange and load event
   * @event load
   * @event hashchange
   * @returns {undefined}
   * @author Rahul J
   */
  addHandlerRender(handler) {
    ['hashchange', 'load'].forEach(ev => window.addEventListener(ev, handler));
  }

  _clear() {
    this._parentElement.innerHTML = '';
  }
}

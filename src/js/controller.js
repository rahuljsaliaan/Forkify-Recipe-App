import * as model from './model.js';
import { MODAL_CLOSE_SEC } from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';

// if (module.hot) module.hot.accept();

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;
    recipeView.renderSpinner();

    // 0. Update results view to mark selected search result
    resultsView.update(model.getSearchResultsPage());
    bookmarksView.update(model.state.bookmarks);

    // 1. Loading recipe
    await model.loadRecipe(id);

    // 2. Rendering recipe
    recipeView.render(model.state.recipe);
  } catch (error) {
    console.error(error.message);
    recipeView.renderError();
  }
};

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();

    // get search query
    const query = searchView.getQuery();

    // load search results
    await model.loadSearchResult(query);

    // render result
    // resultsView.render(model.state.search.results); //all results
    resultsView.render(model.getSearchResultsPage()); //particular page

    // render initial pagination buttons
    paginationView.render(model.state.search);
  } catch (error) {
    console.error(error.message);
    resultsView.renderError();
  }
};

const controlPagination = function (goToPage) {
  resultsView.render(model.getSearchResultsPage(goToPage)); //particular new page

  // render new  pagination buttons
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  // Update the recipe servings (in state)
  model.updateServings(newServings);

  // Update the recipe view
  // recipeView.render(model.state.recipe); DEPRECATED
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  try {
    if (!model.state.recipe.bookmarked) model.addBookMark(model.state.recipe);
    else model.deleteBookMark(model.state.recipe.id);

    recipeView.update(model.state.recipe);
    bookmarksView.render(model.state.bookmarks);
  } catch (error) {
    bookmarksView.renderError();
  }
};

const controlBookmarks = function () {
  try {
    bookmarksView.render(model.state.bookmarks);
  } catch (error) {
    bookmarksView.renderError();
  }
};

const controlAddRecipe = async function (newRecipe) {
  // Upload the new Recipe Data
  try {
    // Render the loading spinner
    addRecipeView.renderSpinner();

    await model.uploadRecipe(newRecipe);

    // Render the added recipe
    recipeView.render(model.state.recipe);

    // Success message
    addRecipeView.renderMessage();

    // Render Bookmark view
    bookmarksView.render(model.state.bookmarks);

    // Change ID in URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`); // state,  title, url

    // Close form window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (error) {
    addRecipeView.renderError(error.message);
  }
};

// subscriber function
const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};

init();

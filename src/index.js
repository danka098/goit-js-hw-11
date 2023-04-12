// import { fetchImages } from './fetchImages';
import Notiflix from 'notiflix';
import axios from 'axios';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const form = document.querySelector('#search-form');
const searchInput = document.querySelector('input[name="searchQuery"]');
const searchBtn = document.querySelector('button[type="submit"]');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');
loadMoreBtn.style.display = 'none';
let page;
let allPages;
const perPage = 40;

const lightbox = new SimpleLightbox('.photo-link');
searchInput.focus();

async function fetchGallery() {
  try {
    const response = await axios.get(
      `https://pixabay.com/api/?key=33158907-0652e41e9f508e65904cd564d&q=${searchInput.value.trim()}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${page}`,
      {
        params: {
          key: '30644078-9c3e2e06796d38a395da3d7bc',
          image_type: 'photo',
          orientation: 'horizontal',
          safesearch: 'true',
          page: page,
          per_page: 40,
        },
      }
    );
    const images = await response.data;
    console.log(response);
    console.log(images);
    allPages = Math.ceil(response.data.totalHits / 40);
    console.log(allPages);
    if (allPages === 0) {
      loadMoreBtn.style.display = 'none';
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    } else {
      loadMoreBtn.style.display = 'block';
    }

    gallery.insertAdjacentHTML(
      'beforeend',
      images.hits
        .map(
          element =>
            `<div class="photo-card">
            <img src="${element.largeImageURL}" alt="${element.tags}" loading="lazy" />
          <div class="info">
            <p class="info-item">
              <b>Likes: ${element.likes}</b>
            </p>
            <p class="info-item">
              <b>Views: ${element.views}</b>
            </p>
            <p class="info-item">
              <b>Comments: ${element.comments}</b>
            </p>
            <p class="info-item">
              <b>Downloads: ${element.downloads}</b>
            </p>
          </div>
        </div>`
        )
        .join('')
    );
    lightbox.refresh();
  } catch (error) {
    console.error(error);
  }
}

async function newPage(e) {
  e.preventDefault();
  page += 1;
  try {
    const response = await axios.get(
      `https://pixabay.com/api/?key=33158907-0652e41e9f508e65904cd564d&q=${searchInput.value.trim()}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${page}`,
      {
        params: {
          key: '33371363-d0431b264357eef04487873b0',
          image_type: 'photo',
          orientation: 'horizontal',
          safesearch: true,
          page: page,
          per_page: 40,
        },
      }
    );
    const images = await response.data;
    console.log(response);
    console.log(images);
    if (images.totalHits < perPage && images.totalHits > 0) {
      loadMoreBtn.style.display = 'none';
      Notiflix.Notify.info(
        "We're sorry, but you've reached the end of search results."
      );
    }

    gallery.insertAdjacentHTML(
      'beforeend',
      images.hits
        .map(
          element =>
            `<div class="photo-card">
        <img src="${element.largeImageURL}" alt="${element.tags}" loading="lazy" />
        <div class="info">
          <p class="info-item">
            <b>Likes: ${element.likes}</b>
          </p>
          <p class="info-item">
            <b>Views: ${element.views}</b>
          </p>
          <p class="info-item">
            <b>Comments: ${element.comments}</b>
          </p>
          <p class="info-item">
            <b>Downloads: ${element.downloads}</b>
          </p>
        </div>
      </div>`
        )
        .join('')
    );
    lightbox.refresh();
  } catch (error) {
    console.log(error);
  }
}

form.addEventListener('submit', e => {
  e.preventDefault();
  gallery.innerHTML = '';
  page = 1;
  fetchGallery();
});
loadMoreBtn.addEventListener('click', newPage);

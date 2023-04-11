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
let page = 1;
const perPage = 40;

const lightbox = new SimpleLightbox('.gallery img', {
  captionsData: 'alt',
  captionDelay: 250,
  captionPosition: 'bottom',
});

async function fetchGallery() {
  gallery.innerHTML = '';
  try {
    const response = await axios.get(
      `https://pixabay.com/api/?key=33158907-0652e41e9f508e65904cd564d&q=${searchInput.value.trim()}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${page}`,
      {
        params: {
          key: '30644078-9c3e2e06796d38a395da3d7bc',
          image_type: 'photo',
          orientation: 'horizontal',
          safesearch: 'true',
        },
      }
    );
    const images = response.data.hits;
    console.log(response);
    console.log(images);
    if (images.length == 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      loadMoreBtn.style.display = 'none';
    }
    if (images.totalHits < perPage && images.totalHits > 0) {
      Notiflix.Notify.warning(
        "We're sorry, but you've reached the end of search results."
      );
    } else {
      loadMoreBtn.style.display = 'block';
    }

    gallery.insertAdjacentHTML(
      'beforeend',
      images
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
    page += 1;
  } catch (error) {
    console.error(error);
  }
}

form.addEventListener('submit', e => {
  e.preventDefault();
  fetchGallery();
});
loadMoreBtn.addEventListener('click', fetchGallery);

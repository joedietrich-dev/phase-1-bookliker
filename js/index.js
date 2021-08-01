document.addEventListener("DOMContentLoaded", function () { app() });

async function app() {
  const books = await fetch('http://localhost:3000/books').then(res => res.json());
  const bookList = document.getElementById('list');
  const bookDetails = document.getElementById('show-panel');
  const currentUser = { "id": 1, "username": "pouros" };

  renderBooklist(books, bookList, bookDetails, currentUser);





}

const renderBooklist = (books, list, detailContainer, currentUser) => {
  return books.reduce((parent, book) => {
    const bookItem = document.createElement('li');
    bookItem.innerText = book.title;
    bookItem.addEventListener('click', (e) => renderBookDetail(book, detailContainer, currentUser));
    parent.appendChild(bookItem);
    return parent;
  }, list);
}

const renderBookDetail = (book, detailContainer, currentUser) => {
  detailContainer.innerHTML = '';
  const bookImage = document.createElement('img');
  bookImage.src = book.img_url;
  const bookTitle = document.createElement('h2');
  bookTitle.innerText = book.title;
  const bookSubTitle = document.createElement('h3');
  bookSubTitle.innerText = book.subtitle;
  const bookDescription = document.createElement('p');
  bookDescription.innerText = book.description;
  const likeButton = document.createElement('button');
  likeButton.innerText = book.users.find(user => user.id === currentUser.id) ? 'Unlike' : 'Like';
  likeButton.addEventListener('click', () => likeBook(book, currentUser));
  likeButton.id = 'like-button';
  const userLikes = document.createElement('ui');
  userLikes.id = 'user-likes';
  renderLikes(book.users, userLikes);
  detailContainer.append(bookImage, bookTitle, bookSubTitle, bookDescription, likeButton, userLikes);
}

const renderLikes = (users, likeContainer) => {
  users.forEach(user => {
    const userLike = document.createElement('li');
    userLike.innerText = user.username;
    userLike.id = `user-${user.id}-like`;
    likeContainer.appendChild(userLike);
  });
}

const likeBook = (book, currentUser) => {
  const didUserLike = !!book.users.find(user => user.id === currentUser.id);
  const newLikes = didUserLike
    ? book.users.filter(user => user.id !== currentUser.id)
    : [...book.users, currentUser];

  fetch(`http://localhost:3000/books/${book.id}`, {
    method: 'PATCH',
    headers: {
      "Content-Type": "application/json; charset=utf-8"
    },
    body: JSON.stringify({
      id: book.id,
      users: newLikes
    })
  }).then(res => res.json())
    .then(data => {
      const userLikes = document.getElementById('user-likes');
      const likeButton = document.getElementById('like-button');
      book.users = data.users;
      userLikes.innerHTML = '';
      renderLikes(data.users, userLikes);
      likeButton.innerText = didUserLike ? 'Like' : 'Unlike';
    })
}
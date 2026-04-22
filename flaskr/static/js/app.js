(function () {
  const userBtn = document.getElementById('user-menu-btn');
  const userMenu = document.getElementById('user-menu');

  if (userBtn && userMenu) {
    userBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      const open = userMenu.classList.toggle('open');
      userBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });

    document.addEventListener('click', function () {
      userMenu.classList.remove('open');
      userBtn.setAttribute('aria-expanded', 'false');
    });
  }
})();

(function () {
  const commentInput = document.getElementById('review-input');
  const postCommentBtn = document.getElementById('post-comment-btn');
  const commentList = document.getElementById('comment-list');

  if (commentInput && postCommentBtn && commentList) {
    postCommentBtn.addEventListener('click', function () {
      const cleaned = (commentInput.value || '').trim();
      if (!cleaned) return;

      const emptyMessage = commentList.querySelector('.status-message');
      if (emptyMessage) emptyMessage.remove();

      const article = document.createElement('article');
      article.className = 'comment-item';

      const text = document.createElement('p');
      text.textContent = cleaned;

      const date = document.createElement('span');
      date.textContent = new Date().toLocaleString();

      article.appendChild(text);
      article.appendChild(date);
      commentList.prepend(article);
      commentInput.value = '';
    });
  }

  const starButtons = Array.from(document.querySelectorAll('.star-btn'));
  const ratingValue = document.getElementById('rating-value');

  if (starButtons.length && ratingValue) {
    starButtons.forEach((button) => {
      button.addEventListener('click', function () {
        const value = Number(button.getAttribute('data-rating') || '0');

        starButtons.forEach((btn) => {
          const btnValue = Number(btn.getAttribute('data-rating') || '0');
          const active = btnValue <= value;
          btn.classList.toggle('active', active);
          btn.setAttribute('aria-checked', btnValue === value ? 'true' : 'false');
        });

        ratingValue.textContent = value > 0 ? `${value}.0 / 5` : 'No rating yet';
      });
    });
  }
})();

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

  const limitCheckboxGroup = (name, max) => {
    const inputs = Array.from(document.querySelectorAll(`input[name="${name}"]`));
    if (!inputs.length) return;

    inputs.forEach((input) => {
      input.addEventListener('change', () => {
        const selectedCount = inputs.filter((item) => item.checked).length;
        if (selectedCount > max) {
          input.checked = false;
        }
      });
    });
  };

  const updateInputActiveStates = () => {
    const controls = Array.from(document.querySelectorAll('.genre-chip input, .theme-tag input'));
    controls.forEach((input) => {
      const wrapper = input.closest('label');
      if (!wrapper) return;
      wrapper.classList.toggle('active', input.checked);
    });
  };

  limitCheckboxGroup('favorite_genres', 3);
  limitCheckboxGroup('disliked_genres', 3);

  const pillRemovers = Array.from(document.querySelectorAll('.pill-remove'));
  const themeQueryInput = document.getElementById('theme_query');
  const customTagsInput = document.getElementById('custom_tags');
  const tagInput = document.getElementById('tag_input');
  const addTagBtn = document.getElementById('add_tag_btn');
  const themeTagsContainer = document.querySelector('.theme-tags');
  const activeToggleInputs = Array.from(document.querySelectorAll('.genre-chip input, .theme-tag input'));

  const populateTags = () => {
    if (!customTagsInput || !themeTagsContainer) return;
    const currentTags = customTagsInput.value.split(',').map(t => t.trim()).filter(t => t);
    // Clear existing custom tags pills
    const existingPills = themeTagsContainer.querySelectorAll('.theme-tag:not(.theme-query-pill)');
    existingPills.forEach(pill => pill.remove());
    // Add pills for current tags
    currentTags.forEach(tag => {
      const label = document.createElement('label');
      label.className = 'theme-tag active';
      label.innerHTML = `
        <input type="checkbox" name="theme_tags" value="${tag}" checked />
        <span>${tag}</span>
        <span class="pill-remove" aria-hidden="true">×</span>
      `;
      themeTagsContainer.appendChild(label);
    });
  };

  const addTag = () => {
    if (!tagInput || !customTagsInput || !themeTagsContainer) return;
    const newTag = tagInput.value.trim();
    if (!newTag) return;
    const currentTags = customTagsInput.value.split(',').map(t => t.trim()).filter(t => t);
    if (currentTags.includes(newTag)) return; // Avoid duplicates
    currentTags.push(newTag);
    customTagsInput.value = currentTags.join(', ');
    tagInput.value = '';
    populateTags();
  };

  activeToggleInputs.forEach((input) => {
    input.addEventListener('change', updateInputActiveStates);
  });

  if (addTagBtn) {
    addTagBtn.addEventListener('click', addTag);
  }

  if (tagInput) {
    tagInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        addTag();
      }
    });
  }

  pillRemovers.forEach((button) => {
    button.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      const wrapper = button.closest('label');
      if (!wrapper) return;

      if (button.dataset.remove === 'theme-query' && themeQueryInput) {
        themeQueryInput.value = '';
        const checkbox = wrapper.querySelector('input[type="checkbox"]');
        if (checkbox) checkbox.checked = false;
        wrapper.remove();
        return;
      }

      const tagText = wrapper.querySelector('span').textContent;
      if (customTagsInput) {
        const currentTags = customTagsInput.value.split(',').map(t => t.trim()).filter(t => t);
        const updatedTags = currentTags.filter(t => t !== tagText);
        customTagsInput.value = updatedTags.join(', ');
      }
      wrapper.remove();
    });
  });

  populateTags();
  updateInputActiveStates();
})();

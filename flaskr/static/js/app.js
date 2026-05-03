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

  const getSavedTags = () => {
    if (!customTagsInput) return [];
    return customTagsInput.value.split(',').map(t => t.trim()).filter(t => t);
  };

  const saveTags = (tags) => {
    if (!customTagsInput) return;
    customTagsInput.value = tags.filter(Boolean).join(', ');
  };

  limitCheckboxGroup('favorite_genres', 3);
  limitCheckboxGroup('disliked_genres', 3);

  const themeQueryInput = document.getElementById('theme_query');
  const customTagsInput = document.getElementById('custom_tags');
  const tagInput = document.getElementById('tag_input');
  const addTagBtn = document.getElementById('add_tag_btn');
  const themeTagsContainer = document.querySelector('.theme-tags');
  const activeToggleInputs = Array.from(document.querySelectorAll('.genre-chip input, .theme-tag input'));

  const populateTags = () => {
    if (!customTagsInput || !themeTagsContainer) return;
    const currentTags = getSavedTags();
    const existingPills = themeTagsContainer.querySelectorAll('.theme-tag:not(.theme-query-pill)');
    existingPills.forEach(pill => pill.remove());
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
    if (!tagInput || !customTagsInput) return;
    const newTag = tagInput.value.trim();
    if (!newTag) return;
    const currentTags = getSavedTags();
    if (currentTags.includes(newTag)) return;
    currentTags.push(newTag);
    saveTags(currentTags);
    tagInput.value = '';
    populateTags();
    updateInputActiveStates();
  };

  const removeTag = (tagText) => {
    const currentTags = getSavedTags();
    const updatedTags = currentTags.filter((tag) => tag !== tagText);
    saveTags(updatedTags);
    populateTags();
    updateInputActiveStates();
  };

  const handleRemoveClick = (button) => {
    const wrapper = button.closest('label');
    if (!wrapper) return;

    if (button.dataset.remove === 'theme-query' && themeQueryInput) {
      themeQueryInput.value = '';
      const checkbox = wrapper.querySelector('input[type="checkbox"]');
      if (checkbox) checkbox.checked = false;
      wrapper.remove();
      updateInputActiveStates();
      return;
    }

    const tagText = wrapper.querySelector('span')?.textContent?.trim();
    if (tagText) {
      removeTag(tagText);
    }
  };

  if (themeTagsContainer) {
    themeTagsContainer.addEventListener('click', (event) => {
      const button = event.target.closest('.pill-remove');
      if (!button) return;
      event.preventDefault();
      event.stopPropagation();
      handleRemoveClick(button);
    });

    themeTagsContainer.addEventListener('change', (event) => {
      const input = event.target;
      if (!input.matches('input[name="theme_tags"]')) return;
      const wrapper = input.closest('label');
      if (!wrapper) return;

      if (!input.checked) {
        if (wrapper.dataset.remove === 'theme-query' && themeQueryInput) {
          themeQueryInput.value = '';
          wrapper.remove();
        } else {
          const tagText = wrapper.querySelector('span')?.textContent?.trim();
          if (tagText) {
            removeTag(tagText);
          }
        }
      }
      updateInputActiveStates();
    });
  }

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

  populateTags();
  updateInputActiveStates();
})();

function toggle(element) {
  event.stopPropagation();
  element.classList.toggle('active');
}

function toggleSearch() {
  const bar = document.getElementById('searchBar');
  bar.style.display = bar.style.display === 'block' ? 'none' : 'block';
  if (bar.style.display === 'block') {
    document.getElementById('searchInput').focus();
  }
}

// Chatbot functions
function toggleChatbot() {
  const window = document.getElementById('chatbotWindow');
  window.classList.toggle('active');
  if (window.classList.contains('active')) {
    document.getElementById('chatbotInput').focus();
  }
}

function handleChatbotKeyPress(event) {
  if (event.key === 'Enter') {
    sendChatbotMessage();
  }
}

function addChatbotMessage(content, sender, isTyping) {
  const messagesContainer = document.getElementById('chatbotMessages');
  const messageDiv = document.createElement('div');
  messageDiv.className = `message ${sender}-message`;
  
  const contentDiv = document.createElement('div');
  contentDiv.className = 'message-content';
  if (isTyping) {
    contentDiv.textContent = 'AI is typing...';
  } else {
    contentDiv.textContent = content;
  }
  
  messageDiv.appendChild(contentDiv);
  messagesContainer.appendChild(messageDiv);
  
  // Scroll to bottom
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
  return contentDiv;
}

function sendChatbotMessage() {
  const input = document.getElementById('chatbotInput');
  const message = input.value.trim();
  if (!message) return;

  // Add user message
  addChatbotMessage(message, 'user');
  input.value = '';

  // Add typing indicator
  const typingDiv = addChatbotMessage('', 'bot', true);

  // Generate AI response after a short delay
  setTimeout(() => {
    const response = generateAIResponse(message);
    // Typewriter effect (faster)
    let i = 0;
    typingDiv.textContent = '';
    function typeWriter() {
      if (i < response.length) {
        typingDiv.textContent += response.charAt(i);
        i++;
        setTimeout(typeWriter, 6 + Math.random() * 10); // much faster
      }
    }
    typeWriter();
  }, 400 + Math.random() * 200); // faster initial delay
}

function generateAIResponse(userMessage) {
  const message = userMessage.toLowerCase();
  
  // FAQ data for AI to search through
  const faqData = {
    'campaign results': {
      category: 'Help Center > Cases > Campaigns',
      answer: 'Go to the Campaigns tab under Help Center > Cases and click on the campaign to view results and insights.',
      keywords: ['campaign', 'results', 'view', 'insights', 'cases'],
      searchTerm: 'Campaign Results'
    },
    'dashboard': {
      category: 'Organization',
      answer: 'Overview and reporting metrics related to your organization.',
      keywords: ['dashboard', 'overview', 'reporting', 'metrics', 'organization'],
      searchTerm: 'Dashboard'
    },
    'agent features': {
      category: 'Agent',
      answer: 'Details on the tools and permissions available to agents using the platform.',
      keywords: ['agent', 'features', 'tools', 'permissions', 'platform'],
      searchTerm: 'Agent Features'
    },
    'content management': {
      category: 'Content',
      answer: 'Guidance on uploading, editing, and reviewing content assets.',
      keywords: ['content', 'managing', 'uploading', 'editing', 'reviewing', 'assets'],
      searchTerm: 'Managing Content'
    },
    'admin controls': {
      category: 'Admin',
      answer: 'Instructions for account and user permission settings for administrators.',
      keywords: ['admin', 'controls', 'account', 'permissions', 'settings', 'administrators'],
      searchTerm: 'Admin Controls'
    },
    'welcome': {
      category: 'General',
      answer: 'Start here for general information about SweetRelish.',
      keywords: ['welcome', 'general', 'information', 'start'],
      searchTerm: 'Welcome'
    }
  };

  // Check for exact matches first
  for (const [key, data] of Object.entries(faqData)) {
    if (message.includes(key)) {
      // Trigger search automatically
      triggerSearch(data.searchTerm);
      return `I found information about ${key} in the FAQ:\n\n**${data.category}**\n${data.answer}\n\nI've searched for "${data.searchTerm}" in the FAQ above. You can click on the highlighted results to expand them!`;
    }
  }

  // Check for keyword matches
  for (const [key, data] of Object.entries(faqData)) {
    for (const keyword of data.keywords) {
      if (message.includes(keyword)) {
        // Trigger search automatically
        triggerSearch(data.searchTerm);
        return `I found relevant information in the FAQ:\n\n**${data.category}**\n${data.answer}\n\nThis relates to your question about "${keyword}". I've searched for "${data.searchTerm}" above - click on the highlighted results to see more details!`;
      }
    }
  }

  // General responses for common questions
  if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
    return "Hello! I'm here to help you find information in the SweetRelish FAQ. You can ask me about campaigns, dashboard, agent features, content management, admin controls, or any other topics covered in the FAQ.";
  }

  if (message.includes('help') || message.includes('what can you do')) {
    return "I can help you find information in the FAQ! Try asking me about:\n• Campaign results and insights\n• Dashboard and reporting\n• Agent features and tools\n• Content management\n• Admin controls and settings\n\nOr just describe what you're looking for in your own words!";
  }

  if (message.includes('search') || message.includes('find')) {
    return "I can help you search the FAQ! Try asking me about specific topics like 'campaign results', 'dashboard', 'agent features', or 'content management'. I'll find the relevant information and automatically search for it in the FAQ above.";
  }

  // Default response
  return "I'm not sure I found exactly what you're looking for. Try asking about specific topics like:\n• Campaign results\n• Dashboard features\n• Agent tools\n• Content management\n• Admin settings\n\nOr use the search bar above to search through all FAQ content.";
}

function triggerSearch(searchTerm) {
  const searchInput = document.getElementById('searchInput');
  const searchBar = document.getElementById('searchBar');

  // Show search bar if it's hidden
  if (searchBar.style.display !== 'block') {
    searchBar.style.display = 'block';
  }

  // Simulate typing effect in the search bar
  searchInput.value = '';
  let i = 0;
  function typeSearch() {
    if (i <= searchTerm.length) {
      searchInput.value = searchTerm.slice(0, i);
      // Trigger the search input event
      const event = new Event('input', { bubbles: true });
      searchInput.dispatchEvent(event);
      i++;
      setTimeout(typeSearch, 40 + Math.random() * 30); // fast but visible
    }
  }
  typeSearch();

  // Focus on the search input
  searchInput.focus();
}

function resetFAQ() {
  // Reset search bar
  const searchInput = document.getElementById('searchInput');
  const searchBar = document.getElementById('searchBar');
  searchInput.value = '';
  if (searchBar.style.display === 'block') {
    searchBar.style.display = 'none';
  }
  const event = new Event('input', { bubbles: true });
  searchInput.dispatchEvent(event);

  // Reset FAQ: collapse all
  document.querySelectorAll('.category, .question').forEach(el => {
    el.classList.remove('active');
    el.style.display = 'block';
  });
  document.querySelectorAll('mark').forEach(m => m.replaceWith(m.textContent));

  // Hide no results message
  const noResults = document.getElementById('noResultsMessage');
  if (noResults) noResults.style.display = 'none';

  // Reset chatbot
  const chatbotWindow = document.getElementById('chatbotWindow');
  if (chatbotWindow) chatbotWindow.classList.remove('active');
  const chatbotInput = document.getElementById('chatbotInput');
  if (chatbotInput) chatbotInput.value = '';
  const chatbotMessages = document.getElementById('chatbotMessages');
  if (chatbotMessages) {
    chatbotMessages.innerHTML = `<div class="message bot-message"><div class="message-content">Hi! I'm your AI assistant. I can help you find information in the FAQ. What would you like to know?</div></div>`;
  }
  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

document.addEventListener('DOMContentLoaded', function() {
  const searchInput = document.getElementById('searchInput');
  const noResults = document.getElementById('noResultsMessage');
  searchInput.addEventListener('input', function () {
    const value = this.value.trim().toLowerCase();
    const categories = document.querySelectorAll('.category');
    let anyVisible = false;

    // Helper: recursively search questions and expand parents if match
    function searchQuestions(element, value) {
      let found = false;
      // Only search .question direct children
      const questions = Array.from(element.children).filter(child => child.classList && child.classList.contains('question'));
      questions.forEach(q => {
        // Remove previous highlight
        q.querySelectorAll('mark').forEach(m => m.replaceWith(m.textContent));
        let qText = q.firstChild.textContent.trim().toLowerCase();
        let match = value && qText.includes(value);
        // Highlight
        if (match) {
          let inner = q.firstChild.textContent.replace(new RegExp(`(${value})`, 'gi'), '<mark>$1</mark>');
          q.firstChild.innerHTML = inner;
        } else {
          q.firstChild.innerHTML = q.firstChild.textContent;
        }
        // Recursively search nested questions
        let nestedContent = Array.from(q.children).find(child => child.classList && child.classList.contains('question-content'));
        let foundInNested = false;
        if (nestedContent) {
          foundInNested = searchQuestions(nestedContent, value);
        }
        // Show/hide - only show if it matches or has matching children
        if (!value) {
          q.style.display = 'block';
          q.classList.remove('active');
        } else if (match || foundInNested) {
          q.style.display = 'block';
          q.classList.add('active');
          found = true;
        } else {
          q.style.display = 'none';
          q.classList.remove('active');
        }
      });
      return found;
    }

    categories.forEach(category => {
      // Remove previous highlight from category
      category.querySelectorAll('mark').forEach(m => m.replaceWith(m.textContent));
      let catText = category.firstChild.textContent.trim().toLowerCase();
      let catMatch = value && catText.includes(value);
      if (catMatch) {
        let inner = category.firstChild.textContent.replace(new RegExp(`(${value})`, 'gi'), '<mark>$1</mark>');
        category.firstChild.innerHTML = inner;
      } else {
        category.firstChild.innerHTML = category.firstChild.textContent;
      }
      // Search all nested questions
      let categoryContent = Array.from(category.children).find(child => child.classList && child.classList.contains('category-content'));
      let foundInQuestions = false;
      if (categoryContent) {
        foundInQuestions = searchQuestions(categoryContent, value);
      }
      // Show/hide category - only show if it matches or has matching questions
      if (!value) {
        category.style.display = 'block';
        category.classList.remove('active');
        anyVisible = true;
      } else if (catMatch || foundInQuestions) {
        category.style.display = 'block';
        category.classList.add('active');
        anyVisible = true;
      } else {
        category.style.display = 'none';
        category.classList.remove('active');
      }
    });

    // Show/hide no results message
    if (value && !anyVisible) {
      noResults.style.display = 'block';
    } else {
      noResults.style.display = 'none';
    }
  });

  // Add click handler for search results
  document.addEventListener('click', function(event) {
    const searchValue = searchInput.value.trim();
    if (searchValue && event.target.closest('.question')) {
      const question = event.target.closest('.question');
      const hasHighlight = question.querySelector('mark');
      
      if (hasHighlight) {
        // Collapse all other questions first
        document.querySelectorAll('.question.active').forEach(q => {
          if (q !== question) {
            q.classList.remove('active');
          }
        });
        document.querySelectorAll('.category.active').forEach(c => {
          if (!c.contains(question)) {
            c.classList.remove('active');
          }
        });
        
        // Expand the clicked question and its parents
        question.classList.add('active');
        let parent = question.closest('.category');
        if (parent) {
          parent.classList.add('active');
        }
        
        // Scroll to the question
        question.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  });
}); 
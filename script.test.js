const fs = require('fs');
const path = require('path');

const script = fs.readFileSync(path.join(__dirname, 'script.js'), 'utf8');
window.eval(script);

describe('toggle for parent elements', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div class="parent"></div>
      <div class="parent"></div>
      <div class="parent"></div>
    `;
    global.event = { stopPropagation: jest.fn() };
    window.getComputedStyle = () => ({ getPropertyValue: () => 'none' });
  });

  test('only one parent retains active class at a time', () => {
    const parents = document.querySelectorAll('.parent');

    window.toggle(parents[0]);
    expect(parents[0].classList.contains('active')).toBe(true);

    window.toggle(parents[1]);
    expect(parents[0].classList.contains('active')).toBe(false);
    expect(parents[1].classList.contains('active')).toBe(true);

    window.toggle(parents[2]);
    expect(parents[1].classList.contains('active')).toBe(false);
    expect(parents[2].classList.contains('active')).toBe(true);
  });
});

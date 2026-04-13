console.log('Dark Pattern Radar: script started');

const COLORS = {
  'Urgency':            '#FF6B6B',
  'Scarcity':           '#FF922B',
  'Misdirection':       '#CC5DE8',
  'Social Proof':       '#339AF0',
  'Other Dark Pattern': '#FF6B6B'
};

function extractTexts() {
  const tags = ['p', 'span', 'button', 'h1', 'h2', 'h3', 'a', 'div', 'li'];
  const items = [];
  tags.forEach(tag => {
    document.querySelectorAll(tag).forEach(el => {
      const text = el.innerText?.trim();
      if (text && text.length > 2 && text.length < 300 && el.children.length === 0) {
        items.push({ element: el, text });
      }
    });
  });
  return items;
}

async function analyze() {
  console.log('Dark Pattern Radar: analyzing page...');
  const items = extractTexts();
  console.log('Dark Pattern Radar: extracted', items.length, 'text elements');
  
  if (items.length === 0) return;

  // Send in batches of 50 to avoid large requests
  const batchSize = 50;
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    const texts = batch.map(b => b.text);

    try {
      const response = await fetch('http://127.0.0.1:5000/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ texts })
      });

      const data = await response.json();
      console.log('Dark Pattern Radar: batch result', data.dark_patterns_found, 'found');

      data.results.forEach((result, idx) => {
        if (result.is_dark_pattern) {
          const el = batch[idx].element;
          const color = COLORS[result.label] || '#FF6B6B';
          el.style.backgroundColor = color;
          el.style.color = '#fff';
          el.style.borderRadius = '4px';
          el.style.padding = '2px 6px';
          el.title = `⚠️ ${result.label} (${Math.round(result.confidence * 100)}% confidence)`;
        }
      });
    } catch (e) {
      console.log('Dark Pattern Radar: API error', e);
    }
  }
}

setTimeout(analyze, 3000);
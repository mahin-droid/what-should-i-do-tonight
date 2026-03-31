const CATEGORIES = ['Entertainment', 'Food', 'Sports', 'Travel', 'Events'];

const TRENDING_ITEMS = {
  Entertainment: [
    { title: 'Panchayat S4 Trailer Drops', score: 95 },
    { title: 'New Shah Rukh Khan Film Announced', score: 92 },
    { title: 'Netflix India Top 10 Updated', score: 85 },
  ],
  Food: [
    { title: 'Biryani Festival at Manek Chowk', score: 88 },
    { title: 'New Cafe Opens on SG Highway', score: 72 },
    { title: 'Street Food Documentary Viral', score: 78 },
  ],
  Sports: [
    { title: 'IPL 2025 Mid-Season Report', score: 94 },
    { title: 'India vs Australia T20 Schedule Out', score: 90 },
    { title: 'ISL Final Tickets Sold Out', score: 82 },
  ],
  Travel: [
    { title: 'Rann Utsav 2025 Dates Announced', score: 86 },
    { title: 'Goa Flight Prices Drop 30%', score: 80 },
    { title: 'New Vande Bharat Route to Udaipur', score: 75 },
  ],
  Events: [
    { title: 'Comedy Night This Saturday', score: 78 },
    { title: 'Heritage Walk Registration Open', score: 70 },
    { title: 'Gaming Tournament at Alpha One', score: 74 },
  ],
};

function setupTrendingHandler(socket, namespace) {
  // Send initial trending data
  socket.emit('trending_data', TRENDING_ITEMS);

  // Update trending every 30 seconds
  const interval = setInterval(() => {
    // Randomly update scores
    const category = CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];
    const items = TRENDING_ITEMS[category];
    if (items && items.length > 0) {
      const item = items[Math.floor(Math.random() * items.length)];
      const oldScore = item.score;
      item.score = Math.min(100, Math.max(50, item.score + Math.floor(Math.random() * 11) - 5));

      if (Math.abs(item.score - oldScore) > 5) {
        namespace.emit('trending_update', {
          category,
          item: item.title,
          oldScore,
          newScore: item.score,
          timestamp: new Date().toISOString(),
        });
      }

      // Random activity spike
      if (Math.random() < 0.1) {
        namespace.emit('activity_spike', {
          category,
          message: `${category} activity surging! ${item.title} is blowing up.`,
          spike_percentage: Math.floor(Math.random() * 30) + 20,
          timestamp: new Date().toISOString(),
        });
      }
    }
  }, 30000);

  socket.on('disconnect', () => {
    clearInterval(interval);
  });
}

module.exports = { setupTrendingHandler };

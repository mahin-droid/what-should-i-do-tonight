const IPL_TEAMS = [
  'Mumbai Indians', 'Chennai Super Kings', 'Royal Challengers Bangalore',
  'Kolkata Knight Riders', 'Delhi Capitals', 'Rajasthan Royals',
  'Punjab Kings', 'Sunrisers Hyderabad', 'Gujarat Titans', 'Lucknow Super Giants',
];

const VENUES = [
  'Narendra Modi Stadium, Ahmedabad', 'Wankhede Stadium, Mumbai',
  'Eden Gardens, Kolkata', 'M. Chinnaswamy Stadium, Bangalore',
  'MA Chidambaram Stadium, Chennai',
];

// Persistent match state
let activeMatches = [];

function generateMatch() {
  const teams = [];
  while (teams.length < 2) {
    const t = IPL_TEAMS[Math.floor(Math.random() * IPL_TEAMS.length)];
    if (!teams.includes(t)) teams.push(t);
  }
  return {
    match_id: `live_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    sport: 'cricket',
    teams,
    score: {
      batting_team: teams[0],
      runs: Math.floor(Math.random() * 30),
      wickets: 0,
      overs: Math.round(Math.random() * 3 * 10) / 10,
      run_rate: 0,
      target: null,
      innings: 1,
    },
    status: 'live',
    venue: VENUES[Math.floor(Math.random() * VENUES.length)],
    league: 'IPL 2025',
    excitement_score: 50,
  };
}

function progressMatch(match) {
  const s = match.score;
  if (s.wickets >= 10 || s.overs >= 20) {
    if (s.innings === 1) {
      s.target = s.runs + 1;
      s.innings = 2;
      s.batting_team = match.teams[1];
      s.runs = 0;
      s.wickets = 0;
      s.overs = 0;
    } else {
      match.status = 'completed';
      return null;
    }
  }

  // Add runs
  const outcomes = [0, 0, 1, 1, 1, 2, 2, 3, 4, 4, 6];
  const runs = outcomes[Math.floor(Math.random() * outcomes.length)];
  s.runs += runs;

  // Possible wicket (10% chance)
  if (Math.random() < 0.1 && s.wickets < 10) {
    s.wickets += 1;
    // Emit wicket event
    return { event: 'wicket_fall', data: { match_id: match.match_id, teams: match.teams, wickets: s.wickets, runs: s.runs } };
  }

  // Progress overs
  s.overs = Math.round((s.overs + 0.1) * 10) / 10;
  if (s.overs % 1 >= 0.6) {
    s.overs = Math.floor(s.overs) + 1;
  }

  s.run_rate = s.overs > 0 ? Math.round((s.runs / s.overs) * 100) / 100 : 0;

  // Calculate excitement
  let excitement = 50;
  if (s.target) {
    const remaining = s.target - s.runs;
    const oversLeft = 20 - s.overs;
    if (remaining < 30 && oversLeft < 5) excitement = 95;
    else if (remaining < 50 && oversLeft < 8) excitement = 80;
  }
  if (s.wickets >= 5) excitement = Math.max(excitement, 75);
  if (s.run_rate > 9) excitement = Math.max(excitement, 70);
  match.excitement_score = excitement;

  // Check win in 2nd innings
  if (s.innings === 2 && s.target && s.runs >= s.target) {
    match.status = 'completed';
    return { event: 'match_ended', data: { match_id: match.match_id, winner: s.batting_team, teams: match.teams } };
  }

  return null;
}

function setupSportsHandler(socket, namespace) {
  // Initialize matches if none exist
  if (activeMatches.length === 0) {
    activeMatches.push(generateMatch());
    if (Math.random() > 0.5) activeMatches.push(generateMatch());
  }

  // Send initial state
  socket.emit('initial_state', activeMatches.filter(m => m.status === 'live'));

  // Update scores every 5 seconds
  const interval = setInterval(() => {
    const liveMatches = activeMatches.filter(m => m.status === 'live');

    if (liveMatches.length === 0) {
      // Start a new match
      activeMatches = [generateMatch()];
    }

    for (const match of activeMatches) {
      if (match.status !== 'live') continue;
      const specialEvent = progressMatch(match);

      if (specialEvent) {
        namespace.emit(specialEvent.event, specialEvent.data);
      }
    }

    namespace.emit('score_update', activeMatches.filter(m => m.status === 'live'));
  }, 5000);

  socket.on('disconnect', () => {
    clearInterval(interval);
  });
}

module.exports = { setupSportsHandler };

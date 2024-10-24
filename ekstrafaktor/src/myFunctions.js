

const apiOrgInfo = (endpoint, parameters)  => {

  let orgParam = Array.isArray(parameters)?
      parameters.map(parameter => `${Object.keys(parameter)}=${parameter[Object.keys(parameter)]}`).join('&')
      :`${Object.keys(parameters)}=${parameters[Object.keys(parameters)]}`;
  orgParam=orgParam.includes("&")?orgParam.slice(0,orgParam.length):orgParam;
  const myHeaders = new Headers();
  myHeaders.append("x-rapidapi-key", "0f534c7fb965f8983d9160d34499a2ff");
  myHeaders.append("x-rapidapi-host", "v3.football.api-sports.io");

  const requestOptions = {
  method: 'GET',
  headers: myHeaders,
  redirect: 'follow'
  };
  const apiWithEndpoint = `http://localhost:8080/api/${endpoint}?${orgParam}`;
  const adressWithOptions = {apiAddress:apiWithEndpoint, requestOptions:requestOptions};
  return adressWithOptions;//
}

const evaluatePlayerImpact = (playerImpact) => {
    if (playerImpact>0.57){
      return 2;//rød
    }else if (playerImpact>0.28){
      return 1;//gul
    }else{
      return 0;//grønn
    }
  }

  const evaluateMatchStatus = (listPlayersImpacts) => {
    const sum = listPlayersImpacts.reduce((a,b) => a+b, 0);
    const numberInjuries = listPlayersImpacts.length;
    if (sum>=8){
      return ['r', numberInjuries, sum];//rød
    }else if (sum>4){
      return ['y', numberInjuries, sum];//gul
    }else{
      return ['g', numberInjuries, sum];//grønn
    }
  }

  const fetchTeamStats = async (leagueID, teamID, fixtureDate, setState, refVar) => {
      
    const teamStatsApi = apiOrgInfo("teams/statistics", [{ league: leagueID}, {season: "2023"}, {team: teamID}, {date: fixtureDate}]);
    if (teamStatsApi) { 
    try {
      const response = await fetch(teamStatsApi.apiAddress, teamStatsApi.requestOptions);
      const string = await response.text();
      const teamStats = string===""? {}: JSON.parse(string);
      const totalMatches = teamStats.response.fixtures.played.total;
      
      setState(prevTeamsPlayedMatches => ({ ...prevTeamsPlayedMatches, [teamID]: totalMatches}));
      refVar.current[teamID] = totalMatches;
    } catch (error) {
      console.log(`Error: ${error}`);
      throw error;
    }
  }
  };

  
  const fetchPlayerStats = async (playerID, teamID, setState, setRef) => {
    const playerStatsApi = apiOrgInfo("players", [{ id: playerID}, {season: "2023"}, {team: teamID}]);
    try {
      
      const response = await fetch(playerStatsApi.apiAddress, playerStatsApi.requestOptions);
      const string = await response.text();
      const playerStats = string===""? {}: JSON.parse(string);
      const totalMatches = playerStats.response[0].statistics[0].games.lineups;
      const playerName = playerStats.response[0].player.name;
      const playerTeam = playerStats.response[0].statistics[0].team.name;
      const playerLeague = playerStats.response[0].statistics[0].league.name;
      const playerTeamId = playerStats.response[0].statistics[0].team.id;
      const playerLeagueId = playerStats.response[0].statistics[0].league.id;
      setState(prevPlayerStats => ({ ...prevPlayerStats, 
        [playerID]: {"played": totalMatches,
           "name": playerName,
            "team": playerTeam,
             "teamId": playerTeamId,
             "league": playerLeague,
              "leagueId": playerLeagueId,
              "id": playerID}}));
      setRef.current[playerID] = totalMatches;
      return playerStats;//få frem hovedliga 
    } catch (error) {
      console.log(`Error: ${error}`);
      throw error;
    }
  

  }

 const fetchSidelinedDate = async(playerID, setState, matchDate) => {
    const sidelinedApi = apiOrgInfo("sidelined", [{ player: playerID}]);
    try {
      const sidelinedRes = await fetch(sidelinedApi.apiAddress, sidelinedApi.requestOptions);
      const sidelinedString = await sidelinedRes.text();
      let sidelined = sidelinedString===""? {}: JSON.parse(sidelinedString);
      if(sidelined.results!==0){//skade detaljer tilgjengelig for spiller
      const injuredStartDate = new Date(sidelined.response[0].start);
      const injuryType =  sidelined.response[0].type;
      const daysDuration = Math.round((matchDate - injuredStartDate) / (1000 * 60 * 60 * 24));
      setState(prevPlayerStats => ({ ...prevPlayerStats, [playerID]: 
        {   ...prevPlayerStats[playerID], 
            "injured": injuredStartDate,
             "injuryType": injuryType,
              "duration": daysDuration}}));
        }else if(sidelined.results === 0 && !("rateLimit" in sidelined.errors)){//skade detaljer utilgjengelig for spiller
          setState(prevPlayerStats => ({ ...prevPlayerStats, [playerID]:
            {   ...prevPlayerStats[playerID], 
                "injured": "N/A",
                 "injuryType": "N/A",
                  "duration": "N/A"}}));
        }else if ("rateLimit" in sidelined.errors){//rate limit er oversteget for forespørsel
          sidelined = {errors: false, player: playerID, errorsMSG: sidelined.errors};//returnerer spiller id for å gjøre nytt API kall
          return sidelined;
        };
      return sidelined;
    } catch (error) {
      console.log(`Error: ${error}`);
      throw error;
    }
  }
 
  
export {apiOrgInfo, evaluatePlayerImpact, evaluateMatchStatus, fetchPlayerStats, fetchTeamStats, fetchSidelinedDate};
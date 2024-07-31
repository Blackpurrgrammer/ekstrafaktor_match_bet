import React from 'react'
import './App.css';
import { useEffect,useState } from 'react';



const MatchListing = (props) => {
  const [toggle, setToggle] = useState(false);
  const leaguesObjects = [];
  const leagues = Array.from(new Set(props.importMathces.map((match) => match.league.id)));//alle ligaene 
  const leagueInjuries = [...new Set(props.importInjuries.map(dataLeague=> dataLeague.league.id))]//alle ligaene med skade data
  const filterLeagueInjrs = leagues.filter((fixture)=> leagueInjuries.includes(fixture));//viser kamper fra ligaer med skade data
  filterLeagueInjrs.forEach((league) => {
    let leagueName = props.importMathces.find((match) => match.league.id === league)?.league.name;
    let leagueCountry = props.importMathces.find((match) => match.league.id === league)?.league.country;
    let leagueID = props.importMathces.find((match) => match.league.id === league)?.league.id;
    let teams = props.importMathces.filter((match) => match.league.id === league).map((matchTeam) => [matchTeam.teams.home.id, matchTeam.teams.away.id]);
    let date = props.importMathces.filter((match) => match.league.id === league).map((matchDate) => matchDate.fixture.date.slice(0,10));
    if (leagueName) {//legger til nyttig filtrert info om ligakampene med skade data som brukes i komponent tabellen
      leaguesObjects.push({name : leagueName, country : leagueCountry, id : leagueID, TeamsID : teams, fixture : date});//filter pga med kun de ligaene med data om skader
    }
  });
  
  


//objekter for å lagre cache data
const [teamsPlayedMatches, setTeamsPlayedMatches] = useState({});
const [playerStats, setPlayerStats] = useState({});

const hasKeyValueType = (obj, key, type) => {//data fecthing forbygging av samme data flere ganger
  return obj.hasOwnProperty(key) && typeof obj[key] === type;
};

  useEffect(() => {
    const myHeaders = new Headers();
              myHeaders.append("x-rapidapi-key", "436ccf9b5092f9960ceb89cfa9ac53fe");
              myHeaders.append("x-rapidapi-host", "v3.football.api-sports.io");
              

    const requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'};

    const fetchTeamStats = async (leagueID, teamID, fixtureDate) => {
      if (!hasKeyValueType(teamsPlayedMatches, teamID, 'number')) { 
      try {
        const response = await fetch(`http://localhost:8080/api/teams/statistics?league=${leagueID}&season=2023&team=${teamID}&date=${fixtureDate}`, requestOptions);
        const string = await response.text();
        const teamStats = string===""? {}: JSON.parse(string);
        const totalMatches = teamStats.response.fixtures.played.total;//error beccause of undefined
        
        setTeamsPlayedMatches(prevTeamsPlayedMatches => ({ ...prevTeamsPlayedMatches, [teamID]: totalMatches}));
      } catch (error) {
        console.log(`Error: ${error}`);
      }
    }
    };

    
    const fetchPlayerStats = async (playerID, teamID) => {
      if (!hasKeyValueType(playerStats, playerID, 'number') || !hasKeyValueType(teamsPlayedMatches, teamID, 'number')) { 
      try {
        const response = await fetch(`http://localhost:8080/api/players?id=${playerID}&season=2023&team=${teamID}`, requestOptions);
        const string = await response.text();
        const playerStats = string===""? {}: JSON.parse(string);
        const totalMatches = playerStats.response[0].statistics[0].games.lineups;
        setPlayerStats(prevPlayerStats => ({ ...prevPlayerStats, [playerID]: totalMatches}));
        return playerStats;//få frem hovedliga 
      } catch (error) {
        console.log(`Error: ${error}`);
      }
    }

    }

    let toggleMathces = props.importMathces.filter((match) => match.league.id === toggle);
    
    let toggleTeamInjuries = toggleMathces.flatMap((match) => {
      return props.importInjuries.filter(injured => 
        [match.teams.home.name, match.teams.away.name].includes(injured.team.name)
      );
    });
    
    
    

    toggleTeamInjuries.forEach(async (player) => {
      try {
        let statsPlayer = await fetchPlayerStats(player.player.id, player.team.id); 
        if (statsPlayer && statsPlayer.response && statsPlayer.response.length > 0) {
          let teamStats = await fetchTeamStats(
            statsPlayer.response[0].statistics[0].league.id, 
            statsPlayer.response[0].statistics[0].team.id, 
            props.importMathces[0].fixture.date.slice(0,10)
          );
          
        } else {
          console.error('No data returned for player stats');
        }
      } catch (error) {
        console.error('Error fetching player or team stats:', error);
      }
    });
        
    
  }, [toggle]);

  

  const evaluatePlayerImpact = (playerImpact) => {
    if (playerImpact>0.57){
      return 2;//rød
    }else if (playerImpact>0.28){
      return 1;//gul
    }else{
      return 0;//grønn ul
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
  
  const handleToggle = (leagueId) => {//render kamper fra en bestemt liga av gangen når vis knappen trykkes
    setToggle(toggle === leagueId? false : leagueId);//viser kamper fra en bestemt liga av gangen

  };

  
  return (
    <div>
      <table id="match-listing">
        <tbody>
          {leaguesObjects.map((league) => (
            <React.Fragment key={league.id}>
              <tr>
                <td id="border-league">
                  {league.country}:{league.name}
                </td>
                <td id='hide-show-match-btn'>
                  <button onClick={() => handleToggle(league.id)}>Vis</button>
                </td>
              </tr>
              {toggle === league.id && (//viser sett med kamper fra en bestemt liga
                props.importMathces
                  .filter((match) => match.league.id === league.id)
                  .map((match) => (
                    <tr key={match.fixture.id}>
                      <td>{match.teams.home.name}-{match.teams.away.name}</td>
                      <td>skader:
                        {(() => {
                          const impacts = props.importInjuries.filter(
                            (injured) => [match.teams.home.name, match.teams.away.name].includes(injured.team.name)//finner bestemte skadede spillere for hver kamp
                          )
                          .map((injuredPlayer) => {//finner data om antall kamper for hver spiller og klubblag
                            if (teamsPlayedMatches[injuredPlayer.team.id] && playerStats[injuredPlayer.player.id]) {//når objekt data er tilgjengelig for klubblag og spiller
                              return evaluatePlayerImpact(playerStats[injuredPlayer.player.id]/teamsPlayedMatches[injuredPlayer.team.id]);//bedømmer skadevirkning for hver spiller
                            }
                            return null;
                          })
                          .filter(result => result !== null); // samler non-null innvirkning data
                          //gi css farge gul og rød for y og r
                          const colorMap = {r:"#C10037", y:"#EFF50E"};
                          // liste innvirkning som tilsvarer mange tall
                          let matchStatus = evaluateMatchStatus(impacts);//gir en liste med matchstatus for farge, antall skader og totalt antall innvirkningspoeng
                          let criclecolor = colorMap[matchStatus[0]];
                          return(<span><br />{matchStatus[1]}<div className='circle' style={{'--circle-color': criclecolor}} title='Match status indicator'></div></span>);
                        })()}
                        </td>
                    </tr>
                  ))
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
  
}

export default MatchListing;



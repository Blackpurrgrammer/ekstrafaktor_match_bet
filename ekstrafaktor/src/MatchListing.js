import React from 'react'
import './App.css';
import { useEffect,useState, useRef } from 'react';
import { evaluatePlayerImpact, evaluateMatchStatus, apiOrgInfo } from './myFunctions';



const MatchListing = (props) => {
  
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
const refTeamsPlayed = useRef({});
const refSeasonsValues = useRef({});
const [playerStats, setPlayerStats] = useState({});

const hasKeyValueType = (obj, key, type) => {//data fecthing forbygging av samme data flere ganger
  return obj.hasOwnProperty(key) && typeof obj[key] === type;
};

  useEffect(() => {
    const fetchTeamStats = async (leagueID, teamID, fixtureDate) => {
      
      const teamStatsApi = apiOrgInfo("teams/statistics", [{ league: leagueID}, {season: "2023"}, {team: teamID}, {date: fixtureDate}]);
      if (teamStatsApi) { 
      try {
        const response = await fetch(teamStatsApi.apiAddress, teamStatsApi.requestOptions);
        const string = await response.text();
        const teamStats = string===""? {}: JSON.parse(string);
        const totalMatches = teamStats.response.fixtures.played.total;//error beccause of undefined
        
        setTeamsPlayedMatches(prevTeamsPlayedMatches => ({ ...prevTeamsPlayedMatches, [teamID]: totalMatches}));
        refTeamsPlayed.current[teamID] = totalMatches;
      } catch (error) {
        console.log(`Error: ${error}`);
      }
    }
    };

    
    const fetchPlayerStats = async (playerID, teamID) => {
      const playerStatsApi = apiOrgInfo("players", [{ id: playerID}, {season: "2023"}, {team: teamID}]);
      if (!hasKeyValueType(playerStats, playerID, 'number') || !hasKeyValueType(teamsPlayedMatches, teamID, 'number')) { 
      try {
        const response = await fetch(playerStatsApi.apiAddress, playerStatsApi.requestOptions);
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

    let toggleMathces = props.importMathces.filter((match) => match.league.id === props.toggle);
    
    let toggleTeamInjuries = toggleMathces.flatMap((match) => {
      return props.importInjuries.filter(injured => 
        [match.teams.home.name, match.teams.away.name].includes(injured.team.name)
      );
    });
    
    const delay = ms => new Promise(res => setTimeout(res, ms));
    

    const processInjuries = async() => {
      for (const player of toggleTeamInjuries){//for of loop for å pause hver data innhenting om skader
      try {
        console.log(player.player.id, player.player.name, player.team.id, player.team.name);
        let statsPlayer = await fetchPlayerStats(player.player.id, player.team.id); 
        await delay(250);//pause for å unngå for mange requests 5 tillate api requests per sekund
        console.log('useref', statsPlayer, !refTeamsPlayed.current[player.team.id], player.team.id);
        if (statsPlayer && statsPlayer.response && !refTeamsPlayed.current[player.team.id]) { 
          await fetchTeamStats(
            statsPlayer.response[0].statistics[0].league.id, 
            statsPlayer.response[0].statistics[0].team.id, 
            props.importMathces[0].fixture.date.slice(0,10)
          );
        }
        }
       catch (error) {
        console.error('Error fetching player or team stats:', error);
      }
    }
    };
        
    processInjuries();

  }, [props.toggle]);

  
  const handleToggle = (leagueId) => {//render kamper fra en bestemt liga av gangen når vis knappen trykkes
    props.setToggle(props.toggle === leagueId? false : leagueId);//viser kamper fra en bestemt liga av gangen

  };

        return (
      <div>
        <div className="grid-container-mthL">
          {leaguesObjects.map((league) => (
            
            <div>{/*parent node*/}
              <div key={league.id} className="grid-item-border-league">
              <div style={{gridColumn: "2 / 3"}}>
                {league.country}:{league.name}
              </div>
              
              <div id='hide-show-match-btn'>
                  <button onClick={() => handleToggle(league.id)}>Vis</button>
                </div>
              </div>
              {props.toggle === league.id && ( // viser sett med kamper fra en bestemt liga
                  props.importMathces
                    .filter((match) => match.league.id === league.id)
                    .map((match) => (
                      <div key={match.fixture.id} className='grid-item-mtch-lstng'>
                          <div style={{gridColumn: "1 / 2"}}>{match.teams.home.name}</div>
                          <div style={{gridColumn: "2 / 3"}}>
                            {console.log(match.fixture.date)}
                            {props.resultExist ? `${match.goals.home}-${match.goals.away}` : match.fixture.date.slice(11, 16)}
                          </div>
                          <div style={{gridColumn: "3 / 4"}}>{match.teams.away.name}</div>
                          <div style={{gridColumn: "4 / 4"}}>skader:
                            {(() => {
                              const impacts = props.importInjuries.filter(
                                (injured) => [match.teams.home.name, match.teams.away.name].includes(injured.team.name)
                              )
                              .map((injuredPlayer) => {
                                console.log(injuredPlayer.team.name, teamsPlayedMatches[injuredPlayer.team.id], playerStats[injuredPlayer.player.id]);//husk if statement for props
                                if (teamsPlayedMatches[injuredPlayer.team.id] && playerStats[injuredPlayer.player.id]) {
                                  return evaluatePlayerImpact(playerStats[injuredPlayer.player.id] / teamsPlayedMatches[injuredPlayer.team.id]);
                                }
                                return null;
                              })
                              .filter(result => result !== null);
                              const colorMap = { r: "#C10037", y: "#EFF50E" };
                              console.log(impacts);
                              let matchStatus = evaluateMatchStatus(impacts);
                              let criclecolor = colorMap[matchStatus[0]];
                              
                              return (<span><br />{matchStatus[1]}<div className='circle' style={{ '--circle-color': criclecolor }} title='Match status indicator'></div></span>);
                            })()}
                          </div>
                      </div>
                    ))
                )}
            </div>
            
          ))}
        </div>
      </div>
    );
  
}

export default MatchListing;



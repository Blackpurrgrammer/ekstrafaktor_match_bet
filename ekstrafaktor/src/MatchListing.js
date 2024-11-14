import React from 'react'
import './App.css';
import { useEffect} from 'react';
import FactorIndicator from './FactorIndicator';
import { fetchPlayerStats, fetchTeamStats} from './myFunctions';

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
  
  

  useEffect(() => {
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
        let statsPlayer = await fetchPlayerStats(player.player.id, player.team.id, props.setPlayerStats, props.refPlayersStats, toggleMathces[0].league.id, toggleMathces[0].league.name); 
        await delay(250);//pause for å unngå for mange requests 5 tillate api requests per sekund
        if (statsPlayer && statsPlayer.response && !props.refTeamsPlayed.current[player.team.id]) { 
          await fetchTeamStats(
            statsPlayer.response[0].statistics[0].league.id, 
            statsPlayer.response[0].statistics[0].team.id, 
            props.importMathces[0].fixture.date.slice(0,10),
            props.setTeamsPlayedMatches,
            props.refTeamsPlayed
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
                            {props.resultExist ? `${match.goals.home}-${match.goals.away}` : match.fixture.date.slice(11, 16)}
                          </div>
                          <div style={{gridColumn: "3 / 4"}}>{match.teams.away.name}</div>
                          <div style={{gridColumn: "4 / 4"}}>skader:
                            {/* samlet skade innvirkning per kamp*/}
                            {<FactorIndicator item={match}
                               importInjuries={props.importInjuries}
                               playerStats={props.playerStats}
                               teamsPlayedMatches={props.teamsPlayedMatches}
                               showType='Match' />}
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



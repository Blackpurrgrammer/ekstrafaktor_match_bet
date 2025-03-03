import React from 'react'
import './App.css';
import { useEffect, useState, useMemo, useCallback} from 'react';
import FactorIndicator from './FactorIndicator';
import { evaluatePlayerImpact, fetchPlayerStats, fetchTeamCountryInfo, fetchTeamStats, filterList} from './myFunctions';
import { Spin } from 'antd';

const MatchListing = (props) => {
  const [spinProgress, setSpinProgress] = useState({});
  const [currentMatchStatus, setCurrentMatchStatus] = useState({});
  let queriedInjuries = filterList(props.importInjuries, props.query, ['team.name', 'fixture.id', 'league.name', 'league.country']);//filtrerer skade data basert på søkeord
  const leaguesObjects = [];
  const leagues = Array.from(new Set(props.importMathces.map((match) => match.league.id)));//alle ligaene 
  const leagueInjuries = [...new Set(queriedInjuries.map(dataLeague=> dataLeague.league.id))]//alle ligaene med skade data
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
  
  const memoizedCurrentMatchStatus = useMemo(()=> currentMatchStatus, [currentMatchStatus])

  useEffect(() => {
    queriedInjuries = filterList(props.importInjuries, props.query, ['team.name', 'fixture.id', 'league.name', 'league.country']);
    let toggleMathces = props.importMathces.filter((match) => match.league.id === props.toggle);
    
    let toggleTeamInjuries = toggleMathces.flatMap((match) => {
      return queriedInjuries.filter(injured => 
        [match.teams.home.name, match.teams.away.name].includes(injured.team.name)
      );
    });
    
    const delay = ms => new Promise(res => setTimeout(res, ms));
    
    const managePlayerStats = async(stats, item, inter=null) => {
      if (stats!==null && stats.response[0].statistics.length>0) {
        let countryFixtureIdx = inter? inter : toggleMathces[0].league.country;
        let idxCount = 0;
        for (let item of stats.response[0].statistics){//finner rikitig hovedliga indeks for team stats
          if(item.league.country === countryFixtureIdx){//ved hjelp fixture land data finner riktig hovedliga indeks
            
            break;
          }else{
            idxCount++;//øker indeks for å finne riktig hovedliga indeks
          };
        }
        if (stats && stats.response && !props.refTeamsPlayed.current[item.team.id]) { 
          await fetchTeamStats(
            stats.response[0].statistics[idxCount].league.id, 
            stats.response[0].statistics[idxCount].team.id, 
            props.importMathces[0].fixture.date.slice(0,10),
            props.setTeamsPlayedMatches,
            props.refTeamsPlayed
          );
        }
      }
      if(stats && stats?.response && props.refTeamsPlayed.current[item.team.id]){
        await delay(250);
        props.setPlayerStats(prevPlayerStats => ({ ...prevPlayerStats, 
          [item.player.id]: {...prevPlayerStats[item.player.id],
            "totalMatches": props.refTeamsPlayed.current[item.team.id],
             "status": evaluatePlayerImpact(stats.response[0].statistics[0].games.lineups/props.refTeamsPlayed.current[item.team.id])}}));
      }else{
        props.setPlayerStats(prevPlayerStats => ({ ...prevPlayerStats,
          [item.player.id]: {...prevPlayerStats[item.player.id],
            "totalMatches": 0,
            "status": 0}}));
      }
    }


    const processInjuries = async() => {
      for (const player of toggleTeamInjuries){//for of loop for å pause hver data innhenting om skader
      try {
        let statsPlayer = await fetchPlayerStats(player.player.id, player.team.id, props.setPlayerStats, props.refPlayersStats, toggleMathces[0].league.id, toggleMathces[0].league.name, player.player.name, player.team.name); 
        await delay(250);//pause for å unngå for mange requests 5 tillate api requests per sekund
        if (toggleMathces[0].league.country!=='World'){
          managePlayerStats(statsPlayer, player);
        }else if(!props.refTeamsPlayed.current[player.team.id]){//internasjonal liga krever land verifikasjon for å finne riktig hovedliga indeks
          let country = await fetchTeamCountryInfo(player.team.id);
          await delay(150);
          managePlayerStats(statsPlayer, player, country);

        }else if(props.refTeamsPlayed.current[player.team.id] && toggleMathces[0].league.country==='World'){//forbygge unødvendig data innhenting
          managePlayerStats(statsPlayer, player);
        }
        
        
      } catch (error) {
        console.error('Error fetching player or team stats:', error);
      }
    }
    };
        
    processInjuries();

  }, [props.toggle, props.query]);

  const collectFixtureInjuries = (leagueId) => {//lagrer listet skadede spillere per kamp i importMathces for økten
    let leagueMatches = props.importMathces.filter((match) => match.league.id === leagueId);
    let leagueInjuries = queriedInjuries.filter((injury) => leagueMatches.some((match) => [match.teams.home.name, match.teams.away.name].includes(injury.team.name)));
    props.setMatches(prevMatches => 
      prevMatches.map(match =>
        leagueMatches.map(match => match.fixture.id).includes(match.fixture.id)
          ? { ...match, teams: { ...match.teams, 
            players: leagueInjuries.filter(injury=>injury.fixture.id===match.fixture.id) },
            fixture: { ...match.fixture, showInjuries: false }
           } 
          : match
      )
    );
    
    return leagueInjuries;
  }
  const handleToggle = (leagueId) => {//render kamper fra en bestemt liga av gangen når vis knappen trykkes
    props.setToggle(props.toggle === leagueId? false : leagueId);//viser kamper fra en bestemt liga av gangen
    collectFixtureInjuries(leagueId);

  };
  

  useEffect(() => {
    if (props.toggle) {//progress verdi laging for spin til hver kamp
      const matches = props.importMathces.filter((match) => match.league.id === props.toggle);//kamper fra en bestemt liga
      const updateSpinProgress = async () => {
        for (const match of matches) {
          const progressPercent = match.teams.players.
            filter(injuredPlayer => props.playerStats[injuredPlayer.player.id]//alle skadde spillere hver kamp som mottar status underveis
            && Object.keys(props.playerStats[injuredPlayer.player.id]).includes("status")).length;
          const totalFixtureMatchesPlys = match.teams.players.length;//alle skadede spillere for hver kamp
          const progress = (progressPercent / totalFixtureMatchesPlys) * 100;//prosentandel av spillerne som har mottatt status
          setSpinProgress(prev => ({ ...prev, [match.fixture.id]: progress!==0? progress : false }));//JS objekt for oppnå fossefall effekt
          await new Promise(res => setTimeout(res, 250)); // forsinkelse for å skape fossefall effekt
        }
      };


      const storeStatus = async () => {//lagrer status for hver kamp i importMathces for økten
        for (const match of matches){
          if (currentMatchStatus && currentMatchStatus[match.fixture.id]){
            props.setMatches(prevMatches => 
              prevMatches.map(prevMatch => 
                prevMatch.fixture.id === match.fixture.id
                ? { ...prevMatch, teams: { ...prevMatch.teams, status : currentMatchStatus[match.fixture.id]} }//henter status fra factorIndicator komponent
                : prevMatch
              )
            );
          }
        }
      };

      updateSpinProgress();
      storeStatus();
      

    }

  }, [props.toggle, props.playerStats]);


  const  handleFactorIndicatorClick = (fixtureId) => {//håndterer visning visning per kamp
    props.setMatches(prevMatches =>
      prevMatches.map(match => match.fixture.id === fixtureId
        ? { ...match, fixture: { ...match.fixture, showInjuries: !match.fixture.showInjuries } }//flipper visning verdi
        : match
      ));
  };
    

  const renderInjuredPlayers = (match) => {
    //filtrering av hvert lags spillere i aktuell kamp som er trykket på
    let homePlayers = match.teams.players.filter(player => player.team.id === match.teams.home.id);
    let awayPlayers = match.teams.players.filter(player => player.team.id === match.teams.away.id);
    //lengste listen av lagets spillere slik at griden blir lang nok
    let longestIndex = homePlayers.length > awayPlayers.length ? homePlayers.length : awayPlayers.length;
    let injuredPlayers = [];//samler all jsx komponenter for riktig grid visning
  
    for (let i = 0; i < longestIndex; i++) {
      if (homePlayers[i] && awayPlayers[i]) {//plassering skjer i begge kolonnene pga eksistens i hver liste
        //kolonnene har to justerings avstands kolonner slik at plassering av spillere for hvert lag blir riktig
        injuredPlayers.push(
          <div key={i} className='grid-item-injury'>
            <div style={{gridColumn:  "2 / 3"}}>{/*Plassering i andre kolonne for mer presis plassering*/}
              <FactorIndicator
                showType={'Player'}
                item={props.playerStats[homePlayers[i].player.id]}
                 />
            </div>
            <div style={{gridColumn: "3 / 4", textAlign: "start"}}>{/*Følger FactorIndicator som hoved marg*/}
              {homePlayers[i].player.name}
            </div>
            <div style={{gridColumn: "6 / 7"}}>
              <FactorIndicator
                showType={'Player'}
                item={props.playerStats[awayPlayers[i].player.id]}
                 />
            </div>
            <div style={{gridColumn: "7 / 7", textAlign: "start"}}>{/*Følger FactorIndicator som hoved marg*/}
              {awayPlayers[i].player.name}
            </div>
          </div>
        );
      } else if (homePlayers[i]) {//plassering skjer i venstre kolonne pga kun eksistens for hjemmelaget 
        injuredPlayers.push(
          <div key={i} className='grid-item-injury'>
            <div style={{gridColumn:  "2 / 3"}}>
              <FactorIndicator
                showType={'Player'}
                item={props.playerStats[homePlayers[i].player.id]}
                 />
            </div>
            <div style={{gridColumn: "3 / 4", textAlign: "start"}}>{homePlayers[i].player.name}</div>
          </div>
        );
      } else if (awayPlayers[i]) {//plassering skjer i høyre kolonne pga kun eksistens for bortelaget
        injuredPlayers.push(
          <div key={i} className='grid-item-injury'>
            <div style={{gridColumn: "6 / 7"}}>
              <FactorIndicator
                  showType={'Player'}
                  item={props.playerStats[awayPlayers[i].player.id]}
                  />
            </div>
            <div style={{gridColumn: "7 / 7", textAlign: "start"}}>{awayPlayers[i].player.name}</div>
          </div>
        );
      }
    }
  
    return injuredPlayers;//tilslutt blir hele griden returnert for visning blant komponentene
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
                      <div>
                      <div key={match.fixture.id} className='grid-item-mtch-lstng'>
                          <div style={{gridColumn: "1 / 2"}}>{match.teams.home.name}</div>
                          <div style={{gridColumn: "2 / 3"}}>
                            {props.resultExist ? `${match.goals.home}-${match.goals.away}` : match.fixture.date.slice(11, 16)}
                          </div>
                          <div style={{gridColumn: "3 / 4"}}>{match.teams.away.name}</div>
                          <div style={{gridColumn: "4 / 4"}}>
                            <div>skader:</div>
                            {match.teams?.status &&//viser status indikator om kampen allerede har mottatt status
                              <div onClick={() => handleFactorIndicatorClick(match.fixture.id)}>
                                <FactorIndicator item={match}
                                queriedInjuries={queriedInjuries}
                                playerStats={props.playerStats}
                                teamsPlayedMatches={props.teamsPlayedMatches}
                                showType='Match'
                                setCurrentMatchStatus={setCurrentMatchStatus}
                                currentMatchStatus={currentMatchStatus} />
                              </div>
                              }
                            {/*Spiner imens data innhenting av stauts pågår for hver kamp*/}
                            {!(match.teams.players.filter(injuredPlayer=> props.playerStats[injuredPlayer.player.id]
                              && Object.keys(props.playerStats[injuredPlayer.player.id]).includes("status")).length===match.teams.players.length)
                              && !match.teams?.status
                              &&<Spin percent={spinProgress[match.fixture.id]} size='small' />}
                              {match.teams.players.filter(injuredPlayer => props.playerStats[injuredPlayer.player.id]
                                // Faktor indikatoren vises kun når alle spillerne per kamp har mottatt status verdi
                                && Object.keys(props.playerStats[injuredPlayer.player.id]).includes("status")).length === match.teams.players.length
                                //samlet skade innvirkning per kamp
                                && (!match.teams?.status//etter første innlasting 
                                  && 
                                  <div onClick={()=>handleFactorIndicatorClick(match.fixture.id)} style={{cursor: 'pointer'}}>{/*Knappen aktiverer spillervisning under kampen */}
                                    <FactorIndicator item={match}
                                    queriedInjuries={queriedInjuries}
                                    playerStats={props.playerStats}
                                    teamsPlayedMatches={props.teamsPlayedMatches}
                                    showType='Match'
                                    setCurrentMatchStatus={setCurrentMatchStatus}
                                    currentMatchStatus={currentMatchStatus} />
                                  </div>)}
                          </div>
                      </div>
                      {match.fixture.showInjuries &&//skadede spiller visning etter klikk på status indikator
                      <div className="grid-item-container-injuries">
                        {renderInjuredPlayers(match)}{/*skadede spillere vises i grid format*/}             
                        </div>
                        }
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



import React from 'react'
import './App.css';
import { useEffect,useState } from 'react';
import { evaluatePlayerImpact, evaluateMatchStatus, hasKeyValueType, apiOrgInfo } from './myFunctions';

const AvgjorendeSkader = (props) => {
  /*
  const [teamsPlayedMatches, setTeamsPlayedMatches] = useState({});
  const [playerStats, setPlayerStats] = useState({});
  
  
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
        console.log("inside fetchTeamStats", leagueID, teamID, fixtureDate);
        const response = await fetch(`http://localhost:8080/api/teams/statistics?league=${leagueID}&season=2023&team=${teamID}&date=${fixtureDate}`, requestOptions);
        console.log("begrenset innhenting tall pr min", response.headers.get('X-RateLimit-Limit'));
        const string = await response.text();
        console.log("string", string);

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
        const sidelinedRes = await fetch(`http://localhost:8080/api/sidelined?player=${playerID}`, requestOptions);
        const string = await response.text();
        const sidelinedString = await sidelinedRes.text();
        const playerStats = string===""? {}: JSON.parse(string);
        const sidelined = sidelinedString===""? {}: JSON.parse(sidelinedString);
        const totalMatches = playerStats.response[0].statistics[0].games.lineups;
        const injuredStartDate = new Date(sidelined.response[0].start);
        const injuryType =  sidelined.response[0].type;
        setPlayerStats(prevPlayerStats => ({ ...prevPlayerStats, [playerID]: {"played": totalMatches, "injured": injuredStartDate, "injuryType": injuryType}}));
        return playerStats;//få frem hovedliga 
      } catch (error) {
        console.log(`Error: ${error}`);
      }
    }

    }
    //lag filter om viktige spillere basert på antall kamper spilt
    
  
    props.injuries.forEach(async (player) => {//overflødig data fecthing forbygging?
      try {
        let statsPlayer = await fetchPlayerStats(player.player.id, player.team.id); 
        if (statsPlayer && statsPlayer.response && statsPlayer.response.length > 0) {
          console.log(statsPlayer.response[0].statistics[0].league.id, statsPlayer.response[0].statistics[0].team.id, props.selectedDate.toISOString().split('T')[0]);
          let teamStats = await fetchTeamStats(
            statsPlayer.response[0].statistics[0].league.id, 
            statsPlayer.response[0].statistics[0].team.id, 
            props.selectedDate.toISOString().split('T')[0]
          );
          return teamStats;
        } else {
          console.error('No data returned for player stats');
        }
      } catch (error) {
        console.error('Error fetching player or team stats:', error);
      }
    });
        
    
  }, [props.selectedDate]);
  
  const colorMap = { 2: "#C10037", 1: "#EFF50E" };

  //(() => {console.log("tull")})()
  */
  return (
    <div>
        {
          <table id='player-listing'>
            <tr>
              <th>Spillernavn</th>
              <th>Lag</th>
              <th>Skadedato</th>
              <th>Skadevarighet-dager</th>
              <th>Laginnvirkning</th>
            </tr>
            
            
            
          
          </table>
          
          
          }
        
      
    </div>
  )
}

export default AvgjorendeSkader


// if (teamsPlayedMatches[injuredPlayer.team.id] && playerStats[injuredPlayer.player.id]) {
//   let playerStatus = colorMap[evaluatePlayerImpact(playerStats[injuredPlayer.player.id] / teamsPlayedMatches[injuredPlayer.team.id])];
//   <div className='circle' style={{ '--circle-color': playerStatus }} title='Match status indicator'></div>
    
// }
// return null;



// {props.injuries.map((injuredPlayer) => 
//   {
//     playerStats[injuredPlayer.player.id] && teamsPlayedMatches[injuredPlayer.team.id] && (
//     <tr key={injuredPlayer.player.id}>
//       <td>{injuredPlayer.player.name}</td>{/*husk if statement her for playerStats*/}
//       <td>{injuredPlayer.team.name}</td>                
//       <td>{playerStats[injuredPlayer.player.id]?playerStats[injuredPlayer.player.id].injured.toLocaleDateString():"loading..."}</td>
//       <td>{
//         playerStats[injuredPlayer.player.id]?
//         Math.round((props.selectedDate-playerStats[injuredPlayer.player.id].injured)/(1000*60*60*24))
//         :"loading..."}
//       </td>
//       <td>
//         {teamsPlayedMatches[injuredPlayer.team.id] && playerStats[injuredPlayer.player.id]?
//         <div className='circle' style={{ '--circle-color':
//         colorMap[evaluatePlayerImpact(playerStats[injuredPlayer.player.id].played / teamsPlayedMatches[injuredPlayer.team.id])]
//         }} title='Player status indicator'></div>
//         :"loading..."}
//       </td>
//     </tr>
//   )}
//     )      
    
    
//   }
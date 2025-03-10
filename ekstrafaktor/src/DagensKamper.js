import React from 'react'
import MatchListing from './MatchListing';
const DagensKamper = (props) => {
  
  const notStartedFilter = (match) => {
    return match.fixture.status.short !== "FT";
  };

  const resultExist = false;//sendes til MatchListing for å vise klokkeslett 

  return (
    <div>
        {props.matches && props.injuries ? (
      <MatchListing importMathces={props.matches.filter((item)=>notStartedFilter(item))}
        setMatches={props.setMatches}
        importInjuries={props.injuries} 
        toggle={props.toggle}
        setToggle={props.setToggle} 
        resultExist={resultExist}
        teamsPlayedMatches={props.teamsPlayedMatches}
        setTeamsPlayedMatches={props.setTeamsPlayedMatches}
        playerStats={props.playerStats}
        setPlayerStats={props.setPlayerStats}
        refTeamsPlayed={props.refTeamsPlayed}
        refPlayersStats={props.refPlayersStats}
        query={props.query}
        screenSize={props.screenSize}
         />
        ) : (
      <div>Loading matches or no matches found...</div>
        )}
    </div>
  )
}

export default DagensKamper
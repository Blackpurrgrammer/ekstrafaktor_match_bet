import React from 'react'
import MatchListing from './MatchListing';
const SpilteKamper = (props) => {
  const finishedFilter = (match) => {
    return match.fixture.status.short === "FT";
  };
  
  const resultExist = true;//sendes til MatchListing for å vise resultatet

  return (
    <div>
        {props.matches && props.injuries ? (
      <MatchListing 
        importMathces={props.matches.filter((item)=>finishedFilter(item))} 
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
         />
        ) : (
      <div>Loading matches or no matches found...</div>
        )}
    </div>
  )
}

export default SpilteKamper
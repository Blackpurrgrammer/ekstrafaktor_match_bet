import React from 'react'
import MatchListing from './MatchListing';
const DagensKamper = (props) => {
  return (
    <div>
        {props.matches && props.injuries ? (
      <MatchListing importMathces={props.matches} setToggle={props.setToggle} toggle={props.toggle} leagueMatches={props.leagueMatches} setLeagueMatches={props.setLeagueMatches} importInjuries={props.injuries} />
        ) : (
      <div>Loading matches or no matches found...</div>
        )}
    </div>
  )
}

export default DagensKamper
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
      <MatchListing importMathces={props.matches.filter((item)=>finishedFilter(item))} setToggle={props.setToggle} toggle={props.toggle} importInjuries={props.injuries} resultExist={resultExist} />
        ) : (
      <div>Loading matches or no matches found...</div>
        )}
    </div>
  )
}

export default SpilteKamper
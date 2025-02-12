import React from 'react'
import './App.css';
import { evaluateMatchStatus, evaluatePlayerStatus, evaluatePlayerImpact } from './myFunctions';
const FactorIndicator = (props) => {
    const colorMap = { r: "#C10037", y: "#EFF50E" };
    if(props.showType ==='Match'){
        const filteredStatsTeam = props.queriedInjuries.filter(
        (injured) => [props.item.teams.home.name, props.item.teams.away.name].includes(injured.team.name)
        )
        
        const statsPlayersMatches=filteredStatsTeam.map((injuredPlayer) => {
        if (props.playerStats && props.teamsPlayedMatches[injuredPlayer.team.id] && !!props.playerStats[injuredPlayer.player.id]?.played) {
            return evaluatePlayerImpact(props.playerStats[injuredPlayer.player.id].played / props.teamsPlayedMatches[injuredPlayer.team.id]);
        }
        return null;
        });
        let impacts = statsPlayersMatches.filter(result => result !== null);//alle spillere som ikke har spilt kamper er fjernet
        let indicatorStatus = evaluateMatchStatus(impacts);
        let criclecolor = colorMap[indicatorStatus[0]];
        return (<span>{indicatorStatus[1]}<div className='circle' style={{ '--circle-color': criclecolor }} title='Match status indicator'></div></span>);
    }else if(props.showType ==='Player'){
        let impacts = evaluatePlayerImpact(props.item.played / props.teamsPlayedMatches[props.item.teamId]);
        let indicatorStatus = evaluatePlayerStatus(impacts);
        let criclecolor = colorMap[indicatorStatus];
        return (<span><div className='circle' style={{ '--circle-color': criclecolor }} title='Match status indicator'></div></span>);
    }
}

export default FactorIndicator
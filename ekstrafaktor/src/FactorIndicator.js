import React, { useEffect } from 'react'
import './App.css';
import { evaluateMatchStatus, evaluatePlayerStatus, evaluatePlayerImpact } from './myFunctions';

const FactorIndicator = React.memo((props) => {//memo hindrer uendelig rendering
    const colorMap = { r: "#C10037", y: "#EFF50E" };
    
    useEffect(()=>{
        if (props.showType === 'Match' && !props.item.teams.status) {
            // lagrer status som eksporteres til matchlisting
            props.setCurrentMatchStatus(prevMatches => 
                ({...prevMatches, [props.item.fixture.id]: indicatorStatus}));    
        }
        

    }, [props.currentMatchStatus]);

    let indicatorStatus = false;
    //status per kamp
    if(props.showType ==='Match' && !props.item.teams.status){//første innlasting av status beregning
        const players = props.item?.teams.players.map(player => player.player.id);
        const impacts = players.map(playerId => props.playerStats[playerId]?.status);
        indicatorStatus = evaluateMatchStatus(impacts);//tildeles status
        let criclecolor = colorMap[indicatorStatus[0]];
        return (<span>{players.length}
                    <div className='circle' style={{ '--circle-color': criclecolor }}
                    title='Match status indicator'>
                    </div>
                </span>);

    }else if(props.showType ==='Match' && !!props.item.teams.status){//skjer pga eksisterende status 
        // ingen tildeling av ny status oppstår her
        let criclecolor = colorMap[props.item.teams.status[0]];
        return (<span>{props.item.teams.players.length}
                    <div className='circle' style={{ '--circle-color': criclecolor }}
                    title='Match status indicator'>
                    </div>
                </span>);

    }else if(props.showType ==='Player'){//gjelder status per spiller ikke kamp
        let impacts = evaluatePlayerImpact(props.item.played / props.teamsPlayedMatches[props.item.teamId]);
        let indicatorStatus = evaluatePlayerStatus(impacts);
        let criclecolor = colorMap[indicatorStatus];
        return (<span>
                    <div className='circle' style={{ '--circle-color': criclecolor }} 
                    title='Match status indicator'>
                    </div>
                </span>);
    }
}, (prevProps, nextProps) => {
    return (//hindrer uendelig rendering når kamper vises
        prevProps.item === nextProps.item && 
        prevProps.showType === nextProps.showType &&
        prevProps.playerStats === nextProps.playerStats &&
        prevProps.teamsPlayedMatches === nextProps.teamsPlayedMatches);
});

export default FactorIndicator;
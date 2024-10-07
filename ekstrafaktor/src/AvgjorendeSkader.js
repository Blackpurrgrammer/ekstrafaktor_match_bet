import React from 'react'
import './App.css';
import { useEffect} from 'react';
import {fetchSidelinedDate } from './myFunctions';

const AvgjorendeSkader = (props) => {
  
  useEffect(() => {
    
    const delay = ms => new Promise(res => setTimeout(res, ms));
   
    const fetchInjuryDuration = async () => {
    Object.entries(props.playerStats).forEach(async ([playerId, stats]) => {
      try {// hente ut skade dato, og beregne skadevarighet for hver skadet spiller
        await fetchSidelinedDate(playerId, props.setPlayerStats, props.selectedDate);
        await delay(500);
      } catch (error) {
        console.error('Error fetching injury duration:', error);
      }
    });
  };
  
  fetchInjuryDuration();
  }, [props.selectedDate]);
  
  
  
  return (
    <div>
      {Object.keys(props.playerStats).length !== 0 ? (//viser tabell over skadede spillere hvis brukeren har sett kamper
      <>
      <table id='player-listing'>
        <thead>
          <h1>
            Skadede spillere i dine viste kamper:
          </h1>
        </thead>
      </table>
        <table id='player-listing'>
      <thead>
        <tr>
          <th>Spillernavn</th>
          <th>Lag</th>
          <th>Skadedato</th>
          <th>Skadevarighet-dager</th>
          <th>Typeskade</th>
        </tr>
      </thead>
      <tbody>
        
         {Object.entries(props.playerStats).map(([playerId, stats]) => {
          if ("injured" in stats) {
            return (
              <tr key={playerId}>
                <td>{stats.name}</td>
                <td>{stats.team}</td>
                <td>{stats.injured.toLocaleDateString()}</td>
                <td>{stats.duration}</td>
                <td>{stats.injuryType}</td>
              </tr>
            );
          } else {
            console.log(stats.injured);
            return null;
          }
        })} 
      </tbody>
    </table>
    </>
  ) : (
    <h1>Du må se på kamper før du kan se skader her! Gå til dagenskamper eller spilte kamper</h1>
    )}
    <p>
      Alle de skadede spillerne er listet opp over for dine viste kamper. Jo flere kamper du har blitt vist, jo flere spillere vil bli listet opp.
    </p>
    <p>
      Grunnen for at ikke alle de skadede spillerne er listet opp, er at det er en begrensning på antall data uthentinger fra min API leverandør, og prosessen ville vært for tidkrevende. 
    </p>
    </div>
  );
};

export default AvgjorendeSkader;
import React from 'react'
import './App.css';
import { useEffect, useState} from 'react';
import {fetchSidelinedDate } from './myFunctions';
import ReactPaginate from 'react-paginate';

const AvgjorendeSkader = (props) => {
  
  const [currentItems, setCurrentItems] = useState(null);
  const [pageCount, setPageCount] = useState(0);
  const [itemOffset, setItemOffset] = useState(0);
  const itemsPerPage = 10;
  const [readyRendering, setReadyRendering] = useState(false);
  let keysObjectArray = Object.keys(props.playerStats);
  const fetchedPlayersArray = [];
  
  const delay = (ms) => new Promise(res => setTimeout(res, ms));
  let milliseconds = 500;

  useEffect(() => {
    let response = false;
    
    const fetchInjuryDuration = async () => {
  
    const constArraysize = keysObjectArray.length;
    for (let i = 0; i < keysObjectArray.length; i++) {
      const playerId = keysObjectArray[i];
      if (fetchedPlayersArray.includes(playerId)) continue;//sjekker om spilleren allerede er hentet så blir den hoppet over
      try {
        if (Array.isArray(response.errors)) {//tom errors liste response indikerer vellykket API kall
          fetchedPlayersArray.push(response.parameters.player);
        } else if (!response.errors && typeof(response.player) === "string" && fetchedPlayersArray.length<constArraysize+4) {//rate limit er oversteget
          let retryId = response.player;
          keysObjectArray.push(retryId);//legger til spiller id for nytt API kall
        }
        if (!(playerId in fetchedPlayersArray)) {//sjekker om spilleren allerede er hentet
          await delay(milliseconds);
          response = await fetchSidelinedDate(playerId, props.setPlayerStats, props.selectedDate);
        }
      } catch (error) {
        console.error('Error fetching injury duration:', error);
      }
    }
  };
  
  fetchInjuryDuration();
  
  
  
  }, [props.selectedDate, props.setPlayerStats]);
  

  useEffect(() => {
    
    const playersContainInjury = Object.entries(props.playerStats).filter(([playerId, stats]) => "injured" in stats);
    const lengthPlayersStats = Object.keys(props.playerStats).length;
    const lengthPlayersInjured = playersContainInjury.length;
    if (lengthPlayersStats === lengthPlayersInjured) {//sjekker om alle spillere har vært innom API kall fetchSidelinedDate
      setReadyRendering(true);
    }
    
    if (readyRendering) {
      const items = Object.values(props.playerStats);
      const endOffset = itemOffset + itemsPerPage;//regner siste liste indeks for hver side
      const newCurrentItems = items.slice(itemOffset, endOffset);//indekserer mengden som skal vises på visning side
      const newPageCount = Math.ceil(items.length / itemsPerPage);
  
      setCurrentItems((prevCurrentItems) => {//setter forrige og aktuelle spillere til en bestemt side
        if (JSON.stringify(prevCurrentItems) !== JSON.stringify(newCurrentItems)) {
          return newCurrentItems;
        }
        return prevCurrentItems;
      });

      setPageCount((prevPageCount) => {//sjekker om ny mengde trenger flere sider enn forrige mengde
        if (JSON.stringify(prevPageCount) !== JSON.stringify(newPageCount)) {
          return newPageCount;
        }
        return prevPageCount;
      });
    }
  }, [itemOffset, itemsPerPage, readyRendering, props.playerStats]);

  const handlePageClick = (event) => {
    const items = Object.values(props.playerStats);
    const newOffset = event.selected * itemsPerPage % items.length;
    
    setItemOffset(newOffset);
  };
  
  return (
    <div>
      {!readyRendering && Object.keys(props.playerStats).length > 0?(//om objektet er ikke tomt og ikke klar til å rendere pga venting på sidelined data
        <h1>Laster spiller data....</h1>
      ):(
      Object.keys(props.playerStats).length !== 0 ? (
        <>
          <table id='player-listing'>
            <thead>
              <h1>Skadede spillere i dine viste kamper:</h1>
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
              {readyRendering && currentItems && Object.entries(currentItems).map(([playerId, stats]) => {
                if ("injured" in stats) {
                  const injuredDate = new Date(stats.injured);
                  return (
                    <tr key={stats.id}>
                      <td>{stats.name}</td>
                      <td>{stats.team}</td>
                      <td>{injuredDate.toLocaleDateString()}</td>
                      <td>{stats.duration}</td>
                      <td>{stats.injuryType}</td>
                    </tr>
                  );
                } else {

                  return null;
                }
              })}
            </tbody>
          </table>
        </>
      ) : (//om objektet er tomt fordi ingen kamper har blitt vist
        <h1>Du må se på kamper før du kan se skader her! Gå til dagenskamper eller spilte kamper</h1>
      )
      )}
      <p>
        Alle de skadede spillerne er listet opp over for dine viste kamper. Jo flere kamper du har blitt vist, jo flere spillere vil bli listet opp.
      </p>
      <p>
        Grunnen for at ikke alle de skadede spillerne er listet opp, er at det er en begrensning på antall data uthentinger fra min API leverandør, og prosessen ville vært for tidkrevende. 
      </p>
      <ReactPaginate
        previousLabel={'<Forrige'}
        nextLabel={'Neste>'}
        breakLabel={'...'}
        pageCount={pageCount}
        marginPagesDisplayed={2}
        pageRangeDisplayed={5}
        onPageChange={handlePageClick}
        renderOnZeroPageCount={null}
        containerClassName='pagination'
        pageClassName='page-item'
        previousLinkClassName='page-nav'
        nextLinkClassName='page-nav'
        activeLinkClassName='active-page'
         />
    </div>
  );
};

export default AvgjorendeSkader;
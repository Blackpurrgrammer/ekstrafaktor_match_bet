// disse linjene under til import brukes for at useSWR skal funke
/* eslint-disable */
+ "use client";
import './App.css';
import Navbar from './Navbar';
import { useEffect, useState} from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import DagensKamper from './DagensKamper';
import SpilteKamper from './SpilteKamper';
import AvgjorendeSkader from './AvgjorendeSkader';
import SignInUpPage from './SignInUpPage';
import apiOrgInfo from './apiOrgInfo';

function App() {
  
  const [matches, setMatches] = useState([]);
  const [injuries, setInjuries] = useState([]);
  
  
  useEffect(()=>{
    const fixtureEndpoint = apiOrgInfo("fixtures",{date:"2024-05-02"});
    const fetchFixtures = async () => {fetch(fixtureEndpoint.apiAddress, fixtureEndpoint.requestOptions)
    .then(response => response.json())
    .then(data => {setMatches(data.response)})
    .catch(error => console.log('fixtures error', error))
    };
    fetchFixtures();

    const injuriesEndpoint = apiOrgInfo("injuries",{date:"2024-05-02"});
    const fetchInjuries = async () => {fetch(injuriesEndpoint.apiAddress, injuriesEndpoint.requestOptions)
      .then(response => response.json())
      .then(data => {setInjuries(data.response)})
      .catch(error => console.log('injuries error', error))};

    fetchInjuries();

  },[]);

return (
  <Router>
  <div className='App'>
    <Navbar />
    <Routes>
          <Route path="/" element={<DagensKamper injuries={injuries} matches={matches} />} />
          <Route path="/Spilte_kamper" element={<SpilteKamper />} />
          <Route path="/Avgjorende_skader" element={<AvgjorendeSkader />} />
          <Route path="/Signin" element={<SignInUpPage />} />
    </Routes>
  </div>
  </Router>
);
}
export default App;

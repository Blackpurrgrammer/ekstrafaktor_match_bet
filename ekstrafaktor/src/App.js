// disse linjene under til import brukes for at useSWR skal funke
/* eslint-disable */
+ "use client";
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './Navbar';
import DagensKamper from './DagensKamper';
import SpilteKamper from './SpilteKamper';
import AvgjorendeSkader from './AvgjorendeSkader';
import SignInUpPage from './SignInUpPage';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format, addDays, set } from 'date-fns';
import {apiOrgInfo} from './myFunctions';

function App() {
  const [matches, setMatches] = useState([]);
  const [injuries, setInjuries] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [toggle, setToggle] = useState(false);
  const teamStatsFetched = {};
  
  useEffect(() => {
    const formattedDate = format(selectedDate, 'yyyy-MM-dd');

    const fixtureEndpoint = apiOrgInfo("fixtures", [{ date: formattedDate}, {timezone: "europe/berlin" }]);
    const fetchFixtures = async () => {
      fetch(fixtureEndpoint.apiAddress, fixtureEndpoint.requestOptions)
        .then(response => response.json())
        .then(data => { setMatches(data.response); console.log(data) })
        .catch(error => console.log('fixtures error', error));
    };
    

    const injuriesEndpoint = apiOrgInfo("injuries", [{ date: formattedDate}, {timezone: "europe/berlin" }]);
    const fetchInjuries = async () => {
      fetch(injuriesEndpoint.apiAddress, injuriesEndpoint.requestOptions)//"https://v3.football.api-sports.io/injuries?date=2024-08-20&timezone=europe/paris"
        .then(response => response.json())
        .then(data => setInjuries(data.response))
        .catch(error => console.log('injuries error', error));
    };
    
    
    fetchInjuries();  
    
    
    fetchFixtures();

    setToggle(false);//kampliga velger tilbake til false når ny dag velges

  }, [selectedDate]);//selectedDate

  const handlePrevDay = () => {
    setSelectedDate(prevDate => addDays(prevDate, -1));
  };

  const handleNextDay = () => {
    setSelectedDate(prevDate => addDays(prevDate, 1));
  };
  console.log("injuries", injuries);
  return (
    <Router>
      <div className='App'>
        <Navbar />
        <div className='date-picker'>
          <button onClick={handlePrevDay}>&lt;Forrige dag</button>
          <DatePicker
            selected={selectedDate}
            onChange={date => setSelectedDate(date)}
            dateFormat="yyyy-MM-dd"
          />
          <button onClick={handleNextDay}>Neste dag&gt;</button>
        </div>
        <Routes>
          <Route path="/" element={<DagensKamper
            injuries={injuries}
            matches={matches} 
            toggle={toggle} 
            setToggle={setToggle} 
            teamStatsFetched={teamStatsFetched}
            />} />
          <Route path="/Spilte_kamper" element={<SpilteKamper 
            injuries={injuries} 
            matches={matches} 
            selectedDate={selectedDate} 
            toggle={toggle} 
            setToggle={setToggle} />} />
          <Route path="/Avgjorende_skader" element={<AvgjorendeSkader 
            injuries={injuries} selectedDate={selectedDate}
             />} />
          <Route path="/Signin" element={<SignInUpPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

// function App() {
//   const [matches, setMatches] = useState([]);
//   const [injuries, setInjuries] = useState([]);
//   const [selectedDate, setSelectedDate] = useState(new Date());
  

//   useEffect(() => {
//     const formattedDate = format(selectedDate, 'yyyy-MM-dd');

//     const fixtureEndpoint = apiOrgInfo("fixtures", { date: formattedDate });
//     const fetchFixtures = async () => {
//       fetch(fixtureEndpoint.apiAddress, fixtureEndpoint.requestOptions)
//         .then(response => response.json())
//         .then(data => { setMatches(data.response) })
//         .catch(error => console.log('fixtures error', error));
//     };
//     fetchFixtures();

//     const injuriesEndpoint = apiOrgInfo("injuries", { date: formattedDate });
//     const fetchInjuries = async () => {
//       fetch(injuriesEndpoint.apiAddress, injuriesEndpoint.requestOptions)
//         .then(response => response.json())
//         .then(data => { setInjuries(data.response) })
//         .catch(error => console.log('injuries error', error));
//     };
//     fetchInjuries();

//   }, [selectedDate]);

//   return (
//     <Router>
//       <div className='App'>
//         <Navbar />
//         <div className='date-picker'>
//           <DatePicker
//             selected={selectedDate}
//             onChange={date => setSelectedDate(date)}
//             dateFormat="yyyy-MM-dd"
//           />  
//         </div>
//         <Routes>
//           <Route path="/" element={<DagensKamper injuries={injuries} matches={matches} />} />
//           <Route path="/Spilte_kamper" element={<SpilteKamper />} />
//           <Route path="/Avgjorende_skader" element={<AvgjorendeSkader />} />
//           <Route path="/Signin" element={<SignInUpPage />} />
//         </Routes>
//       </div>
//     </Router>
//   );
// }

// export default App;

import {db} from "./firebaseConfig";
import { useState, useEffect } from "react";
import "./App.css";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";


const  CommonData = () => {
  const [teams, setTeam] = useState([]);
  const teamsCollectionref = collection(db, "Common_football_data/collected_teams/serieA");//test
  //I want to get all the teams from the collection
  const getTeams = async () => {
    const data = await getDocs(teamsCollectionref);
    const teamsRef = data.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
    
    setTeam(teamsRef);
  };

  useEffect(() => {
    getTeams();
  }, []);
  console.log(teams[0][499]);
}
export default CommonData;
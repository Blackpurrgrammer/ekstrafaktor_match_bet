
const apiOrgInfo = (endpoint, parameters)  => {

  let orgParam = Array.isArray(parameters)?
      parameters.map(parameter => `${Object.keys(parameter)}=${parameter[Object.keys(parameter)]}`).join('&')
      :`${Object.keys(parameters)}=${parameters[Object.keys(parameters)]}`;
  orgParam=orgParam.includes("&")?orgParam.slice(0,orgParam.length):orgParam;
  const myHeaders = new Headers();
  myHeaders.append("x-rapidapi-key", "0f534c7fb965f8983d9160d34499a2ff");
  myHeaders.append("x-rapidapi-host", "v3.football.api-sports.io");

  const requestOptions = {
  method: 'GET',
  headers: myHeaders,
  redirect: 'follow'
  };
  const apiWithEndpoint = `http://localhost:8080/api/${endpoint}?${orgParam}`;// https://v3.football.api-sports.io/
  const adressWithOptions = {apiAddress:apiWithEndpoint, requestOptions:requestOptions};
  return adressWithOptions;//
}

const evaluatePlayerImpact = (playerImpact) => {
    if (playerImpact>0.57){
      return 2;//rød
    }else if (playerImpact>0.28){
      return 1;//gul
    }else{
      return 0;//grønn ul
    }
  }

  const evaluateMatchStatus = (listPlayersImpacts) => {
    const sum = listPlayersImpacts.reduce((a,b) => a+b, 0);
    const numberInjuries = listPlayersImpacts.length;
    if (sum>=8){
      return ['r', numberInjuries, sum];//rød
    }else if (sum>4){
      return ['y', numberInjuries, sum];//gul
    }else{
      return ['g', numberInjuries, sum];//grønn
    }
  }

  const hasKeyValueType = (obj, key, type) => {//data fecthing forbygging av samme data flere ganger
    return obj.hasOwnProperty(key) && typeof obj[key] === type;
  };

  
export {apiOrgInfo, evaluatePlayerImpact, evaluateMatchStatus, hasKeyValueType};
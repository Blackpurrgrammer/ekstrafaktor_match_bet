// Purpose: Fetches data from the football API and sets the state of the component that called it.

const apiOrgInfo = (endpoint, parameters)  => {

    let orgParam = Array.isArray(parameters)?
        parameters.map(parameter => `${Object.keys(parameter)}=${parameter[Object.keys(parameter)]}`).join('&')
        :`${Object.keys(parameters)}=${parameters[Object.keys(parameters)]}`;
    orgParam=orgParam.includes("&")?orgParam.slice(0,orgParam.length-1):orgParam;
    const myHeaders = new Headers();
    myHeaders.append("x-rapidapi-key", "436ccf9b5092f9960ceb89cfa9ac53fe");
    myHeaders.append("x-rapidapi-host", "v3.football.api-sports.io");

    const requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
    };
    const apiWithEndpoint = `http://localhost:8080/api/${endpoint}?${orgParam}`;
    const adressWithOptions = {apiAddress:apiWithEndpoint, requestOptions:requestOptions};
    return adressWithOptions;//
}

export default apiOrgInfo;
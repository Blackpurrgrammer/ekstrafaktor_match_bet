
// fetch = Function used for making HTTP requests to fetch resources.
//              (JSON style data, images, files)
//              Simplifies asynchronous data fetching in JavaScript and
//              used for interacting with APIs to retrieve and send
//              data asynchronously over the web.
//              fetch(url, {options})

const outsideConst = [];

async function fetchData(){

    try{

        // const pokemonName = document.getElementById("pokemonName").value.toLowerCase();
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/venusaur`);

        if(!response.ok){
            throw new Error("Could not fetch resource");
        }

        const data = await response.json();
        // console.log(data);
        outsideConst.push(data);
    }
    catch(error){
        console.error(error);
    }
}
fetchData().then(data => {
    if (data) { // Ensure data is not undefined due to an error.
        outsideConst.push(data);
        console.log(outsideConst); // Use the data stored in outsideConst.
    }
});

console.log(outsideConst); // This will log an empty array because the fetch operation is asynchronous.
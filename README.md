# ekstrafaktor_match_bet

1. Hent ut filene fra repo

2. Start server fra cors-proxy/server.js med node.js for unngå cors-policy feil

3. Dagens kamper er hovedsiden der du ser kampstatus for hver kamp når det kommer til skadesituasjon for hver kamp
   Rød betyr kritisk mange viktige skadede spillere ute for den bestemte kampen, gul betyr litt kritisk og grønn ikke kritisk.

For tiden jobber jeg med en mer detaljert info tabell for skadede spillere på en bestemt dato der man skal se info som skadet dato, skadevarighet i dager og innvirkningsstatus.
API kan kun innhente informasjon på 7500 utrekk per dag, og maks 300 utrekk per minutt(5 utrekk per sekund). Dette får konsekvenser når applikasjonen skal beregne skadestatus per kamp når man trykker på Vis knappen per liga.

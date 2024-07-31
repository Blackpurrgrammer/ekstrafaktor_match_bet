# ekstrafaktor_match_bet

1. Hent ut filene fra repo

2. Start server fra cors-proxy/server.js med node.js for unngå cors-policy feil

3. Dagens kamper er hovedsiden der du ser kampstatus for hver kamp når det kommer til skadesituasjon for hver kamp
   Rød betyr kritisk mange viktige skadede spillere ute for den bestemte kampen, gul betyr litt kritisk og grønn ikke kritisk.

For tiden jobber jeg med firebase brukerdatabase som skal kobles til prosjektet der man kan lage bruker og lagre statistikk på ulike lag og spillere.
API kan kun innhente informasjon på 100 utrekk per dag, og maks 10 utrekk per minutt. Dette får konsekvenser når applikasjonen skal beregne skadestatus per kamp når man trykker på Vis knappen per liga.
Derfor er den løsningen også fra en bestemt dato siden det er få kamper på denne dato-en her pga begrensende utrekk.

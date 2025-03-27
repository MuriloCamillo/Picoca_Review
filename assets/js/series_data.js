/* Borboletícia - Usar esse padrão pra inserir os dados das séries

  'usar o identificador do html onde tem o id?=': {
     title: "",
     year: ,
     creator: "",
     tagline: "",
     synopsis: "",
     status: "Episódios semanais /  Renovada para x temporada / Aguardando renovação / Finalizada / Cancelada / ",
     statusClass: "status-inproduction", 
     cast: ["Fulano1", "Fulano2"],
     genres: ["Drama", "Crime"],
     seasons: ["1ª Temporada - 9 episódios", "2ª Temporada - 14 episódios"],
     watchPlatforms: ["Disney+"],
     posterImg: "assets/img/index/trend/demolidor_trend.webp",  //O poster da série
     backdropImg: "assets/img/series_info/demolidorbg.webp",  //Background da série
     trailerUrl: "https://www.youtube.com/embed/9KZyUQpihsE"  //Trailer da série
   },

Tipos de statusClass das séries:
 status-inproduction: Em produção
 status-renewed: Renovada
 status-waiting: Aguardando renovação
 status-ended: Finalizada
 status-canceled: Cancelada */

const seriesData = {
  // Trends
  'demolidor-renascido': {
    title: "Demolidor: Renascido",
    year: 2025,
    creator: "Matt Corman, Chris Ord",
    tagline: "O trabalho do diabo nunca termina.",
    synopsis: "Matt Murdock, um advogado cego com habilidades fantásticas, luta por justiça através de seu agitado escritório de advocacia, enquanto o ex-chefe do crime Wilson Fisk busca seus próprios empreendimentos políticos em Nova Iorque. Quando suas identidades passadas começam a emergir, seus caminhos se cruzam perigosamente.",
    status: "Episódios semanais.",
    statusClass: "status-inproduction", // Classe CSS para estilizar o status
    cast: ["Charlie Cox", "Vincent D'Onofrio", "Margarita Levieva", "Zabryna Guevara"],
    genres: ["Drama", "Crime", "Ficção", "Super Heróis"],
    seasons: ["1ª Temporada - 9 episódios"],
    watchPlatforms: ["Disney+"],
    posterImg: "assets/img/index/trend/demolidor_trend.webp",
    backdropImg: "assets/img/series_info_bg/demolidorbg.webp", 
    trailerUrl: "https://www.youtube.com/embed/9KZyUQpihsE" 
  },
  'fallout': {
    title: "Fallout",
    year: 2024,
    creator: "Geneva Robertson-Dworet, Graham Wagner",
    tagline: "O fim do mundo é apenas o começo.",
    synopsis: "Baseado em uma das maiores séries de videogame de todos os tempos, Fallout é a história de quem tem e quem não tem em um mundo onde não há quase nada para se ter. Duzentos anos após o apocalipse, os habitantes dos luxuosos abrigos radioativos são forçados a retornar à paisagem infernal irradiada que seus ancestrais deixaram para trás.",
    status: "Renovada para 2ª Temporada.",
    statusClass: "status-renewed",
    cast: ["Ella Purnell", "Aaron Moten", "Walton Goggins", "Kyle MacLachlan"],
    genres: ["Ficção Científica", "Ação", "Aventura", "Drama", "Pós-apocalíptico"],
    seasons: ["1ª Temporada - 8 episódios"],
    watchPlatforms: ["Prime Video"],
    posterImg: "assets/img/index/trend/fallout_trend.webp",
    backdropImg: "assets/img/series_info_bg/falloutbg.webp",
    trailerUrl: "https://www.youtube.com/embed/0kQ8i2FpRDk" 
  },
  'invincible': {
    title: "Invincible",
    year: 2021, 
    creator: "Robert Kirkman",
    tagline: "Quase lá. ",
    synopsis: "Mark Grayson é um adolescente normal, exceto pelo fato de que seu pai, Nolan, é o super-herói mais poderoso do planeta. Pouco depois de seu aniversário de dezessete anos, Mark começa a desenvolver seus próprios poderes e entra na tutela de seu pai.",
    status: "Renovada para 4º Temporada.",
    statusClass: "status-renewed",
    cast: ["Steven Yeun", "Sandra Oh", "J.K. Simmons"],
    genres: ["Animação", "Ação", "Aventura", "Super Heróis"],
    seasons: ["Temporada 1", "Temporada 2"],
    watchPlatforms: ["Prime Video"],
    posterImg: "assets/img/index/trend/invincible_trend.webp",
    backdropImg: "assets/img/series_info_bg/invinciblebg.webp", 
    trailerUrl: "https://www.youtube.com/embed/bfAVpuko5o" //trocar
  },
  'reacher': {
    title: "Reacher",
    year: 2022,
    creator: "Nick Santora",
    tagline: "Onde ele vai, a justiça segue.",
    synopsis: "Jack Reacher, um ex-policial militar, viaja pelos Estados Unidos para investigar crimes e ajudar os necessitados. Sua busca por justiça o leva a descobrir uma conspiração que ameaça a vida de milhões.",
    status: "Renovada para 2ª Temporada.",
    statusClass: "status-renewed",
    cast: ["Alan Ritchson", "Malcolm Goodwin", "Willa Fitzgerald"],
    genres: ["Ação", "Crime", "Drama", "Mistério"],
    seasons: ["1ª Temporada - 8 episódios"],
    watchPlatforms: ["Prime Video"],
    posterImg: "assets/img/index/trend/reacher_trend.webp",
    backdropImg: "assets/img/series_info_bg/reacherbg.webp",
    trailerUrl: "https://www.youtube.com/embed/0kQ8i2FpRDk" //trocar
  },
  'thewhitelotus': {
    title: "The White Lotus",
    year: 2021,
    creator: "Mike White",
    tagline: "Um paraíso de férias. Um grupo de hóspedes.",
    synopsis: "Um grupo de hóspedes se hospeda no resort tropical White Lotus, onde suas vidas se entrelaçam em meio a uma série de eventos perturbadores.",
    status: "Renovada para 2ª Temporada.",
    statusClass: "status-renewed",
    cast: ["Murray Bartlett", "Connie Britton", "Jennifer Coolidge"],
    genres: ["Comédia", "Drama"],
    seasons: ["1ª Temporada - 6 episódios"],
    watchPlatforms: ["HBO Max"],
    posterImg: "assets/img/index/trend/whitelotus_trend.webp",
    backdropImg: "assets/img/series_info_bg/thewhitelotusbg.webp",
    trailerUrl: "https://www.youtube.com/embed/0kQ8i2FpRDk" //trocar
  },
  'ruptura': {
    title: "Ruptura",
    year: 2022,
    creator: "Dan Erikson",
    tagline: "Viver para trabalhar.",
    synopsis: "Mark lidera uma equipe de funcionários de escritório cujas memórias foram divididas cirurgicamente entre a vida no trabalho e a vida pessoal. Quando um colega de trabalho misterioso aparece fora do escritório, ele começa uma jornada para descobrir a verdade sobre seu trabalho.",
    status: "Aguardando renovação.",
    statusClass: "status-waiting",
    cast: ["Adam Scott", "Britt Lower", "Zach Cherry", "John Turturro"],
    genres: ["Drama", "Mistério", "Sci-Fi"],
    seasons: ["1ª Temporada - 9 episódios", "2ª Temporada - 10 episódios"],
    watchPlatforms: ["Apple TV+"],
    posterImg: "assets/img/index/trend/ruptura_trend.webp",
    backdropImg: "assets/img/series_info_bg/rupturabg.webp",
    trailerUrl: "https://www.youtube.com/embed/0kQ8i2FpRDk" //trocar
  },
  // Ranked
  'brooklyn99': {
    title: "Brooklyn Nine-Nine",
    year: 2013,
    creator: "Dan Goor, Michael Schur",
    tagline: "Um detetive e seu time de policiais.",
    synopsis: "O detetive Jake Peralta e sua equipe de policiais do 99º distrito de Brooklyn enfrentam crimes e situações hilárias enquanto tentam manter a ordem na cidade.",
    status: "Finalizada.",
    statusClass: "status-ended",
    cast: ["Andy Samberg", "Terry Crews", "Andre Braugher"],
    genres: ["Comédia", "Policial"],
    seasons: ["1ª Temporada - 22 episódios", "2ª Temporada - 22 episódios"],
    watchPlatforms: ["Peacock"],
    posterImg: "assets/img/index/ranked/b99_ranked.webp",
    backdropImg: "assets/img/series_info_bg/brooklyn99bg.webp",
    trailerUrl: "https://www.youtube.com/embed/0kQ8i2FpRDk" //trocar
  }
};
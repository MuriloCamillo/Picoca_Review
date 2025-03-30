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
 status-inproduction: Episodios semanais
 status-renewed: Renovada para x temporada
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
    cast: ["Charlie Cox", "Vincent D'Onofrio", "Margarita Levieva", "Zabryna Guevara", "Deborah Ann Woll", "Elden Henson"],
    genres: ["Drama", "Crime", "Ficção", "Super Heróis"],
    seasons: ["1ª Temporada - 9 episódios"],
    watchPlatforms: ["Disney+"],
    posterImg: "assets/img/index/trend/demolidor_trend.webp",
    backdropImg: "assets/img/series_info_bg/demolidor_bg.webp", 
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
    cast: ["Ella Purnell", "Aaron Moten", "Walton Goggins", "Kyle MacLachlan", "Moises Arias"],
    genres: ["Ficção Científica", "Ação", "Aventura", "Pós-apocalíptico"],
    seasons: ["1ª Temporada - 8 episódios"],
    watchPlatforms: ["Prime Video"],
    posterImg: "assets/img/index/trend/fallout_trend.webp",
    backdropImg: "assets/img/series_info_bg/fallout_bg.webp",
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
    cast: ["Steven Yeun", "Sandra Oh", "J.K. Simmons", "Walton Goggins", "Gilian Jacobs"],
    genres: ["Animação", "Ação", "Aventura", "Super Heróis"],
    seasons: ["1ª Temporada - 8 episódios", "2ª Temporada - 8 episódios", "3ª Temporada - 8 episódios"],
    watchPlatforms: ["Prime Video"],
    posterImg: "assets/img/index/trend/invincible_trend.webp",
    backdropImg: "assets/img/series_info_bg/invincible_bg.webp", 
    trailerUrl: "https://www.youtube.com/embed/-bfAVpuko5o" 
  },
  'reacher': {
    title: "Reacher",
    year: 2022,
    creator: "Nick Santora",
    tagline: "Onde ele vai, a justiça segue.",
    synopsis: "Jack Reacher, um ex-policial militar, viaja pelos Estados Unidos para investigar crimes e ajudar os necessitados. Sua busca por justiça o leva a descobrir uma conspiração que ameaça a vida de milhões.",
    status: "Aguardando renovação.",
    statusClass: "status-waiting",
    cast: ["Alan Ritchson", "Malcolm Goodwin", "Willa Fitzgerald", "Maria Sten", "Serinda Swan"],
    genres: ["Ação", "Crime", "Drama", "Aventura"],
    seasons: ["1ª Temporada - 8 episódios", "2ª Temporada - 8 episódios", "3ª Temporada - 8 episódios"],
    watchPlatforms: ["Prime Video"],
    posterImg: "assets/img/index/trend/reacher_trend.webp",
    backdropImg: "assets/img/series_info_bg/reacher_bg.webp",
    trailerUrl: "https://www.youtube.com/embed/BPeKW29kJT8" 
  },
  'thewhitelotus': {
    title: "The White Lotus",
    year: 2021,
    creator: "Mike White",
    tagline: "Um paraíso de férias. Um grupo de hóspedes.",
    synopsis: "Um grupo de hóspedes se hospeda no resort tropical White Lotus, onde suas vidas se entrelaçam em meio a uma série de eventos perturbadores.",
    status: "Episódios semanais.",
    statusClass: "status-inproduction",
    cast: ["Natasha Rothwell", "Jon Gries", "Jennifer Coolidge", "Walton Goggins", "Leslie Bibb"],
    genres: ["Comédia", "Drama", "Mistério"],
    seasons: ["1ª Temporada - 6 episódios", "2ª Temporada - 7 episódios", "3ª Temporada - 8 episódios"],
    watchPlatforms: ["Max"],
    posterImg: "assets/img/index/trend/whitelotus_trend.webp",
    backdropImg: "assets/img/series_info_bg/thewhitelotus_bg.webp",
    trailerUrl: "https://www.youtube.com/embed/TGLq7_MonZ4" 
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
    backdropImg: "assets/img/series_info_bg/ruptura_bg.webp",
    trailerUrl: "https://www.youtube.com/embed/EFjc_qHrnsQ"
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
    cast: ["Andy Samberg", "Terry Crews", "Andre Braugher", "Melissa Fumero", "Stephanie Beatriz", "Joe Lo Truglio"],
    genres: ["Comédia", "Policial", "Crime"],
    seasons: ["1ª Temporada - 22 episódios", "2ª Temporada - 23 episódios", "3ª Temporada - 23 episódios", "4ª Temporada - 22 episódios", "5ª Temporada - 22 episódios", "6ª Temporada - 18 episódios", "7ª Temporada - 13 episódios", "8ª Temporada - 9 episódios"],
    watchPlatforms: ["Peacock", "Netflix"],
    posterImg: "assets/img/index/ranked/b99_ranked.webp",
    backdropImg: "assets/img/series_info_bg/brooklyn99_bg.webp",
    trailerUrl: "https://www.youtube.com/embed/q6G_RMGk3vs" 
  },
  'fmab': {
    title: "Fullmetal Alchemist: Brotherhood",
    year: 2009,
    creator: "Yasuhiro Irie",
    tagline: "Se você deseja obter alguma coisa, é preciso pagar um preço equivalente.",
    synopsis: "Os irmãos Elric, Edward e Alphonse, tentam trazer sua mãe de volta à vida usando alquimia, mas a experiência dá errado. Eles embarcam em uma jornada para recuperar seus corpos e descobrir os segredos da alquimia.",
    status: "Finalizada.",
    statusClass: "status-ended",
    cast: ["Rie Kugimiya", "Romi Park", "Shin-Ichiro Miki", "Megumi Takamoto", "Kenta Miyake"],
    genres: ["Animação", "Aventura", "Fantasia", "Comédia", "Ação", "Mistério", "Bom demais pode assistir sem medo"],
    seasons: ["1ª Temporada - 64 episódios"],
    watchPlatforms: ["Crunchyroll", "Netflix"],
    posterImg: "assets/img/index/ranked/fmabh_ranked.webp",
    backdropImg: "assets/img/series_info_bg/fullmetal_bg.webp",
    trailerUrl: "https://www.youtube.com/embed/AYlksPeSXrs"
  },
  'juri': {
    title: "Juri Duty",
    year: 2023,
    creator: "Lee Eisenberg, Gene Stupnitsky",
    tagline: "12 jurados. 11 atores.",
    synopsis: "Um homem comum se torna o jurado de um caso judicial, mas não sabe que todos os outros jurados e advogados são atores. Ele tenta fazer o melhor possível enquanto lida com as situações absurdas que surgem.",
    status: "Finalizada.",
    statusClass: "status-ended",
    cast: ["Ronald Gladden", "James Marsden", "Susan James Berger", "Mekki Leeper", "David Brown"],
    genres: ["Comédia"],
    seasons: ["1ª Temporada - 8 episódios"],
    watchPlatforms: ["Prime Video"],
    posterImg: "assets/img/index/ranked/juri_ranked.webp",
    backdropImg: "assets/img/series_info_bg/juri_bg.webp",
    trailerUrl: "https://www.youtube.com/embed/Ei6YoSid5fo"
  },
  'saul': {
    title: "Better Call Saul",
    year: 2015,
    creator: "Vince Gilligan, Peter Gould",
    tagline: "A verdade é só um ponto de vista.",
    synopsis: "A série segue a transformação de Jimmy McGill, um advogado de defesa pública, em Saul Goodman, o advogado de Walter White. A série explora sua vida antes de conhecer Walter e os desafios que ele enfrenta.",
    status: "Finalizada.",
    statusClass: "status-ended",
    cast: ["Bob Odenkirk", "Jonathan Banks", "Rhea Seehorn", "Giancarlo Esposito", "Michael Mando", "Patrick Fabian", "Michael McKean"],
    genres: ["Drama", "Crime"],
    seasons: ["1ª Temporada - 10 episódios", "2ª Temporada - 10 episódios", "3ª Temporada - 10 episódios", "4ª Temporada - 10 episódios", "5ª Temporada - 10 episódios", "6ª Temporada - 13 episódios"],
    watchPlatforms: ["Netflix"],
    posterImg: "assets/img/index/ranked/saul_ranked.webp",
    backdropImg: "assets/img/series_info_bg/saul_bg.webp",
    trailerUrl: "https://www.youtube.com/embed/FAdiEjeNRi0"
  },
  'spyxfamily': {
    title: "Spy x Family",
    year: 2022,
    creator: "Tatsuya Endo",
    tagline: "Uma família de espiões.",
    synopsis: "Um espião chamado Twilight deve formar uma família falsa para completar uma missão. Ele adota uma menina telepata e se casa com uma assassina, sem saber que ambos têm segredos próprios.",
    status: "Renovada para 3ª Temporada.",
    statusClass: "status-renewed",
    cast: ["Takuya Eguchi", "Atsumi Tanezaki", "Saori Hayami", "Kenichirou Matsuda"],
    genres: ["Animação", "Ação", "Comédia"],
    seasons: ["1ª Temporada - 25 episódios", "2ª Temporada - 12 episódios"],
    watchPlatforms: ["Crunchyroll", "Netflix"],
    posterImg: "assets/img/index/ranked/spyfamily_ranked.webp",
    backdropImg: "assets/img/series_info_bg/spyfamily_bg.webp",
    trailerUrl: "https://www.youtube.com/embed/0CJr6AfE2rY"
  },
  'the_office': {
    title: "The Office",
    year: 2005,
    creator: "Greg Daniels",
    tagline: "Um escritório, muitos problemas.",
    synopsis: "A série segue a vida cotidiana dos funcionários de um escritório de vendas de papel, mostrando suas interações e os desafios que enfrentam no trabalho.",
    status: "Finalizada.",
    statusClass: "status-ended",
    cast: ["Steve Carell", "Rainn Wilson", "John Krasinski", "Jenna Fischer", "Mindy Kaling", "B.J. Novak", "Creed Bratton"],
    genres: ["Comédia"],
    seasons: ["1ª Temporada - 6 episódios", "2ª Temporada - 22 episódios", "3ª Temporada - 23 episódios", "4ª Temporada - 14 episódios", "5ª Temporada - 26 episódios", "6ª Temporada - 24 episódios", "7ª Temporada - 24 episódios", "8ª Temporada - 24 episódios", "9ª Temporada - 27 episódios"],
    watchPlatforms: ["Peacock", "Netflix", "Prime Video", "Max"],
    posterImg: "assets/img/index/ranked/theoffice_ranked.webp",
    backdropImg: "assets/img/series_info_bg/theoffice_bg.webp",
    trailerUrl: "https://www.youtube.com/embed/tNcDHWpselE"
  }
};
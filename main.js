// Juego de blackjack
// Versión simplificada, sin apuestas, del juego BlackJack. Se omiten los palos porque no influeyen en las reglas del juego, sino que lo importante es el valor númerico de cada carta.

// Pedimos nombre al jugador para darle la bienvenida.
nombre = prompt(
  "¡Bienvenido a mi versión simplificada del BlackJack! Tranqui, no es con apuestas. \nIngresa tu nombre de usuario"
);
while (!nombre.trim()) {
  alert("Ingresa tu usuario.");
  nombre = prompt("¡Bienvenido a mi versión simplificada del BlackJack! Tranqui, no es con apuestas. \n¿Cómo te llamás?");
}
if (nombre.toLowerCase() == "rulo19") {
  alert(
    "Bienvenido genio \nMaestro \nCrack \nLeyenda \nVos ni necesitas leer las reglas."
  );
} else {
  // Si no es Rulo19, le consultamos si quiere leer las reglas.
  reglas = prompt(
    "Bienvenido " + nombre + " ¿necesitas leer las reglas de BlackJack? \nSi o No"
  );
  while (reglas.toLowerCase() != "si" && reglas.toLowerCase() != "no") {
    alert("Ingresa una opción válida.");
    reglas = prompt(
      "Bienvenido " + nombre + " ¿necesitas leer las reglas de BlackJack? \nSi o No"
    );
  }
  if (reglas.toLowerCase() == "si") {
    alert(
      "El objetivo de cualquier mano de blackjack es derrotar a la banca. Para esto, debes tener una mano que puntúe más alto que la mano de la banca, pero que no supere los 21 puntos en valor total. O bien, puedes ganar con una puntuación inferior a 22 cuando la mano de la banca supera los 21 puntos."
    );
  }
}

// Declaramos las variables
let opcion = true

// Objeto para guardar un registro de las partidas
const PARTIDAS = {
  Total: 1,
  Ganadas: 0,
  Perdidas: 0,
  Empates: 0,
  Winrate: 0
}


// Ejecutamos el juego hasta que el usuario no quiera jugar más.
blackjack();
while (opcion) { 
  PARTIDAS.Total ++
  blackjack();
}


// Funciones:

// Funcion del juego principal.
function blackjack() {
  // Definimos dos constantes, que serán las cartas iniciales del jugador y el crupier (banca).
  const manoJugador = [repartirCartas(), repartirCartas()];
  const manoBanca = [repartirCartas(), repartirCartas()];


  // Bucle para determinar si el jugador se pasó de 21 (lo que haría que pierda automáticamente) o para saber si quiere robar otra carta o "plantarse".
  while (puntaje(manoJugador) < 21) {
    
      opcion = confirm(`${nombre}, tu mano actual es: ${mostrarCartas(manoJugador)}
      Tu puntaje es: ${puntaje(manoJugador)}
      Banca inicial: ${mostrarCartas([manoBanca[0]])}
      ¿Querés robar otra carta?'`);
    if (opcion) {
      let nuevaCarta = repartirCartas();
      manoJugador.push(nuevaCarta);
    } else {
      break;
    }
  }

  /* Bucle para determinar si la banca debe robar una carta o no. Por regla, en el Blackjack la banca no puede plantarse con un valor total menor a 17.
 Si el jugador perdió automáticamente (por pasarse de 21) no hace falta que la banca robe una tercera carta. En cambio, si el jugador se plantó y la banca tiene un valor menor a 17, debe robar por regla.
 */
  while (puntaje(manoBanca) < 17 && puntaje(manoJugador) <= 21) {
    manoBanca.push(repartirCartas());
  }

  // Mostrando los resultados una vez finalizada la partida
  alert(
  `Robaste: ${mostrarCartas(manoJugador)}
  Tu puntaje fue de: ${puntaje(manoJugador)}
  ${resultado(puntaje(manoJugador), puntaje(manoBanca))}
  Banca: ${mostrarCartas(manoBanca)}
  Puntaje total de la banca: ${puntaje(manoBanca)}`);
  
  PARTIDAS.Winrate = (PARTIDAS.Ganadas / PARTIDAS.Total) * 100   
  opcion = confirm(`Resultados:
  Partidas: ${PARTIDAS.Total}
  Partidas ganadas: ${PARTIDAS.Ganadas}
  Partidas perdidas: ${PARTIDAS.Perdidas} 
  Empates: ${PARTIDAS.Empates}
  Porcentaje de ganadas: ${PARTIDAS.Winrate.toFixed(2)}% 
  \n¿Querés jugar de vuelta?`);
}

/* Esta funcion reparte las cartas, de manera aleatoria, dentro de los valores de un mazo de poker. Se omiten los palos porque no son importantes en el BlackJack.
    Devuelve un valor aleatorio, dentro de los valores posibles (teniendo en cuenta un mazo tradicional de póker, sin comodines)
*/
function repartirCartas() {
  const CARTAS = [2, 3, 4, 5, 6, 7, 8, 9, "J", "Q", "K", "A"];
  const PALOS = ['♠', '♣', '♦', '♥']
  const carta = CARTAS[Math.floor(Math.random() * CARTAS.length)];
  const palo = PALOS[Math.floor(Math.random() * PALOS.length)];
  return {carta, palo}
}

/*
  Esta funcion muestra las cartas en la mano, agregando el palo correspondiente a las barajas de poker.
*/
function mostrarCartas(mano) {
  return mano.map(carta => `${carta.carta}${carta.palo}`).join(', ');
}

/* Esta funcion suma el valor de las cartas en la mano, y también en la banca, para calcular quien gana o pierde.
 Devuelve el resultado de sumar los valores de las cartas en la mano
*/

function puntaje(mano) {
  let puntuacion = 0;

  // Bucle para calcular el valor de cada carta en la mano.
  for (let i = 0; i < mano.length; i++) {
    let carta = mano[i];

    // Condicional cambiar los valores de las cartas J,Q,K y A a su valor numérico correspondiente, siguiendo las reglas de blackjack.
    switch (carta.carta) {
      case "J":
      case "Q":
      case "K":
        puntuacion += 10;
        break;
      case "A":
        if (puntuacion <= 10) {
          puntuacion += 11;
        } else {
          puntuacion += 1;
        }
        break;
      default:
        puntuacion += parseInt(carta.carta);
        break;
    }
  }

  return puntuacion;
}

/* Esta funcion calcula los puntajes (la suma total de las cartas en la mano) entre el jugador y la banca, o también conocido como crupier.
  Se usa la palabra banca en lugar de crupier para simplifcar más los conceptos del juego.
  Devuelve diferentes resultados, dependiendo si ganamos, perdemos o empatamos.
*/
function resultado(puntajeJugador, puntajeBanca) {
  // Condicional para verificar si gana el jugador, la banca o si hay empate
  if (puntajeJugador <= 21 && puntajeBanca < puntajeJugador){
    PARTIDAS.Ganadas ++
    return "¡Ganaste, " + nombre + "!" + "\nPierde la Banca";
  }else if (puntajeJugador > 21) {
    PARTIDAS.Perdidas ++
    return "Te pasaste de 21, " + nombre + "\n¡Perdiste!";
  } else if (puntajeBanca > 21) {
    PARTIDAS.Ganadas ++
    return "¡Ganaste, " + nombre + "!" + "\nPierde la Banca";
  } else if ((puntajeJugador > puntajeBanca) && (puntajeBanca > 21)) {
    PARTIDAS.Ganadas ++
    return "¡Ganaste, " + nombre + "!" + "\nPierde la Banca";
  } else if (puntajeJugador < puntajeBanca) {
    PARTIDAS.Perdidas ++
    return "¡Perdiste, " + nombre + "!" + "\nGana la Banca";
  } else if (puntajeJugador == puntajeBanca) {
    PARTIDAS.Empates ++
    return "Empate!";
  }
}

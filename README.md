# Party game
Objective: Be the first player to reach the specified number of points

Player count: 4-10

# Gameplay
Each turn, one player is in the "hot seat".

The hot seat player draws a question, and then answer the question honestly.

All other players must answer the question as well in the attempt of impersonating the person in the hot seat.

Points are gained by correctly guessing which answer is the hot seat player's answer.


# Scoring

The player in the hot seat gains 3 points as long as one other player guesses their answer correctly.

If everyone guesses correctly the hot seat player's answer, meaning their answer was too specific and obvious, then the player gets zero points.

If the non-hot seat players get their answer chosen, they will get a point for it.

# Technical Side

## server, rooms, clients (solely networking)
  This way: we don't transfer large socket objects when emitting gamestates; uesrs can have the same nickname across different rooms

 - RoomMap: dictionary with roomID as key and Game object as value
 - userMap: dictionary with client.id as key and socket object as value (npm socket.io)


### Classes
 - Game: hostID, roomID, playerMap, (other game stuff)
 -- playerMap: dictionary with username as key and Player object (containing client.id) as value

 - Player: client.id, username, (other player stuff)




- Questions class:
  - question string
  - (?) weight

- (?) Question Pack:
  - string name
  - array of question instances

- Card class:
  - --different constructors for different game modes
  - constructor(int n, pack p): generates array of n random, unique questions from p
  - constructor(int units, int, margin_of_error, pack p): generates array of questions from p whose weights sum to units + or - error

- Player Class:
  - points
  - name
  - profile picture
  - turn order  

- Game Class:
  - point goal

- Game States:
  - Player joining (lobby)  
  - Select new hotseat player
  - Drawing a new question
  - Everyone answering questions
  - Guessing phase
  - Turn change
  - Victory

# Ideas:
- Players can write their own questions
- Question Suggestions
- Host privileges and settings
- Different question packs for different audience

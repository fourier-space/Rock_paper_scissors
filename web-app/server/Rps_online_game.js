import RPS from "./rps.js";
/**
 * Rps_online_game is a module to be accessed through JSON_RPC on a server,
 * in order to manage a concurrent set of Rock Paper Scissors games.
 * @namespace Rps_online_game
 * @author A. Freddie Page
 * @version 2021/22
 */
const Rps_online_game = Object.create(null);

const game_length = 5; // seconds

const list_of_games = [];

/**
 * The configuration of a game of Rock Paper Scissors.
 * @memberof Rps_online_game
 * @typedef {object} Game
 * @property {number} game_id Numeric identifier of a game.
 * @property {boolean} full Whether a game has two players matched.
 * @property {number} throw_due The date/time that throws should be made by.
 * @property {(RPS.Throw | "")} player_1_throw
 *     The throw made by Player 1 or `""` if not made or not visible.
 * @property {(RPS.Throw | "")} player_2_throw
 *     The throw made by Player 2 or `""` if not made or not visible.
 * @property {boolean} ended Whether the game has ended.
 * @property {number} [current_time]
 *     The timestamp for information about a game.
 * @property {(1 | 2 | 0)} [winner]
 *     If the game is won by player 1 or 2 or drawn (0).
 */

let last_game_id = 0;

/**
 * Players sign up to initiate a game.
 * If a game exists that is not ended and not full that game becomes full,
 * and returned with the requesting player becoming Player 2
 * Otherwise a new game (not full) is created and returned with the requesting
 * player becoming Player 1.
 * @memberof Rps_online_game
 * @function
 * @returns {Rps_online_game.Game}
 */
Rps_online_game.ready_to_play = function () {
    const open_vacant_games = list_of_games.filter(
        (game) => !game.ended && !game.full
    );
    if (open_vacant_games.length === 0) {
        last_game_id += 1;
        const new_game = {
            "game_id": last_game_id,
            "full": false,
            "throw_due": Number(new Date()) + game_length * 1000,
            "player_1_throw": "",
            "player_2_throw": "",
            "ended": false
        };
        list_of_games.push(new_game);
        return new_game;
    }
    const existing_game = open_vacant_games[0];
    existing_game.full = true;
    return existing_game;
};

/**
 * Makes a move to an open game as a player.
 * @memberof Rps_online_game
 * @function
 * @param {number} game_id The game to which a throw is made.
 * @param {number} player The number of the player making the throw.
 * @param {RPS.Throw} thrown The RPS throw the player makes.
 */
Rps_online_game.make_a_throw = function (game_id, player, thrown) {
    const game = list_of_games.find((g) => g.game_id === game_id);
    if (player === 1) {
        game.player_1_throw = thrown; // `throw` is a Javascript reserved word.
    }
    if (player === 2) {
        game.player_2_throw = thrown;
    }
};

/**
 * Check the status of an RPS game. Moves are hidden if the game is not over.
 * @memberof Rps_online_game
 * @function
 * @param {number} game_id The identifier of the game to check.
 * @returns {Rps_online_game.Game} The state of the game checked.
 */
Rps_online_game.check_result = function (game_id) {
    const game = list_of_games.find((g) => g.game_id === game_id);
    if (game.ended) {
        return game;
    }
    if (game.throw_due < new Date()) {
        game.ended = true;
        game.winner = RPS.play_round(game.player_1_throw, game.player_2_throw);
        return game;
    }
    return Object.assign({}, game, {
        "player_1_throw": "",
        "player_2_throw": "",
        "current_time": Number(new Date())
    });
};

export default Object.freeze(Rps_online_game);

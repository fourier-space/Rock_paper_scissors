import Json_rpc from "./Json_rpc.js";

let game;
let player;

const rock_button = document.getElementById("rock_button");
const paper_button = document.getElementById("paper_button");
const scissors_button = document.getElementById("scissors_button");
const lizard_button = document.getElementById("lizard_button");
const spock_button = document.getElementById("spock_button");

const history_list = document.getElementById("history_list");

const winner_text = [
    "Game Draw",
    "I Win",
    "Opponent Wins"
];

// Rps_online_game methods:
const ready_to_play = Json_rpc.method("ready_to_play");
const make_a_throw = Json_rpc.method("make_a_throw");
const check_result = Json_rpc.method("check_result");

const check_result_TO = function () {
    check_result(game.game_id).then(function (result_game) {
        game = result_game;
        if (game.ended) {
            const li = document.createElement("li");

            const final_throws = (
                player === 1
                ? [game.player_1_throw, game.player_2_throw]
                : [game.player_2_throw, game.player_1_throw]
            );

            let winner; // Here 1 is me, 2 is opponent.
            if (game.winner === 0) {
                winner = 0;
            } else if (player === 1) {
                winner = game.winner;
            } else {
                winner = 3 - game.winner; // 1 → 2, 2 → 1
            }

            li.textContent = (
                `I played ${final_throws[0]}, ` +
                `Opponent played ${final_throws[1]}: ` +
                `${winner_text[winner]}`
            );

            history_list.append(li);

            my_throw_span.textContent = emoji[final_throws[0]];
            their_throw_span.textContent = emoji[final_throws[1]];


        } else {
            setTimeout(check_result_TO, game.throw_due - game.current_time);
        }
    });
};

const my_throw_span = document.getElementById("my_throw");
const their_throw_span = document.getElementById("their_throw");
const emoji = {
    "Rock": "🪨",
    "Paper": "🧻",
    "Scissors": "✂️",
    "Lizard": "🦖",
    "Spock": "🖖",
    "": "💁"
};

const button_click = function (my_throw) {
    return function () {
        my_throw_span.textContent = emoji[my_throw];

        if (!game || game.ended) {
            their_throw_span.textContent = emoji[""];
            ready_to_play().then(function (response_game) {
                game = response_game;
                player = (
                    game.full
                    ? 2
                    : 1
                );

                make_a_throw(game.game_id, player, my_throw);

                setTimeout(check_result_TO, game.throw_due - game.current_time);
            });
        } else {
            make_a_throw(game.game_id, player, my_throw);
        }
    };
};

rock_button.onclick = button_click("Rock");
paper_button.onclick = button_click("Paper");
scissors_button.onclick = button_click("Scissors");
lizard_button.onclick = button_click("Lizard");
spock_button.onclick = button_click("Spock");

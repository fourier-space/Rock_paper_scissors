import RPS from "../server/rps.js";
import fc from "fast-check";
import property from "./property.js";

const arbitrary_throw = fc.constantFrom(
    "Rock",
    "Paper",
    "Scissors",
    "Lizard",
    "Spock"
);

describe("Rock Paper Scissors Rules", function () {

    property(
        "RPS outcomes are symmetric under swapping players' throws",
        [arbitrary_throw, arbitrary_throw],
        function (player_1_throw, player_2_throw) {
            const round_1 = RPS.play_round(player_1_throw, player_2_throw);
            const round_2 = RPS.play_round(player_2_throw, player_1_throw);

            return (
                (round_1 === 1 && round_2 === 2) ||
                (round_1 === 2 && round_2 === 1) ||
                (round_1 === 0 && round_2 === 0)
            );

        }
    );

    property(
        "If only one player makes a throw then that player wins",
        [arbitrary_throw, fc.constantFrom(1, 2)],
        function (only_throw, player) {
            if (player === 1) {
                return RPS.play_round(only_throw, "") === 1;
            } else {
                return RPS.play_round("", only_throw) === 2;
            }
        }
    );

    it("If neither player makes a throw, the game is a draw", function () {
        if (RPS.play_round("", "") !== 0) {
            throw new Error(
                "Game not drawn when both players make no move"
            );
        }
    });

});

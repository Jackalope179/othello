from reversi import Reversi, Coord
from reversiai import ReversiAI
from aihelper import AIHelper, FormatConverter
import time

def attack():

    # 1 - Coin Parrity
    # 2 - Stability
    # 3 - Corner occupancy
    # 4 - CORNER CLOSENESS
    # 5 - Mobility
    # 6 - Static
    # Black player is 1
    # White player is -1
    player_black = ReversiAI(1)     
    for i in range(1,8):     
        player_white = ReversiAI(i)    #black player is 1
        game = Reversi()
        current_player = 1
        count = 0
        # game.print_board()
        start_game = time.time()
        while True:
            board = FormatConverter.game_to_ai_board(game.board)
            start = None
            elapse = None
            if current_player == 1:
                # print("BLACK turn")    
                start = time.time()
                move_b = player_black.get_next_move(board,1)
                elapse = time.time() - start
                if move_b is not None:
                    game.play(move_b)
                    # print("The move is : ", move_b, end=" ")
                    # print(" (in %.2f ms)" % (elapse*1000))
                current_player = -1

            else:
                # print("WHITE turn")    
                start = time.time()
                move_w = player_white.get_next_move(board,-1)
                elapse = time.time() - start
                if move_w is not None:
                    game.play(move_w)
                    # print("The move is : ", move_w, end=" ")
                    # print(" (in %.2f ms)" % (elapse*1000))
                current_player = 1

            # count += 1
            # print("Board ", "%3d" % count)
            if game.game_state!='In progress':
                print(i,": ", game.black_player.result, ' - ', game.white_player.result)
                # game.print_board()
                # print(game.game_state)
                break
            # game.print_board()
            # print("------------------------------------")

        # print("END GAME in %.2f s" % (time.time() - start_game))




if __name__ == '__main__':
    attack()







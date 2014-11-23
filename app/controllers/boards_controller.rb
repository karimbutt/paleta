class BoardsController < ApplicationController
  before_action :set_board, only: [:show, :edit, :update, :destroy]

  def show    
    @board = Board.last
    @picture = Picture.last
    @sorted_picture_colors = @picture.picture_colors.sort_by do |x|
       x.pixels_count.to_i
    end.reverse

    @array_for_api = @board.format(@sorted_picture_colors)

  end

  def query
    @board = Board.last
    @picture = Picture.last
    @sorted_picture_colors = @picture.picture_colors.sort_by do |x|
       x.pixels_count.to_i
    end.reverse

    @array_for_api = @board.format(@sorted_picture_colors)
    # @mini_set = @array_for_api[0..49]
    # @second_set = @array_for_api[50..100]

    respond_to do |format|
      format.json { render :json => { dataset: @array_for_api } }
    end
  end

  def new
    @board = Board.create
    redirect_to board_path(@board)
  end


  private
    # Use callbacks to share common setup or constraints between actions.
    def set_board
      @board = Board.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def board_params
      params[:board]
    end
end

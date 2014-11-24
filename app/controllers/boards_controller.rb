class BoardsController < ApplicationController
  before_action :set_board, only: [:show, :edit, :update, :destroy]

  def show
    @board = Board.last
    @picture = Picture.last

    @sorted_picture_colors = @picture.picture_colors.sort_by do |x|
       x.pixels_count.to_i
    end.reverse

    @array_for_api = @board.format(@sorted_picture_colors)

    @rgb_avgpercent_d3 = @board.average_rgb(@array_for_api)

    @colour_lover_pallet = @board.colourlovers(@array_for_api)

    @tint = @colour_lover_pallet.first
    @tinted = @board.set_tint(@tint)
    binding.pry
  end

  def query
    @board = Board.last
    @picture = Picture.last
    @sorted_picture_colors = @picture.picture_colors.sort_by do |x|
       x.pixels_count.to_i
    end.reverse

    @array_for_api = @board.format(@sorted_picture_colors)
    @full_array = @array_for_api[0..250]

    respond_to do |format|
      format.json { render :json => { dataset: @full_array } }
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

class BoardsController < ApplicationController
  before_action :set_board, only: [:show, :edit, :update, :destroy]

  def show
    @board = Board.last
    @picture = Picture.last

    @sorted_picture_colors = @picture.picture_colors.sort_by do |x|
       x.pixels_count.to_i
    end.reverse
  
    @array_for_api = @board.format(@sorted_picture_colors)

    # @colour_lover_pallet = @board.colourlovers(@array_for_api)

  end

  def query
    @board = Board.last
    @board.set_board_picture
    @board.save

    @picture = @board.pictures.first
   

    @sorted_picture_colors = @picture.picture_colors.sort_by do |x|
       x.pixels_count.to_i
    end.reverse

    @array_of_individual_hexes = @board.format(@sorted_picture_colors)
    @aggregate_rgb_cmyk= @board.average_rgb_and_cmyk(@array_of_individual_hexes)
  
    @full_array_for_d3 = [@array_of_individual_hexes, @aggregate_rgb_cmyk]
    binding.pry
    respond_to do |format|
      format.json { render :json => { dataset: @full_array_for_d3} }
    end
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

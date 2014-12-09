class BoardsController < ApplicationController
  before_action :set_board, only: [:show, :edit, :update, :destroy]

  def show
    @board = Board.last
    @picture = @board.pictures.first

    @sorted_picture_colors = @picture.picture_colors.sort_by do |x|
       x.pixels_count.to_i
    end.reverse

    @array_of_individual_hexes = @board.format(@sorted_picture_colors)
    @colour_lovers_palette = @board.colourlovers(@array_of_individual_hexes)
    @array_for_api = @board.format(@sorted_picture_colors)
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

    @aggregate_rgb_cmyk = @board.aggregate_data(@array_of_individual_hexes)

    @full_array_for_d3 = [@array_of_individual_hexes, @aggregate_rgb_cmyk]

    respond_to do |format|
      format.json { render :json => { dataset: @full_array_for_d3} }
    end
  end


  def tint_shade
    @board = Board.last
    @hex = params[:color].keys.first.gsub('#', '')
    @tints = @board.set_tint(@hex)
    @shades = @board.set_shade(@hex).reverse
    @picture = @board.pictures.first

    @tints_color_array = []
    @tints.each do |tint|
      rgb = @picture.hex_to_rgb(tint)
      cmyk = @picture.rgb_to_cmyk(rgb)
      new_tint = [tint,rgb, cmyk]
      @tints_color_array << new_tint
    end

    @shades_color_array = []
    @shades.each do |shade|
      rgb = @picture.hex_to_rgb(shade)
      cmyk = @picture.rgb_to_cmyk(rgb)
      new_shade = [shade,rgb, cmyk]
      @shades_color_array << new_shade
    end
    
    respond_to do |format|
      format.json { render :json => { dataset: [@tints_color_array, @shades_color_array] } }
    end
  end


  def default_tint_shade
    @board = Board.last
    @default_hex = @board.pictures.first.colors.first.hex.gsub('#', '')
    @default_tints = @board.set_tint(@default_hex)
    @default_shades = @board.set_shade(@default_hex).reverse
    @picture = @board.pictures.first


    @tints_color_array = []
    @default_tints.each do |tint|
      rgb = @picture.hex_to_rgb(tint)
      cmyk = @picture.rgb_to_cmyk(rgb)
      new_tint = [tint,rgb, cmyk]
      @tints_color_array << new_tint
    end

    @shades_color_array = []
    @default_shades.each do |shade|
      rgb = @picture.hex_to_rgb(shade)
      cmyk = @picture.rgb_to_cmyk(rgb)
      new_shade = [shade,rgb, cmyk]
      @shades_color_array << new_shade
    end
    respond_to do |format|
      format.json { render :json => { dataset: [@tints_color_array, @shades_color_array] } }
    end
  end


  def convert_colors
    @hex = params[:color].keys.first
    @board = Board.last
    @picture = @board.pictures.first

    @rgb = @picture.hex_to_rgb(@hex)
    @cmyk = @picture.rgb_to_cmyk(@rgb)

    respond_to do |format|
      format.json { render :json => { dataset: [@rgb, @cmyk] } }
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

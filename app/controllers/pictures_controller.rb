class PicturesController < ApplicationController
  before_action :set_picture, only: [:show, :edit, :update, :destroy]


  def new
    @picture = Picture.new
  end

  def create  
    @picture = Picture.create(picture_params)
    url = @picture.image_url
    # url = Rails.root + "tmp/#{@picture.id}/#{@picture.image.filename}"
    @picture.parse_colors(url)

    @board = Board.new
    @picture.board = @board
    @picture.save

    redirect_to board_path(@board)
    # redirect_to new_board_path
  end


  private
    def set_picture
      @picture = Picture.find(params[:id])
    end

    def picture_params
      params.require(:picture).permit(:image)
    end
end

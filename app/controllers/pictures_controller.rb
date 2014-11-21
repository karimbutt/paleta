class PicturesController < ApplicationController
  before_action :set_picture, only: [:show, :edit, :update, :destroy]


  def new
    @picture = Picture.new
  end

  def create  
    @picture = Picture.create(picture_params)
    url = "public/uploads/#{@picture.id}/#{@picture.image.filename}"
    @picture.parse_colors(url)

    redirect_to new_board_path
  end


  private
    def set_picture
      @picture = Picture.find(params[:id])
    end

    def picture_params
      params.require(:picture).permit(:image)
    end
end

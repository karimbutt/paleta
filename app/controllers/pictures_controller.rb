class PicturesController < ApplicationController
  before_action :set_picture, only: [:show, :edit, :update, :destroy]

  # def index
  #   @pictures = Picture.all
  # end

  # def show
  # end

  def new
    @picture = Picture.new
  end

  # def edit
  # end

  def create  
    @picture = Picture.create(picture_params)
    url = "public/uploads/#{@picture.id}/#{@picture.image.filename}"
    @picture.parse_colors(url)
    
    redirect_to new_board_path
  end

  # def update
  #   respond_to do |format|
  #     if @picture.update(picture_params)
  #       format.html { redirect_to @picture, notice: 'Picture was successfully updated.' }
  #       format.json { render :show, status: :ok, location: @picture }
  #     else
  #       format.html { render :edit }
  #       format.json { render json: @picture.errors, status: :unprocessable_entity }
  #     end
  #   end
  # end

  # def destroy
  #   @picture.destroy
  #   respond_to do |format|
  #     format.html { redirect_to pictures_url, notice: 'Picture was successfully destroyed.' }
  #     format.json { head :no_content }
  #   end
  # end

  private
    def set_picture
      @picture = Picture.find(params[:id])
    end

    def picture_params
      params.require(:picture).permit(:image)
    end
end

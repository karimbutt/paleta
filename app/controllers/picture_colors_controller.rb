class PictureColorsController < ApplicationController

  def query
    # binding.pry
    respond_to do |format|
      format.json { render :json => { dataset: "hello" } }
    end
  end

end

class PictureColor < ActiveRecord::Base
	belongs_to :picture
	belongs_to :color
end

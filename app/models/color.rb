class Color < ActiveRecord::Base
	has_many :picture_colors
	has_many :pictures, through: :picture_colors
end

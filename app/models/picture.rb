class Picture < ActiveRecord::Base
	has_many :picture_colors
	belongs_to :board
	has_many :colors, through: :picture_colors
end

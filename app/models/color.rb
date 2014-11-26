class Color < ActiveRecord::Base
	has_many :picture_colors
	has_many :pictures, through: :picture_colors


 	def find_complementary(rgb_string)
 		split_colors = rgb_string.gsub("(","").gsub(")","").split(",")
		
		red= split_colors[0].to_f
		green= split_colors[1].to_f
		blue= split_colors[2].to_f
		paleta_color = P::Color.new(red,green,blue)
		complementary_color = paleta_color.complement!
 	end
end
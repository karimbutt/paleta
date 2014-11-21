class Board < ActiveRecord::Base
	has_many :pictures
	has_many :colors, through: :pictures


	def format(objects)
		objects.collect do |object|
			hex = Color.find(object.color_id).hex
			prevalence = object.pixels_count.to_i
			value = [hex, prevalence]
		
		end
	end

end


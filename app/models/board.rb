class Board < ActiveRecord::Base
	has_many :pictures
	has_many :colors, through: :pictures


	def format(objects)
		objects.collect do |object|
			found_color = Color.find(object.color_id)
			hex = found_color.hex
			rgb = found_color.rgb
			prevalence = object.pixels_count.to_i
			value = [hex, rgb, prevalence]
		end
	end

	def average_rgb(data_array)
		overall_red = 0
		overall_green = 0
		overall_blue = 0

		data_array.each do |data|
			split_colors = data.split(",").flatten[1].gsub("(","").gsub(")","").split(",")
			overall_red += split_colors[0].to_i
			overall_green += split_colors[1].to_i
			overall_blue += split_colors[2].to_i
		end
		
		overall_red = overall_red.to_f
		overall_green = overall_green.to_f
		overall_blue = overall_blue.to_f

		total_colors = overall_red + overall_green + overall_blue
		red_percent = (overall_red/total_colors)*100
		green_percent = (overall_green/total_colors)*100
		blue_percent = (overall_blue / total_colors)*100

		hash_for_d3 = [{color: "red", value: red_percent}, {color: "green", value: green_percent}, {color: "blue", value: blue_percent}]
	end

end


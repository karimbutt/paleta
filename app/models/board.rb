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

	def average_rgb_and_cmyk(data_array)
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
	
		#RGB Percent Conversion
		total_colors = overall_red + overall_green + overall_blue
		red_percent = (overall_red/total_colors)*100
		green_percent = (overall_green/total_colors)*100
		blue_percent = (overall_blue / total_colors)*100

		#Needed for CYMK Conversion
		average_red = overall_red/data_array.count
		average_green = overall_green/data_array.count
		average_blue = overall_blue/data_array.count

		cmyk_red = average_red/255
		cmyk_green = average_green/255
		cmyk_blue = average_blue/255

		#CYMK colors
		k = 1 - [cmyk_red, cmyk_green, cmyk_blue].max
		c = (1-cmyk_red-k)/(1-k)
		m = (1-cmyk_green-k)/(1-k)
		y = (1-cmyk_blue-k)/(1-k)
	
		#Hash to return for d3
		hash_for_d3 = [[{color: "red", value: red_percent}, {color: "green", value: green_percent}, {color: "blue", value: blue_percent}],[{color: "cyan", value: c},{color: "magenta", value: m},{color: "yellow", value: y},{color: "black", value: k}]]
		
	end

	
end


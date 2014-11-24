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

	def colourlovers(colors)
	  # colors[0]=""
	  counter = 0
	  url_colors = []
	  pallets = []
	  while counter < 20
	    counter += 1
	    current_color = colors[counter][0]
	    current_color.gsub!('#', '')
	    url_colors << current_color
	    uri = "http://www.colourlovers.com/api/palettes?hex=#{url_colors.join(',')}&orderCol=numViews&sortBy=DESC&format=json"
	    puts uri
	    encoded_uri = URI::encode(uri)
	    colour_lovers_pallets = JSON.parse(open(encoded_uri).read)
	    if colour_lovers_pallets.empty?
	      url_colors.pop
	      next
	    else
	      pallets = colour_lovers_pallets[0]["colors"]
	      # puts pallets.inspect
	    end
	  end
	  pallets
	end

#http://stackoverflow.com/questions/6615002/given-an-rgb-value-how-do-i-create-a-tint-or-shade
	def set_tint(color)
		@color = color
		red = color[0..1].to_i(16)
		green = color[2..3].to_i(16)
		blue = color[4..5].to_i(16)

		@red_tint = red + (0.25 * (255 - red))
		@green_tint = green + (0.25 * (255 - green))
		@blue_tint = blue + (0.25 * (255 - blue))

		tinted = []
		tinted << @blue_tint
		tinted << @green_tint
		tinted << @red_tint
		tinted

		# red_tint = red_tint.to_s(16)
		# green_tint = green_tint.to_s(16)
		# blue_tint = blue_tint.to_s(16)
	end


end


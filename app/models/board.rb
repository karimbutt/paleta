class Board < ActiveRecord::Base
	has_many :pictures
	has_many :colors, through: :pictures

	def format(objects)
		objects.collect do |object|
			found_color = Color.find(object.color_id)
			hex = found_color.hex
			rgb = found_color.rgb
			prevalence = object.pixels_count.to_i
			cmyk = found_color.cmyk
			complementary = found_color.matching

			split_rbg = rgb.gsub("(","").gsub(")","").split(",")
				red = split_rbg[0].to_f
				green = split_rbg[1].to_f
				blue = split_rbg[2].to_f
				total = red + green + blue
				percent_red = red / total
				percent_green = green / total
				percent_blue = blue / total

			split_cmyk = cmyk.gsub("(","").gsub(")","").split(",")
				cyan = split_cmyk[0].to_f
				magenta = split_cmyk[1].to_f
				yellow = split_cmyk[2].to_f
				black = split_cmyk[3].to_f
				total = cyan + magenta + yellow + black
				percent_cyan = cyan / total
				percent_magenta = magenta / total
				percent_yellow = yellow / total
				percent_black = black / total

			rgb_for_pie = [{color: "red", value: percent_red}, {color: "green", value: percent_green}, {color: "blue", value: percent_blue}]
			cmyk_for_pie = [{color: "cyan", value: percent_cyan}, {color: "magenta", value: percent_magenta}, {color: "yellow", value: percent_yellow}, {color: "black", value: percent_black}]

			value = [hex, rgb, prevalence, cmyk, complementary, rgb_for_pie, cmyk_for_pie]
		end
	end

	def set_board_picture
		Picture.last.board_id = self.id
		Picture.last.save
		self.save
	end

	def aggregate_rgb(data_array)
		total_elements = data_array.count

		values = data_array.collect do |row|
			row[1]
		end

		overall_red = 0.0
		overall_green = 0.0
		overall_blue = 0.0

		values.each do |value|
			split_colors = value.gsub("(","").gsub(")","").split(",")
			overall_red += split_colors[0].to_f
			overall_green += split_colors[1].to_f
			overall_blue += split_colors[2].to_f
		end

		total_colors = overall_red + overall_green + overall_blue
		percent_red = overall_red / total_colors
		percent_green = overall_green / total_colors
		percent_blue = overall_blue / total_colors

		[{color: "red", value: percent_red}, {color: "green", value: percent_green}, {color: "blue", value: percent_blue}]
	end

	def aggregate_cmyk(data_array)
		total_elements = data_array.count

		values = data_array.collect do |row|
			row[3]
		end

		overall_cyan = 0.0
		overall_magenta = 0.0
		overall_yellow = 0.0
		overall_black = 0.0

		values.each do |value|
			split_colors = value.gsub("(","").gsub(")","").split(",")
			overall_cyan += split_colors[0].to_f
			overall_magenta += split_colors[1].to_f
			overall_yellow += split_colors[2].to_f
			overall_black += split_colors[3].to_f
		end

		total_colors = overall_cyan + overall_magenta + overall_yellow + overall_black
		percent_cyan = overall_cyan/total_colors
		percent_magenta = overall_magenta/total_colors
		percent_yellow = overall_yellow/total_colors
		percent_black = overall_black/total_colors

		[{color: "cyan", value: percent_cyan},{color: "magenta", value: percent_magenta},{color: "yellow", value: percent_yellow},{color: "black", value: percent_black}]
	end

	def aggregate_data(data_array)
		[aggregate_rgb(data_array),aggregate_cmyk(data_array)]
	end

	def colourlovers(colors)
	  counter = 0
	  url_colors = []
	  palettes = []
	  while counter < 10
	    current_color = colors[counter][0]
	    counter += 1
	    current_color.gsub!('#', '')
	    url_colors << current_color
	    uri = "http://www.colourlovers.com/api/palettes?hex=#{url_colors.join(',')}&orderCol=numViews&sortBy=DESC&format=json"
	    encoded_uri = URI::encode(uri)
	    colour_lovers_palettes = JSON.parse(open(encoded_uri).read)
	    if colour_lovers_palettes.empty?
	      url_colors.pop
	      next
	    elsif colour_lovers_palettes.size == 1
	      palettes << colour_lovers_palettes[0]["colors"]
	      next
	    elsif colour_lovers_palettes.size == 2
	    	palettes << colour_lovers_palettes[0]["colors"]
	    	palettes << colour_lovers_palettes[1]["colors"]
	    	next
    	elsif colour_lovers_palettes.size >= 3
    		palettes << colour_lovers_palettes[0]["colors"]
    		palettes << colour_lovers_palettes[1]["colors"]
    		palettes << colour_lovers_palettes[3]["colors"]
    		next
    	else
    		palettes << colour_lovers_palettes[0]["colors"]
	    end
	  end
	  palettes.reverse[0..2]
	end

	# def colourlovers(colors)
	#   # colors[0]=""
	#   counter = 0
	#   url_colors = []
	#   palettes = []
	#   all_pallets = {}
	#   while counter < 10
	#     counter += 1
	#     current_color = colors[counter][0]
	#     current_color.gsub!('#', '')
	#     url_colors << current_color
	#     uri = "http://www.colourlovers.com/api/palettes?hex={url_colors.join(',')}&orderCol=numViews&sortBy=DESC&format=json"
	#     # puts uri
	#     encoded_uri = URI::encode(uri)
	#     colour_lovers_palettes = JSON.parse(open(encoded_uri).read)
	#     if colour_lovers_palettes.empty?
	#       url_colors.pop
	#       next
	#     else
	#     	all_pallets[:one] = [1]["colors"]
	#     	all_pallets[:two] = [2]["colors"]
	#       all_pallets[:match] = colour_lovers_palettes[0]["colors"]
	#       pallets = colour_lovers_palettes[0]["colors"]

	#     end
	#   end
	#   palettes
	# end


#http://stackoverflow.com/questions/6615002/given-an-rgb-value-how-do-i-create-a-tint-or-shade
	def set_tint(color_to_tint)
		color = color_to_tint
	  @all_tints =[]
		@all_tints << color

	  counter = 0
	  while counter < 9
	    counter += 1
	    red = color[0..1].to_i(16)
	    green = color[2..3].to_i(16)
	    blue = color[4..5].to_i(16)

	    @red_tint = red + (0.25 * (255 - red))
	    @green_tint = green + (0.25 * (255 - green))
	    @blue_tint = blue + (0.25 * (255 - blue))
	    tinted = ""
	    tinted << @red_tint.to_i.to_s(16)
	    tinted << @green_tint.to_i.to_s(16)
	    tinted << @blue_tint.to_i.to_s(16)
	    color = tinted
	    @all_tints << tinted
	  end
	  @all_tints
	end


	# Board methods
	def set_shade(color_to_shade)
	  color = sanatize_hex(color_to_shade)
	  @all_tints =[]

	  10.times do
	    color = sanatize_hex(color)
	    rgb_colors = convert_to_rgb(color)
	    tint = tint(rgb_colors)
	    color = rgb_to_hex(tint).join('')
	    @all_tints << color
	  end
	  p @all_tints
	end

	def sanatize_hex(color)
	  if color.size == 3
	    return color.split('').collect { |color| color + color }.join
	  end
	  color
	end

	def to_true_hex(hex)
	  if hex.size > 2
	    return "ff"
	  elsif hex.size == 1
	    return hex.prepend "0"
	  else
	    return hex
	  end
	end

	def rgb_to_hex(tint_values)
	  tint_values.map do |tint|
	    hex = tint.to_i.to_s(16)
	    to_true_hex(hex)
	  end
	end

	def tint(rgb_values)
	  rgb_values.map do |value|
	    value * 0.85
	  end
	end

	def convert_to_rgb(color)
	  red = color[0..1].to_i(16)
	  green = color[2..3].to_i(16)
	  blue = color[4..5].to_i(16)
	  [red, green, blue]
	end

	# def set_shade(color_to_shade)
	# 	color = color_to_shade

	#   @all_tints =[]
	# 	@all_tints << color

	#   counter = 0
	#   while counter < 10
	#     counter += 1
	#     red = color[0..1].to_i(16)
	#     green = color[2..3].to_i(16)
	#     blue = color[4..5].to_i(16)

	#     @red_tint = red * 0.25
	#     @green_tint = green * 0.25
	#     @blue_tint = blue * 0.25
	#     tinted = ""
	#     tinted << @red_tint.to_i.to_s(16)
	#     tinted << @green_tint.to_i.to_s(16)
	#     tinted << @blue_tint.to_i.to_s(16)
	#     color = tinted
	#     @all_tints << tinted
	#   end
	#   @all_tints
	# end

end


class Picture < ActiveRecord::Base
	has_many :picture_colors
	belongs_to :board
	has_many :colors, through: :picture_colors
  	mount_uploader :image, ImageUploader


  def parse_colors(image_path)

    img =  Magick::Image.read(image_path).first
  	pixels_and_counts = img.quantize.color_histogram

  	hex_hashes = Hash.new

  	pixels_and_counts.each do |key, value|
  		fake_hex = key.to_color(Magick::AllCompliance, false, Magick::QuantumDepth, true)
  		real_hex = "##{fake_hex[1..2]}#{fake_hex[5..6]}#{fake_hex[9..10]}"
  		hex_hashes[real_hex] = value
  	end

  	sorted_hex = hex_hashes.sort_by {|key, value| value}.reverse

  	create_color_objects(sorted_hex)
  end

  def create_color_objects(sorted_hex)

  	sorted_hex.each do |color_array|
  		color_name = color_array[0] 
  		
      if Color.find_by(hex: color_name)
        color = Color.find_by(hex: color_name)
      else
        color = Color.create(hex: color_name)
        color.rgb = hex_to_rgb(color.hex)
        color.cmyk = rgb_to_cmyk(color.rgb)
        color.save
      end


  		PictureColor.new.tap do |c|
  			c.color_id = color.id
  			c.picture_id = self.id
  			c.pixels_count = color_array[1]
  			c.save
  		end
  	end
  end

  def hex_to_rgb(hex)
      cleaned = hex.gsub("#","")
      
      red = cleaned[0..1].hex
      green = cleaned[2..3].hex
      blue = cleaned[4..5].hex

      rgb = "(#{red},#{green},#{blue})"
  end

  def rgb_to_cmyk(rgb)
    split_rgbarray = rgb.gsub("(","").gsub(")","").split(",")
    red = split_rgbarray[0]
    green = split_rgbarray[1]
    blue = split_rgbarray[2]

    cmyk_red = red.to_f/255
    cmyk_green = green.to_f/255
    cmyk_blue = blue.to_f/255

    k = 1 - [cmyk_red, cmyk_green, cmyk_blue].max
    c = (1-cmyk_red-k)/(1-k)
    m = (1-cmyk_green-k)/(1-k)
    y = (1-cmyk_blue-k)/(1-k)

    cmyk = "(#{c.round(2)},#{m.round(2)},#{y.round(2)},#{k.round(2)})"
    
  end

end
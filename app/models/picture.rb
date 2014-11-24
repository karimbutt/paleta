

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
      elsif 
        color = Color.create(hex: color_name)
        color.rgb = hex_to_rgb(color.hex)
        #color.cmyk = ColorConverter.cmyk(color.hex)
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

end
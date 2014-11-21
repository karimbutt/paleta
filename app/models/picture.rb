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
  		color = Color.find_or_create_by(hex: color_name)
  		
  		PictureColor.new.tap do |c|
  			c.color_id = color.id
  			c.picture_id = self.id
  			c.pixels_count = color_array[1]
  			c.save
  		end

  	end
  end

  
end
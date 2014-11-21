class Picture < ActiveRecord::Base
	has_many :picture_colors
	belongs_to :board
	has_many :colors, through: :picture_colors
  	mount_uploader :image, ImageUploader


  def parse_colors(image_path, colors=256, depth=8)

    img =  Magick::Image.read(image_path).first
	pixels_and_counts = img.quantize.color_histogram

	rgb_hashes = Hash.new

	pixels_and_counts.each do |key, value|
		fake_rgb = key.to_color(Magick::AllCompliance, false, Magick::QuantumDepth, true)
		real_rgb = "##{fake_rgb[1..2]}#{fake_rgb[5..6]}#{fake_rgb[9..10]}"
		rgb_hashes[real_rgb] = value
	end

	sorted_rgb = rgb_hashes.sort_by {|key, value| value}.reverse
	
	create_color_objects(sorted_rgb)
  end

  def create_color_objects(sorted_rgb)
  	sorted_rgb.each do |color_array|
  		color_name = color_array[0]
  		color = Color.find_or_create_by(rgba: color_name)
  		
  		PictureColor.new.tap do |c|
  			c.color_id = color.id
  			c.picture_id = self.id
  			c.pixels_count = color_array[1]
  			c.save
  		end
  	end
  end

  
end
class Picture < ActiveRecord::Base
	has_many :picture_colors
	belongs_to :board
	has_many :colors, through: :picture_colors
  mount_uploader :image, ImageUploader

  def parse_colors(image_path, colors=256, depth=8)
    output = `convert #{image_path} -resize 400x400 -format %c -dither None -quantize YIQ -colors #{colors} -depth #{depth} histogram:info:-`
    binding.pry
    @lines = output.lines.sort.reverse.map(&:strip).reject(&:empty?)
    colors
    color_counts
    scores
    create_colors
  end

  # Returns an array of colors in descending order of occurances.
  def colors
    hex_values = @lines.map { |line| line[/#([0-9A-F]{6}) /, 1] }.compact
    hex_values.map { |hex| Color::RGB.from_html(hex) }
  end

  def color_counts
    @lines.map { |line| line.split(':')[0].to_i }
  end

  def scores
    total = color_counts.inject(:+).to_f
    scores = color_counts.map { |count| count / total }
    @colors_array = scores.zip(colors)
  end

  def create_colors
    @colors_array.each do |color_info|
      Color.new(color_info)
    end
  end

end

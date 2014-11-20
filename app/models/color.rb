class Color < ActiveRecord::Base
	has_many :picture_colors
	has_many :pictures, through: :picture_colors

  def initialize(color_info)
    color_info = @color_info
  end

  def parse_color_info
    value_array = @color_info.gsub(': ', '-').gsub(') ', ')-').gsub(' srgba', '-').split('-')
  end

  def count
    count = value_array[0].to_i
  end

  def rgba
    rgba = value_array[1]
  end

  def hex
    hex = value_array[2]
  end

  def srgba
    srgba = value_array[3]
  end

  def delete_transparent
    if self.rgba[-2] == 0
      self.destroy
    end
  end
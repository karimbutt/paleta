class Board < ActiveRecord::Base
	has_many :pictures
	has_many :colors, through: :pictures
end

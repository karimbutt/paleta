class FixRgbaColumnName < ActiveRecord::Migration
  def change
  	rename_column :colors, :rgba, :rgb
  end
end

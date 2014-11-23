class RemoveSrgbColumnFromColors < ActiveRecord::Migration
  def change
  	remove_column :colors, :srgba
  end
end

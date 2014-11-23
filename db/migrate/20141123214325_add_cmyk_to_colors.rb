class AddCmykToColors < ActiveRecord::Migration
  def change
  	add_column :colors, :cmyk, :string
  end
end

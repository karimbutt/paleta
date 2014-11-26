class AddMatchingToColors < ActiveRecord::Migration
  def change
  	add_column :colors, :matching, :string
  end
end

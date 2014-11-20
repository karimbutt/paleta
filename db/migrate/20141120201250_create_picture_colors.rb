class CreatePictureColors < ActiveRecord::Migration
  def change
    create_table :picture_colors do |t|
      t.string :pixels_count
      t.belongs_to :picture
      t.belongs_to :color

      t.timestamps
    end
  end
end

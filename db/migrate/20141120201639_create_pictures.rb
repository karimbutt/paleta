class CreatePictures < ActiveRecord::Migration
  def change
    create_table :pictures do |t|
    	t.belongs_to :board
      t.timestamps
    end
  end
end

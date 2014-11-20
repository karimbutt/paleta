class CreateColors < ActiveRecord::Migration
  def change
    create_table :colors do |t|
      t.string :hex
      t.string :rgba
      t.string :srgba

      t.timestamps
    end
  end
end

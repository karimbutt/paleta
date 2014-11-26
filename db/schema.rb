# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20141126170120) do

  create_table "boards", force: true do |t|
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "colors", force: true do |t|
    t.string   "rgb"
    t.string   "hex"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "cmyk"
    t.string   "matching"
  end

  create_table "picture_colors", force: true do |t|
    t.string   "pixels_count"
    t.integer  "picture_id"
    t.integer  "color_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "pictures", force: true do |t|
    t.integer  "board_id"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "image"
  end

end

#!/usr/bin/env ruby
month = ARGV[0]
year = ARGV[1]
meeting = "#{month} #{year}"

def update_file(filename, next_data)
  file_data = File.read(filename)
  File.open(filename, 'w') do |file|
    first = true
    file_data.each_line do |line|
      file.puts line
      if first then
        file.puts next_data
        first = false
      end
    end
  end
end

next_meeting = """#{meeting}:
  date:
  where:
  facebook:
    event_id:
"""

next_book = """- title:
  author:
  meeting_for: #{meeting}
  slug:
  image-source:
  info-links: {}
#    isfdb:
#    goodreads:
  store-links: []
#  - name:
#    class:
#    url:

"""

next_short = """- title:
  author:
  meeting_for: #{meeting}
  slug:
#  image-source:
  info-links: {}
#    isfdb:
#    goodreads:
  store-links: []
#  - name:
#    class:
#    url:

"""

next_film = """- title:
  meeting_for: #{meeting}
  slug:
#  image-source:
  info-links: {}
#    imdb:
#    justwatch:
  store-links: []
#  - name:
#    class:
#    url:

"""

update_file("_data/meetings.yml", next_meeting)
update_file("_data/books.yml", next_book)
update_file("_data/shorts.yml", next_short)
update_file("_data/films.yml", next_film)

File.open("_current_config.yml", 'w') do |file|
  file.puts """---
next_meeting: #{meeting}
"""
end

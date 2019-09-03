require 'yaml'

def validate_file(file_name, type)
  data = YAML.load_file(file_name)
  mandatory_keys = []
  optional_keys = []

  ordered_keys = ['meeting_for', 'title', 'author', 'slug', 'image-source', 'suggested-by', 'isfdb', 'goodreads', 'imdb', 'justwatch', 'store-links']

  if type == 'books' then
    mandatory_keys = ['title', 'author', 'meeting_for', 'slug', 'store-links']
    optional_keys = ['isfdb', 'goodreads', 'image-source', 'suggested-by']
  elsif type == 'shorts' then
    mandatory_keys = ['title', 'author', 'meeting_for', 'slug', 'store-links']
    optional_keys = ['isfdb', 'goodreads', 'image-source', 'store-links', 'suggested-by']
  elsif type == 'films' then
    mandatory_keys = ['title', 'meeting_for', 'slug', 'store-links']
    optional_keys = ['imdb', 'justwatch', 'image-source', 'suggested-by']
  end
  validate_data(data, mandatory_keys, optional_keys)
  validate_order(data, ordered_keys)

#  file = File.open(file_name_1, 'w')
#  file.puts new_data.to_yaml
#  file.close
end

def validate_data(data, mandatory_keys, optional_keys)
  valid_keys = mandatory_keys + optional_keys

  data.each do |entry|
    puts entry['meeting_for']

    entry.each do |key, value|
      if not (valid_keys.include? key) then
        puts "Invalid key! #{key}"
      end
    end

    mandatory_keys.each do |key|
      if not (entry.has_key? key) then
        puts "Key not found! #{key}"
      end
    end

    puts
  end

end

def validate_order(data, ordered_keys)
  data2 = []
  data.each do |entry|
    puts entry['meeting_for']

    if !entry.has_key?('store-links')
      entry['store-links'] = []
    end

    ordered_entry = entry.sort_by {|k, v| ordered_keys.find_index(k)}.to_h
    data2 << ordered_entry

  end
  puts data2.to_yaml
end

# Bit nasty, but should do the job
if ARGV.size >= 2
  validate_file(ARGV[1], ARGV[0])
end


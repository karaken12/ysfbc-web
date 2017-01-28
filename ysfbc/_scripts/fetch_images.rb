require 'yaml'
require 'open-uri'

def download_images(file_name)
  data = YAML.load_file(file_name)
  data.each do |entry|
    img_path = ".#{entry['img-url']}"
    image_source = entry['image-source']
    if not(File.exists?(img_path)) and image_source
       puts "Downloading #{image_source} to #{img_path}..."
       open(image_source) do |download|
         IO.copy_stream(download, img_path)
       end
       FileUtils.chmod 0644, img_path
    end
  end
end

ARGV.each do |file_name|
  download_images(file_name)
end

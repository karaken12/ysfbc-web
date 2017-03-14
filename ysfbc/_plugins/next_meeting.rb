require 'discourse_api'
require 'open-uri'
require 'rmagick'
include Magick

module Discourse
  class NextMeeting < Jekyll::Generator

     def generate(site)
       name = site.config['next_meeting']
       meeting = site.data['meetings'][name]
       site.data['next_meeting'] = meeting

       setup_entries(site, 'book', 'books')
       setup_entries(site, 'short', 'shorts')
       setup_entries(site, 'film','films')
     end

    def setup_entries(site, type, ptype)
      for entry in site.data[ptype]
        entry['ptype'] = ptype
        entry['img-url'] = image_url(entry)
        download_image(site, entry)
        create_image_vars(site, entry)

        meeting_name = entry['meeting_for']
        if !site.data['meetings'].has_key?(meeting_name)
          puts "Missing meeting: #{meeting_name}"
          next
        end
        site.data['meetings'][meeting_name][type] = entry
      end
    end

    def image_url(entry)
      base = entry['ptype']
      year = entry['meeting_for'][-4..-1]
      slug = entry['slug']
      "/images/#{base}/#{year}/#{slug}.jpg"
    end

    def original_image_url(entry)
      base = entry['ptype']
      year = entry['meeting_for'][-4..-1]
      slug = entry['slug']
      "/images/o/#{base}/#{year}/#{slug}.jpg"
    end

    def download_image(site, entry)
      img_path = ".#{original_image_url(entry)}"
      image_source = entry['image-source']
      if not(File.exists?(img_path)) and image_source
         puts "Downloading #{image_source} to #{img_path}..."
         open(image_source) do |download|
           IO.copy_stream(download, img_path)
         end
         FileUtils.chmod 0664, img_path
         site.static_files << Jekyll::StaticFile.new(site, site.source, File.dirname(entry['img-url']), File.basename(entry['img-url']))
      end
    end

    def create_image_vars(site, entry)
      img_path = ".#{image_url(entry)}"
      orig_image_path = ".#{original_image_url(entry)}"
      if not(File.exists?(img_path)) and File.exists?(orig_image_path)
        puts "Resizing #{img_path}..."
        orig_img = Image.read(orig_image_path).first
        new_img = orig_img.resize_to_fit(150,500)
        new_img.write(img_path)
        site.static_files << Jekyll::StaticFile.new(site, site.source, File.dirname(img_path), File.basename(img_path))
      end
    end

  end
end


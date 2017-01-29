require 'discourse_api'
require 'open-uri'

module Discourse
  class NextMeeting < Jekyll::Generator

     def generate(site)
       name = site.config['next_meeting']
       meeting = site.data['meetings'][name]
       site.data['next_meeting'] = meeting

       for book in site.data['books']
         download_image(site, book)

         meeting_name = book['meeting_for']
         if !site.data['meetings'].has_key?(meeting_name)
           puts "Missing meeting: #{meeting_name}"
           next
         end
         site.data['meetings'][meeting_name]['book'] = book
       end

       for short in site.data['shorts']
         download_image(site, short)

         meeting_name = short['meeting_for']
         if !site.data['meetings'].has_key?(meeting_name)
           puts "Missing meeting: #{meeting_name}"
           next
         end
         site.data['meetings'][meeting_name]['short'] = short
       end

       for film in site.data['films']
         download_image(site, film)

         meeting_name = film['meeting_for']
         if !site.data['meetings'].has_key?(meeting_name)
           puts "Missing meeting: #{meeting_name}"
           next
         end
         site.data['meetings'][meeting_name]['film'] = film
       end
     end

    def download_image(site, entry)
      img_path = ".#{entry['img-url']}"
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

  end
end


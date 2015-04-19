require 'discourse_api'

module Discourse
  class NextMeeting < Jekyll::Generator
     def generate(site)
       name = 'May 2015'
       meeting = site.data['meetings'][name]
       site.data['next_meeting'] = meeting

       for book in site.data['allbooks']
         meeting_name = book['meeting_for']
         if !site.data['meetings'].has_key?(meeting_name)
           puts "Missing meeting: #{meeting_name}"
           next
         end
         site.data['meetings'][meeting_name]['book'] = book
       end

       for short in site.data['shorts']
         meeting_name = short['meeting_for']
         if !site.data['meetings'].has_key?(meeting_name)
           puts "Missing meeting: #{meeting_name}"
           next
         end
         site.data['meetings'][meeting_name]['short'] = short
       end
     end
  end
end


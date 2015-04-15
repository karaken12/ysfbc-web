require 'discourse_api'

module Discourse
  class NextMeeting < Jekyll::Generator
     def generate(site)
       name = 'April 2015'
       meeting = site.data['meetings'][name]
       site.data['next_meeting'] = meeting

       for book in site.data['allbooks']
         meeting = site.data['meetings'][book['meeting_for']]
         meeting['book'] = book
       end

       for short in site.data['shorts']
         meeting = site.data['meetings'][short['meeting_for']]
         meeting['short'] = short
       end
     end
  end
end


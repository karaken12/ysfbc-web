require 'discourse_api'

module Discourse
  class NextMeeting < Jekyll::Generator
     def generate(site)
       meeting = site.data['meetings'][0]
       meeting['book'] = site.data['allbooks'][0]
       meeting['short'] = site.data['shorts'][0]
       site.data['next_meeting'] = meeting
     end
  end
end


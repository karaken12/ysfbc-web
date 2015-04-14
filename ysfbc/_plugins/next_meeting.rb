require 'discourse_api'

module Discourse
  class NextMeeting < Jekyll::Generator
     def generate(site)
       meeting = {'when'=> '7:00pm, Thursday 16th April 2015', 'where'=>'The Maltings Pub'}
       meeting['facebook'] = {'event_id' => '742862479166342'}
       meeting['book'] = site.data['allbooks'][0]
       meeting['short'] = site.data['shorts'][0]
       site.data['next_meeting'] = meeting
     end
  end
end


require 'discourse_api'

module Discourse
  class BlogEntries < Jekyll::Generator
     def generate(site)
       maxtopics = site.config['max_blog_entries']
       if maxtopics.nil?
         maxtopics = -1
       end

       client = DiscourseApi::Client.new(site.config['discourse_base'])
       client.api_key = site.config['discourse_api_key']
       client.api_username = site.config['discourse_api_user']
       topics = client.category_latest_topics('blog')
       topics = topics.select{ |topic| topic['pinned'] == false }
       if (maxtopics > 0 && topics.count > maxtopics)
         topics = topics[0..(maxtopics-1)]
       end
       entries = []
       topics.each { |topic|
         entries.push(client.topic(topic['id']))
       }
       site.data['blog_entries'] = entries
     end
  end
end


require 'discourse_api'

module Discourse
  class BlogEntries < Jekyll::Generator
     def generate(site)
       # Set up config parameters
       maxtopics = site.config['max_blog_entries']
       if maxtopics.nil?
         maxtopics = -1
       end
       maxage = site.config['max_blog_age']
       if maxage.nil?
         maxage = -1
       end

       category = 'blog'

       # Set up Discourse client
       client = DiscourseApi::Client.new(site.config['discourse_base'])
       client.api_key = site.config['discourse_api_key']
       client.api_username = site.config['discourse_api_user']

       #TODO for each category:
       topics = client.category_latest_topics(category)
       topics = topics.select{ |topic| topic['pinned'] == false }
       # If set, restrict the number of topics returned
       if (maxtopics > 0 && topics.count > maxtopics)
         topics = topics[0..(maxtopics-1)]
       end
       # Now retrieve the requested data.
       entries = []
       topics.each { |topic|
         entries.push(client.topic(topic['id']))
       }
       # If set, restict to newer topics.
       if (maxage > 0)
         entries = entries.select{ |entry|
           age = Date.today - Date.parse(entry['created_at'])
           age < maxage
         }
       end
       #TODO for each category, put this away into a variable

       site.data['blog_entries'] = entries
     end
  end
end


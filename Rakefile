require 'aws-sdk-s3'
require 'logger'
require 'mime-types'
require 'yaml'

log = Logger.new(STDOUT)
log.level = Logger::DEBUG

config = YAML.load_file('config.yml')

task :default => :build

task :build do
  Dir.chdir('ysfbc') do
    sh "jekyll build --config \"_config.yml,_secret_config.yml,_current_config.yml\""
  end
end

task :publish => ['build', 'aws:deploy']

namespace :aws do

  desc "Deploy to AWS."
  task :deploy => [:s3]

  desc "Deploy to S3."
  task :s3 do
    # TODO: what about deleting old files?
    access_key_id = config[:aws][:access_key_id]
    secret_access_key = config[:aws][:secret_access_key]
    bucket_name = config[:aws][:s3_deploy_bucket]
    from_folder = 'ysfbc/_site'

    s3 = Aws::S3::Resource.new(
      region: 'eu-west-1',
      credentials: Aws::Credentials.new(access_key_id, secret_access_key)
    )
    bucket = s3.bucket(bucket_name)

    log.info "Deploying files to S3 bucket..."

    Dir.chdir(from_folder) do
      Dir["**/*"].each do |file|
        next if File.directory?(file)
        mime_type = MIME::Types.type_for(file).first
        if ! mime_type.nil?
          mime_type = mime_type.simplified
        end
        data = File.read(file)
        log.debug "Uploading #{file} with Content-Type: #{mime_type}"
        bucket.put_object(key: file, body: data, content_type: mime_type, acl: 'public-read')
      end
    end

    log.info "...done."
  end

end

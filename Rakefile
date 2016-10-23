task :default => :build

task :build do
  Dir.chdir('ysfbc') do
    sh "jekyll build --config \"_config.yml,_secret_config.yml,_current_config.yml\""
  end
end

task :publish => :build do
  Dir.chdir('ysfbc') do
    sh "sudo rsync -v -a -delete _site/ /var/www/ysfbc/"
  end
end

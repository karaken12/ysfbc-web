task :default => :build

task :build do
  Dir.chdir('ysfbc') do
    sh "jekyll build"
  end
end

task :publish => :build do
  Dir.chdir('ysfbc') do
    sh "sudo rsync -v -a -delete _site/ /var/www/ysfbc/"
  end
end

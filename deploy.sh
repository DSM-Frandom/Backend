echo "mysql server shutdown"
mysqladmin -uroot -p shutdown

echo "redis-server stop"
sudo /etc/init.d/redis-server stop

echo "git pull..."
git pull origin main

echo "docker-compose down..."
sudo docker-compose down

echo "docker rmi..."
sudo docker rmi -f backend_app

echo "docker-compose up..."
sudo docker-compose up -d
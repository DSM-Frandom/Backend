echo "git pull..."
git pull origin main

echo "docker-compose down..."
sudo docker-compose down

echo "docker rmi..."
sudo docker rmi -f backend_app

echo "docker-compose up..."
sudo docker-compose up -d


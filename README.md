## An exploration into Angular 18 real-time WebSocket-based UI

### Get the backend working

```shell
docker-compose up -d
cd backend
python3.12 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py loaddata doodads/fixtures/users.json
```

Visit http://127.0.0.1:8000/admin/ in one tab, log in with admin:mellon

In another, open up index.html from the root folder. Observe if new Doodad entries
appear in your table as you add them in the admin panel.

### Get the frontend working

```shell
cd frontend
nvm use 22.1.0
npm install
ng serve
```

Visit http://localhost:4200/
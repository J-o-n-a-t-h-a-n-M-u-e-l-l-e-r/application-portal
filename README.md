# Application Portal

This project was developed as part of my bachelor thesis at the [Big Data Analytics Group](https://bigdata.uni-saarland.de/index.php) under the supervision of [Prof. Dr. Jens Dittrich](https://bigdata.uni-saarland.de/people/dittrich.php), who gave me the original idea for this project.

The goal was to explore the offline capabilities of web apps in the form of a progressive web app (PWA). To achieve this, I
created a simple application portal that allows users to either register as students and apply for a course or as staff members to review and accept these applications. The process
of reviewing, committing, and accepting applications is possible offline and will sync with the server once the user is online again.

![Application Portal](/frontend/public/img/screenshots_mockup.png)

## Structure

According to the thesis, this repository contains all three web applications separated into their own branches:

- *main*: The fully offline-capable application portal
- *network-optimized-pwa*: The network-optimized version of the main PWA used in the experiments, containing all related information in the README of the branch
- *no-pwa*: The version of the application portal without any PWA capabilities used as a baseline in the experiments

## Technologies

Short overview of the main technologies used in this project.

### Frontend

- [Nuxt.js](https://nuxtjs.org/)
- [Vue.js](https://vuejs.org/)
- [Pinia](https://pinia.esm.dev/)
- [Pinia-Plugin-PersistedState](https://prazdevs.github.io/pinia-plugin-persistedstate/)
- [PWA Vite Plugin](https://vite-pwa-org.netlify.app/)
- [shadcn-Vue](https://shadcn-vue.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Workbox](https://developers.google.com/web/tools/workbox)
- [Playwright](https://playwright.dev/)

### Backend

- [Django](https://www.djangoproject.com/)
- [Django REST Framework](https://www.django-rest-framework.org/)
- [Django-Rest-Knox](https://github.com/jazzband/django-rest-knox)

## Setup

### Prequisites

I used the following versions for development, so ensure you have at least these versions installed:

- Node.js - `v20.11.1`
- npm - `v10.2.4`
- Python - `v3.12.4`

### Installation

First, clone the repository.

#### Backend

For setting up the backend, it is recommended to create a virtual environment:

```bash
python -m venv venv
source venv/bin/activate
```

Then install the required packages:

```bash
cd backend/
pip install -r requirements.txt
```

Now you need to create a PostgreSQL database. You can either set up a local database or use a cloud service for this.
Create a `.env` file in the backend directory and add the following environment variables:

```bash
SECRET_KEY=your_secret_key
DEBUG=True
DATABASE_URL=postgres://user:password@localhost:5432/db_name
API_URL=http://localhost:8000
```

Replace the `SECRET_KEY` with a random secret key which you can generate in the Django shell with the following command:

```bash
python manage.py shell
from django.core.management.utils import get_random_secret_key  
get_random_secret_key()
```

Replace the `DATABASE_URL` with your database credentials.

Now you can run the migrations with the following two commands:

```bash
python manage.py makemigrations
python manage.py migrate
```

Create a superuser for the Django admin:

```bash
python manage.py createsuperuser
```

#### Frontend

To set up the frontend, navigate to the `frontend` directory:

```bash
cd frontend
```

Install the required packages:

```bash
npm install
```

Create a `.env` file in the `frontend` directory and add the following environment variables:

```bash
NUXT_ENCRYPTION_KEY="your_encryption_key"
NUXT_API_URL="http://localhost:8000"
NUXT_APP_URL="http://localhost:3000/"
```

Replace the `NUXT_ENCRYPTION_KEY` with a random string containing at least 10 characters.

## Development Server

Start the Django development server on `http://localhost:8000`:

```bash
python manage.py runserver
```

Start the development server on `http://localhost:3000`:

```bash
npm run dev
```

For testing the service worker and full offline capabilities, use the preview command instead of dev:

```bash
npm run build
npm run preview
```

Feel free to explore the application by registering as a student or staff member and checking out the offline capabilities.

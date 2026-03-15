# Wikipedia Knowledge Explorer

Aplicacion web para explorar y buscar articulos de Wikipedia. Backend en FastAPI, frontend en Next.js, base de datos PostgreSQL, cache con Redis y tareas asincronas con Celery.

## Requisitos previos

- [Docker](https://docs.docker.com/get-docker/) y [Docker Compose](https://docs.docker.com/compose/install/) >= 2.x

---

## Instalacion y ejecucion

### 1. Clonar el repositorio

```bash
git clone https://github.com/yoderickmejia/PruebaTecnica
cd wikipedia-knowledge-explorer
```

### 2. Configurar variables de entorno

```bash
cp backend/.env.example backend/.env
```

Editar `backend/.env` con tus valores.

### 3. Levantar los servicios

```bash
docker compose up --build
```

Las siguientes veces basta con:

```bash
docker compose up
```

### 4. Acceder a la aplicacion

| Servicio   | URL                       |
|------------|---------------------------|
| Aplicacion | http://localhost          |
| API        | http://localhost/api/v1   |
| Docs API   | http://localhost/api/docs |

---

## Detener los servicios

```bash
docker compose down
```

Para eliminar tambien los volumenes (borra la base de datos):

```bash
docker compose down -v
```



## Steps to Start coding:
1. Init containers

```bash
docker network create chatty-app
```

```bash
docker-compose -f docker-compose.yml up -d postgres adminer
```

2. Init Database

```bash
npm run database:init
```

3. Start service

```bash
docker-compose -f docker-compose.yml up -d server
```

Then you can run the command below to see how the logging worked:

```bash
docker logs -f chatty-app-server
```

# Note
## Migration

- Generate

```bash
npm run typeorm:generate-migration
```

- Run

```bash
npm run typeorm:run-migrations
```

## Swagger

```bash
docker inspect | grep IPAddress
```
then use the `IPAddress` value and access to the link formated below:

`http://<IPAddressValue>:9669/api`

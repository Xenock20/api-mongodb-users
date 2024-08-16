# API test

## Configuration

You need a `.env` file. Use `.env.dist` as a template.

## Dependencies

You need a MongoDB instance running.

You must install npm packages from package.json.

## Run

Use `start` script from package.json.


## API Reference

#### Route documentation

```http
  GET /api-docs
```


#### Get users

```http
  GET /api/users
```

```http
  GET /api/users?enabled=false&sortBy=-userInformation.name
```

```http
  GET /api/users?enabled=true&sortBy=userInformation.age
```

```http
  GET /api/users?sortBy=email
```

#### New user

```http
  POST /api/users
```

body:

```bash
{
  "color": "string",
  "email": "string",
  "name": "string",
  "lastName": "string",
  "dni": "string",
  "age": "integer"
}
```


#### Disable user

```http
  POST /api/:id/disable
```


| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `string` |Required. ID of the user to disable. |


#### Update user

```http
  PUT /api/users
```

body:

```bash
{
  "color": "string",
  "email": "string",
  "name": "string",
  "lastName": "string",
  "dni": "string",
  "age": "integer"
}
```

```http
  PATCH /api/users
```

body (Not all are required):

```bash
{
  "color": "string",
  "email": "string",
  "name": "string",
  "lastName": "string",
  "dni": "string",
  "age": "integer"
}
```

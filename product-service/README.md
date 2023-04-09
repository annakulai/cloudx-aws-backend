[Mock Data](https://fakestoreapi.com/products)

GET - https://0zd2ie8wva.execute-api.us-east-1.amazonaws.com/dev/products
GET - https://0zd2ie8wva.execute-api.us-east-1.amazonaws.com/dev/products/{productId}
GET - https://0zd2ie8wva.execute-api.us-east-1.amazonaws.com/dev/swagger
GET - https://0zd2ie8wva.execute-api.us-east-1.amazonaws.com/dev/swagger.json

### Dynamodb + Docker

aws dynamodb list-tables --endpoint-url http://localhost:8000 --region us-east-1

aws dynamodb scan --table-name products --endpoint-url http://localhost:8000 --region us-east-1
aws dynamodb scan --table-name stocks --endpoint-url http://localhost:8000 --region us-east-1

aws dynamodb delete-table --table-name products --endpoint-url http://localhost:8000 --region us-east-1
aws dynamodb delete-table --table-name stocks --endpoint-url http://localhost:8000 --region us-east-1

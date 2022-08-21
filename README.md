# chat-app

## How to start the app
```
    cd docker && docker-compose build && docker-compose up
```
This will start the application with 2 reader and 2 writer clients.
You can tweak the amount off clients in `./docker/docket-compose.yaml` by changing the amount of duplicates.

## Architecture
Right now the application is setup as a monolith, this is not optimal for a big amount of users. Currently every client creates one socket connection with the server annd everything goes through this one socket connection. Why one connection per user and not per room? This would lead to multiple connections per user and those socket connections are quite a drain on a server. Further this makes it easier to split the application into smaller services and as such optimise the applcation for a bigger workload.

We can change the architecture so that it is more optimal for a bigger amount of users:
1.  Split the registration and authentication into a seperate server.
1.  Add a load balancer in front of the application which uses sticky sessions and spawn multiple instances that listen on the sockets.
1.  Another way would be split of the listening into a enitity that only passes command onto a message queue and reads command relevant to it self. This will split the responsibilities over as many entities as possible and thus will lower the pressure on the listening entity. persisting of the data will be handeled by specific entities which also read from the message queue. 

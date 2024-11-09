package main

import (
	"context"
	"log"
	connect "server/connection"
	"server/model/todo"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

var collection *mongo.Collection

func main() {
	client := connect.ToMongo()

	collection = client.Database("todoee").Collection("todos")

	r := gin.Default()

	r.Use(cors.Default())

	r.GET("/todos", getTodos)
	r.POST("/todos", addTodo)
	r.DELETE("/todos/:id", deleteTodo)

	r.Run("localhost:9000")

	defer func() {
		if err := client.Disconnect(context.TODO()); err != nil {
			log.Fatalf("Error disconnecting the Mongo client!")
			return
		}
	}()
}

func addTodo(c *gin.Context) {
	var todo todo.Model

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	err := c.BindJSON(&todo)
	if err != nil {
		c.JSON(400, gin.H{"error": "Invalid object data!"})
		return
	}

	todo.ID = primitive.NewObjectID()

	result, err := collection.InsertOne(ctx, todo)
	if err != nil {
		c.JSON(400, gin.H{"error": "Error inserting the object!"})
		return
	}

	c.JSON(201, result)
}

func getTodos(c *gin.Context) {
	var todos []todo.Model

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	cursor, err := collection.Find(ctx, bson.M{})
	if err != nil {
		c.JSON(400, gin.H{"error": "Unable to find data from collection"})
		return
	}

	for cursor.Next(ctx) {
		var todo todo.Model
		if err := cursor.Decode(&todo); err != nil {
			c.JSON(401, gin.H{"error": "Error decoding the todo"})
			return
		}
		todos = append(todos, todo)
	}

	c.JSON(200, todos)
}

func deleteTodo(c *gin.Context) {
	id := c.Param("id")

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	objId, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		c.JSON(400, gin.H{"error": "Invalid Object ID"})
		return
	}

	result, err := collection.DeleteOne(ctx, bson.M{"_id": objId})
	if err != nil {
		c.JSON(404, gin.H{"error": "Item not found"})
		return
	}

	c.JSON(200, result)
}

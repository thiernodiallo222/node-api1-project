const express = require("express")
const database = require("./database.js")

// creates our server instance
const server = express()

server.use(express.json())

server.post("/api/users", (req, res) => {
	
	if ((!req.body.name) || (!req.body.bio)) {
		return res.status(400).json({
			message:"Please provide name and / or  bio for the user!"
		})
	}
	const newUser = database.createUser({
        name: req.body.name,
        bio:req.body.bio
	})
// 201 status code means a resource was successfully created
	res.status(201).json(newUser)
})

server.get("/api/users", (req, res) => {
    const users = database.getUsers();
	res.json(users)
})


server.get("/api/users/:id", (req, res) => {

	const userId = req.params.id
	const user = database.getUserById(userId)
	if (user) {
		res.json(user)
	} else {
		res.status(404).json({
			message: "User not found",
		})
	}
})

server.delete("/api/users/:id", (req, res) => {
	const user = database.getUserById(req.params.id)

	if (user) {
		database.deleteUser(user.id)
		// 204 is just a successful empty response
		res.status(200).json({ message: `${user.name} has been deleted` });
		// res.status(204).end()
	} else {
		res.status(404).json({
			message: "User not found",
		})
	}
})

server.patch("/api/users/:id", (req, res) => {
	const user = database.getUserById(req.params.id)

	// can't update a user that doesn't exist, so make sure it exists first
	if (user) {
		const updatedUser = database.updateUser(user.id, {
			// use a fallback value if no name is specified, so it doesn't empty the field
            name: req.body.name || user.name,
            bio: req.body.bio || user.bio
		})

		res.json(updatedUser)
	} else {
		res.status(404).json({
			message: "User not found",
		})
	}
})



server.listen(3000, () => {
	console.log("server started at port 3000")
})
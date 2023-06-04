import supertest from "supertest";
import { expect } from "chai";
import dotenv from "dotenv";
import { createRandomUser } from "../helpers/timuser_helper";


dotenv.config();


const request = supertest("https://gorest.co.in/public/v2/");
const token = process.env.USER_TOKEN;


describe("/users route", () => {
  let userId = null;

  it("GET /users", async () => {
	const res = await request.get("users");

	expect(res.status).to.equal(200);
	expect(res.body).to.not.be.empty;
  });

  it("GET /users | query parameters", async () => {
	const url = `users?access-token=${token}&gender=male&status=inactive`;
	const res = await request.get(url);
	res.body.forEach((user) => {
  	expect(user.gender).to.eq("male");
  	expect(user.status).to.eq("inactive");
	});
  });

  it("POST /users | skapa ny användare", async () => {
	const data = createRandomUser();
	const res = await request
  	.post("users")
  	.set("Authorization", `Bearer ${token}`)
  	.send(data);
	userId = res.body.id;
    expect(res.status).to.eq(201);
    expect(res.body.id).to.eq(userId);
   
    
  });

  it('GET /users/: id | hämta användaren vi nyss skapade', async () => {
	const res = await request.get(`users/${userId}?access-token=${token}`);
    expect(res.body.id).to.eq(userId);
   });

  it("PUT /users/:id | byt användaren", async () => {
	const data = { name: "User updated" };

	const res = await request
  	.put(`users/${userId}`)
  	.set("Authorization", `Bearer ${token}`)
  	.send(data);
    expect(res.body.name).to.eq('User updated');
    expect(res.body).to.include(data);
	
  });

it("DELETE /users/:id | användare vi nyss skapade", async () => {
	const res = await request
  	.delete(`users/${userId}`)
  	.set("Authorization", `Bearer ${token}`);
	
  });

it("DELETE /users/:id (Negative)", async () => {
	const res = await request
  	.delete(`users/${userId}`)
  	.set("Authorization", `Bearer ${token}`);
    expect(res.body.message).to.eq("Resource not found");
	
  });

it("GET /users/:id (Negative)", async () => {
	const res = await request.get(`users/${userId}`);
	expect(res.body.message).to.eq("Resource not found");
  });


  

  
    });

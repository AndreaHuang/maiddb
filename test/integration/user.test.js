const request = require("supertest");
const mongoose = require("mongoose");
const { User } = require("../../model/user");
const { TestScheduler } = require("jest");
describe("/api/user", () => {
  let server;

  beforeEach(() => {
    server = require("../../index");
  });
  afterEach(async () => {
    await server.close();
  });
  describe("GET /api/user/me", () => {});
  describe("POST", () => {
    let requestBody;
    beforeEach(() => {
      requestBody = {
        name: "User Name",
        email: "test@test.com",
        password: "P@ssw0rd",
      };
    });
    afterEach(async () => {
      await User.remove();
    });

    const exec = async () => {
      return await request(server).post("/api/users").send(requestBody);
    };
    it("should return status 200 and _id if input is valid", async () => {
      const res = await exec();
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("_id");
    });
    it("should return status 400 if email is not passed", async () => {
      requestBody.email = undefined;
      const res = await exec();
      expect(res.status).toBe(400);
      expect(res.body.errorCode).toBe("BERR001");
      expect(res.body.message).toContain("email");
    });
    it("should return status 400 if email is invalid", async () => {
      requestBody.email = "notAEmail";
      const res = await exec();
      expect(res.status).toBe(400);
      expect(res.body.errorCode).toBe("BERR001");
      expect(res.body.message).toContain("email");
    });
    it("should return status 400 if password is not passed", async () => {
      requestBody.password = undefined;
      const res = await exec();
      expect(res.status).toBe(400);
      expect(res.body.errorCode).toBe("BERR001");
      expect(res.body.message).toContain("password");
    });
    it("should return status 400 if password doesn't meet complexity", async () => {
      requestBody.password = "1234";
      const res = await exec();
      expect(res.status).toBe(400);
      expect(res.body.errorCode).toBe("BERR001");
      expect(res.body.message).toContain("password");
    });
    it("should return status 400 if name is not passed", async () => {
      requestBody.name = undefined;
      const res = await exec();
      expect(res.status).toBe(400);
      expect(res.body.errorCode).toBe("BERR001");
      expect(res.body.message).toContain("name");
    });
    it("should return status 400 if name is too short", async () => {
      requestBody.name = "a";
      const res = await exec();
      expect(res.status).toBe(400);
      expect(res.body.errorCode).toBe("BERR001");
      expect(res.body.message).toContain("name");
    });
    it("should return status 400 if name is duplicated", async () => {
      await exec();
      requestBody.email = "anotheremail@test.com";
      const res = await exec();
      expect(res.status).toBe(400);
      expect(res.body.errorCode).toBe("BERR003");
      expect(res.body.message).toContain("name");
    });
    it("should return status 400  if email is duplicated", async () => {
      await exec();
      requestBody.name = "anotherName";
      const res = await exec();

      expect(res.status).toBe(400);
      expect(res.body.errorCode).toBe("BERR002");
      expect(res.body.message).toContain("email");
    });
    // it("should return user if input is valid", async () => {
    //   const res = await exec();
    //   expect(res.body).toContain("name");
    // });
  });
  // describe("GET", () => {
  // beforeAll
  //GET /api/cases?maidname=xx&agent=yy&&page=zz&limit=aa
  //GET /api/cases?maidname=xx&agent=yy&&all
  //Return first 20 (default limit) records (sort by date desc) and metadata if no query parameter is passed
  //Return first aa records (sort by date desc) and metadata if only limit=aa is passed
  //Return correct pagingation (sort by date desc) without metadata if both page and limit are passed
  //Return all search result if query parameter all is passed
  //   });
});

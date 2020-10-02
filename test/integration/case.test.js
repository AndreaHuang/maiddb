const request = require("supertest");
const mongoose = require("mongoose");
const { Case } = require("../../model/case");
const { User } = require("../../model/user");
const constants = require("../../config/constants");

describe("/api/cases", () => {
  let server;
  let token;
  beforeEach(() => {
    server = require("../../index");
    token = new User().generateAuthToken();
  });
  afterEach(async () => {
    await server.close();
  });

  describe("POST", () => {
    let requestBody;

    beforeEach(() => {
      requestBody = {
        maid: {
          name: "Maid Name",
          nationality: "ID",
          yearOfBirth: 2002,
          monthOfBirth: 12,
        },
        categories: ["Bad to kids"],
        details: "a long description that is at least 30 characters",
        reference: {
          source: "Facebook",
          link: "https://alink",
          postDate: "2019-09",
        },
      };
    });

    const exec = async () => {
      return await request(server)
        .post("/api/cases")
        .set(constants.HEADER_AUTH_TOKEN, token)
        .send(Object.assign({}, requestBody));
    };
    it("should return 401 if user is not authenticated", async () => {
      token = "";
      const res = await exec();
      expect(res.status).toBe(401);
    });
    it("should return 400 if maid.name is not passed", async () => {
      requestBody.maid.name = undefined;
      const res = await exec();
      console.log(res.body);
      expect(res.status).toBe(400);
      expect(res.body.errorCode).toBe("BERR001");
      expect(res.body.message).toContain("maid.name");
    });
    it("should return 400 if maid is too young", async () => {
      requestBody.maid.yearOfBirth = 2020;
      const res = await exec();
      // console.log(res.body);
      expect(res.status).toBe(400);
      expect(res.body.errorCode).toBe("BERR001");
      expect(res.body.message).toContain("maid.yearOfBirth");
    });
    it("should return 400 if maid is too old", async () => {
      requestBody.maid.yearOfBirth = 1950;
      const res = await exec();
      expect(res.status).toBe(400);
      expect(res.body.errorCode).toBe("BERR001");
      expect(res.body.message).toContain("maid.yearOfBirth");
    });
    it("should return 400 if maid monthOfBirth is invalid", async () => {
      requestBody.maid.monthOfBirth = 13;
      const res = await exec();
      expect(res.status).toBe(400);
      expect(res.body.errorCode).toBe("BERR001");
      expect(res.body.message).toContain("maid.monthOfBirth");
    });
    it("should return 400 if details is not passed", async () => {
      requestBody.details = undefined;
      const res = await exec();
      // console.log(res.body);
      expect(res.status).toBe(400);
      expect(res.body.errorCode).toBe("BERR001");
      expect(res.body.message).toContain("details");
    });
    it("should return 400 if details is too short", async () => {
      requestBody.details = "a";
      const res = await exec();
      // console.log(res.body);
      expect(res.status).toBe(400);
      expect(res.body.errorCode).toBe("BERR001");
      expect(res.body.message).toContain("details");
    });
    it("should return 400 if details is too long", async () => {
      requestBody.details = new Array(200).join(
        "a super super long description"
      );
      const res = await exec();
      // console.log(res.body);
      expect(res.status).toBe(400);
      expect(res.body.errorCode).toBe("BERR001");
      expect(res.body.message).toContain("details");
    });
    it("should return 400 if categories is empty", async () => {
      requestBody.categories = [];
      const res = await exec();
      // console.log(res.body);
      expect(res.status).toBe(400);
      expect(res.body.errorCode).toBe("BERR001");
      expect(res.body.message).toContain("categories");
    });
    it("should return 400 if externalSource.postDate is not valid date string", async () => {
      requestBody.externalSource.postDate = "";
      let res = await exec();
      expect(res.status).toBe(400);
      expect(res.body.errorCode).toBe("BERR001");
      expect(res.body.message).toContain("externalSource.postDate");

      requestBody.externalSource.postDate = "abc";
      res = await exec();
      expect(res.status).toBe(400);
      expect(res.body.errorCode).toBe("BERR001");
      expect(res.body.message).toContain("externalSource.postDate");
    });
    it("should return 400 if externalSource.source is not set", async () => {
      requestBody.externalSource.source = undefined;
      const res = await exec();
      expect(res.status).toBe(400);
      expect(res.body.errorCode).toBe("BERR001");
      expect(res.body.message).toContain("externalSource.source");
    });
    it("should return 200 if externalSource is not set", async () => {
      requestBody.externalSource = undefined;
      const res = await exec();
      expect(res.status).toBe(200);
    });

    it("should return 200 if input is valid", async () => {
      const res = await exec();
      expect(res.status).toBe(200);
    });
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

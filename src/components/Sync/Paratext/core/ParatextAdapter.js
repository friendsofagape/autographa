import axios from "axios";
import xml2js from "xml2js";
const ENDPOINT = "https://data-access.paratext.org";
axios.defaults.withCredentials = false;
export default class Paratext {
  /**
   *
   * @param {username} username
   * @param {password} password
   */
  constructor(username, password) {
    this.username = username;
    this.password = password;
    this.setToken(this.getToken());
  }

  setToken(token) {
    this.accessToken = token;
  }

  /**
   * Get a user name with authentication token.
   * @return {token} Token from the paratext API
   */

  async getToken() {
    let paraTextReqBody = {
      username: this.username,
      password: this.password,
      grant_type: "password",
      scope: "projects:read projects.members:read  data_access",
    };
    let config = {
      headers: {
        Authorization: `Bearer ${process.env.REACT_APP_PARATEXT_TOKEN}`,
        "Content-Type": "application/json",
        "Access-Control-Expose-Headers": "Access-Control-*",
        "Access-Control-Allow-Origin": "http://localhost:3000",
      },
    };
    let token = "";
    token = await axios
      .post("https://registry.paratext.org/api8/token", paraTextReqBody, config)
      .then((res) => {
        return res.data.access_token;
      })
      .catch((err) => {
        return "";
      });
    return token;
  }
  /**
   * Lists the logged-in user's projects.
   * @param url the user who's projects will be listed. Requires token or username and password
   * @returns {Promise<array>} an array of projects objects
   */
  async getProjects(attempt = 1) {
    let token = await this.accessToken;
    let _this = this;
    let config = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Access-Control-Expose-Headers": "Access-Control-*",
        "Access-Control-Allow-Origin": "http://localhost:3000",
      },
    };
    let response = await axios
      .get(`${ENDPOINT}/api8/projects`, config)
      .then((res) => {
        return res;
      })
      .catch((err) => {
        if (
          err.response.data &&
          err.response.data.includes("Invalid authorization token")
        ) {
          if (attempt === 3) throw err;
          _this.getToken();
          return _this.getProjects(attempt + 1);
        }
      });
    let projects = [];
    if (response && response.status === 200) {
      new xml2js.Parser().parseString(response.data, (err, result) => {
        projects = result.repos.repo;
      });
    } else {
      throw new Error("Something went wrong");
    }
    return projects;
  }
  async getBooksList(projectId, attempt = 1) {
    let token = await this.accessToken;
    let config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    let books = [];
    let response = await axios
      .get(`${ENDPOINT}/api8/books/${projectId}`, config)
      .then((res) => {
        return res;
      })
      .catch((err) => {
        if (
          err.response.data &&
          err.response.data.includes("Invalid authorization token")
        ) {
          if (attempt === 3) throw err;
          this.getToken();
          return this.getBooksList(projectId, attempt + 1);
        }
        return { status: 400 };
      });
    if (response && response.status === 200) {
      new xml2js.Parser().parseString(response.data, (err, result) => {
        books = result.ProjectBooks.Book.map((res, i) => {
          return res.$;
        });
      });
      return books;
    } else {
      throw new Error("Something went wrong");
    }
  }

  //importing
  async getUsxBookData(projectId, bookId, attempt = 1) {
    let token = await this.accessToken;
    let config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    return await axios
      .get(`${ENDPOINT}/api8/text/${projectId}/${bookId}`, config)
      .then((res) => {
        return res.data;
      })
      .catch((err) => {
        if (
          err.response.data &&
          err.response.data.includes("Invalid authorization token")
        ) {
          if (attempt === 3) throw err;
          this.getToken();
          return this.getUsxBookData(projectId, bookId, attempt + 1);
        }
        throw new Error("Fetch bookdata issue");
      });
  }
  //Revision
  async getBookRevision(projectId, bookId, attempt = 1) {
    let token = await this.accessToken;
    let config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    return await axios
      .get(`${ENDPOINT}/api8/revisions/${projectId}/${bookId}`, config)
      .then((res) => {
        return res.data;
      })
      .catch((err) => {
        if (
          err.response.data &&
          err.response.data.includes("Invalid authorization token")
        ) {
          if (attempt === 3) throw err;
          this.getToken();
          return this.getBookRevision(projectId, bookId, attempt + 1);
        }
        throw new Error("Fetch bookdata issue");
      });
  }

  //exporting to paratext
  async updateBookData(projectId, bookId, revision, bookXmldoc, attempt = 1) {
    //convert in usx
    //send to the paratext API
    let token = await this.accessToken;
    let config = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    };
    return await axios
      .post(
        `${ENDPOINT}/api8/text/${projectId}/${revision}/${bookId}`,
        bookXmldoc,
        config
      )
      .then((res) => {
        return res.data;
      })
      .catch((err) => {
        if (
          err.response.data &&
          err.response.data.includes("Invalid authorization token")
        ) {
          if (attempt === 3) throw err;
          this.getToken();
          return this.updateBookData(
            projectId,
            bookId,
            revision,
            bookXmldoc,
            attempt + 1
          );
        }
        throw new Error("upload bookdata issue");
      });
  }
}

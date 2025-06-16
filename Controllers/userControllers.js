import { request, response } from "express";
import { client } from "../DB/db.js";
import { generateAccessToken } from "../helpers/generateToken.js";

export const getUsers = async (req = request, res = response) => {
  try {
    const sql = `SELECT * FROM users`;

    const querySQL = await client.query(sql);

    res.status(200).json({ status: "Ok", data: querySQL.rows });
  } catch (err) {
    res.status(500).json({
      status: "Failed",
      error: err.message,
    });
  }
};

export const login = async (req = request, res = response) => {
  try {
    const { userName, password } = req.body;
    console.log(userName, password);
    const sql = `SELECT * FROM "users" WHERE "userName" = $1 AND "password" = $2`;
    const results = await client.query(sql, [userName, password]);

    if (results.rows.length == 0) {
      // the DB always return an array, if this arrays has length <= 0, that means such user doesn't exists in DB
      throw new Error("this user does not exist in the DB");
    }

    const user = results.rows[0].userName;
    const userId = results.rows[0].userId;
    const role = results.rows[0].role;

    const token = generateAccessToken(userId, role);

    res.cookie("jwt", token, { httpOnly: true, secure: true });
    res.status(200).json({
      status: "user logged in",
      data: { isAdmin: role },
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      status: "FAILED",
      error: err.message,
    });
  }
};

export const createUser = async (req = request, res = reponse) => {
  try {
    const { userName, password, role } = req.body;
    // INSERT the new user.
    const sql = `INSERT INTO "users"("userName","password","role") VALUES ($1,$2,$3)`;
    const results = await client.query(sql, [userName, password, role]);

    // if everthing goes well. res.status(201)

    res.status(201).json({
      status: "Created",
    });
  } catch (err) {
    res.status(400).json({
      status: "FAILED",
      error: err.message,
    });
  }
};

export const editUser = async (req = request, res = response) => {
  try {
    const { userId, userName, password } = req.body;

    // patch name query
    const sql =
      "UPDATE users SET userName = $1, password = $2 WHERE userId = $3 RETURNING userName";
    const query = await client.query(sql, [userName, password, userId]);
    console.log(query.rows);

    res.status(200).json({
      status: "OK",
      data: "Modifed",
      new_name: query.rows[0].userName,
    });
  } catch (error) {
    // if something goes wrong it will catch and show Error
    res.status(400).json({
      status: "FAILED",
      error: error.message,
    });
  }
};

export const deleteUser = async (req = request, res = response) => {
  try {
    const { userId } = req.body;
    // Query to delete
    const query = "DELETE  FROM  users  WHERE userId  = $1";
    await client.query(query, [userId]);

    res.status(200).json({ status: "OK", data: "Deleted" });
  } catch (err) {
    res.status(500).json({
      status: "Failed server",
      data: err.message,
    });
  }
};

export const logOut = async (req = request, res = response) => {
  try {
    res.clearCookie("jwt");
    res.status(200).json({ msg: "User logged out successfully" });
  } catch (error) {
    res.status(500).json({
      status: "Failed",
      data: err.message,
    });
  }
};

export const online = async (req = request, res = response) => {
  res.status(200).json({ status: "OK", message: "SERVER ONLINE" });
};
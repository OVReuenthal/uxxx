import express from "express";
import {
  createUser,
  deleteUser,
  getUsers,
  login,
  editUser,
  logOut,
  online
} from "../Controllers/userControllers.js";
import { validateFields } from "../middlewares/validateFields.js";
import { check } from "express-validator";
import { validateUser } from "../middlewares/validateData.js";
import { authenticateToken } from "../middlewares/authenticateToken.js";

const userRouter = express.Router();

userRouter.post(
  "/user/login",
  [
    check("name_user", "error name").notEmpty().isLength({ max: 20 }), // this "check" are middlewares
    check("password", "error password").notEmpty().isLength({ max: 20 }),
    validateFields,
  ],
  login
);

userRouter.post(
  "/user/create",
  [
    check("name_user", "error name").notEmpty().isLength({ max: 20 }),
    check("password", "error password").notEmpty().isLength({ max: 20 }),
    check("rol", "error rol").isBoolean().notEmpty(),
    validateFields,
  ],
  createUser
);

userRouter.patch(
  "/user/edit",
  [
    check("id_user", "user error").notEmpty().custom(validateUser),
    check("name_user", "error name").notEmpty().isLength({ max: 20 }),
    validateFields,
  ],
  editUser
);

userRouter.delete(
  "/user/delete",
  [
    check("id_user", "user error").notEmpty().custom(validateUser),
    validateFields,
  ],

  deleteUser
);

userRouter.get("/users", [validateFields, authenticateToken], getUsers);

userRouter.get("/online", online);

userRouter.post("/logout", logOut);
export { userRouter };

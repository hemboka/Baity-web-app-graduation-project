import mongoose from "mongoose";

export function dbConnection() {
  mongoose
    .connect(`${process.env.DB_CONNECTION}`)
    .then(() => {
      console.log("database connected");
    })
    .catch((err) => {
      console.log("ERROR IN DATABASE ", err);
    });
}

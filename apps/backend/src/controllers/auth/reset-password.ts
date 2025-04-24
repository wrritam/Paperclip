import express from "express";
import prisma from "../../db/db.config";
import bcrypt from "bcryptjs";

export const resetPassword = async (
  req: express.Request,
  res: express.Response
) => {
  const { password, email } = req.body;
  const hashedPassword: string = await new Promise((resolve, reject) => {
    bcrypt.hash(password, 7, (err, hash) => {
      if (err) reject(err);
      else resolve(hash as string);
    });
  });
  if (hashedPassword) {
    await prisma.user.update({
      where: { email: email },
      data: {
        password: hashedPassword,
        updatedAt: new Date().toISOString(),
      },
    });
    res.json({ message: "Password updated successfully" });
  } else {
    res.json({ message: "Could not update password" });
  }
};

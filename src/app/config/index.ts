import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

interface Config {
  nodeEnv: string;
  port: number;
  database: {
    url: string;
  };
  jwt: {
    accessSecret: any;
    refreshSecret: any;
    accessExpiresIn: any;
    refreshExpiresIn: any;
  };
}

const config: Config = {
  nodeEnv: process.env.NODE_ENV || "development",

  port: Number(process.env.PORT) || 5000,

  database: {
    url: process.env.DATABASE_URL || "",
  },

  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET || "",
    refreshSecret: process.env.JWT_REFRESH_SECRET || "",
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || "15m",
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "30d",
  },
};

export default config;

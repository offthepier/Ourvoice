import createDynamoDBClient from "../../config/db";
import AdminService from "./admin.service";
const ADMIN_TABLE = process.env.ADMIN_TABLE || "admin";

const adminService = new AdminService(createDynamoDBClient(), ADMIN_TABLE);

export default adminService;

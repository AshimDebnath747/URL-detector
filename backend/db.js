import { neon } from "@neondatabase/serverless";
const sql = neon('postgresql://neondb_owner:npg_K7itJzbdjB9k@ep-orange-heart-ahl4t2w3-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require');
export default sql;
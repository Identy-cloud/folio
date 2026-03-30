import postgres from "postgres";

const sql = postgres(process.env.DATABASE_URL!);

async function check() {
  const users = await sql`SELECT id, email, plan FROM users`;
  console.log("USERS:");
  users.forEach((u) => console.log(`  ${u.email} → plan: ${u.plan} (${u.id.slice(0, 8)})`));

  const subs = await sql`SELECT user_id, plan, status FROM subscriptions`;
  console.log("\nSUBSCRIPTIONS:");
  subs.forEach((s) => console.log(`  ${s.user_id.slice(0, 8)} → plan: ${s.plan}, status: ${s.status}`));

  const pres = await sql`SELECT user_id, COUNT(*) as count FROM presentations GROUP BY user_id`;
  console.log("\nPRESENTATIONS:");
  pres.forEach((p) => console.log(`  ${p.user_id.slice(0, 8)} → ${p.count} presentations`));

  await sql.end();
}

check().catch(console.error);

import { prisma } from "./app/lib/prisma";

async function main() {
    try {
        console.log("Checking Post table...");
        const count = await prisma.post.count();
        console.log("Post count:", count);
        console.log("Database connection successful.");
    } catch (e) {
        console.error("Error connecting to database:", e);
    } finally {
        await prisma.$disconnect();
    }
}

main();

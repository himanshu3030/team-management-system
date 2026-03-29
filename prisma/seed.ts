import { hashPassword } from "@/app/lib/auth";
import prisma from "@/app/lib/db"
// import { Role } from "@/app/types"
import { Role } from "@/app/generated/prisma/enums";

async function main() {
    console.log("🚀 Starting database seeding...");

    // 1. Clear existing data to avoid unique constraint errors
    // (Optional, but very helpful for repeated testing)

    // 2. Create Teams (Fixed Promise.all with an array [])
    const teams = await Promise.all([
        prisma.team.create({
            data: {
                name: "Engineering",
                description: "Software development team",
                code: "ENG-2024"
            },
        }),
        prisma.team.create({
            data: {
                name: "Marketing",
                description: "Marketing and sales team",
                code: "MKT-2024"
            },
        }),
        prisma.team.create({
            data: {
                name: "Operations",
                description: "Business and Operations team",
                code: "OPS-2024"
            },
        }),
    ]);

    const sampleUsers = [
        {
            name: "John Developer",
            email: "john@company.com",
            team: teams[0],
            role: Role.MANAGER
        },
        {
            name: "Jane Designer",
            email: "jane@company.com",
            team: teams[0],
            role: Role.USER
        },
        {
            name: "Bob Marketer",
            email: "bob@company.com",
            team: teams[1],
            role: Role.MANAGER
        },
        {
            name: "Alice Sales",
            email: "alice@company.com",
            team: teams[1],
            role: Role.USER
        },
    ];

    // 3. Create Users
    for (const userData of sampleUsers) {
        const passwordHash = await hashPassword("12345");
        console.log(`***********************${passwordHash}******************************`)
        
        await prisma.user.create({
            data: {
                email: userData.email,
                name: userData.name,
                password: passwordHash,
                role: userData.role,
                teamId: userData.team.id, // Linking via the created team's ID
            },
        });
    }

    console.log("✅ Database seeded successfully!");
}

main()
    .catch((error) => {
        console.error("❌ Seeding failed:", error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
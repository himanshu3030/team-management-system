import { Prisma } from "@/app/generated/prisma/client";
import { getCurrentUser } from "@/app/lib/auth";
import prisma from "@/app/lib/db";
import { Role } from "@/app/types";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json(
                {
                    error: "you are not authorized to access the user information"
                },
                {
                    status: 401
                }
            )
        }

        const searchParams = request.nextUrl.searchParams;
        const teamId = searchParams.get("teamId");
        const role = searchParams.get("role") as Role;

        const where: Prisma.UserWhereInput = {};

        if (user.role === Role.ADMIN) {
            // Admin can see all users
        } else if (user.role === Role.MANAGER) {
            // Manager can see users in their team users but not cross managers
            where.OR = [{ teamId: user.teamId }, { role: Role.USER }]
        } else {
            // Regular users can only see in their team
            where.teamId = user.teamId,
                where.role = { not: Role.ADMIN };
        }

        if (teamId) {
            where.teamId = teamId;
        }
        if (role) {
            where.role = role;
        }

        const users = await prisma.user.findMany({
            where,
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                team: {
                    select: {
                        id: true,
                        name: true
                    }
                },
                createdAt: true,
            },
            orderBy: { createdAt: "desc"},
        })

        return NextResponse.json({users})

    } catch (error) {
        console.error("Get users error: ", error)
        return NextResponse.json({
            error: "Internal server error"
        },{status: 500})

    }
}
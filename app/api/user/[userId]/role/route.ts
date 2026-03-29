import { checkUserPermission, getCurrentUser } from "@/app/lib/auth";
import prisma from "@/app/lib/db";
import { Role } from "@/app/types";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
    request: NextRequest,
    context: { params: Promise<{ userId: string }> }
) {

    try {
        const { userId } = await context.params;

        const currentUser = await getCurrentUser();
        if (!currentUser || !checkUserPermission(currentUser, Role.ADMIN)) {
            return NextResponse.json(
                {
                    error: "You are not authorize to assign team"
                },
                {
                    status: 401
                }
            )
        }

        // prevent users from changing there own role
        if (userId === currentUser.id) {
            return NextResponse.json(
                {
                    error: "You cannot change your own role"
                },
                {
                    status: 401
                }
            )
        }

        const { role } = await request.json();

        const validateRoles = [Role.USER, Role.MANAGER]

        if (!validateRoles.includes(role)) {
            return NextResponse.json({
                error: "You cannot have more than one Admin role user"
            },
                { status: 404 })
        }



        const updateUser = await prisma.user.update({
            where: {
                id: userId
            },
            data: {
                role
            },
            include: {
                team: true
            }
        })

        return NextResponse.json({
            user: updateUser,
            message: `User role updated to ${role} successfully`
        })

    } catch (error) {
        console.error("Role assignment Error : ", error)
        if (error instanceof Error && error.message.includes("Record to update not found")) {
            return NextResponse.json({
                error: "User not found"
            }, { status: 404 })
        }

        return NextResponse.json({
            error: "Internal server error something went weong"
        }, { status: 500 })
    }

}
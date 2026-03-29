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

        const user = await getCurrentUser();
        if (!user || !checkUserPermission(user, Role.ADMIN)) {
            return NextResponse.json(
                {
                    error: "You are not authorize to assign team"
                },
                {
                    status: 401
                }
            )
        }

        const { teamId } = await request.json();

        if (teamId) {
            const team = await prisma.team.findUnique({
                where: {
                    id: teamId
                }
            })

            if (!team) {
                return NextResponse.json({
                    error: "Team not found"
                },
                    { status: 404 })
            }

        }

        const updateUser = await prisma.user.update({
            where: {
                id: userId
            },
            data: {
                teamId: teamId
            },
            include: {
                team: true
            }
        })

        return NextResponse.json({
            user: updateUser,
            teamId: teamId ? "User assigned to a team successfully" : "User removed from a team successfully"
        })

    } catch (error) {
          console.error("Team assignment Error : ", error)
          if(error instanceof Error && error.message.includes("Record to update not found")){
            return NextResponse.json({
                error: "User not found"
            },{status: 404})
          }

          return NextResponse.json({
                error: "Internal server error something went weong"
            },{status: 500})
    }

}
import { generateToken, hashPassword } from "@/app/lib/auth";
import prisma from "@/app/lib/db";
import { Role } from "@/app/types";
import { error } from "console";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {

    try {

        const { name, email, password, teamCode } = await request.json();

        if (!name || !email || !password) {
            return NextResponse.json(
                {
                    error: "Name, email & password are required or invalid"
                },
                { status: 400 }
            );
        }

        const existingUser = await prisma.user.findUnique({
            where: {
                email: email
            }
        })

        if (existingUser) {
            return NextResponse.json({
                error: "user with this email is already exists"
            },
                { status: 409 })
        }

        let teamId : string | undefined;
        if (teamCode) {
            const team = await prisma.team.findUnique({
                where: {
                    code: teamCode
                }
            })

            if (!team) {
                return NextResponse.json({
                    error: "please enter a valid team code"
                },
                    { status: 400 })
            }
            teamId = team.id 
        }

        const hashedPassword = await hashPassword(password)

        const userCount = await prisma.user.count();
        const role = userCount === 0? Role.ADMIN : Role.USER;

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role,
                teamId
            },
            include: {
                team: true,
            }
        })

        const token = generateToken(user.id)

        const response = NextResponse.json({
            user:{
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                teamId: user.teamId,
                team: user.team,
                token,
            }
        })

        response.cookies.set("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV ==="production",
            sameSite: "lax",
            maxAge: 60*60*24*7
        });

        return response;

    } catch (error) {
        console.error("Registration failed")
        return NextResponse.json({
            error: "Internal server error something went wrong",
        },{status: 500})
    }

}
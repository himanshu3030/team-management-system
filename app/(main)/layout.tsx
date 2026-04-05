import { ReactNode } from "react"
import { Header } from "../components/Header"
import { apiClient } from "../lib/apiClient"
import { getCurrentUser } from "../lib/auth"

export default async function MainLayout({children}: {children: ReactNode}) {
    const user = await getCurrentUser();
    return<>
    <Header user={user ?? null}/>
    <main className="container mx-auto px-4 py-8">{children}</main>
    </>
}
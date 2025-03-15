import React from 'react'
import {Button} from "@/components/ui/button"
import Link from "next/link";
import {ArrowBigLeft} from "lucide-react";

const NotFound = () => {
    return (
        <div className="flex h-screen flex-col items-center justify-center bg-background p-4">
            <h1 className="text-6xl font-bold text-foreground mb-4">404</h1>
            <p className="text-lg text-muted-foreground mb-6">
                The page you were looking for is not found.
            </p>
            <Button> <ArrowBigLeft/><Link href={`/`}>Back to Homepage</Link></Button>
        </div>
    )
}

export default NotFound

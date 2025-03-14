"use client";
import { useEffect, useState } from "react";
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

const ConsentPopup = () => {
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const hasAcknowledged = localStorage.getItem("radiatorforge-info-acknowledged");
        if (!hasAcknowledged) setOpen(true);
    }, []);

    const handleAcknowledge = () => {
        localStorage.setItem("radiatorforge-info-acknowledged", "true");
        setOpen(false);
    };

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Disclaimer</AlertDialogTitle>
                    <AlertDialogDescription>
                        This project is inspired by Behance. I do not claim ownership of the design or the projects shown here. All visible projects are used with the creators' consent.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogAction onClick={handleAcknowledge}>
                        Acknowledge
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default ConsentPopup;

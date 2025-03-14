"use client";
import {useEffect, useState} from "react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from "@/components/ui/alert-dialog";
import {cn} from "@/lib/utils";

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
            <AlertDialogContent className={cn(`!bg-background !text-foreground`)}>
                <AlertDialogHeader>
                    <AlertDialogTitle>Disclaimer</AlertDialogTitle>
                    <AlertDialogDescription className={`text-base font-medium`}>
                        <p>
                            This portfolio site is a personal project developed to demonstrate my technical skills and
                            abilities. The design draws inspiration from Behance. All featured
                            projects are displayed with explicit permission from their creators.
                        </p>

                        <p className={`mt-4`}>This site is not affiliated with or endorsed by Behance. It serves solely
                            as a showcase of my
                            development capabilities and is not intended for commercial use.</p>
                        <p>For questions or concerns, contact me <a href="https://suniljangir.site" target={"_blank"}
                                                                    className={`text-blue-700 underline text-lg`}>here</a>.
                        </p>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogAction
                        onClick={handleAcknowledge}>
                        Acknowledge
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default ConsentPopup;

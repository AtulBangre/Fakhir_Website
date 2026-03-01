'use client';

import { useState, useEffect } from "react";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";

const CountdownTimer = ({ startDate, hours = 2, status }) => {
    const [timeLeft, setTimeLeft] = useState("");
    const [isOverdue, setIsOverdue] = useState(false);

    useEffect(() => {
        if (status === 'completed' || status === 'cancelled' || status === 'expired') {
            setTimeLeft(status?.toUpperCase() || "");
            return;
        }

        if (!startDate) return;

        const target = new Date(startDate).getTime() + (hours * 60 * 60 * 1000);

        const updateTimer = () => {
            const now = new Date().getTime();
            const diff = target - now;

            if (diff <= 0) {
                setTimeLeft("OVERDUE");
                setIsOverdue(true);
                return;
            }

            const h = Math.floor(diff / (1000 * 60 * 60));
            const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const s = Math.floor((diff % (1000 * 60)) / 1000);

            setTimeLeft(`${h}h ${m}m ${s}s`);
        };

        updateTimer();
        const interval = setInterval(updateTimer, 1000);
        return () => clearInterval(interval);
    }, [startDate, hours, status]);

    if (status === 'completed' || status === 'cancelled' || status === 'expired') {
        return <span className="text-[10px] font-bold text-muted-foreground">{timeLeft}</span>;
    }

    return (
        <div className={cn(
            "flex items-center gap-1.5 px-2 py-1 rounded-md text-[10px] font-bold font-mono",
            isOverdue ? "bg-red-100 text-red-600 animate-pulse" : "bg-amber-100 text-amber-600"
        )}>
            <Clock className="h-3 w-3" />
            {timeLeft}
        </div>
    );
};

export default CountdownTimer;

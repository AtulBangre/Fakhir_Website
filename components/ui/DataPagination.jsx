"use client";

import React from "react";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";

import { cn } from "@/lib/utils";

const DataPagination = ({ currentPage, totalPages, onPageChange }) => {
    if (totalPages <= 1) return null;

    return (
        <div className="mt-auto flex flex-col md:flex-row items-center justify-between gap-4 pt-4 border-t w-full">
            <p className="text-sm text-muted-foreground font-medium bg-muted/50 px-4 py-2 rounded-full border">
                Showing page <span className="text-foreground font-bold">{currentPage}</span> of <span className="text-foreground font-bold">{totalPages}</span>
            </p>
            <Pagination className="mx-0 w-auto">
                <PaginationContent className="bg-card border rounded-full p-1 shadow-sm flex items-center gap-1">
                    <PaginationItem>
                        <PaginationPrevious
                            className={cn(
                                "px-3 h-9 rounded-full hover:bg-muted hover:text-foreground transition-all duration-200 border-none font-medium text-sm",
                                currentPage === 1 ? "opacity-40 pointer-events-none" : "cursor-pointer"
                            )}
                            onClick={(e) => {
                                e.preventDefault();
                                if (currentPage > 1) onPageChange(currentPage - 1);
                            }}
                        />
                    </PaginationItem>

                    <div className="flex items-center gap-1 mx-1">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                            if (
                                totalPages <= 5 ||
                                page === 1 ||
                                page === totalPages ||
                                (page >= currentPage - 1 && page <= currentPage + 1)
                            ) {
                                return (
                                    <PaginationItem key={page}>
                                        <PaginationLink
                                            href="#"
                                            isActive={page === currentPage}
                                            className={cn(
                                                "w-9 h-9 font-medium text-sm rounded-full transition-all duration-200",
                                                page === currentPage
                                                    ? "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90"
                                                    : "hover:bg-muted hover:text-foreground border-none"
                                            )}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                onPageChange(page);
                                            }}
                                        >
                                            {page}
                                        </PaginationLink>
                                    </PaginationItem>
                                );
                            } else if (
                                (page === currentPage - 2 && currentPage > 3) ||
                                (page === currentPage + 2 && currentPage < totalPages - 2)
                            ) {
                                return (
                                    <PaginationItem key={`ellipsis-${page}`} className="px-1 text-muted-foreground">
                                        <PaginationEllipsis className="w-5 h-9" />
                                    </PaginationItem>
                                );
                            }
                            return null;
                        })}
                    </div>

                    <PaginationItem>
                        <PaginationNext
                            className={cn(
                                "px-3 h-9 rounded-full hover:bg-muted hover:text-foreground transition-all duration-200 border-none font-medium text-sm",
                                currentPage === totalPages ? "opacity-40 pointer-events-none" : "cursor-pointer"
                            )}
                            onClick={(e) => {
                                e.preventDefault();
                                if (currentPage < totalPages) onPageChange(currentPage + 1);
                            }}
                        />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        </div>
    );
};

export default DataPagination;

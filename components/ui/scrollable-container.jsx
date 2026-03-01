"use client";

import { useEffect, useRef } from "react";

/**
 * Enhanced scrollable container that works flawlessly with:
 * 1. Mouse Wheel (direct injection for reliability)
 * 2. Touch/Trackpad (native behavior with overscroll containment)
 * 3. Mouse Drag (swipe-to-scroll for desktop)
 * 4. Keyboard (Arrows, PageUp/Down, Home/End)
 */
export function ScrollableContainer({ children, className = "", maxHeight = "100%", ...props }) {
    const containerRef = useRef(null);
    const isDragging = useRef(false);
    const startPos = useRef({ x: 0, y: 0, left: 0, top: 0 });

    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;

        // 1. Direct Wheel Injection (Ensures Scroll X/Y precision and 2D trackpad scrolling)
        const handleWheel = (e) => {
            const { scrollTop, scrollHeight, clientHeight, scrollLeft, scrollWidth, clientWidth } = el;

            const hasVScroll = scrollHeight > clientHeight;
            const hasHScroll = scrollWidth > clientWidth;

            let deltaX = e.deltaX;
            let deltaY = e.deltaY;

            // Auto-map vertical to horizontal if only H-scroll exists, or if Shift is held
            if (e.shiftKey || (hasHScroll && !hasVScroll)) {
                deltaX = deltaX || deltaY;
                deltaY = 0;
            }

            const canScrollLeft = scrollLeft > 0;
            const canScrollRight = Math.ceil(scrollLeft + clientWidth) < scrollWidth;
            const canScrollUp = scrollTop > 0;
            const canScrollDown = Math.ceil(scrollTop + clientHeight) < scrollHeight;

            let handled = false;

            if (deltaX !== 0) {
                if ((deltaX < 0 && canScrollLeft) || (deltaX > 0 && canScrollRight)) {
                    el.scrollLeft += deltaX;
                    handled = true;
                }
            }

            if (deltaY !== 0) {
                if ((deltaY < 0 && canScrollUp) || (deltaY > 0 && canScrollDown)) {
                    el.scrollTop += deltaY;
                    handled = true;
                }
            }

            if (handled) {
                e.preventDefault();
                e.stopPropagation();
            }
        };

        // 2. Mouse Drag (Swipe) Handling
        const handleMouseDown = (e) => {
            if (e.button !== 0) return; // Only left click
            // Don't drag if clicking buttons, inputs or links
            if (e.target.closest('button, input, a, [role="button"]')) return;

            isDragging.current = true;
            el.style.cursor = 'grabbing';
            el.style.userSelect = 'none';

            startPos.current = {
                x: e.pageX - el.offsetLeft,
                y: e.pageY - el.offsetTop,
                left: el.scrollLeft,
                top: el.scrollTop
            };
        };

        const handleMouseUp = () => {
            if (!isDragging.current) return;
            isDragging.current = false;
            el.style.cursor = 'grab';
            el.style.userSelect = 'auto';
        };

        const handleMouseMove = (e) => {
            if (!isDragging.current) return;

            const x = e.pageX - el.offsetLeft;
            const y = e.pageY - el.offsetTop;
            const walkX = (x - startPos.current.x) * 1.5;
            const walkY = (y - startPos.current.y) * 1.5;

            el.scrollLeft = startPos.current.left - walkX;
            el.scrollTop = startPos.current.top - walkY;
        };

        // 3. Touch Handling - Rely on native browser behavior for momentum
        const handleTouchStart = (e) => {
            // Ensure the container is focused when touched to allow keyboard follow-up
            if (document.activeElement !== el) {
                el.focus({ preventScroll: true });
            }
        };

        el.addEventListener("wheel", handleWheel, { passive: false });
        el.addEventListener("mousedown", handleMouseDown);
        el.addEventListener("touchstart", handleTouchStart, { passive: true });
        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseup", handleMouseUp);

        // Initial cursor and styles
        el.style.cursor = 'grab';

        return () => {
            el.removeEventListener("wheel", handleWheel);
            el.removeEventListener("mousedown", handleMouseDown);
            el.removeEventListener("touchstart", handleTouchStart);
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleMouseUp);
        };
    }, []);

    const handleKeyDown = (e) => {
        const el = containerRef.current;
        if (!el) return;

        const scrollAmount = 60;
        const pageAmount = el.clientHeight * 0.8;

        // Don't intercept keyboard events if the user is typing in an input or textarea
        const target = e.target;
        if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
            return;
        }

        switch (e.key) {
            case "ArrowUp":
                el.scrollTop -= scrollAmount;
                e.preventDefault();
                break;
            case "ArrowDown":
                el.scrollTop += scrollAmount;
                e.preventDefault();
                break;
            case "ArrowLeft":
                el.scrollLeft -= scrollAmount;
                e.preventDefault();
                break;
            case "ArrowRight":
                el.scrollLeft += scrollAmount;
                e.preventDefault();
                break;
            case "PageDown":
                el.scrollTop += pageAmount;
                e.preventDefault();
                break;
            case "PageUp":
                el.scrollTop -= pageAmount;
                e.preventDefault();
                break;
            case "Home":
                el.scrollTop = 0;
                e.preventDefault();
                break;
            case "End":
                el.scrollTop = el.scrollHeight;
                e.preventDefault();
                break;
            case " ": // Space bar
                if (!e.shiftKey) {
                    el.scrollTop += pageAmount;
                } else {
                    el.scrollTop -= pageAmount;
                }
                e.preventDefault();
                break;
        }
    };

    return (
        <div
            ref={containerRef}
            className={`custom-scrollbar ${className}`}
            tabIndex={0}
            onKeyDown={handleKeyDown}
            style={{
                maxHeight: maxHeight,
                overflowY: "auto",
                overflowX: "auto",
                overscrollBehavior: "contain",
                WebkitOverflowScrolling: "touch",
                touchAction: "pan-x pan-y",
                outline: "none",
                position: "relative",
                ...props.style
            }}
            {...props}
        >
            {children}
            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 8px;
                    height: 8px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: rgba(0, 0, 0, 0.03);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #c1c5cb;
                    border-radius: 10px;
                    border: 2px solid transparent;
                    background-clip: content-box;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #9ca3af;
                    border: 2px solid transparent;
                    background-clip: content-box;
                }
            `}</style>
        </div>
    );
}

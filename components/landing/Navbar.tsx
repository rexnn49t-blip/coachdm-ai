"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import {
  Menu,
  X,
  MessageSquareText,
  ArrowRight,
  Bell,
  Flame,
  Clock3,
  AlertTriangle,
  ChevronRight,
} from "lucide-react";
import { UserButton, useUser } from "@clerk/nextjs";

type SmartNotification = {
  id: string;
  type:
    | "lead_reply"
    | "follow_up_due"
    | "objection"
    | "hot_lead";
  title: string;
  description: string;
  actionLabel: string;
  leadId: string;
  createdAt: string;
  priority: number;
};

const links = [
  {
    name: "Home",
    href: "/",
  },
  {
    name: "Features",
    href: "/#features",
  },
  {
    name: "FAQs",
    href: "/#faq",
  },
  {
    name: "Pricing",
    href: "/pricing",
  },
  {
    name: "Dashboard",
    href: "/dashboard",
  },
  {
    name: "Settings",
    href: "/settings",
  },
];

const READ_NOTIFICATIONS_KEY =
  "coachdm-read-notifications";

function getNotificationIcon(
  type: SmartNotification["type"]
) {
  switch (type) {
    case "lead_reply":
      return (
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.025]">
          <Flame
            className="h-[18px] w-[18px] text-zinc-400"
            strokeWidth={1.7}
          />
        </div>
      );

    case "follow_up_due":
      return (
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.025]">
          <Clock3
            className="h-[18px] w-[18px] text-violet-400"
            strokeWidth={1.7}
          />
        </div>
      );

    case "objection":
      return (
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.025]">
          <AlertTriangle
            className="h-[18px] w-[18px] text-zinc-400"
            strokeWidth={1.7}
          />
        </div>
      );

    case "hot_lead":
      return (
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.025]">
          <Flame
            className="h-[18px] w-[18px] text-zinc-400"
            strokeWidth={1.7}
          />
        </div>
      );

    default:
      return (
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.025]">
          <Bell
            className="h-[18px] w-[18px] text-zinc-400"
            strokeWidth={1.7}
          />
        </div>
      );
  }
}

function getNotificationHref(
  notification: SmartNotification
) {
  return `/leads/${notification.leadId}`;
}

function formatNotificationTime(
  createdAt: string
) {
  const date = new Date(createdAt);
  const now = new Date();

  const diff = now.getTime() - date.getTime();

  if (diff < 0) {
    return "Just now";
  }

  const minutes = Math.floor(
    diff / (1000 * 60)
  );

  if (minutes < 1) {
    return "Just now";
  }

  if (minutes < 60) {
    return `${minutes}m ago`;
  }

  const hours = Math.floor(minutes / 60);

  if (hours < 24) {
    return `${hours}h ago`;
  }

  const days = Math.floor(hours / 24);

  if (days < 7) {
    return `${days}d ago`;
  }

  return date.toLocaleDateString();
}

export default function Navbar() {
  const [mobileOpen, setMobileOpen] =
    useState(false);

  const [scrolled, setScrolled] =
    useState(false);

  const [notifications, setNotifications] =
    useState<SmartNotification[]>([]);

  const [notificationOpen, setNotificationOpen] =
    useState(false);

  const [loadingNotifications, setLoadingNotifications] =
    useState(false);

  const [readNotifications, setReadNotifications] =
    useState<string[]>([]);

  const [isMounted, setIsMounted] =
    useState(false);

  const { isSignedIn } = useUser();

  /*
   * Confirm client mount.
   */
  useEffect(() => {
    setIsMounted(true);
  }, []);

  /*
   * Load locally stored read notifications.
   */
  useEffect(() => {
    try {
      const stored =
        window.localStorage.getItem(
          READ_NOTIFICATIONS_KEY
        );

      if (!stored) {
        return;
      }

      const parsed = JSON.parse(stored);

      if (Array.isArray(parsed)) {
        setReadNotifications(
          parsed.filter(
            (item): item is string =>
              typeof item === "string"
          )
        );
      }
    } catch (error) {
      console.error(
        "Load read notifications error:",
        error
      );
    }
  }, []);

  /*
   * Save read notifications.
   */
  useEffect(() => {
    try {
      window.localStorage.setItem(
        READ_NOTIFICATIONS_KEY,
        JSON.stringify(readNotifications)
      );
    } catch (error) {
      console.error(
        "Save read notifications error:",
        error
      );
    }
  }, [readNotifications]);

  /*
   * Navbar scroll state.
   */
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    handleScroll();

    window.addEventListener(
      "scroll",
      handleScroll
    );

    return () => {
      window.removeEventListener(
        "scroll",
        handleScroll
      );
    };
  }, []);

  /*
   * Load notifications.
   */
  useEffect(() => {
    if (!isSignedIn) {
      setNotifications([]);
      setNotificationOpen(false);
      return;
    }

    let cancelled = false;

    async function loadNotifications() {
      try {
        setLoadingNotifications(true);

        const response = await fetch(
          "/api/notifications",
          {
            method: "GET",
            cache: "no-store",
          }
        );

        if (!response.ok) {
          return;
        }

        const data = await response.json();

        if (cancelled) {
          return;
        }

        setNotifications(
          Array.isArray(data.notifications)
            ? data.notifications
            : []
        );
      } catch (error) {
        if (!cancelled) {
          console.error(
            "Load notifications error:",
            error
          );
        }
      } finally {
        if (!cancelled) {
          setLoadingNotifications(false);
        }
      }
    }

    loadNotifications();

    const interval = window.setInterval(
      loadNotifications,
      60_000
    );

    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, [isSignedIn]);

  /*
   * Escape key.
   */
  useEffect(() => {
    if (!notificationOpen) {
      return;
    }

    const handleKeyDown = (
      event: KeyboardEvent
    ) => {
      if (event.key === "Escape") {
        setNotificationOpen(false);
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [notificationOpen]);

  /*
   * Prevent background scrolling.
   */
  useEffect(() => {
    if (!notificationOpen) {
      return;
    }

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow =
        previousOverflow;
    };
  }, [notificationOpen]);

  /*
   * Open / close notification drawer.
   */
  function handleNotificationToggle() {
    setMobileOpen(false);

    setNotificationOpen(
      (current) => !current
    );
  }

  /*
   * Close notification drawer.
   */
  function closeNotifications() {
    setNotificationOpen(false);
  }

  /*
   * Mark notification as read.
   */
  function markNotificationAsRead(
    notificationId: string
  ) {
    setReadNotifications((current) => {
      if (current.includes(notificationId)) {
        return current;
      }

      return [...current, notificationId];
    });
  }

  /*
   * Mark all as read.
   */
  function markAllNotificationsAsRead() {
    setReadNotifications(
      notifications.map(
        (notification) => notification.id
      )
    );
  }

  const unreadNotifications =
    notifications.filter(
      (notification) =>
        !readNotifications.includes(
          notification.id
        )
    );

  const notificationCount =
    unreadNotifications.length;

  /*
   * =========================================================
   * NOTIFICATION DRAWER
   *
   * IMPORTANT:
   * The drawer uses explicit inline geometry.
   * This avoids Tailwind positioning/stacking conflicts.
   * =========================================================
   */
  const notificationDrawer =
    notificationOpen &&
    isMounted &&
    typeof document !== "undefined"
      ? createPortal(
          <>
            {/* Backdrop */}
            <div
              onClick={closeNotifications}
              aria-hidden="true"
              style={{
                position: "fixed",
                inset: 0,
                zIndex: 2147483646,
                backgroundColor:
                  "rgba(0, 0, 0, 0.72)",
                backdropFilter:
                  "blur(2px)",
              }}
            />

            {/* Drawer */}
            <aside
              id="notification-panel"
              role="dialog"
              aria-modal="true"
              aria-label="Notifications"
              style={{
                position: "fixed",
                top: 0,
                right: 0,
                bottom: 0,
                width:
                  window.innerWidth >= 1024
                    ? "50vw"
                    : window.innerWidth >= 640
                      ? "70vw"
                      : "100vw",
                zIndex: 2147483647,
                display: "flex",
                flexDirection: "column",
                backgroundColor:
                  "#090909",
                borderLeft:
                  "1px solid rgba(255,255,255,0.10)",
                boxShadow:
                  "-20px 0 60px rgba(0,0,0,0.55)",
              }}
            >
              {/* Header */}
              <div className="flex h-20 shrink-0 items-center justify-between border-b border-white/[0.08] px-6 sm:px-8">
                <div className="min-w-0">
                  <div className="flex items-center gap-3">
                    <h2 className="text-lg font-semibold tracking-tight text-white">
                      Notifications
                    </h2>

                    {notificationCount > 0 && (
                      <span className="rounded-full bg-violet-500/[0.10] px-2.5 py-1 text-[10px] font-semibold text-violet-300">
                        {notificationCount} unread
                      </span>
                    )}
                  </div>

                  <p className="mt-1 text-xs text-zinc-500">
                    {loadingNotifications
                      ? "Checking for updates..."
                      : notificationCount === 0
                        ? "You're all caught up."
                        : "Actions that may need your attention."}
                  </p>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  {notificationCount > 0 && (
                    <button
                      type="button"
                      onClick={
                        markAllNotificationsAsRead
                      }
                      className="hidden rounded-lg px-3 py-2 text-xs font-medium text-violet-400 transition hover:bg-violet-500/[0.08] hover:text-violet-300 sm:block"
                    >
                      Mark all as read
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={closeNotifications}
                    className="flex h-9 w-9 items-center justify-center rounded-lg text-zinc-500 transition hover:bg-white/[0.06] hover:text-white"
                    aria-label="Close notifications"
                  >
                    <X
                      className="h-5 w-5"
                      strokeWidth={1.8}
                    />
                  </button>
                </div>
              </div>

              {/* Mobile Mark All */}
              {notificationCount > 0 && (
                <div className="border-b border-white/[0.06] px-6 py-3 sm:hidden">
                  <button
                    type="button"
                    onClick={
                      markAllNotificationsAsRead
                    }
                    className="text-xs font-medium text-violet-400 transition hover:text-violet-300"
                  >
                    Mark all as read
                  </button>
                </div>
              )}

              {/* Content */}
              <div className="min-h-0 flex-1 overflow-y-auto">
                {loadingNotifications &&
                notifications.length === 0 ? (
                  <div className="flex h-full items-center justify-center px-6">
                    <div className="text-center">
                      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.025]">
                        <Bell
                          className="h-5 w-5 animate-pulse text-zinc-500"
                          strokeWidth={1.6}
                        />
                      </div>

                      <p className="mt-4 text-sm text-zinc-500">
                        Checking notifications...
                      </p>
                    </div>
                  </div>
                ) : notifications.length === 0 ? (
                  <div className="flex h-full items-center justify-center px-6">
                    <div className="max-w-sm text-center">
                      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.025]">
                        <Bell
                          className="h-7 w-7 text-zinc-600"
                          strokeWidth={1.5}
                        />
                      </div>

                      <h3 className="mt-6 text-base font-semibold text-zinc-300">
                        No notifications
                      </h3>

                      <p className="mt-2 text-sm leading-6 text-zinc-600">
                        You're all caught up. We'll
                        let you know when something
                        needs your attention.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="divide-y divide-white/[0.06]">
                    {notifications.map(
                      (notification) => {
                        const isUnread =
                          !readNotifications.includes(
                            notification.id
                          );

                        return (
                          <Link
                            key={
                              notification.id
                            }
                            href={getNotificationHref(
                              notification
                            )}
                            onClick={() => {
                              markNotificationAsRead(
                                notification.id
                              );

                              closeNotifications();
                            }}
                            className={`group block px-6 py-6 transition sm:px-8 sm:py-7 ${
                              isUnread
                                ? "bg-white/[0.018] hover:bg-white/[0.04]"
                                : "opacity-55 hover:bg-white/[0.025]"
                            }`}
                          >
                            <div className="flex gap-4 sm:gap-5">
                              {getNotificationIcon(
                                notification.type
                              )}

                              <div className="min-w-0 flex-1">
                                <div className="flex items-start justify-between gap-4">
                                  <div className="flex min-w-0 items-center gap-2">
                                    <h3
                                      className={`truncate text-sm font-semibold sm:text-[15px] ${
                                        isUnread
                                          ? "text-white"
                                          : "text-zinc-400"
                                      }`}
                                    >
                                      {
                                        notification.title
                                      }
                                    </h3>

                                    {isUnread && (
                                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-violet-400" />
                                    )}
                                  </div>

                                  <span className="shrink-0 text-[11px] text-zinc-600">
                                    {formatNotificationTime(
                                      notification.createdAt
                                    )}
                                  </span>
                                </div>

                                <p className="mt-2 text-sm leading-6 text-zinc-500">
                                  {
                                    notification.description
                                  }
                                </p>

                                <div className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-violet-400 transition group-hover:text-violet-300">
                                  {
                                    notification.actionLabel
                                  }

                                  <ChevronRight
                                    className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
                                    strokeWidth={1.8}
                                  />
                                </div>
                              </div>
                            </div>
                          </Link>
                        );
                      }
                    )}
                  </div>
                )}
              </div>
            </aside>
          </>,
          document.body
        )
      : null;

  return (
    <>
      {/* =====================================================
          NAVBAR
      ===================================================== */}

      <header
        className={`fixed top-0 z-50 w-full transition-all duration-300 ${
          scrolled
            ? "border-b border-white/10 bg-black/90 backdrop-blur-xl"
            : "bg-black/60 backdrop-blur-md"
        }`}
      >
        <div className="mx-auto flex h-20 max-w-7xl items-center px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-3"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 shadow-lg shadow-blue-600/20">
              <MessageSquareText className="h-6 w-6 text-white" />
            </div>

            <div>
              <h2 className="text-xl font-bold text-white">
                Coach
                <span className="text-blue-500">
                  DM AI
                </span>
              </h2>

              <p className="text-xs text-gray-400">
                AI Sales Assistant
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="ml-auto hidden items-center gap-8 lg:flex xl:gap-10">
            {links.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="relative text-sm font-medium text-gray-300 transition hover:text-white after:absolute after:-bottom-2 after:left-0 after:h-[2px] after:w-0 after:bg-blue-500 after:transition-all hover:after:w-full"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Desktop Auth */}
          <div className="ml-8 hidden items-center gap-4 lg:flex">
            {isSignedIn ? (
              <>
                {/* Notification Button */}
                <button
                  type="button"
                  onClick={
                    handleNotificationToggle
                  }
                  className={`relative flex h-10 w-10 items-center justify-center rounded-xl transition ${
                    notificationOpen
                      ? "bg-white/[0.07] text-white"
                      : "text-zinc-400 hover:bg-white/[0.05] hover:text-white"
                  }`}
                  aria-label="Open notifications"
                  aria-expanded={
                    notificationOpen
                  }
                  aria-controls="notification-panel"
                >
                  <Bell
                    className="h-[19px] w-[19px]"
                    strokeWidth={1.8}
                  />

                  {notificationCount > 0 && (
                    <span className="absolute right-[5px] top-[4px] h-2 w-2 rounded-full bg-violet-400 ring-2 ring-black" />
                  )}
                </button>

                <UserButton
                  appearance={{
                    elements: {
                      avatarBox: "h-10 w-10",
                    },
                  }}
                />
              </>
            ) : (
              <>
                <Link
                  href="/sign-in"
                  className="rounded-xl border border-zinc-700 px-5 py-2.5 text-sm font-medium text-white transition hover:border-blue-500 hover:bg-zinc-900"
                >
                  Sign In
                </Link>

                <Link
                  href="/sign-up"
                  className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:scale-105 hover:bg-blue-700"
                >
                  Start Free
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() =>
              setMobileOpen(
                (current) => !current
              )
            }
            className="ml-auto text-white lg:hidden"
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? (
              <X className="h-7 w-7" />
            ) : (
              <Menu className="h-7 w-7" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="border-t border-zinc-800 bg-black/95 backdrop-blur-xl lg:hidden">
            <div className="space-y-6 p-6">
              {links.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() =>
                    setMobileOpen(false)
                  }
                  className="block text-lg text-gray-300 transition hover:text-white"
                >
                  {item.name}
                </Link>
              ))}

              <div className="flex flex-col gap-3 pt-4">
                {isSignedIn ? (
                  <div className="flex items-center justify-center gap-4">
                    {/* Mobile Notification Button */}
                    <button
                      type="button"
                      onClick={
                        handleNotificationToggle
                      }
                      className={`relative flex h-12 w-12 items-center justify-center rounded-xl border transition ${
                        notificationOpen
                          ? "border-violet-500/30 bg-violet-500/[0.08] text-white"
                          : "border-white/[0.08] bg-white/[0.025] text-zinc-400 hover:bg-white/[0.05] hover:text-white"
                      }`}
                      aria-label="Open notifications"
                      aria-expanded={
                        notificationOpen
                      }
                      aria-controls="notification-panel"
                    >
                      <Bell
                        className="h-5 w-5"
                        strokeWidth={1.8}
                      />

                      {notificationCount > 0 && (
                        <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-violet-400 ring-2 ring-black" />
                      )}
                    </button>

                    <UserButton
                      appearance={{
                        elements: {
                          avatarBox:
                            "h-12 w-12",
                        },
                      }}
                    />
                  </div>
                ) : (
                  <>
                    <Link
                      href="/sign-in"
                      onClick={() =>
                        setMobileOpen(false)
                      }
                      className="rounded-xl border border-zinc-700 py-3 text-center text-white"
                    >
                      Sign In
                    </Link>

                    <Link
                      href="/sign-up"
                      onClick={() =>
                        setMobileOpen(false)
                      }
                      className="rounded-xl bg-blue-600 py-3 text-center font-semibold text-white"
                    >
                      Start Free
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Notification drawer */}
      {notificationDrawer}
    </>
  );
}
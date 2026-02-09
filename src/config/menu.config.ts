import {
    NotebookPen,
    Users,
    CheckSquare,
    StickyNote,
    MessageCircle,
} from "lucide-react";

export type NavItem = {
    labelKey: string;
    href: string;
    icon: any;
    label?: string; // Fallback or override
};

export const MAIN_NAV_ITEMS: NavItem[] = [
    {
        labelKey: "nav.community",
        href: "/",
        icon: Users,
    },
    {
        labelKey: "nav.myJournal",
        href: "/journal",
        icon: NotebookPen,
    },
    {
        labelKey: "nav.todoList",
        href: "/todos",
        icon: CheckSquare,
    },
    {
        labelKey: "nav.notes",
        href: "/notes",
        icon: StickyNote,
        label: "Tủ Lạnh",
    },
    {
        labelKey: "nav.messages",
        href: "/messages",
        icon: MessageCircle,
    },
];

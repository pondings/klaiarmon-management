import { faCalendar, faFile } from "@fortawesome/free-regular-svg-icons";
import { faArrowsSpin, faBuilding, faChartLine, faFileInvoiceDollar, faFolderOpen, faHouse, faMoneyCheck, faNoteSticky, IconDefinition, } from "@fortawesome/free-solid-svg-icons";

export interface Menu {
    path: string;
    title: string;
    icon: IconDefinition;

    isOpened?: boolean;
    subMenuList?: Menu[];
}

export interface MenuConfig {
    menu: Menu,
    el: any;
    parentEl: any;
}

const DASHBOARD: Menu = {
    path: 'dashboard',
    title: 'Dashboard',
    icon: faChartLine,
    isOpened: true,

    subMenuList: [
        { path: 'dashboard', title: 'Dashboard', icon: faChartLine },
        { path: 'dashboard/calendar', title: 'Calendar', icon: faCalendar },
        { path: 'dashboard/document', title: 'Documents', icon: faFolderOpen },
        { path: 'dashboard/memo', title: 'Memo', icon: faNoteSticky }
    ]
}

const ACCOUNTING: Menu = {
    path: 'accounting',
    title: 'Accounting',
    icon: faFileInvoiceDollar,

    subMenuList: [
        { path: 'accounting', title: 'Accounting', icon: faFileInvoiceDollar },
        { path: 'accounting/expense', title: 'Expenses', icon: faMoneyCheck },
        { path: 'accounting/recurring-expense', title: 'Recurring Expense', icon: faArrowsSpin }
    ]
}

const CONDO: Menu = {
    path: 'condo',
    title: 'Condo',
    icon: faBuilding,

    subMenuList: [
        { path: 'condo', title: 'Condo', icon: faBuilding },
        { path: 'condo/document', title: 'Documents', icon: faFile }
    ]
}

const HOME: Menu = {
    path: 'home',
    title: 'Home',
    icon: faHouse,

    subMenuList: [
        { path: 'home', title: 'Home', icon: faHouse },
        { path: 'home/document', title: 'Documents', icon: faFile }
    ]
}

export const MENU_LIST = [
    DASHBOARD, ACCOUNTING, CONDO, HOME
];

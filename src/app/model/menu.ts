import { faCalendar, faFile } from "@fortawesome/free-regular-svg-icons";
import { faBuilding, faChartLine, faFileInvoiceDollar, faHouse, faMoneyCheck, IconDefinition, } from "@fortawesome/free-solid-svg-icons";

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
        { path: 'dashboard/calendar', title: 'Calendar', icon: faCalendar }
    ]
}

const ACCOUNTING: Menu = {
    path: 'accounting',
    title: 'Accounting',
    icon: faFileInvoiceDollar,

    subMenuList: [
        { path: 'accounting', title: 'Accounting', icon: faFileInvoiceDollar },
        { path: 'accounting/expense', title: 'Expense', icon: faMoneyCheck }
    ]
}

const CONDO: Menu = {
    path: 'condo',
    title: 'Condo',
    icon: faBuilding,

    subMenuList: [
        { path: 'condo', title: 'Condo', icon: faBuilding },
        { path: 'condo/document', title: 'Document', icon: faFile }
    ]
}

const HOME: Menu = {
    path: 'home',
    title: 'Home',
    icon: faHouse,

    subMenuList: [
        { path: 'home', title: 'Home', icon: faHouse },
        { path: 'home/document', title: 'Document', icon: faFile }
    ]
}

export const MENU_LIST = [
    DASHBOARD, ACCOUNTING, CONDO, HOME
];

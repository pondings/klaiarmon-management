import { faCalendar } from "@fortawesome/free-regular-svg-icons";
import { faBuilding, faChartLine, faFileInvoiceDollar, faHouse, IconDefinition, } from "@fortawesome/free-solid-svg-icons";

export interface Menu {
    path: string;
    title: string;
    icon: IconDefinition;

    subMenuList?: Menu[];
}

const DASHBOARD: Menu = {
    path: 'dashboard',
    title: 'Dashboard',
    icon: faChartLine,

    subMenuList: [
        { path: 'dashboard', title: 'Dashboard Home', icon: faChartLine },
        { path: 'dashboard/calendar', title: 'Calendar', icon: faCalendar }
    ]
}

const ACCOUNTING: Menu = {
    path: 'accounting',
    title: 'Accounting',
    icon: faFileInvoiceDollar
}

const CONDO: Menu = {
    path: 'condo',
    title: 'Condo',
    icon: faBuilding
}

const HOME: Menu = {
    path: 'home',
    title: 'Home',
    icon: faHouse
}

export const MENU_LIST = [
    DASHBOARD, ACCOUNTING, CONDO, HOME
];
